<script lang="ts">
  import Modal from "../Modal.svelte";
  import { createEventDispatcher } from 'svelte';

  export let item: ILinkEdit | null;
  export let editError = "";

  const dispatch = createEventDispatcher();

  let c = {...item};

  let valMsgTitle = "";
  let valMsgUrl = "";
  let valMsgSortOrder = "";
  let isValid = true;

  let testRequired = (str: string | undefined) => {
    if (!str) return "Required.";
    if (str.trim().length == 0) return "Required.";
    return "";
  };

  let testIsUrl = (str: string | undefined) => {
    if (!str) return "";
    if (!str.startsWith("http")) return "Need to include 'http'.";
    return "";
  };

  let testIsPositiveInteger = (str: string | undefined) => {
    if (!str) return "";

    let val = Number(str);
    if (isNaN(val)) return "Must be a number.";
    if (!Number.isInteger(val) || (val < 1)) return "Must be a positive integer.";
    return "";
  };

  let validateTitle = (str: string | undefined) => {
    valMsgTitle = testRequired(str);
  };

  let validateUrl = (str: string | undefined) => {
    valMsgUrl = testRequired(str);

    if (!valMsgUrl)
      valMsgUrl = testIsUrl(str);
  };

  let validateSortOrder = (str: string | undefined) => {
    valMsgSortOrder = testRequired(str);

    if (!valMsgSortOrder)
      valMsgSortOrder = testIsPositiveInteger(str);
  };


  $: isValid = (valMsgTitle + valMsgUrl + valMsgSortOrder).length === 0;

  let validate = () => {
    validateTitle(c.title);
    validateUrl(c.url);
    validateSortOrder(c.sortOrderEntered);
    isValid = (valMsgTitle + valMsgUrl).length === 0;
  };


  let save = () => {
    validate();
    if (isValid) {
      c.description = c.description || "";
      c.sortOrder = Number(c.sortOrderEntered);
      dispatch("finishEdit", c);
    }
  };

  let cancel = () => {
    dispatch("finishEdit", { linkId: -1 });
  };

</script>

<Modal isShowModal={true} on:setmodal>
  <div class="editor" on:click={(e) => e.stopPropagation()}>
    <div class="title">
      Add / Edit Link Item
    </div>
    {#if editError}
    <div class="error">
      Something went wrong: {editError}
    </div>
    {/if}

    <div class="entry">
      <div class="label required">Item Id</div>
      <div class="info">
        {c.linkId || "New Event"}
      </div>
    </div>

    <div class="entry">
      <div class="label required">Title</div>
      <div class="info">
        <input type="text"
          bind:value={c.title}
          on:blur={() => validateTitle(c.title)}
          class:error-box={valMsgTitle ? true : null}
          placeholder="Title" />
        {#if valMsgTitle}<span class="error">{valMsgTitle}</span>{/if}
      </div>
    </div>

    <div class="entry">
      <div class="label required">URL</div>
      <div class="info">
        <input type="text"
          bind:value={c.url}
          on:blur={() => validateUrl(c.url)}
          class:error-box={valMsgUrl ? true : null}
          placeholder="URL" />
        {#if valMsgUrl}<span class="error">{valMsgUrl}</span>{/if}
      </div>
    </div>
    
    <div class="entry">
      <div class="label">Description</div>
      <div class="info">
        <textarea bind:value={c.description} placeholder="Description"></textarea>
      </div>
    </div>
    
    <div class="entry">
      <div class="label required">Sort Order</div>
      <div class="info">
        <input type="text"
          bind:value={c.sortOrderEntered}
          on:blur={() => validateSortOrder(c.sortOrderEntered)}
          class:error-box={valMsgSortOrder ? true : null}
          placeholder="Sort Order" />
        {#if valMsgSortOrder}<span class="error">{valMsgSortOrder}</span>{/if}
      </div>
    </div>

    <div class="entry">
      <div class="label">Is Deleted</div>
      <div class="info">
        <input type="checkbox" bind:checked={c.isDeleted} />
      </div>
    </div>
    
    <div class="buttons">
      <button on:click={save} class="primary" disabled={isValid ? undefined : true}>Save</button>
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
      margin-bottom: 0.8rem;
    }

    .entry {
      display: flex;
      align-items:flex-start;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;

      .label {
        flex: 1 1 40%;
        text-align: right;
      }

      .required {
        font-weight: bold;
      }

      .info {
        flex: 1 1 60%;
        padding-left: 1rem;

        input[type=text], textarea {
          width: 100%;
        }
      }
    }

    .error {
      color: $error-primary;
      font-size: 0.9rem;
    }

    .error-box {
      box-shadow: 0 0 2px 2px $error-secondary;
      border: 1px solid $error-primary;
      color: darken($error-primary, 10%);
      background-color: lighten($error-secondary, 5%);
    }

    .buttons {
      margin: 1rem 0 0;
      text-align: center;
    }
  }

</style>