import type { AxiosError, AxiosResponse } from "axios";
import { writable, derived, get } from "svelte/store";
import { httpClient } from "./httpclient-store";
import { user } from "./user-store";

// export const wishListStore = derived(user, ($user) => {
export const wishListStore = (userId: number) => {

  // *** Private ***

  let wlId = 0;
  const ax = get(httpClient);

  let data: WishListStore = {
    wlList: [],
    availPlants: []
  };

  const store = writable<WishListStore>(data);

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

  let loadWishList = (userId: number) => {
    ax.get("/api/WishList/GetCurrentList?userId=" + userId)
    .then((resp: AxiosResponse<IvwWishListFlat[]>) =>{
      store.update((a) => ({...a, wlList: resp.data}));
      wlId = Math.max(...resp.data.map(a => a.wlId), -1);
    })
    .catch((err: AxiosError) => console.log(err.response));
  };

  let loadAvailablePlants = () => {
    ax.get("/api/WishList/GetAvailablePlants")
    .then((resp: AxiosResponse<IvwPlantsAvailable[]>) =>{
      store.update((a) => ({...a, availPlants: resp.data}));
    })
    .catch((err: AxiosError) => console.log(err.response));
  };

  let addUpdateItemDb = (item: IWishListItem) => {
    // qty == 0 to remove
    ax.post("/api/WishList/AddUpdateItem?userId=" + userId, item)
    .then(() =>{
      // no op
    })
    .catch((err: AxiosError) => console.log(err.response));

  };

  // *** Public ***

  let getWlPlantNames = (): IPlantIdName[] => {
    let list = get(store).wlList;
    return [ ...new Set(list.map(a => a.plantId))]
      .map(a => ({
        plantId: a || 0,
        plantName: list.find(x => x.plantId === a)?.plantName || "" }))
      .sort(alphaSort);
  };

  let getAvailablePlantNames = (): IPlantIdName[] => {
    let list = get(store).availPlants;
    return [ ...new Set(list.map(a => a.plantId))]
      .map(a => ({
        plantId: a || 0,
        plantName: list.find(x => x.plantId === a)?.plantName || "" }))
      .sort(alphaSort);
  };

  let getItemCount = () => {
    return get(store).wlList.reduce((tot, cv) => tot += cv.qty, 0);
  };

  let getPlantCount = () => {
    return (new Set(get(store).wlList.map(a => a.plantId))).size;
  };

  let setEditMode = (plantId: number, potSizeId: number) => {
    // plantId === 0 => Cancel edit mode
    let list = get(store).wlList;

    if (plantId === 0) {
      list = list.map(a => ({...a, isEditMode: false}));
    }
    else {
      list = list.map(a => ({...a, isEditMode: (a.plantId === plantId && a.potSizeId === potSizeId)}));
    }
    store.update((a) => ({...a, wlList: list}));
  };

  let updateQty = (plantId: number, potSizeId: number, qty: number) => {
    if (qty <= 0) {
      removeItem(plantId, potSizeId);
      return;
    }

    let st = get(store);
    let price = st.wlList.find(a => a.plantId === plantId && a.potSizeId === potSizeId)?.price || 0;

    let list = st.wlList.map(a => ({...a,
      qty: (a.plantId === plantId && a.potSizeId === potSizeId) ? qty : a.qty
    }));
    store.update((a) => ({...a, wlList: list}));
    addUpdateItemDb({
      wlId,
      plantId,
      potSizeId,
      price,
      qty
    });

    //TODO: Adjust available list?
  };

  let removeItem = (plantId: number, potSizeId: number) => {
    let list = get(store).wlList.filter(a => !(a.plantId === plantId && a.potSizeId === potSizeId));
    store.update((a) => ({...a, wlList: list}));
    addUpdateItemDb({
      wlId,
      plantId,
      potSizeId,
      price: 0,
      qty: 0
    });
  };

  let addItem = (plantId: number, potSizeId: number, qty: number) => {
    let st = get(store);
    let availPlant = st.availPlants.find(a => a.plantId === plantId && a.potSizeId === potSizeId);
    if (!availPlant) return;

    let newItem: IvwWishListFlat = {
      userId,
      createdDate: null,
      lastUpdateDate: null,
      emailedDate: null,
      isClosed: false,
      wlId,
      plantId,
      plantName: availPlant.plantName,
      potSizeId,
      potDescription: availPlant.potDescription,
      price: availPlant.price,
      qty,
      currentPrice: availPlant.price,
      isCurrentlyAvailable: true,
      isEditMode: false
    };

    let list = st.wlList.filter(a => !(a.plantId === plantId && a.potSizeId === potSizeId));
    list = [...list, newItem].sort(alphaSort);
    
    store.update((a) => ({...a, wlList: list}));
    addUpdateItemDb({
      wlId,
      plantId,
      potSizeId,
      price: newItem.price,
      qty: newItem.qty
    });
  };

  // *** Init ***

  loadAvailablePlants();
  loadWishList(userId);


  return {
    ...store,
    getWlPlantNames,
    getAvailablePlantNames,
    getItemCount,
    getPlantCount,
    setEditMode,
    updateQty,
    removeItem,
    addItem
  };
};

