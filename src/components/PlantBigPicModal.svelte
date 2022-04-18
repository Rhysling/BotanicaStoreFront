<script lang="ts">
  import Modal from "./Modal.svelte";

  export let bigPicPaths: PicIdPath[] = [];
  export let isShowModal: boolean = false;

  let last: number;
  let ix = 0;
  let hasMultiple: boolean;

  $: {
    last = bigPicPaths.length - 1;
    ix = 0;
    hasMultiple = last > 0;
  }

  let changePic = (n: number) => {
    let i = ix + n;

    if (i < 0) {
      ix = last;
      return;
    }

    if (i > last) {
      ix = 0;
      return;
    }

    ix = i;
  };

</script>

<Modal {isShowModal} on:setmodal>
  {#if isShowModal}
  <div class="frame" on:click={(e) => e.stopPropagation()}>
    {#if hasMultiple}
      <a href="/" class="arrow left" on:click|preventDefault|stopPropagation={() => changePic(-1)}><i class="fas fa-angle-left"></i></a>
    {/if}
    <img src="{bigPicPaths[ix].path}" alt="Botanica plant" />
    {#if hasMultiple}
      <a href="/" class="arrow right" on:click|preventDefault|stopPropagation={() => changePic(1)}><i class="fas fa-angle-right"></i></a>
    {/if}
  </div>
  {/if}
</Modal>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .frame {
    position: relative;
    height: 90vh;
    width: 100%;
    margin-top: 5vh;
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 95vw;
    max-height: 90vh;
  }

  .arrow {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 5rem;
    z-index: 2;

    &.left {
      left: 2rem;
    }

    &.right {
      right: 2rem;
    }
  }

  i {
    color: rgba(255, 255, 255, 0.3);
  }

  a {
    text-decoration: none;

    i {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }


</style>