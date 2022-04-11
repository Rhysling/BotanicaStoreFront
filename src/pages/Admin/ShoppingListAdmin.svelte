<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";

  let master: IvwShoppingListSummary[] = [];
  let summaryList: IvwShoppingListSummary[] = [];
  let detailList: IvwShoppingListItem[] = [];
  let includeClosed = true;
  let showSummary = true;

  let detListId = 0;
  let detUser = "";
  let detCreated = "";
  let detLastUpdate = "";
  let detEmailed = "";
  let detPlants:{plantId: number, plantName: string}[] = [];
  let detTotalQty = 0;
  let detTotalPretax = 0;
  let detIsClosed = false;

  let alphaSort = (a: any, b: any) => {
    let sv = 0;

    if (a.plantName && b.plantName) {
      if (a.plantName < b.plantName) sv = -100;
      if (a.plantName > b.plantName) sv = 100;
    }
    
    if (a.sortOrder && b.sortOrder) {
      if (a.sortOrder < b.sortOrder) sv -= 10;
      if (a.sortOrder > b.sortOrder) sv += 10;
    }

    return sv;
  };

  let filterList = (inclClosed: boolean) => {
    if (!inclClosed)
      summaryList = master.filter(a => !a.isClosed);
    else
      summaryList = master;
  };

  let viewDetail = (listId: number) => {
    $ax.get("/api/admin/ShoppingList/GetItems?listId=" + listId)
    .then((response: AxiosResponse<IvwShoppingListItem[]>) => {
      detailList = response.data;

      let sm = master.find(a => a.wlId == listId);
      if (sm) {
        detListId = listId;
        detUser = sm.userFullName ? `${sm.userFullName} (${sm.email})` : sm.email;
        detCreated = sm.createdDateFormatted;
        detLastUpdate = sm.lastUpdateDateFormatted;
        detEmailed = sm.emailedDateFormatted;
        detIsClosed = sm.isClosed;
      }

      detPlants = [ ...new Set(detailList.map(a => a.plantId))]
      .map(a => ({
        plantId: a || 0,
        plantName: detailList.find(x => x.plantId === a)?.plantName || "" }))
      .sort(alphaSort);

      detTotalQty = detailList.reduce((acc, cur) => acc += cur.qty, 0);
      detTotalPretax = detailList.reduce((acc, cur) => acc += cur.qty * cur.price, 0);

      showSummary = false;
    })
    .catch((err) => console.error({err}));

  };
  
  $: filterList(includeClosed);

// ** detail **

let makeNotes = (a: IvwShoppingListItem) => {
  let res: string[] = [];

  if (!a.currentPrice) res.push("No current price.");

  if (a.currentPrice && (a.price != a.currentPrice))
    res.push(`Current price is $${a.currentPrice.toFixed(2)}.`);

  if (!a.isCurrentlyAvailable) res.push("Not currently available.");

  return res.join(" ");
};

let closeDetail = () => showSummary = true;

let toggleClosed = () => {
  // POST api/admin/ShoppingList/SetIsClosed?listId=1&isClosed=true
  $ax.post("/api/admin/ShoppingList/SetIsClosed?listId=" + detListId + "&isClosed=" + (detIsClosed ? "false" : "true"))
    .then((response: AxiosResponse<boolean>) => {

      let s = master.find(a => a.wlId === detListId);
      if (s) {
        s.isClosed = !detIsClosed;
        filterList(includeClosed);
      }
      
      detIsClosed = !detIsClosed;
    })
    .catch((err) => console.error({err}));
};



// *** Init ***

  let init = () => {
    $ax.get("/api/admin/ShoppingList/GetAll")
    .then((response: AxiosResponse<IvwShoppingListSummary[]>) => {
      master = response.data;
    })
    .then(() => filterList(includeClosed))
    .catch((err) => console.error({err}));

  };

  init();

</script>

