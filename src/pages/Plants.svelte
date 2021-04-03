<script lang="ts">
   import App from "../App.svelte";
import Pager from "../components/Pager.svelte";
  import { listedPlants } from "../stores/listedplants-store";
import About from "./About.svelte";
import Calendar from "./Calendar.svelte";
  
  let itemsPerPage = 25
  let itemCount = $listedPlants.length;
  let currentPage = 1;

  let filteredList = $listedPlants;
  let pagedList: IvwListedPlant[] = [];

  let setPage = (pageNum: number) =>{
    let startIndex = (pageNum - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, filteredList.length);
    pagedList = filteredList.slice(startIndex, endIndex);
    //console.log({startIndex, endIndex});
  };

  let handlePageChanged = (event: any) => {
		currentPage = event.detail.currentPage;
    //console.log(event);
    setPage(currentPage);
	};

  setPage(currentPage);

  let filterGenus = "";
  let filterDescription = "";

  let filterPlants = () => {
    let f = (p: IvwListedPlant) => {
      return (filterGenus === "" || p.genus.toLowerCase().startsWith(filterGenus.toLowerCase())) &&
        (filterDescription === "" || p.description.toLowerCase().includes(filterDescription.toLowerCase()));
    };

    filteredList = $listedPlants.filter(f);
    itemCount = filteredList.length;
    currentPage = 1;
    //console.log({ filteredList });
    setPage(currentPage);
  };

  let clearFilter = () => {
    filterGenus = "";
    filterDescription = "";
    filterPlants();
  };

</script>

<div class="search">
  Search:
  <input type="text" class="genus-box" bind:value={filterGenus} placeholder="Genus" />
  <input type="text" class="description-box" bind:value={filterDescription} placeholder="Description" />
  <a href="/" on:click|preventDefault={filterPlants}>Go</a>
  <a href="/" on:click|preventDefault={clearFilter}>Cancel</a>
  <div class="pager">
    <Pager { ...{ itemsPerPage, itemCount, currentPage } } on:pageChanged={handlePageChanged} />
  </div>
</div>

<div>
  {#each pagedList as p (p.plantId)}
    <div>{p.genus} - {p.species}</div>
    <hr />
  {/each}
</div>

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