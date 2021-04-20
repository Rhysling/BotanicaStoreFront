<script lang="ts">
  import Pager from "../../components/Pager.svelte";
  import { createEventDispatcher } from 'svelte';

  export let plants: IPlant[] = [];

  let filterGenus = "";
  let isListedOnly = false;
  let itemCount = 0;

  const dispatch = createEventDispatcher();

  let filterPlants = () => {
    let f = (p: IPlant) => {
      return (filterGenus === "" || p.genus.toLowerCase().startsWith(filterGenus.toLowerCase())) &&
        (isListedOnly === false || p.isListed);
    };

    let filteredList = plants.filter(f);
    itemCount = filteredList.length;
    dispatch("filterPlants", { filteredList });
  };

  let clearFilter = () => {
    filterGenus = "";
    isListedOnly = false;
    filterPlants();
  };

  $: if (plants.length > 0) {
    filterPlants();
  }

</script>

<div class="search">
  Search:
  <input type="text" class="genus-box" bind:value={filterGenus} placeholder="Genus" />
  <div class="sep">Listed only:</div>
  <input type="checkbox" class="listed-only-box" bind:checked={isListedOnly} />
  <a href="/" on:click|preventDefault={filterPlants}>Go</a>
  <div class="sep">-</div>
  <a href="/" on:click|preventDefault={clearFilter}>Cancel</a>
  <div class="pager">
    <Pager { itemCount } on:pageChanged />
  </div>
</div>

<style lang="scss">
	@import "../../styles/_custom-variables.scss";

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
  }

  .pager {
    flex: 1 0 auto;
    text-align: right;
  }

</style>