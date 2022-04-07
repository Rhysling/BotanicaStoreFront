import { localStore } from './localstorage-store';

let init: PlantAdminFilter = {
  filterType: "genus",
  filterText: "",
  filterFlag: "",
  isListedOnly: false,
  isNwNativeOnly: false
};

export const plantAdminFilterStore = localStore<PlantAdminFilter>("plantadminfilter", init);
