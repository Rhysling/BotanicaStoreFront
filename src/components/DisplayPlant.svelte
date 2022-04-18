<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { isLoggedIn } from "../stores/user-store";
  import { navTo } from "../stores/route-store.js";
  import { picPaths } from "../stores/utils";

  export let plant: IvwListedPlant;

  let plantId: number;
  let genus: string;
	let species: string;
	let family: string;
	let description: string;
	let plantSize: string;
	let plantType: string;
	let plantZone: string;
  // pictureLocation
	let isNwNative: boolean;
	let pics: string;
  // isFeatured
	let slug: string;
	let availability: string;

  $:({
    plantId,
    genus,
    species,
    family,
    description,
    plantSize,
    plantType,
    plantZone,
    isNwNative,
    pics,
    slug,
    availability
  } = plant);

  const dispatch = createEventDispatcher();

  let paths: PicPaths;
  $: paths = picPaths(plantId, pics);

  let showBigPics = () => {
    dispatch("showBigPics", paths.lgPaths);
  };

</script>

<div class="plant">
  {#if paths.lgPaths.length}
  <a href="/" on:click|preventDefault={showBigPics}><img src="{paths.smPath}" alt="{genus} {species}" /></a>
  {:else}
  <img src="{paths.smPath}" alt="{genus} {species}" />
  {/if}
  <div class="text">
    <div class="h1">{genus} {species}</div>
    {#if family}<div class="h2">{family}</div>{/if}
    <div class="description">
      {description}
    </div>
    <div class="details">
      {plantZone || ""} {plantSize || ""} {plantType || ""}
    </div>
    <div class="permalink">
      <a href="/plant/{slug}" target="_blank">Permalink</a>
      {#if false}<a href="/" on:click|preventDefault={(e) => navTo(e, "/plant/" + slug)}>Permalink</a>{/if}
    </div>
    {#if availability}
    <div class="availability">
      <span>Availability:</span>
      {#if $isLoggedIn}
      <a href="/"
        on:click|preventDefault={(e) => navTo(e, "/shopping-list", {plantId})}
        title="Go to Shopping List">{availability}</a>
      {:else}
      {availability}
      {/if}
    </div>
    {/if}
  </div>
  {#if isNwNative}
    <div class="nwn" title="Northwest Native">NWN</div>
  {/if}
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";
  $pad: 0.25rem;

  .plant {
    display: flex;
    border: 1px solid black;
    margin: $pad 0;
    position: relative;

    img {
      display: block;
      flex: 0 0 150px;
      width: 150px;
      height: 150px;
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
      margin: 0.5rem 0 0;
      font-size: 0.85rem;
    }

    .details {
      margin: 0.5rem 0 0;
      color: #8b4513;
      font-size: 0.85rem;
    }

    .permalink {
      margin: 0.5rem 0 0;
      font-size: 0.85rem;
    }

    .availability {
      margin: 0.5rem 0 0;
      color: $main-color;
      font-size: 0.85rem;

      span {
        font-weight: bold;
      }
    }

    .nwn {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.4rem;
      font-size: 0.8rem;
      font-weight: bold;
      font-style: italic;
      color: $main-color;
      z-index: 2;
    }
  }

</style>