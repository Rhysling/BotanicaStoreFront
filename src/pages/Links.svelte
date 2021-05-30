<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

  let links: ILink[] = [];

  $ax.get("/api/Links/GetAll")
    .then((response: AxiosResponse<ILink[]>) => links = response.data)
    .catch((err) => console.log({err}));

</script>

<div class="content">
  {#each links as l}
    <div class="item">
      <div class="star">
        <img src="./assets/img/star-4.png" alt="star">
      </div>
      <div class="details">
        <div class="title">{l.title}</div>
        <div class="url"><a href={l.url} target="_blank">{l.url}</a></div>
        <div class="description">{l.description}</div>
      </div>
    </div>
  {:else}
    No listings.
  {/each}
  
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.content {
		font-size: 0.9rem;
		padding: 2rem;
    margin: 0 auto;
    max-width: 610px;

    .item {
      display: flex;
      margin-bottom: 1.3rem;
    }

    .star {
      padding: 0 1rem;
    }

    .title {
      font-size: 1rem;
      font-weight: bold;
      color: $main-color;
    }

    .url {
      margin-bottom: 0.3rem;
    }

	}


</style>