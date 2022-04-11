<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import EditCalendarAdmin from "../../components/admin/EditCalendarAdmin.svelte";

  let calMaster: ICalendar[] = [];
  let calList: ICalendar[] = [];
  let isFutureOnly = false;
  let editedItem: ICalendar | null = null;
  let editError = "";

  let editItem = (itemId: number) => {
    if (itemId === 0) {
      editedItem = {
        itemId: 0,
        beginDate: "",
        endDate: null,
        eventTime: "",
        title: "",
        location: "",
        description: "",
        isSpecial: false,
        beginDateFormatted: "",
        endDateFormatted: ""
      };

      return;
    }

    let c = calList.find(a => a.itemId == itemId);

    if (c)
      editedItem = c;
  };

  let saveItem = (item: ICalendar) => {
    item.beginDate = (new Date(item.beginDate)).toJSON();
    item.endDate = item.endDate ? (new Date(item.endDate)).toJSON() : null;

    $ax.post("/api/Calendar/Save", item)
    .then((response: AxiosResponse<ICalendar>) => {
      let item = response.data;
      item.beginDate = item.beginDate ? item.beginDate.substring(0, 10) : "";
      item.endDate = item.endDate ? item.endDate.substring(0, 10) : null;

      calMaster = [
        item,
        ...(calMaster.filter(a => a.itemId !== item.itemId))
      ].sort((a,b) => Date.parse(b.beginDate) - Date.parse(a.beginDate))
    })
    .then(() => filterList(isFutureOnly))
    .then(() => editedItem = null)
    .catch((err) => console.error({err}));
};

  let filterList = (ifo: boolean) => {
    if (ifo)
      calList = calMaster.filter(a => Date.parse(a.beginDate) >= Date.now() - 3600000 * 24);
    else
      calList = calMaster;
  };

  
  let handleEditModal = (e: CustomEvent<{val: boolean}>) => {
    if (!e.detail.val)
      editedItem = null;
  };

  let handleFinishEdit = (e: CustomEvent<ICalendar>) => {
    if (e.detail.itemId < 0) {
      editedItem = null;
      return;
    }
    saveItem(e.detail);
  };


  $: filterList(isFutureOnly);

// *** Init ***

  let init = () => {
    $ax.get("/api/Calendar/GetAll")
    .then((response: AxiosResponse<ICalendar[]>) => {
      calMaster = response.data.map(a => ({
        ...a,
        beginDate: a.beginDate ? a.beginDate.substring(0, 10) : "",
        endDate: a.endDate ? a.endDate.substring(0, 10) : null
      }))
    })
    .then(() => filterList(isFutureOnly))
    .catch((err) => console.error({err}));

  };

  init();

</script>

<div class="search">
  <div>
    Future only:
    <input type="checkbox" class="future-only-box" bind:checked={isFutureOnly} />
  </div>
  <div class="right">
    <i class="fas fa-caret-right"></i>
    <a href="/" on:click|preventDefault={() => editItem(0)}>Add</a>
  </div>
</div>

<div>
  {#each calList as c}
    <div class="item">
      <div class="dates">
        <div class="date">{c.beginDateFormatted}</div>
        {#if c.endDate}
        <div class="date-sep">through</div>
        <div class="date">{c.endDateFormatted}</div>
        {/if}
        <div class="time">{c.eventTime}</div>
      </div>
      <div class="details">
        <div class="title"><a href="/" on:click|preventDefault={() => editItem(c.itemId)}>{c.title}</a></div>
        <div class="description">{c.description}</div>
        <div class="location">{c.location}</div>
        {#if c.isSpecial}<div class="is-special">Is Special</div>{/if}
      </div>
    </div>
  {:else}
  <div class="empty">
    No listings.
  </div>
  {/each}
</div>


{#if editedItem}
  <EditCalendarAdmin
    item={editedItem}
    {editError}
    on:setmodal={handleEditModal}
    on:finishEdit = {handleFinishEdit}
  />
{/if}

<style lang="scss">
  @import "../../styles/_custom-variables.scss";

  .search {
    display: flex;
    flex-flow: row nowrap;
    align-items:baseline;
    font-size: 0.8rem;
    margin-top: 0.5em;
    padding: 0.2rem 0.4rem;
    background-color: $beige-lighter;

    input {
      position: relative;
      top: 2px;
    }

    .right {
      flex: 1 1 50%;
      text-align: right;
    }
  }

  .item {
    display: flex;
    margin: 0.4rem 3vw 0;
    border: 1px solid black;

    @media screen and (max-width: $bp-small) {
      margin: 0.4rem 0 0;
    }
  }

  .dates {
    flex: 0 1 40%;
    padding: 0.4rem;

    > div {
      margin-top: 0.2rem;
    }

    .date {
      font-size: 0.9rem;
    }

    .date-sep {
      font-size: 0.8rem;
      padding-left: 2rem;
      color: lighten($text-color, 5%);
    }

    .time {
      font-size: 0.8rem;
    }
  }

  .details {
    flex: 0 1 60%;
    padding: 0.4rem 0.4rem 0.4rem 0;

    > div {
      margin-top: 0.2rem;
    }

    .title {
      font-weight: bold;
    }

    .description {
      font-size: 0.9rem;
    }

    .location {
      font-size: 0.85rem;
      color: #8B4513;
    }
  }

  .is-special {
    font-size: 0.9rem;
    font-weight: bold;
  }

  .empty {
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 5rem 0;
  }

</style>