<script lang="ts">
  import Modal from "../Modal.svelte";
  import { createEventDispatcher } from 'svelte';

  export let item: ICalendar | null;
  export let editError = "";

  const dispatch = createEventDispatcher();

  let c = {...item};

  let valMsgBeginDate = "";
  let valMsgEndDate = "";
  let valMsgTitle = "";
  let isValid = true;

  let testRequired = (str: string) => {
    if (!str) return "Required.";
    if (str.trim().length == 0) return "Required.";
    return "";
  };

  let testIsDate = (str: string) => {
    if (!str) return "";
    let d = Date.parse(str);
    if (isNaN(d)) return "Not a valid date.";
    let dOld = Date.parse("2000-01-01");
    let dNew = Date.parse("2050-01-01");
    if (d < dOld || d > dNew) return "Not a valid date.";
    return "";
  };

  let testIsAfter = (str: string, firstDate: string) => {
    if (!str) return "";
    let d = Date.parse(str);
    let df = Date.parse(firstDate);
    if (df >= d) return "Must be later than first date.";
    return "";
  };

  let validateBeginDate = (str: string) => {
    valMsgBeginDate = [testRequired(str), testIsDate(str)].join(" ").trim();
  };

  let validateEndDate = (str: string, first: string) => {
    valMsgEndDate = [testIsDate(str), testIsAfter(str, first)].join(" ").trim();
  };

  let validateTitle = (str: string) => {
    valMsgTitle = testRequired(str);
  };

  $: isValid = (valMsgBeginDate + valMsgEndDate + valMsgTitle).length === 0;

  let validate = () => {
    validateBeginDate(c.beginDate || "");
    validateEndDate(c.endDate || "", c.beginDate || "");
    validateTitle(c.title || "");
    isValid = (valMsgBeginDate + valMsgEndDate + valMsgTitle).length === 0;
  };


  let save = () => {
    validate();
    if (isValid)
      dispatch("finishEdit", c);
  };

  let cancel = () => {
    dispatch("finishEdit", { itemId: -1 });
  };

</script>

<Modal isShowModal={true} on:setmodal>
  <div class="editor" on:click={(e) => e.stopPropagation()}>
    <div class="title">
      Add / Edit Calendar Item
    </div>
    {#if editError}
    <div class="error">
      Something went wrong: {editError}
    </div>
    {/if}

    <div class="entry">
      <div class="label required">Item Id</div>
      <div class="info">
        {c.itemId || "New Event"}
      </div>
    </div>

    <div class="entry">
      <div class="label required">Begin Date</div>
      <div class="info">
        <input type="text"
          bind:value={c.beginDate}
          on:blur={() => validateBeginDate(c.beginDate || "")}
          class:error-box={valMsgBeginDate ? true : null}
          placeholder="Begin Date" />
        {#if valMsgBeginDate}<span class="error">{valMsgBeginDate}</span>{/if}
      </div>
    </div>

    <div class="entry">
      <div class="label">End Date</div>
      <div class="info">
        <input type="text"
          bind:value={c.endDate}
          on:blur={() => validateEndDate(c.endDate || "", c.beginDate || "")}
          class:error-box={valMsgEndDate ? true : null}
          placeholder="End Date" />
        {#if valMsgEndDate}<span class="error">{valMsgEndDate}</span>{/if}
      </div>
    </div>

    <div class="entry">
      <div class="label">Event Time</div>
      <div class="info">
        <input type="text" bind:value={c.eventTime} placeholder="Event Time" />
      </div>
    </div>

    <div class="entry">
      <div class="label required">Title</div>
      <div class="info">
        <input type="text"
          bind:value={c.title}
          on:blur={() => validateTitle(c.title || "")}
          class:error-box={valMsgTitle ? true : null}
          placeholder="Title" />
        {#if valMsgTitle}<span class="error">{valMsgTitle}</span>{/if}
      </div>
    </div>
    
    <div class="entry">
      <div class="label">Description</div>
      <div class="info">
        <textarea bind:value={c.description} placeholder="Description"></textarea>
      </div>
    </div>
    
    <div class="entry">
      <div class="label">Location</div>
      <div class="info">
        <input type="text" bind:value={c.location} placeholder="Location" />
      </div>
    </div>

    <div class="entry">
      <div class="label">Is Special</div>
      <div class="info">
        <input class="sm" type="checkbox" bind:checked={c.isSpecial} />
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