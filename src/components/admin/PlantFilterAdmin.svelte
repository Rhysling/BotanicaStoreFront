<script lang="ts">
  import Pager from "../../components/Pager.svelte";
  import { createEventDispatcher } from 'svelte';

  export let plants: IPlant[] = [];

  const filterTypeList = ["genus", "all"];
  let filterType = "genus";
  let filterText = "";
  let filterFlag = "";
  let isListedOnly = false;
  let isNwNativeOnly = false;
  let itemCount = 0;

  const dispatch = createEventDispatcher();

  let filterPlants = () => {
    let f = (p: IPlant) => {

      let passesText = true;
      if (filterText) {
        if (filterType === "genus") {
          passesText = p.genus.toLowerCase().startsWith(filterText.toLowerCase());
        }
        else {
          passesText =
            p.genus.toLowerCase().startsWith(filterText.toLowerCase()) ||
            p.species.toLowerCase().startsWith(filterText.toLowerCase()) ||
            (p.family || "").toLowerCase().includes(filterText.toLowerCase()) ||
            (p.description || "").toLowerCase().includes(filterText.toLowerCase());
        }
      }
      
      let passesFlag = !filterFlag || filterFlag.trim() === "" || p.flag === filterFlag.trim();
      let passesListedOnly = isListedOnly === false || p.isListed;
      let passesNativeOnly = isNwNativeOnly === false || p.isNwNative;

      return passesText && passesFlag && passesListedOnly && passesNativeOnly;
    };

    let filteredList = plants.filter(f);
    itemCount = filteredList.length;
    dispatch("filterPlants", { filteredList });
  };

  let clearFilter = () => {
    filterText = "";
    filterFlag = "";
    isListedOnly = false;
    isNwNativeOnly = false;
    filterPlants();
  };

  $: if (plants.length > 0) {
    filterPlants();
  }

</script>

<div class="search">
  <select bind:value={filterType}>
		{#each filterTypeList as ft}
			<option value={ft}>
				{ft}
			</option>
		{/each}
	</select>
  <input type="text" class="genus-box" bind:value={filterText} placeholder="Search {filterType}" />
  <input type="text" class="flag-box" bind:value={filterFlag} on:keyup={() => {if (filterFlag && filterFlag.length > 2) filterFlag = filterFlag.substring(0,2)}} placeholder="Flag" />
  <div class="sep">Listed:<input type="checkbox" bind:checked={isListedOnly} /></div>
  <div class="sep">NW&nbsp;Native:<input type="checkbox" bind:checked={isNwNativeOnly} /></div>
  <div class="sep"><a href="/" on:click|preventDefault={filterPlants}>Go</a>-<a href="/" on:click|preventDefault={clearFilter}>Cancel</a></div>
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

    select {
      max-width: 4.6rem;
    }

    input {
      margin-left: 0.25rem;
    }

    a {
      display: inline-block;
    }

    .sep {
      display: inline-block;
      margin-left: 0.6rem;
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

    @media screen and (max-width: $bp-small) {
      text-align: left;
      margin-left: 0.25rem;
    }
  }

</style>