<script lang="ts">
  import Pager from "../components/Pager.svelte";
  import DisplayPlant from "../components/DisplayPlant.svelte";
  import PlantBigPicModal from "../components/PlantBigPicModal.svelte";
  import { listedPlants } from "../stores/listedplants-store";
  
  
  let filteredList = $listedPlants;
  let itemCount = filteredList.length;
  let pagedList = filteredList.slice(0, 25);
  
  let filterGenus = "";
  let filterDescription = "";

  let filterPlants = () => {
    let f = (p: IvwListedPlant) => {
      return (filterGenus === "" || p.genus.toLowerCase().startsWith(filterGenus.toLowerCase())) &&
        (filterDescription === "" || p.description.toLowerCase().includes(filterDescription.toLowerCase()));
    };

    filteredList = $listedPlants.filter(f);
    itemCount = filteredList.length;
  };

  let clearFilter = () => {
    filterGenus = "";
    filterDescription = "";
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
  Search:
  <input type="text" class="genus-box" bind:value={filterGenus} placeholder="Genus" />
  <input type="text" class="description-box" bind:value={filterDescription} placeholder="Description" />
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
  Search:
  <input type="text" class="genus-box" bind:value={filterGenus} placeholder="Genus" />
  <input type="text" class="description-box" bind:value={filterDescription} placeholder="Description" />
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
    }

    a {
      display: inline-block;
      margin-left: 0.5em;
    }

    .sep {
      display: inline-block;
      margin-left: 0.5em;
    }

    .genus-box {
      width: 8em;
    }

    .description-box {
      width: 12em;
    }
  }

  .pager {
    flex: 1 0 auto;
    text-align: right;
  }

</style>