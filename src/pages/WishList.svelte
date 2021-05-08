<script lang="ts">
  import { wishListStore } from "../stores/wishlist-store";
  import { user, isLoggedIn } from "../stores/user-store";

  let wl: IvwWishListFlat[] = [];
  let wlp: IPlantIdName[] = [];
  let ap: IvwPlantsAvailable[] = [];
  let app: IPlantIdName[] = [];

  let editError = "";
  let isEditMode = false;
  let isValid = true;

  let taxRate = 0.1025;
  let wlSubtotal = 0;
  let stashQty = 0;
  

  let save = () => {
    //   Make and save details to db
    

    
  };

  
  // *** Local handlers

  

  // *** WishList Edits

  let editItem = (plantId: number, potSizeId: number, qty: number) => {
    wls.setEditMode(plantId, potSizeId);
    stashQty = qty;
    isEditMode = false;
  };

  let removeItem = (plantId: number, potSizeId: number) => {

  };

  let saveItem = (plantId: number, potSizeId: number, qty: number) => {
    wls.updateQty(plantId, potSizeId, qty);
    wls.setEditMode(0, 0);
    isEditMode = false;
  };

  let noop = () => {};

  // *** Reactivity

  $: wls = wishListStore($user.userId);
  $: wlSubtotal = wl.reduce((tot, cv) => tot += cv.qty * cv.price, 0);
  
  // Init
  $:{
    wl = [...$wls.wlList];
    wlp = [...wls.getWlPlantNames()];
  }
  

</script>

<div class="container" on:click={(e) => e.stopPropagation()}>
  <div class="content">
    <div class="modal-title">
      Wish List for {($user.fullName) ? `${$user.fullName} (${$user.email})` : $user.email}
    </div>
    {#if editError}
    <div class="error">
      Something went wrong: {editError}
    </div>
    {/if}

    <div class="wl-header">
      <div class="description">Plant / Pot Size</div>
      <div class="qty">Qty</div>
      <div class="price">Price</div>
      <div class="ext">Ext</div>
      <div class="edit">&nbsp;</div>
    </div>

    {#each wlp as p (p.plantId)}
    <div class="wl-name">
      {p.plantName}
    </div>
      {#each wl.filter(a => a.plantId === p.plantId) as w (w.potSizeId)}
      <div class="wl-item">
        <div class="description">{w.potDescription}</div>
        <div class="qty">
          {#if w.isEditMode}
          <input type="text" bind:value={w.qty} class:error-input={false} />
          {:else}
          {w.qty}
          {/if}
        </div>
        <div class="price">{w.price.toFixed(2)}</div>
        <div class="ext">{(w.price * w.qty).toFixed(2)}</div>
        <div class="edit">
          {#if !w.isEditMode}
            <a href="/"
              on:click|preventDefault={() => editItem(w.plantId, w.potSizeId, w.qty)}
              disabled={isEditMode}
              title="Edit quantity"><i class="fas fa-edit"></i></a>
            <a href="/"
              on:click|preventDefault={() => removeItem(w.plantId, w.potSizeId)}
              disabled={isEditMode}
              title="Remove"><i class="fas fa-trash"></i></a>
          {:else}
              <a href="/"
              on:click|preventDefault={() => saveItem(w.plantId, w.potSizeId, w.qty)}
              title="Save new quantity"><i class="fas fa-save"></i></a>
            <a href="/"
              on:click|preventDefault={() => saveItem(w.plantId, w.potSizeId, stashQty)}
              title="Cancel"><i class="fas fa-undo"></i></a>
          {/if}
        </div>
      </div>

      {/each}
    {/each}

    <div class="wl-footer">
      <div class="description">Subtotal</div>
      <div class="total">{wlSubtotal}</div>
      <div class="edit">&nbsp;</div>
    </div>

    <div class="wl-footer">
      <div class="description">Estimated tax @ {(taxRate * 100).toFixed(2)}%</div>
      <div class="total">{(wlSubtotal * taxRate).toFixed(2)}</div>
      <div class="edit">&nbsp;</div>
    </div>

    <div class="wl-footer bold">
      <div class="description">Projected Total</div>
      <div class="total">${(wlSubtotal * (1 + taxRate)).toFixed(2)}</div>
      <div class="edit">&nbsp;</div>
    </div>

    <div class="buttons">
      <button on:click={noop} class="primary" disabled={isValid === false}>Save</button>
      <button on:click={noop} >Cancel</button>
    </div>  
  </div>
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .container {
    margin: 2rem 5rem;
    padding: 2rem 0;
    background-color: antiquewhite;

    @media screen and (max-width: $bp-small) {
      margin: 2rem;
    }
  }

  .content {
    margin: 0 auto;
    max-width: clamp(220px, 50vw, 400px);

    .modal-title {
      font-size: 1.1rem;
      font-weight: bold;
      text-align:center;
      margin-bottom: 1rem;
    }

    .wl-header {
      display: flex;
      //justify-content: center;
      align-items: baseline;
      margin-left: 0;
      margin-bottom:0.5rem;
      font-weight:bold;
      font-size:0.9rem;

      .description {
        flex: 0 1 1500px;
      }

      .qty {
        flex: 0 0 40px;
        text-align: right;
      }

      .price {
        flex: 0 0 50px;
        text-align: right;
      }

      .ext {
        flex: 0 0 70px;
        text-align: right;
      }

      .edit {
        flex: 0 0 50px;
        margin-left: 0.35rem;
      }
    }

    .wl-name {
      font-weight: bold;
      font-size: 0.85rem;
    }

    .wl-item {
      display: flex;
      //justify-content: center;
      align-items: baseline;
      margin-bottom:0.5rem;
      font-weight: normal;
      font-size: 0.8rem;

      .description {
        flex: 0 1 1500px;
        margin-left: 0.5rem;
      }

      .qty {
        flex: 0 0 40px;
        text-align: right;
      }

      .price {
        flex: 0 0 50px;
        text-align: right;
      }

      .ext {
        flex: 0 0 70px;
        text-align: right;
      }

      .edit {
        flex: 0 0 50px;
        margin-left: 0.35rem;
        
        a {
          display: inline-block;
          color: $main-color;
          margin-left: 0.35rem;
        }
      }
    }

    .wl-footer {
      display: flex;
      margin-bottom:0.5rem;
      font-size: 0.85rem;

      .description {
        flex: 0 1 1500px;
        text-align: right;
      }

      .total {
        flex: 0 0 70px;
        text-align: right;
      }
      .edit {
        flex: 0 0 50px;
        margin-left: 0.35rem;
      }
    }

    .bold {
      font-weight: bold;
    }
  }

  .buttons {
      margin: 1rem 0 0;
      text-align: center;
    }

  .error-input {
    box-shadow: 0 0 2px 2px $error-secondary;
    border: 1px solid $error-primary;
    color: darken($error-primary, 10%);
    background-color: lighten($error-secondary, 5%);
  }

</style>