<div class="summary" style="display:{showSummary ? "block" : "none"}">
  <div class="search">
    <div>
      Incl closed:
      <input type="checkbox" class="filter-box" bind:checked={includeClosed} />
    </div>
    <div class="right"></div>
  </div>

  <div class="title">
    <div class="date">Last Update<br />&nbsp;Created</div>
    <div class="user">Name / Email</div>
    <div class="date">Emailed</div>
    <div class="count">Total Count</div>
    <div class="pretax">Total Pretax</div>
    <div></div>
  </div>

  {#each summaryList as a (a.wlId)}
    <div class="summary-list" class:is-closed={a.isClosed ? true : undefined}>
      <div class="date">{a.lastUpdateDateFormatted}<br />&nbsp;{a.createdDateFormatted}</div>
      <div class="user">{a.userFullName ? `${a.userFullName} (${a.email})` : a.email}</div>
      <div class="date">{a.emailedDateFormatted}</div>
      <div class="count">{a.totalCount}</div>
      <div class="pretax">{a.totalPretax.toFixed(2)}</div>
      <div><a class="detail-link" href="/" on:click|preventDefault={() => viewDetail(a.wlId)}>Detail</a></div>
    </div>
  {:else}
  <div class="empty">
    No shopping lists.
  </div>
  {/each}
</div>

<div class="detail" style="display:{showSummary ? "none" : "block"}">
  <div class="close"><a href="/" on:click|preventDefault={closeDetail}>Back to Lists</a></div>
  <div class="top">
    <div class="user">{detUser}</div>
    <div>Last update: {detLastUpdate}</div>
    <div>Created: {detCreated}</div>
    <div>Emailed: {detEmailed}</div>
    <div>
      List is {detIsClosed ? "closed" : "open"}. --
      <a href="/" on:click|preventDefault={toggleClosed}>{detIsClosed ? "Open" : "Close"} the List</a>
    </div>
  </div>

  <div class="wl-header row">
    <div class="description">Plant / Pot Size</div>
    <div class="qty">Qty</div>
    <div class="price">Price</div>
    <div class="ext">Ext</div>
    <div class="notes">Notes</div>
  </div>

  {#each detPlants as p (p.plantId)}
  <div class="wl-plantname">
    {p.plantName}
  </div>
    {#each detailList.filter(a => a.plantId === p.plantId) as w (w.potSizeId)}
    <div class="wl-item row">
      <div class="description">{w.potDescription}</div>
      <div class="qty">{w.qty}</div>
      <div class="price">{w.price.toFixed(2)}</div>
      <div class="ext">{(w.price * w.qty).toFixed(2)}</div>
      <div class="notes">{makeNotes(w)}</div>
    </div>
    {/each}
  {/each}

  <div class="wl-footer row">
    <div class="description"></div>
    <div class="qty">{detTotalQty}</div>
    <div class="price"></div>
    <div class="ext">${detTotalPretax.toFixed(2)}</div>
    <div class="notes"></div>
  </div>

  <div class="close"><a href="/" on:click|preventDefault={closeDetail}>Back to Lists</a></div>
</div>


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

  .title {
    display: grid;
    grid-template-columns: 3fr 3fr 3fr 1fr 1fr 1fr;
    font-size: 0.9rem;
    font-weight: bold;
    color: $main-color;
    margin: 0.5rem 2rem;

    .count, .pretax {
      text-align: right;
      padding-right: 0.5rem;
    }

    @media screen and (max-width: $bp-small) {
      display: block;

      .count, .pretax {
        text-align: left;
      }
    }
  }

  .summary-list {
    display: grid;
    grid-template-columns: 3fr 3fr 3fr 1fr 1fr 1fr;
    margin: 0 2rem 0.5rem;
    font-size: 0.8rem;

    .count, .pretax {
      text-align: right;
      padding-right: 0.5rem;
    }

    @media screen and (max-width: $bp-small) {
      display: block;
      margin-bottom: 1rem;

      .count, .pretax {
        text-align: left;
      }
    }
  }

  .detail-link {
    font-size: 0.85rem;

    &:hover {
      text-decoration: underline;
    }
  }

  .is-closed {
    color: $text-disabled;
    background-color: $text-reverse-color;

    // .title {
    //   color: lighten($main-color, 5%);
    // }
  }

  .detail {
    font-size: 0.8rem;
    margin: 0.5rem 2rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid black;

    .top {
      margin: 0.5rem 0;

      .user {
        font-weight: bold;
      }

      > div {
        margin-bottom: 0.25rem;
      }
    }

    .wl-header {
      font-weight: bold;
      color: $main-color;
    }

    .wl-plantname {
      font-weight: bold;
      margin-top: 0.35rem;
    }

    .row {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr 3fr;
      margin: 0 0 0.25rem;

      .qty, .price, .ext {
        text-align: right;
        padding-right: 0.5rem;
      }
    }

    .close {
      margin: 0.5rem 0;
    }

  }


  .empty {
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 5rem 0;
  }

</style>