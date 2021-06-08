<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let filterText = "";
  export let isNwNativeOnly = false;
  export let includeNotAvailable = false;

  let filterPlants = () => {
    dispatch("filterPlants", {
      filterText,
      includeNotAvailable,
      isNwNativeOnly
    });
  };

  let clearFilter = () => {
    filterText = "";
    includeNotAvailable = false;
    isNwNativeOnly = false

    dispatch("filterPlants", {
      filterText,
      includeNotAvailable,
      isNwNativeOnly
    });
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