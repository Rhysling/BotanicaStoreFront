<script lang="ts">
import { onMount } from 'svelte';
  import type { AxiosError, AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import AvailabilityFilter from "../../components/admin/AvailabilityFilter.svelte";
  // import EditAvailability from "../../components/admin/EditAvailability.svelte";

  let plants: IvwPlantPriceSummary[] = [];
  let filteredList: IvwPlantPriceSummary[] = [];
  let pagedList: IvwPlantPriceSummary[] = [];

  let editPlantId = 0;
  let editError = "";

  let loadPlants = () => {
    $ax.get("/api/admin/PlantPriceSummary")
    .then(function (response: AxiosResponse<IvwPlantPriceSummary[]>) {
      plants = response.data;
    })
    .catch(function (e) {
      console.log(e);
    });

  };

  onMount(loadPlants);

 

  // Db Ops

  let saveAvailability = (pp: IPlantPrice[]) => {
    editError = "";
    
    $ax.post("/api/admin/xxx", pp)
    .then(function (response: AxiosResponse<number>) {
      let pid = response.data;


      editPlantId = 0;
    })
    .catch(function (e: AxiosError) {
      editError = e.response?.data?.title || "No title provided.";
      console.log(e);
    });
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

 

  let handleEditPlantModal = (e: CustomEvent<{val: boolean}>) => {
    if (!e.detail.val)
    editPlantId = 0;
  };

  let handleFinishEdit = (e: CustomEvent<IPlantPrice[]>) => {
    if (e.detail.length == 0) {
      editPlantId = 0;
      return;
    }

    saveAvailability(e.detail);
  };

</script>

<AvailabilityFilter { plants }
  on:filterPlants={handleFilterPlants}
  on:pageChanged={handleChangePage}
/>
<div>
  {#each pagedList as p (p.plantId)}
    <div>
      {p.genus} {p.species} {p.available} {p.notAvailable}
    </div>
  {/each}
</div>
{#if editPlantId}
<!--  
  <EditAvailability
    plant={editedPlant}
    {editError}
    on:setmodal={handleEditPlantModal}
    on:finishEdit = {handleFinishEdit}
  />
  -->
{/if}

<style lang="scss">

</style>