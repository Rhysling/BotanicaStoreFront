<script lang="ts">
  import { navTo } from "../stores/route-store.js";
  import { listedPlants } from "../stores/listedplants-store";
  import { picPaths } from "../stores/utils";

  let fp: IvwListedPlant | undefined;
  let pn = ""
  let src = "";
  let paths: PicPaths;

  $: {
    fp = $listedPlants.find(p => p.isFeatured);

    if (fp) {
      pn = fp.genus + ((fp.species) ? " " + fp.species : "");
      paths = picPaths(fp.plantId, fp.pics);
      src = paths.smPath;
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
    <div class="info">
      <div class="t1">
        {pn}
      </div>
      {#if fp.family}
      <div class="t2">
        {fp.family}
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
    margin: 0 0 2px 2px;

    @media screen and (max-width: $bp-small) {
      margin: 0.2rem 0;
    }

		div {
			margin-bottom: 0.5rem;
		}

		img {
			display: block;
			margin: 0 0.3rem 0.3rem;
      max-width: 150px;
        height: auto;

      @media screen and (max-width: $bp-small) {
        margin: 0 auto 0.3rem;
      }
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
      display: flex;
      align-items: flex-start;

      @media screen and (max-width: $bp-small) {
        display: block;
      }
		}

    .info {

      @media screen and (max-width: $bp-small) {
        margin: 0 0.5rem 0.3rem;
      }
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
