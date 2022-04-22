import type { AxiosError, AxiosResponse } from "axios";
import { writable, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

const ax = get(httpClient);

// listedPlants
export let listedPlants = writable<IvwListedPlant[]>([]);

ax.get("/api/ListedPlants")
  .then((resp: AxiosResponse<IvwListedPlant[]>) => {
    listedPlants.set(resp.data);
  })
  .catch((err: AxiosError) => console.error(err.response));
