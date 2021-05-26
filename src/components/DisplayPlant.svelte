<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { isLoggedIn } from "../stores/user-store";
  import { navTo } from "../stores/route-store.js";

  export let plantId: number;
  export let genus: string;
	export let species: string;
	export let common: string;
	export let description: string;
	export let plantSize: string;
	export let plantType: string;
	export let plantZone: string;
	export let hasSmallPic: boolean;
	export let bigPicIds: string;
	export let isFeatured: boolean;
	export let availability: string;
	export let isNwNative: boolean;

  const dispatch = createEventDispatcher();

  let src = hasSmallPic ? `/plantpics/p${plantId.toString().padStart(4, "0")}_sm.jpg` : "/plantpics/no-pic.jpg";
  let _: any = isFeatured;

  let showBigPics = () => {
    dispatch("showBigPics", {
			plantId,
      bigPicIds
		});
  };

</script>

<div class="plant">
  {#if bigPicIds}
  <a href="/" on:click|preventDefault={showBigPics}><img {src} alt="{genus} {species}" /></a>
  {:else}
  <img {src} alt="{genus} {species}" />
  {/if}
  <div class="text">
    <div class="h1">{genus} {species}</div>
    {#if common}<div class="h2">{common}</div>{/if}
    <div class="description">
      {description}
    </div>
    <div class="details">
      {plantZone || ""} {plantSize || ""} {plantType || ""}
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