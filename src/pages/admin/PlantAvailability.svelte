<script lang="ts">
  import { onMount } from 'svelte';
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import AvailabilityFilter from "../../components/admin/AvailabilityFilter.svelte";
  import EditAvailability from "../../components/admin/EditAvailability.svelte";

  let plants: IvwPlantPriceSummary[] = [];
  let filteredList: IvwPlantPriceSummary[] = [];
  let pagedList: IvwPlantPriceSummary[] = [];

  let editPlantId = 0;
  let editPlantGenus = "";
  let editPlantSpecies = "";

  let loadPlants = () => {
    $ax.get("/api/admin/PlantPriceSummary/GetSummary")
    .then(function (response: AxiosResponse<IvwPlantPriceSummary[]>) {
      plants = response.data;
    })
    .catch(function (e) {
      console.log(e);
    });

  };

  onMount(loadPlants);

  let editPlant = (plantId: number, genus: string, species: string) => {
    editPlantId = plantId;
    editPlantGenus = genus;
    editPlantSpecies = species;
  };


  // Component handlers ***

  let handleChangePage = (event: CustomEvent<PageState>) => {
    let ps = event.detail;
    pagedList = filteredList.slice(ps.startIndex, ps.endIndex);

    window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
  };

  let handleFilterPlants = (event: CustomEvent<{filteredList: IvwPlantPriceSummary[]}>) => {
		filteredList = event.detail.filteredList;
	};

  let handleFinishEdit = (e: CustomEvent<{plantId: number, summaryAvailable: string, summaryPriced: string}>) => {
    let d = e.detail;

    if (d.plantId == 0) {
      editPlantId = 0;
      return;
    }

    //Update summaries;
    plants = plants.map(a => (a.plantId === d.plantId)
      ? {...a, available: d.summaryAvailable, notAvailable: d.summaryPriced }
      : a);

    filteredList = filteredList.map(a => (a.plantId === d.plantId)
      ? {...a, available: d.summaryAvailable, notAvailable: d.summaryPriced }
      : a);

    pagedList = pagedList.map(a => (a.plantId === d.plantId)
      ? {...a, available: d.summaryAvailable, notAvailable: d.summaryPriced }
      : a);

    editPlantId = 0;
  };

</script>

<AvailabilityFilter { plants }
  on:filterPlants={handleFilterPlants}
  on:pageChanged={handleChangePage}
/>
<div>
  {#each pagedList as p (p.plantId)}
    <div class="item">
      <div class="description">
        <a href="/" on:click|preventDefault={() => editPlant(p.plantId, p.genus, p.species)}>{p.genus} {p.species}</a>
      </div>
      <div class="value">
        <div class="available">{p.available}</div>
        <div class="not-available">{p.notAvailable}</div>
      </div>
        
    </div>
  {/each}
</div>
{#if editPlantId}
  <EditAvailability
    {editPlantId}
    {editPlantGenus}
    {editPlantSpecies}
    on:finishEdit = {handleFinishEdit}
  />
{/if}

<style lang="scss">
  @import "../../styles/_custom-variables.scss";

  .item {
    display: flex;
    flex-flow: row nowrap;
    font-size: 0.9rem;
    border-top: 1px solid black;
    margin: 0.3rem 0 0;

    .description {
      flex: 1 1 100%;
    }

    .value {
      flex: 1 1 100%;
    }

    .available {
      font-size: 0.8rem;
      font-weight: bold;
    }

    .not-available {
      padding: 0 0 0 1rem;
      font-size: 0.8rem;
      color: $text-disabled;
    }
  }

</style>