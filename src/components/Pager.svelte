<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type kvp = {
    label: string;
    value: number;
  };
  
  export let itemsPerPage = 25;
  export let itemCount = 0;
  export let currentPage = 1;

  let startIndex = 0;
  let endIndex = 0;

  let prevItemsPerPage = 0;
  let prevItemCount = 0;
  let isBuilt = false;

  const dispatch = createEventDispatcher();

  let pages = 1;
  let pagelist: kvp[];
  let selectedPage: number;

  let buildList = () => {
    pages = Math.max(Math.ceil(itemCount / itemsPerPage), 1);
    pagelist = [];
    for (let i = 0; i < pages; i +=1) {
      pagelist.push({label: `Page ${i + 1}`, value: i + 1})
    }
    selectedPage = currentPage;
  };

  let changePage = (n: number) => {
    currentPage = Math.min(Math.max(n, 1), pages);
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = Math.min(startIndex + itemsPerPage, itemCount);
    dispatch("pageChanged", {
      itemsPerPage,
      itemCount,
      currentPage,
      startIndex,
      endIndex
		});
  };

  $: if (!isBuilt || (prevItemCount !== itemCount) || (prevItemsPerPage !== itemsPerPage)) {
    buildList();

    prevItemCount = itemCount;
    prevItemsPerPage = itemsPerPage;
    isBuilt = true;
    changePage(currentPage);
  }

  $: isFirst = currentPage === 1;
  $: isLast = currentPage === pages;

</script>

<!-- svelte-ignore a11y-no-onchange -->
<div>
  <a href="/" on:click|preventDefault={() => changePage(1)} class:disabled={isFirst} disabled={isFirst || undefined} title="first"><i class="fas fa-angle-double-left"></i></a>
  <a href="/" on:click|preventDefault={() => changePage(currentPage - 1)} class:disabled={isFirst} disabled={isFirst || undefined} title="previous"><i class="fas fa-angle-left"></i></a>
  <select bind:value={selectedPage} on:change={() => changePage(selectedPage)}>
		{#each pagelist as p}
			<option value={p.value} selected={p.value == currentPage}>
				{p.label}
			</option>
		{/each}
	</select>
  <a href="/" on:click|preventDefault={() => changePage(currentPage + 1)} class:disabled={isLast} disabled={isLast} title="next"><i class="fas fa-angle-right"></i></a>
  <a href="/" on:click|preventDefault={() => changePage(pages)} class:disabled={isLast} disabled={isLast} title="last"><i class="fas fa-angle-double-right"></i></a>
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