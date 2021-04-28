<script lang="ts">
  import Pager from "../components/Pager.svelte";
  import DisplayPlant from "../components/DisplayPlant.svelte";
  import PlantBigPicModal from "../components/PlantBigPicModal.svelte";
  import { listedPlants } from "../stores/listedplants-store";
  
  
  let filteredList = $listedPlants;
  let itemCount = filteredList.length;
  let pagedList = filteredList.slice(0, 25);
  
  let filterText = "";
  let isAvailableOnly = false;

  let filterPlants = () => {
    let f = (p: IvwListedPlant) => {
      let passesText = 
        filterText === "" ||
        p.genus.toLowerCase().startsWith(filterText.toLowerCase()) ||
        p.species.toLowerCase().startsWith(filterText.toLowerCase()) ||
        (p.common || "").toLowerCase().includes(filterText.toLowerCase()) ||
        p.description.toLowerCase().includes(filterText.toLowerCase());

      let passesAvailable = !isAvailableOnly || (p.availability.length > 1);

      return passesText && passesAvailable;
    };

    filteredList = $listedPlants.filter(f);
    itemCount = filteredList.length;
  };

  let clearFilter = () => {
    filterText = "";
    isAvailableOnly = false;
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

</script>

<div class="search">
  <div class="sep">Search:</div>
  <input type="text" class="search-box" bind:value={filterText} placeholder="Name or Description" />
  <div class="sep">Available:</div>
  <input type="checkbox" bind:checked={isAvailableOnly} />
  <div class="sep"><i class="fas fa-caret-left"></i><i class="fas fa-caret-right"></i></div>
  <a href="/" on:click|preventDefault={filterPlants}>Go</a>
  <div class="sep">-</div>
  <a href="/" on:click|preventDefault={clearFilter}>Cancel</a>
  <div class="pager">
    <Pager { itemCount } on:pageChanged={handlePageChanged} />
  </div>
</div>

<div>
  {#each pagedList as p (p.plantId)}
    <DisplayPlant {...p} on:showBigPics={showBigPics} />
  {/each}
</div>

<div class="search">
  <div class="sep">Search:</div>
  <input type="text" class="search-box" bind:value={filterText} placeholder="Name or Description" />
  <div class="sep">Available:</div>
  <input type="checkbox" bind:checked={isAvailableOnly} />
  <div class="sep"><i class="fas fa-caret-left"></i><i class="fas fa-caret-right"></i></div>
  <a href="/" on:click|preventDefault={filterPlants}>Go</a>
  <div class="sep">-</div>
  <a href="/" on:click|preventDefault={clearFilter}>Cancel</a>
  <div class="pager">
    <Pager { itemCount } on:pageChanged={handlePageChanged} />
  </div>
</div>

<PlantBigPicModal {...bigPics} on:setmodal={handleSetModal} />

<style lang="scss">
	@import "../styles/_custom-variables.scss";

  .search {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    font-size: 0.8rem;
    margin-top: 0.5em;
    background-color: $beige-lighter;

    input {
      margin-left: 0.5em;

      &[type="checkbox"] {
        position: relative;
        top: 1px;
      }
    }

    a {
      display: inline-block;
      margin-left: 0.5em;
    }

    .sep {
      display: inline-block;
      margin-left: 0.5em;
    }

    .search-box {
      width: 12em;
    }
  }

  .pager {
    flex: 1 0 auto;
    text-align: right;
  }

</style>