import type { AxiosError, AxiosResponse } from "axios";
import { writable, derived, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

// *** Private ***

const ax = get(httpClient);

let wlId = 0;
let wl = writable<IvwWishListFlat[]>([]);

let alphaSort = (a: any, b: any) => {
  let sv = 0;

  if (a.plantName && b.plantName) {
    if (a.plantName < b.plantName) sv = -100;
    if (a.plantName > b.plantName) sv = 100;
  }
  
  if (a.price && b.price) {
    if (a.price < b.price) sv -= 10;
    if (a.price > b.price) sv += 10;
  }

  return sv;
};

// *** Db Ops ***

let addUpdateItemDb = (item: IWishListItem) => {
  // qty == 0 to remove
  ax.post("/api/WishList/AddUpdateItem", item)
  .then(() =>{
    // no op
  })
  .catch((err: AxiosError) => console.log(err.response));
};


// *** Init ***

let init = () => {
  ax.get("/api/WishList/GetCurrentList")
  .then((resp: AxiosResponse<IvwWishListFlat[]>) => {
    wl.set(resp.data);
    wlId = Math.max(...resp.data.map(a => a.wlId), -1);
  })
  .catch((err: AxiosError) => console.log(err.response));
};

// *** Public ***

let setEditMode = (plantId: number, potSizeId: number) => {
  // plantId === 0 => Cancel edit mode
  let list = get(wl);

  if (plantId === 0) {
    list = list.map(a => ({...a, isEditMode: false}));
  }
  else {
    list = list.map(a => ({...a, isEditMode: (a.plantId === plantId && a.potSizeId === potSizeId)}));
  }
  wl.set(list);
};

let updateQty = (plantId: number, potSizeId: number, qty: number) => {
  if (qty <= 0) {
    removeItem(plantId, potSizeId);
    return;
  }

  let list = get(wl);
  let item = list.find(a => a.plantId === plantId && a.potSizeId === potSizeId);
  
  if (item) {
    item.qty = qty;
    wl.set(list);
    addUpdateItemDb(item);
  }

  //TODO: Adjust available list?
};

let removeItem = (plantId: number, potSizeId: number) => {
  let list = get(wl).filter(a => !(a.plantId === plantId && a.potSizeId === potSizeId));
  wl.set(list);

  addUpdateItemDb({
    wlId,
    plantId,
    potSizeId,
    price: 0,
    qty: 0
  });
};

let addItem = (plant: IvwPlantsAvailable, qty: number) => {
  let list = get(wl);

  let newItem: IvwWishListFlat = {
    userId: 0,
    createdDate: null,
    lastUpdateDate: null,
    emailedDate: null,
    isClosed: false,
    wlId,
    plantId: plant.plantId,
    plantName: plant.plantName,
    potSizeId: plant.potSizeId,
    potDescription: plant.potDescription,
    price: plant.price,
    qty,
    currentPrice: plant.price,
    isCurrentlyAvailable: true,
    isEditMode: false
  };

  list = list.filter(a => !(a.plantId === plant.plantId && a.potSizeId === plant.potSizeId));
  list = [...list, newItem].sort(alphaSort);
  
  wl.set(list);

  addUpdateItemDb({
    wlId,
    plantId: plant.plantId,
    potSizeId: plant.potSizeId,
    price: plant.price,
    qty,
  });
};
  

export const wishListStore =  {
  ...wl,
  init,
  setEditMode,
  updateQty,
  removeItem,
  addItem
};

export const wlPlantNames = derived(
  wl,
  $wl => {
  //IPlantIdName[]
    
  return [ ...new Set($wl.map(a => a.plantId))]
    .map(a => ({
      plantId: a || 0,
      plantName: $wl.find(x => x.plantId === a)?.plantName || "" }))
    .sort(alphaSort);
  }
);

export const wlItemCount = derived(
  wl,
  $wl => $wl.reduce((tot, cv) => tot += +cv.qty, 0)
);

export const wlPlantCount = derived(
  wl,
  $wl => (new Set($wl.map(a => a.plantId))).size
);