<script lang="ts">
  import { onMount } from 'svelte';
  import type { AxiosError, AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import Modal from "../Modal.svelte";
  import { createEventDispatcher } from 'svelte';

  export let editPlantId: number;
  export let editPlantGenus = "";
  export let editPlantSpecies = "";

  const dispatch = createEventDispatcher();

  let eppOriginal: IvwPlantPriceMatrix[] = [];
  let epp: PlantPriceMatrix[] = [];
  let editError = "";
  let isValid = true;
  
let mapOriginalToDisplay = (vw: IvwPlantPriceMatrix[]): PlantPriceMatrix[] => {
  return vw.map(a => (
    {
      ...a,
      price: a.price ? a.price.toFixed(2) : null
    }
  ))
};

  let loadPriceMatrix = (plantId: number) => {
    $ax.get("/api/admin/PlantPriceSummary/GetMatrix?plantId=" + plantId)
    .then(function (response: AxiosResponse<IvwPlantPriceMatrix[]>) {
      eppOriginal = response.data;
      epp = mapOriginalToDisplay(eppOriginal);
    })
    .catch(function (e) {
      console.log(e);
    });
  }

  onMount(() => loadPriceMatrix(editPlantId));

  let validatePrice = (str: string | null) => {
    if (str === null || str === "") return true;

    let val = +str;

    if (isNaN(val)) return false;

    return (val < 999 && val > 0.005);
  };

  $: isValid = !epp.some(a => !validatePrice(a.price));

  let save = () => {
    //   Make and save details to db
    let pp: IPlantPrice[] = epp
      .filter(a => a.price && validatePrice(a.price))
      .map(a => ({
        plantId: editPlantId,
        potSizeId: a.potSizeId,
        price: +(a.price || 0),
        isAvailable: a.isAvailable
      }));

    let summaryAvailable: string = epp
      .filter(a => a.price && validatePrice(a.price) && a.isAvailable)
      .map(a => a.potShorthand + "-$" + a.price || "N/A")
      .join(" / ");

    let summaryPriced: string = epp
      .filter(a => a.price && validatePrice(a.price) && !a.isAvailable)
      .map(a => a.potShorthand + "-$" + a.price || "N/A")
      .join(" / ");

    $ax.post("/api/admin/PlantPrice/UpdateAllForPlant?plantId=" + editPlantId, pp)
    .then(() => {
      let data = {plantId: editPlantId, summaryAvailable, summaryPriced};
      dispatch("finishEdit", data);
    })
    .catch(function (e: AxiosError) {
      editError = e.response?.data?.title || "No title provided.";
      console.log(e);
    });
    
  };

  let cancel = () => {
    dispatch("finishEdit", {plantId: 0, availableSummary: "", otherSummary: ""});
  };

</script>

<Modal isShowModal={true} on:setmodal={cancel}>
  <div class="editor" on:click={(e) => e.stopPropagation()}>
    <div class="title">
      {editPlantGenus} {editPlantSpecies} ({editPlantId})
    </div>
    {#if editError}
    <div class="error">
      Something went wrong: {editError}
    </div>
    {/if}

    <div class="price-item" style="margin-bottom:0.5rem;">
      <div class="description" style="font-weight:bold;font-size:0.9rem;">Pot Size</div>
      <div class="price" style="font-weight:bold;font-size:0.9rem;text-align:right;">Price</div>
      <div class="is-avail" style="font-weight:bold;font-size:0.9rem;">Is Available</div>
    </div>

    {#each epp as p (p.potSizeId)}
    <div class="price-item">
      <div class="description">{p.potDescription}</div>
      <div class="price"><input type="text" bind:value={p.price} class:error-price={!validatePrice(p.price)} /></div>
      <div class="is-avail"><input type="checkbox" bind:checked={p.isAvailable} /></div>
    </div>

    {/each}

    <div class="buttons">
      <button on:click={save} class="primary" disabled={isValid === false}>Save</button>
      <button on:click={cancel} >Cancel</button>
    </div>
  </div>
</Modal>

<style lang="scss">
  @import "../../styles/_custom-variables.scss";

  .editor {
    margin: 5rem 5rem;
    padding: 3rem;
    background-color: antiquewhite;

    .title {
      font-size: 1.1rem;
      font-weight: bold;
      text-align:center;
      margin-bottom: 1rem;
    }

    .price-item {
      display: flex;
      justify-content: center;
      align-items: baseline;
      margin-left: 0;

      .description {
        flex: 0 1 12rem;
        font-size: 0.9rem;
      }

      .price {
        flex: 0 1 5rem;
        font-size: 0.8rem;
        text-align: right;

        input {
          display: inline-block;
          max-width: 4rem;
          text-align: right;
        }
      }

      .is-avail {
        flex: 0 1 8rem;
        margin-left: 1rem;
      }
    }
  }

  .buttons {
      margin: 1rem 0 0;
      text-align: center;
    }

  .error-price {
    box-shadow: 0 0 2px 2px $error-secondary;
    border: 1px solid $error-primary;
    color: darken($error-primary, 10%);
    background-color: lighten($error-secondary, 5%);
  }

</style>