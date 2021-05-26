<script lang="ts">
  import { wishListStore as wls, wlPlantNames as wlp } from "../stores/wishlist-store";
  import { availablePlantsStore as aps, availablePlantNames as apn } from "../stores/availableplants-store";
  import { user } from "../stores/user-store";
  import { navTo, currentParams } from "../stores/route-store";

  let isEditMode = false;
  let isValid = true;
  let sendMsg = "";
  let isSent = false;

  let taxRate = $user.taxRate;
  let wlSubtotal = 0;
  let stashQty = 0;

  // *** Initialize and Test for User ***
  if ($user.userId == 0)
    navTo(null, "/");

  if (!wls.isInitialized)
    wls.init();
  
  // *** Validations

  let validateQty = (inp: string| number | null) => {
    if (inp === undefined || inp === null || inp === "") return false;

    let val = Number(inp);
    if (isNaN(val)) return false;
    if (!Number.isInteger(val)) return false;
    return (val < 99 && val >= 0);
  };

  let validateQtyInput = (inp: string| number | null) => {
    isValid = validateQty(inp);
  };
  

  // *** ShoppingList Edits

  let editItem = (plantId: number, potSizeId: number, qty: number) => {
    if (!isValid || isEditMode) return;

    wls.setEditMode(plantId, potSizeId);
    stashQty = qty;
    isEditMode = true;
  };

  let removeItem = (plantId: number, potSizeId: number) => {
    if (!isValid || isEditMode) return;
    wls.updateQty(plantId, potSizeId, 0);
  };

  let saveItem = (plantId: number, potSizeId: number, qty: number) => {
    if (!isValid) return;

    wls.updateQty(plantId, potSizeId, qty);
    wls.setEditMode(0, 0);
    isValid = true;
    isEditMode = false;
  };

  let revertItem = (plantId: number, potSizeId: number) => {
    isValid = true;
    saveItem(plantId, potSizeId, stashQty);
  };

  // *** Reactivity

  $: wlSubtotal = $wls.reduce((tot, cv) => tot += cv.qty * cv.price, 0);


// Add ***

  let plantToAdd: IPlantIdName = {
    plantId: 0,
    plantName: "[select plant to add]"
  };

  let apsFiltered: IvwPlantsAvailable[] = [];
  let apnAll: IPlantIdName[] = [plantToAdd, ...$apn];

  if ($currentParams && $currentParams.plantId) {
    let p = apnAll.find(a => a.plantId === $currentParams.plantId);
    if (p)
      plantToAdd = p;
  }

  $: apsFiltered = plantToAdd.plantId ? $aps.filter(a => a.plantId === plantToAdd.plantId) : [];


  let validateAddQty = (qty: string) => {
    let val = Number(qty);
    if (isNaN(val)) return false;
    if (!Number.isInteger(val)) return false;
    return (val <= 99 && val > 0);
  };

  let calcExt = (price: number, qty:string) => {
    if (!qty) return "";

    return validateQty(qty) ? (price * +qty).toFixed(2) : "Error";
  };

  let addItem = (plantId: number, potSizeId: number, qtyEntered: string) => {
    let ap =apsFiltered.find(a => a.plantId === plantId && a.potSizeId == potSizeId);

    if (ap) {
      if (!validateAddQty(qtyEntered)) {
        ap.isValid = false;
        apsFiltered = apsFiltered;
        return;
      }

      // Add the item
      wls.addItem(ap, +qtyEntered);

      ap.qtyEntered = "";
      ap.isValid = undefined;
      apsFiltered = apsFiltered;
    }

  };

  let cancelAddItem = (plantId: number, potSizeId: number) => {
    let ap =apsFiltered.find(a => a.plantId === plantId && a.potSizeId == potSizeId);

    if (ap) {
      ap.qtyEntered = "";
      ap.isValid = undefined;
      apsFiltered = apsFiltered;
    }
  };

  let sendList = () => {
    if (!isValid || isEditMode) return;

    wls.sendList().then((resp) =>{
      if (resp && resp.status < 299) {
        isSent = true;
      }
      else {
        sendMsg = "Something went wrong:" + (resp ? resp.data : "Please try again; if it still doesn't work, let us know.");
        isSent = false;
      }
    });

  };

  //let noop = () => {}; 

</script>

