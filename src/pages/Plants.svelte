<script lang="ts">
  import Pager from "../components/Pager.svelte";
  import PlantListFilter from "../components/PlantListFilter.svelte";
  import DisplayPlant from "../components/DisplayPlant.svelte";
  import PlantBigPicModal from "../components/PlantBigPicModal.svelte";
  import { pagedPlants } from "../stores/listedplants-store";

  let bigPics = {
    plantId: 0,
    bigPicIds: "",
    isShowModal: false
  };

  let showBigPics = (e: CustomEvent<{plantId: number, bigPicIds: string}>) => {
    //console.log({e});
    bigPics = { ...e.detail, ...{isShowModal: true} };
    //console.log({bigPics});
  };

  let handleSetModal = (e: CustomEvent<{val: boolean}>) => {
    //console.log({e});
    bigPics = { ...bigPics, ...{isShowModal: e.detail.val} };
    //console.log({bigPics});
  };

  // *** Init ***

</script>

<div class="filter-pager">
  <PlantListFilter />
  <div class="pager">
    <Pager />
  </div>
</div>

<div id="plant-list">
  {#each $pagedPlants as p (p.plantId)}
    <DisplayPlant {...p} on:showBigPics={showBigPics} />
  {/each}
</div>

<div class="filter-pager">
  <PlantListFilter />
  <div class="pager">
    <Pager />
  </div>
</div>

<PlantBigPicModal {...bigPics} on:setmodal={handleSetModal} />

<style lang="scss">
	@import "../styles/_custom-variables.scss";

  .filter-pager {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    font-size: 0.8rem;
    margin-top: 0.5em;
    background-color: $beige-lighter;
  }

  .pager {
    flex: 1 0 auto;
    text-align: right;
  }

</style>