<svelte:options runes={true} />

<script lang="ts">
	//import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../../stores/httpclient-store";
	import { picPaths } from "../../stores/utils";
	import Swal from "sweetalert2";

	let {
		plant: p,
		handleUpdatePlantToggle = () => {},
		handleEditPlant = () => {},
		handleDeletePlant = () => {},
		handleEditPictures = () => {},
	}: {
		plant: IPlant;
		handleUpdatePlantToggle: (pt: PlantToggle) => void;
		handleEditPlant: (plantId: number) => void;
		handleDeletePlant: (plantId: number) => void;
		handleEditPictures: (plantId: number) => void;
	} = $props();

	let paths: PicPaths = $derived(picPaths(p.plantId, p.pics));
	let src = $derived(paths.smPath);
	let bpc = $derived(paths.lgPaths.length);

	let toggleFeatured = (status: boolean) => {
		let pt = { plantId: p.plantId, val: status };
		//Save status
		$ax
			.post("/api/admin/Plants/SetFeatured", pt)
			.then(() => {
				handleUpdatePlantToggle({ ...pt, column: "isFeatured" });
			})
			.catch((e) => {
				console.error(e);
			});
	};

	let toggleListed = (status: boolean) => {
		let pt: PlantToggle = { plantId: p.plantId, val: status };
		//Save status
		$ax
			.post("/api/admin/Plants/SetListed", pt)
			.then(() => {
				//Notify parent response: AxiosResponse<void>
				handleUpdatePlantToggle({ ...pt, column: "isListed" });
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const editPictures = (plantId: number) => {
		handleEditPictures(plantId);
	};

	const editPlant = (plantId: number) => {
		handleEditPlant(plantId);
	};

	const deletePlant = async (plantId: number) => {
		try {
			const result: any = await Swal.fire({
				title: `Delete ${p.genus} ${p.species} (${plantId})?`,
				showCancelButton: true,
				confirmButtonText: "Yes",
				customClass: {
					confirmButton: "primary swal-confirm-button",
					cancelButton: "swal-confirm-button",
				},
				buttonsStyling: false,
			});

			if (result.isConfirmed) {
				handleDeletePlant(plantId);
			}
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div class="plant" class:listed={p.isListed}>
	<div class="status-box">
		{#if p.isFeatured}
			<span class="featured">Featured</span>
		{:else}
			{#if p.isListed}
				<a
					href="/"
					onclick={(e) => {
						e.preventDefault();
						toggleFeatured(!p.isFeatured);
					}}>{p.isFeatured ? "Unfeature" : "Feature"}</a
				>
				<i class="fas fa-caret-up"></i>
			{/if}
			<a
				href="/"
				onclick={(e) => {
					e.preventDefault();
					toggleListed(!p.isListed);
				}}>{p.isListed ? "Unlist" : "List"}</a
			>
		{/if}
	</div>
	<div class="plantid-box">
		{p.plantId}
	</div>
	<img {src} alt="{p.genus} {p.species}" />
	<div class="text">
		<div class="h1">{p.genus} {p.species}</div>
		{#if p.family}<div class="h2">{p.family}</div>{/if}
		<div class="description">
			<strong>Description: </strong>{p.description || "none"}
		</div>
		{#if p.notes}
			<div class="description"><strong>Notes: </strong>{p.notes}</div>
		{/if}
		<div class="details">
			{p.plantZone || ""}
			{p.plantSize || ""}
			{p.plantType || ""}
			{p.isNwNative ? "NW Native" : ""}
		</div>
		<div class="description">
			Picture Location: {p.pictureLocation || "none"}
		</div>
		<div class="description">
			{bpc ? bpc : "No"} big picture{bpc === 1 ? "" : "s"}.
			<i class="fas fa-caret-right"></i>
			<a
				href="/"
				onclick={(e) => {
					e.preventDefault();
					editPictures(p.plantId);
				}}>Edit Pictures</a
			>
			<i class="fas fa-caret-right"></i>
			<a href="/plant/{p.slug}" target="_blank">Permalink</a>
		</div>
		<div class="extra">
			Last update: {p.lastUpdateFormatted}. Flag: {p.flag ? p.flag : "none"}.
		</div>
		<div class="edit">
			<i class="fas fa-caret-right"></i>
			<a
				href="/"
				onclick={(e) => {
					e.preventDefault();
					editPlant(p.plantId);
				}}>Edit Plant</a
			>
			<i class="fas fa-caret-right"></i> <i class="fas fa-caret-right"></i>
			<i class="fas fa-caret-right"></i>
			<a
				href="/"
				onclick={(e) => {
					e.preventDefault();
					deletePlant(p.plantId);
				}}>Delete Plant</a
			>
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
		background-color: rgba(247, 255, 247, 1);
	}
</style>
