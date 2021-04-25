// Using MSBuild ver. 16.9.31205.134 to load projects.
// Generated - 2021/04/25-12:30:37

// SOLUTION: Single Project

// PROJECT SEARCHED:
//	BotanicaStoreBack

type INullable<T> = T | null;

// NAMESPACE: BotanicaStoreBack.Models

interface ICalendar {
	itemId: number;
	beginDate: any;
	endDate: any;
	eventTime: string;
	title: string;
	location: string;
	description: string;
	isSpecial: INullable<boolean>;
}

interface IKey {
	keyName: string;
	keyValue: string;
}

interface IPlant {
	plantId: number;
	genus: string;
	species: string;
	common: string;
	description: string;
	webDescription: string;
	plantSize: string;
	plantType: string;
	plantZone: string;
	hasSmallPic: boolean;
	bigPicIds: string;
	isListed: boolean;
	isFeatured: boolean;
	lastUpdate: any;
	flag: string;
	lastUpdateFormatted: string;
}

interface IPlantPrice {
	plantId: number;
	potSizeId: number;
	price: number;
	isAvailable: boolean;
}

interface IPotSize {
	id: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
}

interface IvwListedPlant {
	plantId: number;
	genus: string;
	species: string;
	common: string;
	description: string;
	plantSize: string;
	plantType: string;
	plantZone: string;
	hasSmallPic: boolean;
	bigPicIds: string;
	isFeatured: boolean;
}

interface IvwPlantPriceMatrix {
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
	plantId: INullable<number>;
	price: INullable<number>;
	isAvailable: INullable<boolean>;
}

interface IvwPlantPriceSummary {
	plantId: number;
	genus: string;
	species: string;
	available: string;
	notAvailable: string;
}

// NAMESPACE: BotanicaStoreBack.Models.Core

interface INameValueItem {
	name: string;
	value: string;
}

interface IPlantPicId {
	plantId: number;
	picId: string;
}

interface IPlantToggle {
	plantId: number;
	val: boolean;
}

interface IUserClient {
	email: string;
	fullName: string;
	token: string;
	isAdmin: boolean;
}

interface IUserLogin {
	email: string;
	fullName: string;
	pw: string;
}

