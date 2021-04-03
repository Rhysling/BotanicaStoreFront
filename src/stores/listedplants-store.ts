import type { AxiosError, AxiosResponse } from "axios";
import { writable, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

const ax = get(httpClient);

export const listedPlants = writable<IvwListedPlant[]>([]);

ax.get("/api/ListedPlants")
  .then((resp: AxiosResponse<IvwListedPlant[]>) =>{
		listedPlants.update(a => resp.data);
  })
  .catch((err: AxiosError) => console.log(err.response));


