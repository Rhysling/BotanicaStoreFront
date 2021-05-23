<script lang="ts">
  import Pager from "../../components/Pager.svelte";
  import { createEventDispatcher } from 'svelte';

  export let plants: IPlant[] = [];

  let filterGenus = "";
  let filterFlag = "";
  let isListedOnly = false;
  let isNwNativeOnly = false;
  let itemCount = 0;

  const dispatch = createEventDispatcher();

  let filterPlants = () => {
    let f = (p: IPlant) => {
      return (filterGenus === "" || p.genus.toLowerCase().startsWith(filterGenus.toLowerCase())) &&
        (!filterFlag || filterFlag.trim() === "" || p.flag === filterFlag.trim()) &&
        (isListedOnly === false || p.isListed) &&
        (isNwNativeOnly === false || p.isNwNative);
    };

    let filteredList = plants.filter(f);
    itemCount = filteredList.length;
    dispatch("filterPlants", { filteredList });
  };

  let clearFilter = () => {
    filterGenus = "";
    filterFlag = "";
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
  <input type="text" class="flag-box" bind:value={filterFlag} on:keyup={() => {if (filterFlag && filterFlag.length > 2) filterFlag = filterFlag.substring(0,2)}} placeholder="Flag" />
  <div class="sep">Listed:</div>
  <input type="checkbox" bind:checked={isListedOnly} />
  <div class="sep">NW Native:</div>
  <input type="checkbox" bind:checked={isNwNativeOnly} />
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
      margin-left: 0.25em;

      &[type="checkbox"] {
        position: relative;
        top: 2px;
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

    .genus-box {
      width: 8em;
    }

    .flag-box {
      width: 3em;
    }
  }

  .pager {
    flex: 1 0 auto;
    text-align: right;
  }

</style>