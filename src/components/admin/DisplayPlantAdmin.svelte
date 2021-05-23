<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import { createEventDispatcher } from 'svelte';

  export let plantId: number;
  export let genus: string;
	export let species: string;
	export let common: string;
	export let description: string;
  export let webDescription: string;
	export let plantSize: string;
	export let plantType: string;
	export let plantZone: string;
  export let isNwNative: boolean;
	export let hasSmallPic: boolean;
	export let bigPicIds: string;
	export let isListed: boolean;
	export let isFeatured: boolean;
	export let lastUpdate: any;
	export let flag: string;
	export let lastUpdateFormatted: string;

  let src = hasSmallPic ? `/plantpics/p${plantId.toString().padStart(4, "0")}_sm.jpg` : "/plantpics/no-pic.jpg";
  let bp = bigPicIds.split(",");
  let bpc = (bp.length === 1 && bp[0] === "") ? 0 : bp.length;
  let _ = lastUpdate;

  const dispatch = createEventDispatcher();

  let toggleFeatured = (status: boolean) => {
    let pt = { plantId, val: status };
    //Save status
    $ax.post("/api/admin/Plants/SetFeatured", pt)
    .then((response: AxiosResponse<void>) => {
      //Notify parent
      dispatch("updatePlantToggle", { ...pt, column: "isFeatured" });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  let toggleListed = (status: boolean) => {
    let pt: PlantToggle = { plantId, val: status };
    //Save status
    $ax.post("/api/admin/Plants/SetListed", pt)
    .then((response: AxiosResponse<void>) => {
      //Notify parent
      dispatch("updatePlantToggle", { ...pt, column: "isListed" });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  let editPictures = (plantId: number) => {
    dispatch("editPictures", plantId);
  };

  let editPlant = (plantId: number) => {
    dispatch("editPlant", plantId);
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
  <img {src} alt="{genus} {species}" />
  <div class="text">
    <div class="h1">{genus} {species}</div>
    {#if common}<div class="h2">{common}</div>{/if}
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
      {bpc ? bpc : "No"} big picture{bpc === 1 ? "" : "s"}.
      <i class="fas fa-caret-right"></i>
      <a href="/" on:click|preventDefault={() => editPictures(plantId)}>Edit Pictures</a>
    </div>
    <div class="extra">Last update: {lastUpdateFormatted}. Flag: {flag ? flag : "none"}.</div>
    <div class="edit">
      <i class="fas fa-caret-right"></i>
      <a href="/" on:click|preventDefault={() => editPlant(plantId)}>Edit Plant</a>
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
  }

  .listed {
    background-color: rgba(247, 255, 247, 1.0);
  }

</style>