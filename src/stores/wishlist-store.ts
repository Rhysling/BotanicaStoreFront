import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { writable, derived, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

// *** Private ***

let ax: AxiosInstance;

let wlId = 0;
let isInitialized = false;
let wl = writable<IvwWishListFlat[]>([]);

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
  ax = get(httpClient);

  ax.get("/api/WishList/GetOrCreateCurrent")
  .then((resp: AxiosResponse<IWishList>) => {
    wlId = resp.data.wlId;
  
    ax.get("/api/WishList/GetListById?wlId=" + wlId)
    .then((resp: AxiosResponse<IvwWishListFlat[]>) => {
      wl.set(resp.data);
      isInitialized = true;
    })
    .catch((err: AxiosError) => console.log(err.response));
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
    sortOrder: plant.sortOrder,
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
  
let sendList = () => {
  return ax.post("/api/WishList/EmailCurrentList")
  .then((resp: AxiosResponse<string>) =>{
    if (resp.status < 299) {
      wl.set([]);
      isInitialized = false;
    }
    else {
      console.log(resp);
    }

    return resp;
  })
  .catch((err: AxiosError) => console.log(err.response));
};

export const wishListStore =  {
  ...wl,
  init,
  setEditMode,
  updateQty,
  removeItem,
  addItem,
  sendList,
  isInitialized
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

export const isShowHowWlWorks = writable(false);

export const wlItemCount = derived(
  wl,
  $wl => $wl.reduce((tot, cv) => tot += +cv.qty, 0)
);

export const wlPlantCount = derived(
  wl,
  $wl => (new Set($wl.map(a => a.plantId))).size
);