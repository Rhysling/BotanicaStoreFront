<script lang="ts">
  import { onMount } from 'svelte';
  import type { AxiosError, AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import PlantFilterAdmin from "../../components/admin/PlantFilterAdmin.svelte";
  import DisplayPlantAdmin from "../../components/admin/DisplayPlantAdmin.svelte";
  import EditPlantAdmin from "../../components/admin/EditPlantAdmin.svelte";
  import PlantPicsAdmin from "../../components/admin/PlantPicsAdmin.svelte";
  import { newPlant } from "../../stores/newobjects-store";
  import { plantAdminFilterStore } from "../../stores/plantadminfilter-store";
  import { paramsFromUrl } from "../../stores/route-store";

  let plants: IPlant[] = [];
  let filteredList: IPlant[] = [];
  let pagedList: IPlant[] = [];
  let currentStartIndex = 0;
  let currentEndIndex = 0;

  let plantFilterIn: PlantAdminFilter = {
    filterType: "genus",
    filterText: "",
    filterFlag: "",
    isListedOnly: false,
    isNwNativeOnly: false,
    isByRecentUpdate: false
  };

  let editedPlant: IPlant | null;
  let editError = "";

  let plantForPics: IPlant | null;

  let loadPlants = () => {
    $ax.get("/api/admin/Plants")
    .then(function (response: AxiosResponse<IPlant[]>) {
      plants = response.data;
    }).then(() => {
      const pu = paramsFromUrl();
      if (Object.entries(pu).length) {
        plantFilterIn = <PlantAdminFilter>{ ...plantFilterIn, ...pu };
      }
      else {
        plantFilterIn = { ...$plantAdminFilterStore };
      }
    })
    .catch(function (e) {
      console.error(e);
    });

  };

  onMount(loadPlants);

  const addPlant = () => {
    editedPlant = {...$newPlant};
  };

  const updatePlant = (p: IPlant) => {
    plants = plants.map(a => (a.plantId === p.plantId) ? p : a);
    filteredList = filteredList.map(a => (a.plantId === p.plantId) ? p : a);
    pagedList = pagedList.map(a => (a.plantId === p.plantId) ? p : a);
  };

  // Db Ops

  const savePlant = (p: IPlant) => {
    editError = "";
    let isNew = p.plantId === 0;

    $ax.post("/api/admin/Plants", p)
    .then(function (response: AxiosResponse<IPlant>) {
      p = response.data;

      if (isNew) {
        plants = [p, ...plants].sort((a, b) => ((a.genus < b.genus) ? -10 : 0) + ((a.species < b.species) ? -1 : 0));
        filteredList = [p, ...filteredList].sort((a, b) => ((a.genus < b.genus) ? -10 : 0) + ((a.species < b.species) ? -1 : 0));
        pagedList = [p, ...pagedList];
      }
      else {
        updatePlant(p);
      }

      editedPlant = null;
    })
    .catch(function (e: AxiosError) {
      editError = (e.response?.data?.title || "No title provided.") + " See log.";
      console.error(e);
    });
  };

  // Component handlers ***

  let handleChangePage = (event: CustomEvent<PageState>) => {
    let ps = event.detail;
    currentStartIndex = ps.startIndex;
    currentEndIndex = ps.endIndex;
    pagedList = filteredList.slice(currentStartIndex, currentEndIndex);

    window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
  };

  let handleFilterPlants = (event: CustomEvent<{filteredList: IPlant[]}>) => {
		filteredList = event.detail.filteredList;
    pagedList = filteredList.slice(currentStartIndex, currentEndIndex);
	};

  let handleUpdatePlantToggle = (e: CustomEvent<PlantToggle>) => {
    let pt = e.detail;

    if (pt.column) {

      if (pt.column === "isFeatured") {
        plants = plants.map((p) => (p.plantId === pt.plantId) ? {...p, isFeatured: pt.val} : {...p, isFeatured: false});
        pagedList = pagedList.map((p) => (p.plantId === pt.plantId) ? {...p, isFeatured: pt.val} : {...p, isFeatured: false});
      }

      if (pt.column === "isListed") {
        plants = plants.map((p) => (p.plantId === pt.plantId) ? {...p, isListed: pt.val} : p);
        pagedList = pagedList.map((p) => (p.plantId === pt.plantId) ? {...p, isListed: pt.val} : p);
      }
    }
    else {
      console.error({handleUpdatePlantToggle: "Item not found", pt});
    }
  };

  let handleEditPlant = (e: CustomEvent<number>) => {
    let plantId = e.detail;
    editedPlant = {...plants.find(p => p.plantId === plantId) || $newPlant};
    editError = "";

  };

  let handleEditPlantModal = (e: CustomEvent<{val: boolean}>) => {
    if (!e.detail.val)
      editedPlant = null;
  };

  let handleFinishEdit = (e: CustomEvent<IPlant>) => {
    if (e.detail.plantId < 0) {
      editedPlant = null;
      return;
    }

    savePlant(e.detail);
  };

  // Plant pics

  let handleEditPictures = (e: CustomEvent<number>) => {
    let plantId = e.detail;
    plantForPics = plants.find(p => p.plantId === plantId) || $newPlant;
  };

  let handleCloseEditPictures = (e: CustomEvent<{val: boolean}>) => {
    if (!e.detail.val)
      plantForPics = null;
  };

  let handleSavePicture = (e: CustomEvent<FormData>) => {
    $ax.post("/api/admin/Pictures/SavePicture", e.detail, {
      headers: {
        "Content-Type": "multipart/form-data"
    }})
    .then((response: AxiosResponse<IPlantPicId>) => {
      let ppid = response.data;
      if (plantForPics) {
        let ppidList: IPlantPicId[] = (<IPlantPicId[]>(JSON.parse(plantForPics.pics) || [])).filter(a => a.picId !== ppid.picId);
        ppidList = [...ppidList, ppid].sort((a, b) => a.picId - b.picId);
        plantForPics.pics = JSON.stringify(ppidList);

        updatePlant(plantForPics);
      }
    })
    .catch((e: AxiosError) => {
      console.error(e);
    });
  };

  let handleDeletePicture = (e: CustomEvent<IPlantPicId>) => {
    let ppid = e.detail;
    $ax.post("/api/admin/Pictures/DeletePicture", ppid)
    .then(() => {
      if (plantForPics) {
        plantForPics.pics = JSON.stringify((<IPlantPicId[]>(JSON.parse(plantForPics.pics) || [])).filter(a => a.picId !== ppid.picId));
        updatePlant(plantForPics);
      }
    })
    .catch((e: AxiosError) => {
      console.error(e);
    });
  };


</script>

<div class="add-plant">
  <i class="fas fa-caret-right"></i>
  <a href="/" on:click|preventDefault={addPlant}>Add Plant</a>
</div>
<PlantFilterAdmin { plants } { plantFilterIn }
  on:filterPlants={handleFilterPlants}
  on:pageChanged={handleChangePage}
/>
<div>
  {#each pagedList as p (p.plantId)}
    <div>
      <DisplayPlantAdmin
        plant={p}
        on:updatePlantToggle={handleUpdatePlantToggle}
        on:editPlant={handleEditPlant}
        on:editPictures={handleEditPictures}
      />
    </div>
  {/each}
</div>
{#if editedPlant}
  <EditPlantAdmin
    plant={editedPlant}
    {editError}
    on:setmodal={handleEditPlantModal}
    on:finishEdit = {handleFinishEdit}
  />
{/if}
{#if plantForPics}
  <PlantPicsAdmin
    plant={plantForPics}
    on:setmodal={handleCloseEditPictures}
    on:savePic={handleSavePicture}
    on:deletePic={handleDeletePicture}
  />
{/if}
<style lang="scss">
	@import "../../styles/_custom-variables.scss";

  .add-plant {
    margin-top: 0.5em;
    padding-left: 0.25em;
  }
</style>