import { readable } from "svelte/store";

let plant = {
  plantId: 0,
	genus: "",
	species: "",
	family: "",
	description: "",
	notes: "",
	plantSize: "",
	plantType: "",
	plantZone: "",
	pictureLocation: "",
	isNwNative: false,
	pics: "[]",
	hasSmallPic: false,
	bigPicIds:  "",
	isListed: false,
	isFeatured: false,
	slug: "",
	lastUpdate: "1950-01-01",
	flag: "",
	lastUpdateFormatted: "None",
	cardLine1: null,
	cardLine2: null
};

export const newPlant = readable(plant, function start(set) {
	// noop
	return function stop() {
		// noop
	};
});