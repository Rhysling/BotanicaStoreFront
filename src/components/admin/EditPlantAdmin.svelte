<script lang="ts">
  import Modal from "../Modal.svelte";
  import { createEventDispatcher } from 'svelte';

  export let plant: IPlant;
  export let editError = "";

  const dispatch = createEventDispatcher();

  let ep = {...plant};
  let isValid: boolean | null = null;
  let isValidGenus = true;
  let isValidSpecies = true;

  let validate = () => {
    isValidGenus = !!ep.genus && ep.genus.length > 1;
    isValidSpecies = !!ep.species && ep.species.length > 1;
    isValid = isValidGenus && isValidSpecies;
  };

  let save = () => {
    validate();
    if (isValid)
      dispatch("finishEdit", ep);
  };

  let cancel = () => {
    dispatch("finishEdit", {plantId: -1});
  };

</script>

<Modal isShowModal={true} on:setmodal>
  <div class="editor" on:click={(e) => e.stopPropagation()}>
    <div class="title">
      Add / Edit Plant
    </div>
    {#if editError}
    <div class="error">
      Something went wrong: {editError}
    </div>
    {/if}
    <div class="subhead">
      <div>
        <div>PlantId:</div>
        <div>{ep.plantId || "New Plant"}</div>
      </div>
      <div>
        <div>Last Update:</div>
        <div>{ep.lastUpdateFormatted}</div>
      </div>
    </div>
    <div class="wrapped">
      <input type="text" bind:value={ep.genus} on:change={validate} placeholder="Genus" />
      {#if !isValidGenus}<span class="error">Required</span>{/if}
    </div>
    <div class="wrapped">
      <input type="text" bind:value={ep.species} on:change={validate} placeholder="Species" />
      {#if !isValidSpecies}<span class="error">Required</span>{/if}
    </div>
    <input type="text" bind:value={ep.common} placeholder="Common" />
    <textarea bind:value={ep.description} placeholder="Description"></textarea>
    <textarea bind:value={ep.webDescription} placeholder="Web Description"></textarea>
    <input class="sm" type="text" bind:value={ep.plantSize} placeholder="Size" />
    <input class="sm" type="text" bind:value={ep.plantType} placeholder="Type" />
    <input class="sm" type="text" bind:value={ep.plantZone} placeholder="Zone" />
    <div class="wrapped">
      <span class="label">Is NW Native</span>
      <input type="checkbox" bind:checked={ep.isNwNative} />
    </div>
    <input class="xs" type="text" bind:value={ep.flag} on:keyup={() => {if (ep.flag && ep.flag.length > 2) ep.flag = ep.flag.substring(0,2)}} placeholder="Flag" />
    <div class="buttons">
      <button on:click={save} class="primary" disabled={isValid === false}>Save</button>
      <button on:click={cancel} >Cancel</button>
    </div>
  </div>
</Modal>

<style lang="scss">
  .editor {
    margin: 5rem 5rem;
    padding: 3rem;
    background-color: antiquewhite;

    .title {
      font-size: 1.1rem;
      font-weight: bold;
      text-align:center;
    }

    .subhead {
      font-size: 0.9rem;
      margin: 0 0 1rem;

      div {
        display: flex;

        div {
          margin: 0 0.5rem 0 0;
        }
      }
    }

    .wrapped > input {
      display: inline-block;
      width: auto;
    }

    .label {
      display: inline-block;
      margin: 0 0.25rem 0 0;
      font-weight: bold;
      font-size: 0.9rem;
    }

    textarea {
      display: block;
      width: 30rem;
    }

    input {
      display: block;
      width: 25rem;

      &.sm {
        width: 15rem;
      }

      &.xs {
        width: 3rem;
      }
    }

    .error {
      color: red;
      font-size: 0.9rem;
    }

    .buttons {
      margin: 1rem 0 0;
    }
  }

</style>