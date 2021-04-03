<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type kvp = {
    label: string;
    value: number;
  };
  
  export let itemsPerPage = 25;
  export let itemCount = 0;
  export let currentPage = 1;
  
  const dispatch = createEventDispatcher();

  let pages = 1;
  let currentPageDisp = currentPage;

  let pagelist: kvp[];
  let selectedPage: number;

  let notify = () => {
		dispatch("pageChanged", {
			currentPage
		});
	}

  let changePage = (n: number) => {
    //selected = {label: `Page ${n}`, value: n};
    currentPage = Math.min(Math.max(n, 1), pages);
    notify();
    //console.log({currentPage: paging.currentPage});
  };

  $:{
    pages = Math.max(Math.ceil(itemCount / itemsPerPage), 1);
    pagelist = [];
    currentPageDisp = currentPage;
    for (let i = 0; i < pages; i +=1) {
      pagelist.push({label: `Page ${i + 1}`, value: i + 1})
    }
    selectedPage = currentPageDisp;
    //console.log({currentPageDisp});
  }

  $: isFirst = currentPage === 1;
  $: isLast = currentPage === pages;

</script>

<!-- svelte-ignore a11y-no-onchange -->
<div>
  <a href="/" on:click|preventDefault={(e) => changePage(1)} class:disabled={isFirst} disabled={isFirst || undefined} title="first"><i class="fas fa-angle-double-left"></i></a>
  <a href="/" on:click|preventDefault={(e) => changePage(currentPage - 1)} class:disabled={isFirst} disabled={isFirst || undefined} title="previous"><i class="fas fa-angle-left"></i></a>
  <select bind:value={selectedPage} on:change={(e) => changePage(selectedPage)}>
		{#each pagelist as p}
			<option value={p.value} selected={p.value == currentPageDisp}>
				{p.label}
			</option>
		{/each}
	</select>
  <a href="/" on:click|preventDefault={(e) => changePage(currentPage + 1)} class:disabled={isLast} disabled={isLast} title="next"><i class="fas fa-angle-right"></i></a>
  <a href="/" on:click|preventDefault={(e) => changePage(pages)} class:disabled={isLast} disabled={isLast} title="last"><i class="fas fa-angle-double-right"></i></a>
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