<svelte:options runes={true} />

<script lang="ts">
	import Modal from "../Modal.svelte";

	const newPlant: IPlant = {
		plantId: 0,
		genus: "",
		species: "",
		family: null,
		description: null,
		notes: null,
		plantSize: null,
		plantType: null,
		plantZone: null,
		pictureLocation: null,
		isNwNative: false,
		pics: "[]",
		isListed: false,
		isFeatured: false,
		slug: "",
		lastUpdate: "",
		flag: null,
		lastUpdateFormatted: "",
		cardLine1: null,
		cardLine2: null,
	};

	let {
		plant,
		editError = "",
		handleEditPlantModal = () => {},
		handleFinishEdit = () => {},
	}: {
		plant: IPlant;
		editError?: string;
		handleEditPlantModal: (isOpen: boolean) => void;
		handleFinishEdit: (plant: Partial<IPlant>) => void;
	} = $props();

	let ep: IPlant = $state({ ...newPlant });
	let isValid: boolean | null = $state(null);
	let isValidGenus = $state(true);
	let isValidSpecies = $state(true);

	let validate = () => {
		isValidGenus = !!ep.genus && ep.genus.length > 1;
		isValidSpecies = !!ep.species && ep.species.length > 1;
		isValid = isValidGenus && isValidSpecies;
	};

	let save = () => {
		validate();
		if (isValid) handleFinishEdit(ep);
	};

	let cancel = () => {
		handleFinishEdit({ plantId: -1 });
	};

	// Startup
	let hasRun = false;
	$effect(() => {
		if (!hasRun) {
			ep = { ...plant };
			hasRun = true;
		}
	});
</script>

<Modal isShowModal={true}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="editor" role="form" onclick={(e) => e.stopPropagation()}>
		<div class="title">Add / Edit Plant</div>
		{#if editError}
			<div class="error">
				Something went wrong: {editError}
			</div>
		{/if}
		<div class="subhead">
			<div>
				<div>PlantId:</div>
				<div>{ep.plantId || "New Plant"}</div>
			</div>
			<div>
				<div>Last Update:</div>
				<div>{ep.lastUpdateFormatted}</div>
			</div>
		</div>
		<div class="wrapped">
			<input
				type="text"
				bind:value={ep.genus}
				onchange={validate}
				placeholder="Genus"
			/>
			{#if !isValidGenus}<span class="error">Required</span>{/if}
		</div>
		<div class="wrapped">
			<input
				type="text"
				bind:value={ep.species}
				onchange={validate}
				placeholder="Species"
			/>
			{#if !isValidSpecies}<span class="error">Required</span>{/if}
		</div>
		<input type="text" bind:value={ep.family} placeholder="Family" />
		<textarea bind:value={ep.description} placeholder="Description"></textarea>
		<textarea bind:value={ep.notes} placeholder="Notes"></textarea>
		<input
			class="sm"
			type="text"
			bind:value={ep.plantSize}
			placeholder="Size"
		/>
		<input
			class="sm"
			type="text"
			bind:value={ep.plantType}
			placeholder="Type"
		/>
		<input
			class="sm"
			type="text"
			bind:value={ep.plantZone}
			placeholder="Zone"
		/>
		<input
			type="text"
			bind:value={ep.pictureLocation}
			placeholder="Picture Location"
		/>
		<div class="wrapped">
			<span class="label">Is NW Native</span>
			<input type="checkbox" bind:checked={ep.isNwNative} />
		</div>
		<input
			class="xs"
			type="text"
			bind:value={ep.flag}
			onkeyup={() => {
				if (ep.flag && ep.flag.length > 2) ep.flag = ep.flag.substring(0, 2);
			}}
			placeholder="Flag"
		/>
		<div class="buttons">
			<button onclick={save} class="primary" disabled={isValid === false}
				>Save</button
			>
			<button onclick={cancel}>Cancel</button>
		</div>
	</div>
</Modal>

<style lang="scss">
	.editor {
		margin: 5rem 5rem;
		padding: 3rem;
		background-color: antiquewhite;

		.title {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
		}

		.subhead {
			font-size: 0.9rem;
			margin: 0 0 1rem;

			div {
				display: flex;

				div {
					margin: 0 0.5rem 0 0;
				}
			}
		}

		.wrapped > input {
			display: inline-block;
			width: auto;
		}

		.label {
			display: inline-block;
			margin: 0 0.25rem 0 0;
			font-weight: bold;
			font-size: 0.9rem;
		}

		textarea {
			display: block;
			width: 30rem;
		}

		input {
			display: block;
			width: 25rem;

			&.sm {
				width: 15rem;
			}

			&.xs {
				width: 3rem;
			}
		}

		.error {
			color: red;
			font-size: 0.9rem;
		}

		.buttons {
			margin: 1rem 0 0;
		}
	}
</style>
