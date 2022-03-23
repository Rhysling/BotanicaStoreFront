import { readable } from "svelte/store";

let plant = {
  plantId: 0,
	genus: "",
	species: "",
	family: "",
	description: "",
	webDescription: "",
	plantSize: "",
	plantType: "",
	plantZone: "",
	pictureLocation: "",
	isNwNative: false,
	hasSmallPic: false,
	bigPicIds:  "",
	isListed: false,
	isFeatured: false,
	lastUpdate: "1950-01-01",
	flag: "",
	lastUpdateFormatted: "None"
};

export const newPlant = readable(plant, function start(set) {
	// noop
	return function stop() {
		// noop
	};
});