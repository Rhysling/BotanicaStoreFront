<script lang="ts">
  import { wishListStore as wls, wlItemCount } from "../stores/wishlist-store";
  import { user, isLoggedIn } from "../stores/user-store";
  import { navTo } from "../stores/route-store.js";
  import Modal from "./Modal.svelte";

  let isShowIntro = false;
  let isShowModal = false;
  let linkText = "";

  if ($isLoggedIn)
    wls.init();

  // *** Local handlers

  let cancel = () => {
    isShowIntro = false;
    isShowModal = false;
  };

  let showIntro = () => {
    isShowIntro = true;
    isShowModal = true;
  };

  // *** Reactivity

  $: {
    if ($user.userId > 0) {
      linkText = ($wlItemCount > 0)
        ? `Your Wish List has ${$wlItemCount} item${($wlItemCount !== 1) ? "s" : ""}`
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
  on:click={(e) => navTo(e, "/wish-list")}>{linkText}</a>
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