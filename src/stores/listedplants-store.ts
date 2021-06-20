import type { AxiosError, AxiosResponse } from "axios";
import { writable, derived, get } from "svelte/store";
import { httpClient } from "./httpclient-store";

const ax = get(httpClient);
const itemsPerPage = 25;

// listedPlants
export let listedPlants = writable<IvwListedPlant[]>([]);

ax.get("/api/ListedPlants")
  .then((resp: AxiosResponse<IvwListedPlant[]>) =>{
		listedPlants.update(() => resp.data);
  })
  .catch((err: AxiosError) => console.log(err.response));


// plantListFilterDisplay
export let plantListFilterDisplay = writable<PlantListFilterType>({
  filterText: "",
  isNwNativeOnly: false,
  includeNotAvailable: false
});

// plantListFilterActive
export let plantListFilterActive = writable<PlantListFilterType>({
  filterText: "",
  isNwNativeOnly: false,
  includeNotAvailable: false
});


// filteredPlants
export let filteredPlants = derived([listedPlants, plantListFilterActive],
  ([$listedPlants, $plf]) => {

    let f = (p: IvwListedPlant) => {
      let passesText = 
        $plf.filterText === "" ||
        p.genus.toLowerCase().startsWith($plf.filterText.toLowerCase()) ||
        p.species.toLowerCase().startsWith($plf.filterText.toLowerCase()) ||
        (p.common || "").toLowerCase().includes($plf.filterText.toLowerCase()) ||
        p.description.toLowerCase().includes($plf.filterText.toLowerCase());

      let passesAvailable =  $plf.includeNotAvailable || (p.availability.length > 1);
      let passesNwNative = !$plf.isNwNativeOnly || p.isNwNative;

      return passesText && passesAvailable && passesNwNative;
    };

    return $listedPlants.filter(f);
});


// currentPage
export let currentPage = writable<number>(1);

// pages
export let pages = derived(filteredPlants,
  ($filteredPlants) => {
    return Math.max(Math.ceil($filteredPlants.length / itemsPerPage), 1);
});


// pagedPlants
export let pagedPlants = derived([filteredPlants, currentPage],
  ([$filteredPlants, $currentPage]) => {
    let startIndex = ($currentPage - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, $filteredPlants.length);
    
    return $filteredPlants.slice(startIndex, endIndex);
});

