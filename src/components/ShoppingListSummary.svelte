<script lang="ts">
  import { wishListStore as wls, wlItemCount, isShowHowWlWorks } from "../stores/wishlist-store";
  import { user, isLoggedIn } from "../stores/user-store";
  import { navTo } from "../stores/route-store.js";
  import Modal from "./Modal.svelte";

  let linkText = "";

  if ($isLoggedIn)
    wls.init();

  // *** Local handlers

  let cancel = () => {
    $isShowHowWlWorks = false;
  };

  let showIntro = () => {
    $isShowHowWlWorks = true;
  };

  // *** Reactivity

  $: {
    if ($user.userId > 0) {
      linkText = ($wlItemCount > 0)
        ? `Your list has ${$wlItemCount} item${($wlItemCount !== 1) ? "s" : ""}`
        : "Start your shopping list";
    }
    else {
      linkText = "Sign in to create a shopping list"
    }
  }

  // *** Initialize

</script>

{#if $isLoggedIn}
  <a href="/"
  on:click={(e) => navTo(e, "/shopping-list")}>{linkText}</a>
{:else}
  Shop online for pickup. <a href="/" on:click|preventDefault={showIntro}>Learn more...</a>
{/if}


<Modal isShowModal={$isShowHowWlWorks} on:setmodal={cancel}>
  <div class="container" on:click={(e) => e.stopPropagation()}>
    <div class="content">
      <div class="modal-title">
        [Describe how the Shopping List works...]
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