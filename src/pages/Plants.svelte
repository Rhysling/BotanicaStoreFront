<script lang="ts">
  import Pager from "../components/Pager.svelte";
  import PlantListFilter from "../components/PlantListFilter.svelte";
  import DisplayPlant from "../components/DisplayPlant.svelte";
  import PlantBigPicModal from "../components/PlantBigPicModal.svelte";
  import { listedPlants } from "../stores/listedplants-store";
  
  let filterText = "";
  let isNwNativeOnly = false;
  let includeNotAvailable = false;
  
  let filteredList: IvwListedPlant[] = [];
  let itemCount = 0;
  let pagedList: IvwListedPlant[] = [];

  let filterPlants = () => {

    let f = (p: IvwListedPlant) => {
      let passesText = 
        filterText === "" ||
        p.genus.toLowerCase().startsWith(filterText.toLowerCase()) ||
        p.species.toLowerCase().startsWith(filterText.toLowerCase()) ||
        (p.common || "").toLowerCase().includes(filterText.toLowerCase()) ||
        p.description.toLowerCase().includes(filterText.toLowerCase());

      let passesAvailable =  includeNotAvailable || (p.availability.length > 1);
      let passesNwNative = !isNwNativeOnly || p.isNwNative;

      return passesText && passesAvailable && passesNwNative;
    };

    filteredList = $listedPlants.filter(f);
    itemCount = filteredList.length;
    pagedList = filteredList.slice(0, 25);
  };

  let handleFilterPlants = (e: CustomEvent<PlantListFilterType>) => {
    filterText = e.detail.filterText;
    isNwNativeOnly = e.detail.isNwNativeOnly;
    includeNotAvailable = e.detail.includeNotAvailable;

    filterPlants();
  };
  
  let handlePageChanged = (event: CustomEvent<PageState>) => {
    let ps = event.detail;
    pagedList = filteredList.slice(ps.startIndex, ps.endIndex);
    // console.log({pagedList});

    window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	};

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
  filterPlants();

</script>

<div class="filter-pager">
  <PlantListFilter {filterText} {isNwNativeOnly} {includeNotAvailable} on:filterPlants={handleFilterPlants} />
  <div class="pager">
    <Pager { itemCount } on:pageChanged={handlePageChanged} />
  </div>
</div>

<div>
  {#each pagedList as p (p.plantId)}
    <DisplayPlant {...p} on:showBigPics={showBigPics} />
  {/each}
</div>

<div class="filter-pager">
  <PlantListFilter {filterText} {isNwNativeOnly} {includeNotAvailable} on:filterPlants={handleFilterPlants} />
  <div class="pager">
    <Pager { itemCount } on:pageChanged={handlePageChanged} />
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