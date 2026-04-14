<svelte:options runes={true} />

<script lang="ts">
	type kvp = {
		label: string;
		value: number;
	};

	let {
		itemCount = 0,
		currentPageIn = 1,
		itemsPerPage = 25,
		onPageChanged,
	}: {
		itemCount?: number;
		currentPageIn?: number;
		itemsPerPage?: number;
		onPageChanged?: (ps: PageState) => void;
	} = $props();

	let pages = $derived(Math.max(Math.ceil(itemCount / itemsPerPage), 1));
	let pagelist: kvp[] = $derived.by(() => {
		let pl: kvp[] = [];
		for (let i = 0; i < pages; i += 1) {
			pl.push({ label: `Page ${i + 1}`, value: i + 1 });
		}
		return pl;
	});

	let selectedPage = $state(1);

	const changePage = (n: number) => {
		if (n < 1) return;
		let currentPage = Math.min(Math.max(n, 1), pages);
		let startIndex = (currentPage - 1) * itemsPerPage;
		selectedPage = currentPage;

		let ps: PageState = {
			itemsPerPage,
			itemCount,
			currentPage,
			startIndex,
			endIndex: Math.min(startIndex + itemsPerPage, itemCount),
		};
		onPageChanged?.(ps);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const setPage = (n: number) => {
		if (n < 1) {
			changePage(1);
			return;
		}
		selectedPage = Math.min(Math.max(n, 1), pages);
	};

	$effect(() => {
		setPage(currentPageIn);
	});

	let isFirst = $derived(selectedPage === 1);
	let isLast = $derived(selectedPage === pages);
</script>

<div>
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			changePage(1);
		}}
		class:disabled={isFirst}
		title="first"><i class="fas fa-angle-double-left"></i></a
	>
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			changePage(selectedPage - 1);
		}}
		class:disabled={isFirst}
		title="previous"><i class="fas fa-angle-left"></i></a
	>
	<select bind:value={selectedPage} onchange={() => changePage(selectedPage)}>
		{#each pagelist as p}
			<option value={p.value}>
				{p.label}
			</option>
		{/each}
	</select>
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			changePage(selectedPage + 1);
		}}
		class:disabled={isLast}
		title="next"><i class="fas fa-angle-right"></i></a
	>
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			changePage(pages);
		}}
		class:disabled={isLast}
		title="last"><i class="fas fa-angle-double-right"></i></a
	>
</div>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	div {
		font-size: 0.8rem;
	}

	a {
		display: inline-block;
		margin: 0 0.25rem;
	}

	.disabled {
		cursor: default;
		color: c.$text-disabled;

		&:hover {
			text-decoration: none;
		}
	}
</style>
