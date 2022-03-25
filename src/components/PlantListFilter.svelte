<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  //import { plantListFilterDisplay as plfd, plantListFilterActive as plfa } from "../stores/listedplants-store";

  export let filterText = "";
  export let includeNotAvailable = true;
  export let isNwNativeOnly = false;

  const dispatch = createEventDispatcher();

  let filterPlants = () => {
    dispatch("filterPlants", {
      filterText,
      includeNotAvailable,
      isNwNativeOnly
		});

    // let el = document.getElementById("plant-list");
    // if (el) el.scrollIntoView(true); // top

    window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
  };

  let clearFilter = () => {
      filterText = "";
      includeNotAvailable = true;
      isNwNativeOnly = false;

    filterPlants();
  };
  
</script>

<div class="sep">Search:</div>
<input type="text" class="search-box" bind:value={filterText} placeholder="Name or Description" />
<div class="sep">NW Native:</div>
<input type="checkbox" bind:checked={isNwNativeOnly} />
<div class="sep" title="All plants including not currently available">Full List:</div>
<input type="checkbox" bind:checked={includeNotAvailable} title="All plants including not currently available" />
<div class="sep"><i class="fas fa-caret-left"></i><i class="fas fa-caret-right"></i></div>
<a href="/" on:click|preventDefault={filterPlants}>Go</a>
<div class="sep">-</div>
<a href="/" on:click|preventDefault={clearFilter}>Cancel</a>


<style lang="scss">
	@import "../styles/_custom-variables.scss";

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

    .search-box {
      width: 12em;
    }

</style>