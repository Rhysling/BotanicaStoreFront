import type { AxiosError, AxiosResponse } from "axios";
import { writable, derived, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

// *** Private ***

const ax = get(httpClient);
let aps = writable<IvwPlantsAvailable[]>([]);

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

// *** Init ***

let init = () => {
  ax.get("/api/WishList/GetAvailablePlants")
  .then((resp: AxiosResponse<IvwPlantsAvailable[]>) =>{
    aps.set(resp.data);
  })
  .catch((err: AxiosError) => console.error(err.response));
};

// *** Public ***



export const availablePlantsStore = {
  ...aps,
  init
};

export const availablePlantNames = derived(
  aps,
  $aps => {
  //IPlantIdName[]
    
  return [ ...new Set($aps.map(a => a.plantId))]
    .map(a => ({
      plantId: a || 0,
      plantName: $aps.find(x => x.plantId === a)?.plantName || "" }))
    .sort(alphaSort);
  }
);