<script lang="ts">
  import { createEventDispatcher } from 'svelte';

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
  </div>
</div>

<style lang="scss">
  $pad: 0.25rem;

  .plant {
    display: flex;
    border: 1px solid black;
    margin: $pad 0;

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
      margin: 0.5rem 0;
      font-size: 0.85rem;
    }

    .details {
      color: #8b4513;
      font-size: 0.85rem;
    }
  }

</style>