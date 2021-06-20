<script lang="ts">
  import { currentPage, pages } from "../stores/listedplants-store";

  type kvp = {
    label: string;
    value: number;
  };

  let pagelist: kvp[];
  let selectedPage: number;

  let buildList = (pc: number) => {
    pagelist = [];
    for (let i = 0; i < pc; i +=1) {
      pagelist.push({label: `Page ${i + 1}`, value: i + 1})
    }
    selectedPage = $currentPage;
  };

  let changePage = (n: number) => {
    n = Math.max(n, 1);
    n = Math.min(n, $pages);

    if (n !== $currentPage) {
      $currentPage = n;

      // let el = document.getElementById("plant-list");
      // if (el) el.scrollIntoView(true); // top

      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  };

  $: {
    buildList($pages);
    changePage(1);
  }

  $: isFirst = $currentPage === 1;
  $: isLast = $currentPage === $pages;

</script>

<!-- svelte-ignore a11y-no-onchange -->
<div>
  <a href="/" on:click|preventDefault={() => changePage(1)} class:disabled={isFirst} disabled={isFirst || undefined} title="first"><i class="fas fa-angle-double-left"></i></a>
  <a href="/" on:click|preventDefault={() => changePage($currentPage - 1)} class:disabled={isFirst} disabled={isFirst || undefined} title="previous"><i class="fas fa-angle-left"></i></a>
  <select bind:value={selectedPage} on:change={() => changePage(selectedPage)}>
		{#each pagelist as p}
			<option value={p.value} selected={p.value == $currentPage}>
				{p.label}
			</option>
		{/each}
	</select>
  <a href="/" on:click|preventDefault={() => changePage($currentPage + 1)} class:disabled={isLast} disabled={isLast} title="next"><i class="fas fa-angle-right"></i></a>
  <a href="/" on:click|preventDefault={() => changePage($pages)} class:disabled={isLast} disabled={isLast} title="last"><i class="fas fa-angle-double-right"></i></a>
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