<div class="container" on:click={(e) => e.stopPropagation()}>
  {#if !isSent}
  <div class="content">
    <div class="modal-title">
      Shopping List for {($user.fullName) ? `${$user.fullName} (${$user.email})` : $user.email}
    </div>

    <div class="wl-header">
      <div class="description">Plant / Pot Size</div>
      <div class="qty">Qty</div>
      <div class="price">Price</div>
      <div class="ext">Ext</div>
      <div class="edit">&nbsp;</div>
    </div>

    {#each $wlp as p (p.plantId)}
    <div class="wl-name">
      {p.plantName}
    </div>
      {#each $wls.filter(a => a.plantId === p.plantId) as w (w.potSizeId)}
      <div class="wl-item">
        <div class="description">{w.potDescription}</div>
        <div class="qty">
          {#if w.isEditMode}
          <input type="text"
            bind:value={w.qty}
            on:keyup={(e) => validateQtyInput(e.currentTarget.value)} 
            class:error-input={!isValid} />
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
              disabled={isEditMode ? true : undefined}
              title="Edit quantity"><i class="fas fa-edit"></i></a>
            <a href="/"
              on:click|preventDefault={() => removeItem(w.plantId, w.potSizeId)}
              disabled={isEditMode ? true : undefined}
              title="Remove"><i class="fas fa-trash"></i></a>
          {:else}
              <a href="/"
              on:click|preventDefault={() => saveItem(w.plantId, w.potSizeId, w.qty)}
              disabled={!isValid ? true : undefined}
              title="Save new quantity"><i class="fas fa-save"></i></a>
            <a href="/"
              on:click|preventDefault={() => revertItem(w.plantId, w.potSizeId)}
              title="Cancel"><i class="fas fa-undo"></i></a>
          {/if}
        </div>
      </div>

      {/each}
    {/each}

    <div class="wl-footer">
      <div class="description">Subtotal</div>
      <div class="total">{wlSubtotal.toFixed(2)}</div>
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

    <div class="wl-add">
      <div class="wl-add-title">
        Add a Plant
      </div>
      <div class="wl-add-name">
        <select bind:value={plantToAdd}>
          {#each apnAll as p (p.plantId)}
            <option value={p}>
              {p.plantName}
            </option>
          {/each}
        </select>
      </div>
    
      {#each apsFiltered as a (a.potSizeId)}
      <div class="wl-add-item">
        <div class="description">{a.potDescription}</div>
        <div class="qty">
          <input type="text"
            bind:value={a.qtyEntered}
            class:error-input={a.isValid === false} />
        </div>
        <div class="price">{a.price.toFixed(2)}</div>
        <div class="ext">{calcExt(a.price, a.qtyEntered)}</div>
        <div class="edit">
          <a href="/"
            on:click|preventDefault={() => addItem(a.plantId, a.potSizeId, a.qtyEntered)}
            disabled={validateAddQty(a.qtyEntered) ? undefined : true}
            title="Add plant"><i class="fas fa-save"></i></a>
          <a href="/"
            on:click|preventDefault={() => cancelAddItem(a.plantId, a.potSizeId)}
            title="Reset"><i class="fas fa-undo"></i></a>
        </div>
      </div>

      {/each}
    </div>

    <div class="buttons">
      <button on:click={sendList} class="primary" disabled={!isValid || isEditMode}>Send My List</button>
    </div>
    {#if sendMsg}<div class="error-box">{sendMsg}</div>{/if}
    <div>
      This emails the list to you and Pamela.
      You can make changes later when you coordinate on the final details or change your mind.
    </div>
  </div>
  {:else}
  <div class="result">
    <div>The list is sent to Pamela with a copy to you.</div>
    <div>Check your email.</div>
    <div><a href="/" on:click={(e) => navTo(e, "/")}>Home</a></div>
  </div>
  {/if}
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
        position: relative;
        min-height: 0.8rem;

        input {
          width: 35px;
          text-align: right;
          position: absolute;
          top: -0.4rem;
          right: -0.4rem;
        }
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

          &[disabled] {
            color: $text-disabled;
            cursor: default;
          }
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

    .wl-add {
      border: 2px solid $main-color;
      border-radius: 5px;
      background-color: #eeffee;
      padding: 0.6rem;

      .wl-add-title {
        font-weight: bold;
        font-size: 0.9rem;
        margin-bottom: 0.8rem;
      }
      .wl-add-name {
        font-size: 0.8rem;
        margin-bottom: 0.8rem;

        select {
          min-width: 70%;
          max-width: 100%;
          padding: 0.2rem;
        }
      }

      .wl-add-item {
        display: flex;
        align-items: baseline;
        margin-bottom:0.8rem;
        font-weight: normal;
        font-size: 0.8rem;

        .description {
          flex: 0 1 1500px;
          margin-left: 0.5rem;
        }

        .qty {
          flex: 0 0 40px;
          text-align: right;
          position: relative;
          min-height: 0.8rem;

          input {
            width: 35px;
            text-align: right;
            position: absolute;
            top: -0.2rem;
            right: -0.2rem;
            padding: 0.2rem;
          }
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

            &[disabled] {
              color: $text-disabled;
              cursor: default;
            }
          }
        }
      }
    }

    .bold {
      font-weight: bold;
    }
  }

  .result {
    text-align: center;
  }

  .buttons {
      margin: 1.5rem 0 0;
      text-align: center;
    }

  .error-input {
    box-shadow: 0 0 2px 2px $error-secondary;
    border: 1px solid $error-primary;
    color: darken($error-primary, 10%);
    background-color: lighten($error-secondary, 5%);
  }

  .error-box {
    border: 1px solid $error-primary;
    color: darken($error-primary, 10%);
    background-color: lighten($error-secondary, 5%);
  }

</style>