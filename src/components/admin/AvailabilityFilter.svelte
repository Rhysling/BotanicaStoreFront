<svelte:options runes={true} />

<script lang="ts">
	import Pager from "../../components/Pager.svelte";

	let {
		plants = [],
		onFilterPlants = () => {},
		onPageChanged = () => {},
	}: {
		plants?: IvwPlantPriceSummary[];
		currentPageIn?: number;
		plantFilterIn?: PlantAdminFilter;
		onFilterPlants?: (filteredList: IvwPlantPriceSummary[]) => void;
		onPageChanged?: (ps: PageState) => void;
	} = $props();

	let filterGenus = $state("");
	let isPriced = $state(false);
	let isAvailable = $state(false);
	let itemCount = $state(0);

	let filterPlants = () => {
		let f = (p: IvwPlantPriceSummary) => {
			return (
				(filterGenus === "" ||
					p.genus.toLowerCase().startsWith(filterGenus.toLowerCase())) &&
				(isPriced === false || !!p.available || !!p.notAvailable) &&
				(isAvailable === false || !!p.available)
			);
		};

		let filteredList = plants.filter(f);
		itemCount = filteredList.length;
		onFilterPlants(filteredList);
	};

	let clearFilter = () => {
		filterGenus = "";
		isPriced = false;
		isAvailable = false;
		filterPlants();
	};

	$effect(() => {
		if (plants.length > 0) {
			filterPlants();
		}
	});
</script>

<div class="search">
	Search:
	<input
		type="text"
		class="genus-box"
		bind:value={filterGenus}
		placeholder="Genus"
	/>
	<div class="sep">Priced only:</div>
	<input type="checkbox" class="filter-checkbox" bind:checked={isPriced} />
	<div class="sep">Available only:</div>
	<input type="checkbox" class="filter-checkbox" bind:checked={isAvailable} />
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			filterPlants();
		}}>Go</a
	>
	<div class="sep">-</div>
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			clearFilter();
		}}>Cancel</a
	>
	<div class="pager">
		<Pager {itemCount} {onPageChanged} />
	</div>
</div>

<style lang="scss">
	@use "../../styles/_custom-variables.scss" as c;

	.search {
		display: flex;
		flex-flow: row wrap;
		align-items: baseline;
		font-size: 0.8rem;
		margin-top: 0.5em;
		background-color: c.$beige-lighter;

		input {
			margin-left: 0.5em;
		}

		a {
			display: inline-block;
			margin-left: 0.5em;
		}

		.sep {
			display: inline-block;
			margin-left: 0.5em;
		}

		.genus-box {
			width: 8em;
		}
	}

	.pager {
		flex: 1 0 auto;
		text-align: right;
	}
</style>
