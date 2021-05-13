<script lang="ts">
  import { navTo } from "../stores/route-store.js";
  import { listedPlants } from "../stores/listedplants-store";

  let fp: IvwListedPlant | undefined;
  let pn = ""
  let src = "";

  $: {
    fp = $listedPlants.find(p => p.isFeatured);

    if (fp) {
      pn = fp.genus + ((fp.species) ? " " + fp.species : "");
      src = fp.hasSmallPic ? `/plantpics/p${fp.plantId.toString().padStart(4, "0")}_sm.jpg` : "/plantpics/no-pic.jpg";
    }
  }

</script>

<div class="card-plants">
  {#if fp}
  <div class="title">
    Featured Plant
  </div>
  <div class="plant">
    <img {src} alt="{pn}" />
    <div class="t1">
      {pn}
    </div>
    {#if fp.common}
    <div class="t2">
      {fp.common}
    </div>
    {/if}
    <div>
      {fp.description}
      <span class="plant-habit">{fp.plantSize || ""} {fp.plantType || ""} {fp.plantZone || ""}</span>
    </div>
    <a href="/" on:click={(e) => navTo(e, "/plants")}>
      See List of Available Plants
    </a>
  </div>
  {:else}
  <div class="title">
    No Featured Plant
  </div>
  {/if}
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

  .card-plants {
		flex: 1 0 auto;
		border: 1px solid black;

		div {
			margin-bottom: 0.5rem;
		}

		img {
			display: block;
			float: left;
			margin: 0 0.3rem 0.3rem 0;
		}

		.title {
      font-size: 1rem;
      font-weight: bold;
      text-align: center;
      padding: 0.25rem;
			background-color: $beige-lighter;
		}

		.plant {
			margin-top: 0.5rem;
		}

		.t1 {
			font-size: 1rem;
			font-weight: bold;
			margin-bottom: 0;
		}

		.t2 {
			font-size: 0.9rem;
			font-style: italic;
		}

		.plant-habit {
			color: #8B4513;
		}

		a {
			display: block;
		}
	}
</style>
