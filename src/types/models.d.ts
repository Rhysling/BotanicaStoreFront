// Using MSBuild ver. 16.9.31205.134 to load projects.
// Generated - 2021/04/29-10:37:08

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
	isSpecial: boolean;
	beginDateFormatted: string;
	endDateFormatted: string;
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
	isNwNative: boolean;
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
	price: INullable<number>;
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
	isNwNative: boolean;
	hasSmallPic: boolean;
	bigPicIds: string;
	isFeatured: boolean;
	availability: string;
}

interface IvwPlantPriceMatrix {
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
	plantId: number;
	price: INullable<number>;
	isAvailable: boolean;
}

interface IvwPlantPriceSummary {
	plantId: number;
	genus: string;
	species: string;
	available: string;
	notAvailable: string;
}

interface IvwPlantsAvailable {
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
	price: number;
	qtyEntered: string;
	isValid?: boolean;
}

interface IvwWishListFlat {
	userId: number;
	createdDate: any;
	lastUpdateDate: any;
	emailedDate: any;
	isClosed: boolean;
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	sortOrder: number;
	price: number;
	qty: number;
	currentPrice: INullable<number>;
	isCurrentlyAvailable: INullable<boolean>;
	isEditMode: boolean;
}

interface IWishList {
	wlId: number;
	userId: number;
	createdDate: any;
	lastUpdateDate: any;
	emailedDate: any;
	isClosed: boolean;
	createdDateFormatted: string;
	lastUpdateDateFormatted: string;
	emailedDateFormatted: string;
}

interface IWishListItem {
	wlId: number;
	plantId: number;
	potSizeId: number;
	price: number;
	qty: number;
}

// NAMESPACE: BotanicaStoreBack.Models.Core

interface INameValueItem {
	name: string;
	value: string;
}

interface IPlantIdName {
	plantId: number;
	plantName: string;
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
	userId: number;
	email: string;
	fullName: string;
	token: string;
	isAdmin: boolean;
	taxRate: number;
}

interface IUserLogin {
	email: string;
	fullName: string;
	pw: string;
}

