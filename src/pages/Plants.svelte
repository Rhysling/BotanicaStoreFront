<svelte:options runes={true} />

<script lang="ts">
	import { listedPlants as lp } from "../stores/listedplants-store";
	import { onDestroy } from "svelte";
	import Pager from "../components/Pager.svelte";
	import PlantListFilter from "../components/PlantListFilter.svelte";
	import DisplayPlant from "../components/DisplayPlant.svelte";
	import PlantBigPicModal from "../components/PlantBigPicModal.svelte";

	let listedPlants: IvwListedPlant[] = [];
	let filteredPlants: IvwListedPlant[] = $state([]);
	let pagedPlants: IvwListedPlant[] = $derived.by(() =>
		filteredPlants.slice(startIndex, endIndex),
	);

	let plantListFilter: PlantFilter = $state({
		filterText: "",
		isNwNativeOnly: false,
		includeNotAvailable: true,
	});

	let itemCount = $derived(filteredPlants.length);
	let itemsPerPage = 25;
	let startIndex = $state(0);
	let endIndex = $derived(Math.min(startIndex + itemsPerPage, itemCount));

	let currentPageIn = $state(1);

	let bigPicPaths: PicIdPath[] = $state([]);
	let isShowModal = $state(false);

	const setModal = (isOpen: boolean) => {
		isShowModal = isOpen;
	};

	let showBigPics = (bigPicPathsIn: PicIdPath[]) => {
		bigPicPaths = bigPicPathsIn;
		isShowModal = true;
	};

	let handleSetModal = (e: CustomEvent<{ val: boolean }>) => {
		isShowModal = e.detail.val;
	};

	let handleFilterPlants = (e: CustomEvent<PlantFilter>) => {
		plantListFilter = e.detail;
		filterPlants();
	};

	let handlePageChanged = (ps: PageState) => {
		currentPageIn = ps.currentPage;
		startIndex = ps.startIndex;
	};

	let filterPlants = () => {
		let plf = plantListFilter;

		let f = (p: IvwListedPlant) => {
			let passesText =
				plf.filterText === "" ||
				p.genus.toLowerCase().startsWith(plf.filterText.toLowerCase()) ||
				p.species.toLowerCase().startsWith(plf.filterText.toLowerCase()) ||
				(p.family || "").toLowerCase().includes(plf.filterText.toLowerCase()) ||
				p.description.toLowerCase().includes(plf.filterText.toLowerCase());

			let passesAvailable =
				plf.includeNotAvailable || p.availability.length > 1;
			let passesNwNative = !plf.isNwNativeOnly || p.isNwNative;

			return passesText && passesAvailable && passesNwNative;
		};

		filteredPlants = listedPlants.filter(f);
		currentPageIn = 1;
		startIndex = 0;
	};

	// *** Init ***
	//onMount(loadPlants);

	const unsubscribe = lp.subscribe((value) => {
		listedPlants = value;
		filterPlants();
	});

	onDestroy(unsubscribe);
</script>

<div class="filter-pager">
	<PlantListFilter {...plantListFilter} on:filterPlants={handleFilterPlants} />
	<div class="pager">
		<Pager
			{itemsPerPage}
			{itemCount}
			{currentPageIn}
			onPageChanged={handlePageChanged}
		/>
	</div>
</div>

<div id="plant-list">
	{#each pagedPlants as p (p.plantId)}
		<DisplayPlant plant={p} {showBigPics} />
	{/each}
</div>

<div class="filter-pager">
	<PlantListFilter {...plantListFilter} on:filterPlants={handleFilterPlants} />
	<div class="pager">
		<Pager
			{itemsPerPage}
			{itemCount}
			{currentPageIn}
			onPageChanged={handlePageChanged}
		/>
	</div>
</div>

<PlantBigPicModal {bigPicPaths} {isShowModal} {setModal} />

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	.filter-pager {
		display: flex;
		flex-flow: row wrap;
		align-items: baseline;
		font-size: 0.8rem;
		margin-top: 0.5em;
		background-color: c.$beige-lighter;
	}

	.pager {
		flex: 1 0 auto;
		text-align: right;
	}
</style>
