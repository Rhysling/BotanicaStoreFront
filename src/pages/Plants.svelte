<script lang="ts">
  import { listedPlants as lp } from "../stores/listedplants-store";
  import { onDestroy } from 'svelte';
  import Pager from "../components/Pager.svelte";
  import PlantListFilter from "../components/PlantListFilter.svelte";
  import DisplayPlant from "../components/DisplayPlant.svelte";
  import PlantBigPicModal from "../components/PlantBigPicModal.svelte";

  let listedPlants: IvwListedPlant[] = [];
  let filteredPlants: IvwListedPlant[] = [];
  let pagedPlants: IvwListedPlant[] = [];

  let plantListFilter: PlantFilter = {
    filterText: "",
    isNwNativeOnly: false,
    includeNotAvailable: true
  };

  let itemCount = 0;
  let itemsPerPage = 25;
  let startIndex = 0;
  let endIndex = 0;
  let currentPageIn = 1;

  let bigPicPaths: PicIdPath[] = [];
  let isShowModal = false;


  let showBigPics = (e: CustomEvent<PicIdPath[]>) => {
    bigPicPaths = e.detail;
    isShowModal = true;
  };

  let handleSetModal = (e: CustomEvent<{val: boolean}>) => {
    isShowModal = e.detail.val;
  };

  let handleFilterPlants = (e: CustomEvent<PlantFilter>) => {
    plantListFilter = e.detail;
    filterPlants();
  };

  let handlePageChanged = (e: CustomEvent<PageState>) => {
    currentPageIn = e.detail.currentPage;
    startIndex = e.detail.startIndex;
    endIndex = e.detail.endIndex
    pagedPlants = filteredPlants.slice(startIndex, endIndex);
  };


  let filterPlants = () => {

    let plf = plantListFilter;

    let f = (p: IvwListedPlant) => {
      let passesText =
        plf.filterText === "" ||
        p.genus.toLowerCase().startsWith(plf.filterText.toLowerCase()) ||
        p.species.toLowerCase().startsWith(plf.filterText.toLowerCase()) ||
        (p.family || "").toLowerCase().includes(plf.filterText.toLowerCase()) ||
        p.description.toLowerCase().includes(plf.filterText.toLowerCase());

      let passesAvailable =  plf.includeNotAvailable || (p.availability.length > 1);
      let passesNwNative = !plf.isNwNativeOnly || p.isNwNative;

      return passesText && passesAvailable && passesNwNative;
    };

    filteredPlants = listedPlants.filter(f);
    itemCount = filteredPlants.length;
    currentPageIn = 1;
    startIndex = 0;
    endIndex = Math.min(startIndex + itemsPerPage, itemCount);
    pagedPlants = filteredPlants.slice(startIndex, endIndex);
  };


  // *** Init ***
  //onMount(loadPlants);

  const unsubscribe = lp.subscribe(value => {
    listedPlants = value;
    filterPlants();
    itemCount = filteredPlants.length;
    //currentPage = 1;
    startIndex = 0;
    endIndex = Math.min(startIndex + itemsPerPage, itemCount);

    pagedPlants = filteredPlants.slice(startIndex, endIndex);
  });

  onDestroy(unsubscribe);

</script>

<div class="filter-pager">
  <PlantListFilter  {...plantListFilter} on:filterPlants={handleFilterPlants} />
  <div class="pager">
    <Pager {itemsPerPage} {itemCount} {currentPageIn} on:pageChanged={handlePageChanged} />
  </div>
</div>

<div id="plant-list">
  {#each pagedPlants as p (p.plantId)}
    <DisplayPlant plant={p} on:showBigPics={showBigPics} />
  {/each}
</div>

<div class="filter-pager">
  <PlantListFilter  {...plantListFilter} on:filterPlants={handleFilterPlants} />
  <div class="pager">
    <Pager {itemsPerPage} {itemCount} {currentPageIn} on:pageChanged={handlePageChanged} />
  </div>
</div>

<PlantBigPicModal {bigPicPaths} {isShowModal} on:setmodal={handleSetModal} />

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