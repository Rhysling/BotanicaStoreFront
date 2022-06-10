<script lang="ts">
  //import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import { createEventDispatcher } from 'svelte';
  import { picPaths } from "../../stores/utils";
  import Swal from "sweetalert2";

  export let plant: IPlant;

  let plantId: number;
  let genus: string;
	let species: string;
	let family: INullable<string>;
	let description: INullable<string>;
  let webDescription: INullable<string>;
	let plantSize: INullable<string>;
	let plantType: INullable<string>;
	let plantZone: INullable<string>;
	let pictureLocation: INullable<string>;
  let isNwNative: boolean;
  let pics: string;
	let isListed: boolean;
	let isFeatured: boolean;
  let slug: string;
	//let lastUpdate: any;
	let flag: INullable<string>;
	let lastUpdateFormatted: string;

  $: ({
    plantId,
    genus,
    species,
    family,
    description,
    webDescription,
    plantSize,
    plantType,
    plantZone,
    pictureLocation,
    isNwNative,
    pics,
    isListed,
    isFeatured,
		slug,
    flag,
    lastUpdateFormatted
  } = plant);

  let paths: PicPaths;
  let src = "";
  let bpc = 0;

  $: {
    paths = picPaths(plantId, pics);
    src = paths.smPath;
    bpc = paths.lgPaths.length;
  }

  const dispatch = createEventDispatcher();

  let toggleFeatured = (status: boolean) => {
    let pt = { plantId, val: status };
    //Save status
    $ax.post("/api/admin/Plants/SetFeatured", pt)
    .then(() => {
      //Notify parent  response: AxiosResponse<void>
      dispatch("updatePlantToggle", { ...pt, column: "isFeatured" });
    })
    .catch((e) => {
      console.error(e);
    });
  };

  let toggleListed = (status: boolean) => {
    let pt: PlantToggle = { plantId, val: status };
    //Save status
    $ax.post("/api/admin/Plants/SetListed", pt)
    .then(() => {
      //Notify parent  response: AxiosResponse<void>
      dispatch("updatePlantToggle", { ...pt, column: "isListed" });
    })
    .catch((e) => {
      console.error(e);
    });
  };

  const editPictures = (plantId: number) => {
    dispatch("editPictures", plantId);
  };

  const editPlant = (plantId: number) => {
    dispatch("editPlant", plantId);
  };

  const deletePlant = async (plantId: number) => {
    try {
      const result: any = await Swal.fire({
        title: `Delete ${genus} ${species} (${plantId})?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: "primary swal-confirm-button",
          cancelButton: "swal-confirm-button"
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        dispatch("deletePlant", plantId);
      }
    }
    catch (error) {
      console.error(error);
    }

  };

</script>

<div class="plant" class:listed={isListed}>
  <div class="status-box">
    {#if isFeatured}
      <span class="featured">Featured</span>
    {:else}
      {#if isListed}
        <a href="/" on:click|preventDefault={() => toggleFeatured(!isFeatured)}>{isFeatured ? "Unfeature" : "Feature"}</a>
        <i class="fas fa-caret-up"></i>
      {/if}
      <a href="/" on:click|preventDefault={() => toggleListed(!isListed)}>{isListed ? "Unlist" : "List"}</a>
    {/if}
  </div>
  <div class="plantid-box">
    {plantId}
  </div>
  <img {src} alt="{genus} {species}" />
  <div class="text">
    <div class="h1">{genus} {species}</div>
    {#if family}<div class="h2">{family}</div>{/if}
    <div class="description">
      <strong>Description: </strong>{description || "none"}
    </div>
    {#if webDescription}
      <div class="description"><strong>Web Description: </strong>{webDescription}</div>
    {/if}
    <div class="details">
      {plantZone || ""} {plantSize || ""} {plantType || ""} {isNwNative ? "NW Native" : ""}
    </div>
    <div class="description">
      Picture Location: {pictureLocation || "none"}
    </div>
    <div class="description">
      {bpc ? bpc : "No"} big picture{bpc === 1 ? "" : "s"}.
      <i class="fas fa-caret-right"></i>
      <a href="/" on:click|preventDefault={() => editPictures(plantId)}>Edit Pictures</a>
			<i class="fas fa-caret-right"></i>
      <a href="/plant/{slug}" target="_blank">Permalink</a>
    </div>
    <div class="extra">Last update: {lastUpdateFormatted}. Flag: {flag ? flag : "none"}.</div>
    <div class="edit">
      <i class="fas fa-caret-right"></i>
      <a href="/" on:click|preventDefault={() => editPlant(plantId)}>Edit Plant</a>
      <i class="fas fa-caret-right"></i> <i class="fas fa-caret-right"></i> <i class="fas fa-caret-right"></i>
      <a href="/" on:click|preventDefault={() => deletePlant(plantId)}>Delete Plant</a>
    </div>
  </div>
</div>

<style lang="scss">
  $pad: 0.25rem;

  .plant {
    position: relative;
    display: flex;
    border: 1px solid black;
    margin: $pad 0;
    align-items: flex-start;

    img {
      display: block;
      flex: 0 0 50px;
      width: 50px;
      height: auto;
      padding: $pad;
    }

    .text {
      flex: 1 1 auto;
      border-left: 1px solid black;
      padding: $pad;
    }

    .h1 {
      font-weight: bold;
    }

    .h2 {
      font-style: italic;
    }

    .description {
      margin: 0.5rem 0;
      font-size: 0.85rem;
    }

    .details {
      color: #8b4513;
      margin: 0.5rem 0;
      font-size: 0.85rem;
    }

    .extra {
      margin: 0.5rem 0;
      font-size: 0.8rem;
    }

    .edit {
      font-size: 0.9rem;
    }

    .status-box {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 0.8rem;
      padding: 0.5rem;

      .featured {
        font-style: italic;
        font-weight: bold;
      }
    }

    .plantid-box {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 0.8rem;
      padding: 0.5rem;
    }
  }

  .listed {
    background-color: rgba(247, 255, 247, 1.0);
  }

</style>