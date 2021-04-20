<script lang="ts">
  import Modal from "./Modal.svelte";

  export let plantId: number;
  export let bigPicIds: string;
  export let isShowModal: boolean = false;

  let ids: string[];
  let last: number;

  $: {
    ids = bigPicIds.split(",");
    last = ids.length - 1;
    ix = 0;
  }

  //console.log({plantId, bigPicIds, isShowModal});
  //console.log({ids});
  let ix = 0;

  let changePic = (n: number) => {
    ix += n;
  };

</script>

<Modal {isShowModal} on:setmodal>
  {#if isShowModal}
  <div class="frame" on:click={(e) => e.stopPropagation()}>
    {#if ix == 0}
      <i class="fas fa-angle-left"></i>
    {:else}
      <a href="/" on:click|preventDefault|stopPropagation={() => changePic(-1)}><i class="fas fa-angle-left"></i></a>
    {/if}
    <img src="/plantpics/p{plantId.toString().padStart(4, "0")}_{ids[ix].padStart(2, "0")}.jpg" alt="Botanica plant" />
    {#if ix == last}
      <i class="fas fa-angle-right"></i>
    {:else}
      <a href="/" on:click|preventDefault|stopPropagation={() => changePic(1)}><i class="fas fa-angle-right"></i></a>
    {/if}
  </div>
  {/if}
</Modal>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .frame {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 50vh auto 0;
    transform: translateY(-50%);
  }

  i {
    display: block;
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.3);
    margin: 0 2rem;
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

  img {
    max-width: calc(100vw - 15rem);
    max-height: 90vh;
  }

</style>