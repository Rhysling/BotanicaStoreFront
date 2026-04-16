<svelte:options runes={true} />

<script lang="ts">
	import { isLoggedIn } from "../stores/user-store";
	import { navTo } from "../stores/route-store.svelte";
	import { picPaths } from "../stores/utils";

	let {
		plant,
		showBigPics,
	}: {
		plant: IvwListedPlant;
		showBigPics: (bigPicPaths: PicIdPath[]) => void;
	} = $props();

	let plantId = $derived(plant.plantId);
	let genus = $derived(plant.genus);
	let species = $derived(plant.species);
	let family = $derived(plant.family);
	let description = $derived(plant.description);
	let plantSize = $derived(plant.plantSize);
	let plantType = $derived(plant.plantType);
	let plantZone = $derived(plant.plantZone);
	// pictureLocation
	let isNwNative = $derived(plant.isNwNative);
	let pics = $derived(plant.pics);
	// isFeatured
	let slug = $derived(plant.slug);
	let availability = $derived(plant.availability);

	let paths: PicPaths = $derived.by(() => picPaths(plantId, pics));
</script>

<div class="plant">
	{#if paths.lgPaths.length}
		<a
			href="/"
			onclick={(e) => {
				e.preventDefault();
				showBigPics(paths.lgPaths);
			}}><img src={paths.smPath} alt="{genus} {species}" /></a
		>
	{:else}
		<img src={paths.smPath} alt="{genus} {species}" />
	{/if}
	<div class="text">
		<div class="h1">{genus} {species}</div>
		{#if family}<div class="h2">{family}</div>{/if}
		<div class="description">
			{description}
		</div>
		<div class="details">
			{plantZone || ""}
			{plantSize || ""}
			{plantType || ""}
		</div>
		<div class="permalink">
			<a href="/plant/{slug}" target="_blank">Permalink</a>
			{#if false}<a href="/" onclick={(e) => navTo(e, "/plant/" + slug)}
					>Permalink</a
				>{/if}
		</div>
		{#if availability}
			<div class="availability">
				<span>Availability:</span>
				{#if $isLoggedIn}
					<a
						href="/"
						onclick={(e) => navTo(e, "/shopping-list", { plantId })}
						title="Go to Shopping List">{availability}</a
					>
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
	@use "../styles/_custom-variables.scss" as c;
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
			color: c.$main-color;
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
			color: c.$main-color;
			z-index: 2;
		}
	}
</style>
