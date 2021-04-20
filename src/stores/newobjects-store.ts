import { readable } from "svelte/store";

let plant = {
  plantId: 0,
	genus: "",
	species: "",
	common: "",
	description: "",
	webDescription: "",
	plantSize: "",
	plantType: "",
	plantZone: "",
	hasSmallPic: false,
	bigPicIds:  "",
	isListed: false,
	isFeatured: false,
	lastUpdate: null,
	flag: "",
	lastUpdateFormatted: "None"
};

export const newPlant = readable(plant, function start(set) {
	// noop
	return function stop() {
		// noop
	};
});