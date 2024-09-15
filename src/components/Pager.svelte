<script lang="ts">
	import { createEventDispatcher } from "svelte";

	type kvp = {
		label: string;
		value: number;
	};

	export let itemCount = 0;
	export let currentPageIn = 1;
	export let itemsPerPage = 25;

	const dispatch = createEventDispatcher();

	let pages = 1;
	let pagelist: kvp[] = [];
	let selectedPage = currentPageIn;

	const buildList = (ic: number) => {
		pages = Math.max(Math.ceil(ic / itemsPerPage), 1);
		pagelist = [];
		for (let i = 0; i < pages; i += 1) {
			pagelist.push({ label: `Page ${i + 1}`, value: i + 1 });
		}

		selectedPage = 1;
	};

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
		dispatch("pageChanged", ps);
	};

	const setPage = (n: number) => {
		if (n < 1) {
			changePage(1);
			return;
		}

		let currentPage = Math.min(Math.max(n, 1), pages);
		selectedPage = currentPage;
	};

	$: buildList(itemCount);
	$: setPage(currentPageIn);
	$: isFirst = selectedPage === 1;
	$: isLast = selectedPage === pages;
</script>

<!-- svelte-ignore a11y-no-onchange -->
<div>
	<a
		href="/"
		on:click|preventDefault={() => changePage(1)}
		class:disabled={isFirst}
		title="first"><i class="fas fa-angle-double-left"></i></a
	>
	<a
		href="/"
		on:click|preventDefault={() => changePage(selectedPage - 1)}
		class:disabled={isFirst}
		title="previous"><i class="fas fa-angle-left"></i></a
	>
	<select bind:value={selectedPage} on:change={() => changePage(selectedPage)}>
		{#each pagelist as p}
			<option value={p.value}>
				{p.label}
			</option>
		{/each}
	</select>
	<a
		href="/"
		on:click|preventDefault={() => changePage(selectedPage + 1)}
		class:disabled={isLast}
		title="next"><i class="fas fa-angle-right"></i></a
	>
	<a
		href="/"
		on:click|preventDefault={() => changePage(pages)}
		class:disabled={isLast}
		title="last"><i class="fas fa-angle-double-right"></i></a
	>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	div {
		font-size: 0.8rem;
	}

	a {
		display: inline-block;
		margin: 0 0.25rem;
	}

	.disabled {
		cursor: default;
		color: $text-disabled;

		&:hover {
			text-decoration: none;
		}
	}
</style>
