<script lang="ts">
  import type { AxiosError } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";
  //import { currentParams } from "../stores/route-store";
  import { picPaths, getBaseURL } from "../stores/utils";

  let slug = "";
  let plant: IPlant | undefined = undefined;
  let isFound: boolean | undefined = undefined;
  let paths: PicPaths;
  let resultText = "Plant not found.";
  let baseURL = getBaseURL();

  let loadPlant = async (slug: string) => {
    if (!slug) {
      isFound = false;
      return;
    }

    try {
      const response = await $ax.get<IPlant>(`${baseURL || window.location.origin}/api/ListedPlants/FindBySlug?slug=${slug}`);
      plant = response.data;

      if (plant) {
        isFound = true;
        paths = picPaths(plant.plantId, plant.pics);
        return;
      }

      isFound = false;
    }
    catch (error) {
      let err = <AxiosError>error;
      resultText = (err.response?.status == 404) ? "Plant not found." : "Something went wrong.";
      isFound = false;
      console.error({err});
    }

  };

  let findSlug = () => {
    const re = /.*\/([^\/]+)\/?$/;
    let match = window.location.pathname.match(re);
    if (!match) {
      isFound = false;
      return;
    }
    slug = match[1];
  };

  findSlug();
  loadPlant(slug);

</script>

{#if isFound === undefined}
  <div class="notice">Loading...</div>
{/if}

{#if isFound === false}
  <div class="notice">{resultText}</div>
{/if}

  {#if isFound === true && plant}
  <div class="plant">
    <div class="top">
      <img src="{paths.smPath}" alt="{plant.genus} {plant.species}" />
      <div class="title">
        <div class="genus">{plant.cardLine1}</div>
        <div class="species">{plant.cardLine2}</div>
        {#if plant.family}<div class="family">{plant.family}</div>{/if}
      </div>
    </div>
    <div class="description">
      {plant.description}
    </div>
    <div class="details">
      {plant.plantZone || ""} {plant.plantSize || ""} {plant.plantType || ""}
      {#if plant.isNwNative}<span class="nwn">Northwest Native.</span>{/if}
    </div>

    {#each paths.lgPaths as bpp}
      <img class="bigpic" src="{bpp.path}" alt="" />
    {/each}
  </div>
{/if}



<style lang="scss">
	@import "../styles/_custom-variables.scss";
  .notice {
    width: 100%;
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    margin: 5rem 0;
  }

  .plant {
    margin: 2rem 3rem;
  }

  .top {
    display: flex;
    align-items: center;

    img {
      width: 150px;
      height: auto;
      margin: 0 1rem 0 0;
    }

    .title {
      font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
      font-weight: bold;
      text-align: center;
      width: 100%;
      margin: 0 0 0 1rem;
    }

    .genus {
      font-size: 3rem;
    }

    .species {
      font-size: 2.5rem;
    }

    .family {
      font-size: 1rem;
      font-style: italic;
    }
  }

  .description {
    margin: 1rem 0 0;
  }

  .details {
    margin: 1rem 0 0;
    color: #8b4513;

    .nwn {
      font-weight: bold;
      font-style: italic;
      color: $main-color;
    }
  }

  .bigpic {
    display: block;
    width: min(750px, 100%);
    height: auto;
    margin: 1rem auto;
    border: 1px solid $main-color;
  }

  @media screen and (max-width: $bp-small) {
    .plant {
      margin: 1rem;
    }

    .top {
      display: block;
      align-items: center;

      img {
        display: block;
        margin: 0 auto 1rem;
      }

      .title {
        margin: 0 auto 1rem;
      }

      .genus {
        font-size: 2rem;
      }

      .species {
        font-size: 1.5rem;
      }
    }

    .description, .details {
      font-size: 0.9rem;
    }
  }

</style>