<script lang="ts">
  import Pager from "../../components/Pager.svelte";
  import { createEventDispatcher } from 'svelte';
  import { plantAdminFilterStore } from "../../stores/plantadminfilter-store";

  export let plants: IPlant[] = [];
  export let currentPageIn = 1;

  export let plantFilterIn: PlantAdminFilter = {
    filterType: "genus",
    filterText: "",
    filterFlag: "",
    isListedOnly: false,
    isNwNativeOnly: false,
    isByRecentUpdate: false
  };

  const filterTypeList = ["genus", "all"];
  let itemCount = 0;

  let paf: PlantAdminFilter = {
    filterType: "genus",
    filterText: "",
    filterFlag: "",
    isListedOnly: false,
    isNwNativeOnly: false,
    isByRecentUpdate: false
  };

  const dispatch = createEventDispatcher();

  let filterPlants = () => {

    const f = (p: IPlant) => {

      let passesText = true;
      if (paf.filterText) {
        if (paf.filterType === "genus") {
          passesText = p.genus.toLowerCase().startsWith(paf.filterText.toLowerCase());
        }
        else {
          passesText =
            p.genus.toLowerCase().startsWith(paf.filterText.toLowerCase()) ||
            p.species.toLowerCase().startsWith(paf.filterText.toLowerCase()) ||
            (p.family || "").toLowerCase().includes(paf.filterText.toLowerCase()) ||
            (p.description || "").toLowerCase().includes(paf.filterText.toLowerCase());
        }
      }
      
      let passesFlag = !paf.filterFlag || paf.filterFlag.trim() === "" || p.flag === paf.filterFlag.trim();
      let passesListedOnly = paf.isListedOnly === false || p.isListed;
      let passesNativeOnly = paf.isNwNativeOnly === false || p.isNwNative;

      return passesText && passesFlag && passesListedOnly && passesNativeOnly;
    };

    // const byGenusSpecies = (a: IPlant, b: IPlant) => {
    //   if ((a.genus + a.species).toLowerCase() < (b.genus + b.species).toLowerCase()) return -100;
    //   if ((a.genus + a.species).toLowerCase() > (b.genus + b.species).toLowerCase()) return 100;
    //   return 0;
    // };

    const byLastUpdateDesc = (a: IPlant, b: IPlant) => {
      if (a.lastUpdate > b.lastUpdate) return -100;
      if (a.lastUpdate < b.lastUpdate) return 100;
      return 0;
    };

    let filteredList = plants.filter(f);

    if (paf.isByRecentUpdate)
      filteredList = filteredList.sort(byLastUpdateDesc);

    $plantAdminFilterStore = paf;
    itemCount = filteredList.length;
    dispatch("filterPlants", { filteredList });
    currentPageIn = -1; // Trigger rerun of Pager
  };

  let clearFilter = () => {
    paf.filterText = "";
    paf.filterFlag = "";
    paf.isListedOnly = false;
    paf.isNwNativeOnly = false;
    paf.isByRecentUpdate = false;
    filterPlants();
  };

  const updateFilter = (f: PlantAdminFilter | undefined | null) => {
    if (f) {
      paf = { ...f };
    }
    if (plants.length > 0) {
      filterPlants();
    }
  };

  $: updateFilter(plantFilterIn);

</script>

<div class="search">
  <select bind:value={paf.filterType}>
		{#each filterTypeList as ft}
			<option value={ft}>
				{ft}
			</option>
		{/each}
	</select>
  <input type="text" class="genus-box" bind:value={paf.filterText} placeholder="Search {paf.filterType}" />
  <input type="text" class="flag-box" bind:value={paf.filterFlag} on:keyup={() => {if (paf.filterFlag && paf.filterFlag.length > 2) paf.filterFlag = paf.filterFlag.substring(0,2)}} placeholder="Flag" />
  <div class="sep">Listed:<input type="checkbox" bind:checked={paf.isListedOnly} /></div>
  <div class="sep">NWN:<input type="checkbox" bind:checked={paf.isNwNativeOnly} /></div>
  <div class="sep">Recent:<input type="checkbox" bind:checked={paf.isByRecentUpdate} /></div>
  <div class="sep"><a href="/" on:click|preventDefault={filterPlants}>Go</a>&nbsp;-&nbsp;<a href="/" on:click|preventDefault={clearFilter}>Cancel</a></div>
  <div class="pager">
    <Pager {itemCount} {currentPageIn} on:pageChanged />
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