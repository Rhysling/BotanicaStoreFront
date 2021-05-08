<script lang="ts">
  import { wishListStore } from "../stores/wishlist-store";
  import { user, isLoggedIn } from "../stores/user-store";
  import { navTo } from "../stores/route-store.js";
  import Modal from "./Modal.svelte";

  let isShowIntro = false;
  let isShowModal = false;
  let itemCount = 0;
  let linkText = "";


  let cancel = () => {
    isShowIntro = false;
    isShowModal = false;
  };
  // *** Local handlers

  let showIntro = () => {
    isShowIntro = true;
    isShowModal = true;
  };

  // *** Reactivity

  $: wls = wishListStore($user.userId);

  $: {
    if ($user.userId > 0 && $wls.wlList) {
      itemCount = wls.getItemCount();

      linkText = (itemCount > 0)
        ? `Your Wish List has ${itemCount} item${(itemCount !== 1) ? "s" : ""}`
        : "Start your Wish List";
    }
    else {
      linkText = "Sign in to create a Wish List"
    }
  }

  // *** Initialize

</script>

{#if $isLoggedIn}
  <a href="/"
    on:click={navTo}
    data-dest={"/wish-list"}>{linkText}</a>
{:else}
  Shop online for pickup. <a href="/" on:click|preventDefault={showIntro}>Learn more...</a>
{/if}


<Modal {isShowModal} on:setmodal={cancel}>
  <div class="container" on:click={(e) => e.stopPropagation()}>
    <div class="content">
      <div class="modal-title">
        [Describe how the Wish List works...]
      </div>


    </div>
  </div>
</Modal>


<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .container {
    margin: 5rem;
    padding: 3rem 0;
    background-color: antiquewhite;

    @media screen and (max-width: $bp-small) {
      margin: 2rem;
    }
  }

  .content {
    margin: 0 auto;
    max-width: clamp(220px, 50vw, 400px);

    .modal-title {
      font-size: 1.1rem;
      font-weight: bold;
      text-align:center;
      margin-bottom: 1rem;
    }

  }

</style>