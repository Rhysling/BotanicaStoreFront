// Using MSBuild ver. 6.0.201 to load projects.
// Generated - 2022/04/06-09:15:12

// SOLUTION: BotanicaStoreBack

// PROJECTS SEARCHED:
//	BotanicaStoreBack
//	BotanicaStoreBack.ColorCards
//	BotanicaStoreBack.Repo

type INullable<T> = T | null | undefined;

// NAMESPACE: BotanicaStoreBack.Models.Core

interface IPlantIdName {
	plantId: number;
	plantName: string;
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

// NAMESPACE: BotanicaStoreBack.Repo.Models

interface ICalendar {
	itemId: number;
	beginDate: string;
	endDate: INullable<string>;
	eventTime: string;
	title: string;
	location: string;
	description: string;
	isSpecial: boolean;
	beginDateFormatted: string;
	endDateFormatted: string;
}

interface IDummyTestTable {
	firstKey: number;
	secondKey: string;
	lastThing: string;
	info: INullable<string>;
	moreStuff: INullable<string>;
	byteThing: Array<string>;
	bigByteThing: INullable<Array<string>>;
}

interface IKey {
	keyName: string;
	keyValue: string;
}

interface ILink {
	linkId: number;
	title: string;
	description: string;
	url: string;
	sortOrder: number;
	isDeleted: boolean;
}

interface INameValueItem {
	name: string;
	value: string;
}

interface IPlant {
	plantId: number;
	genus: string;
	species: string;
	family: INullable<string>;
	description: INullable<string>;
	webDescription: INullable<string>;
	plantSize: INullable<string>;
	plantType: INullable<string>;
	plantZone: INullable<string>;
	pictureLocation: INullable<string>;
	isNwNative: boolean;
	pics: string;
	isListed: boolean;
	isFeatured: boolean;
	slug: string;
	lastUpdate: string;
	flag: INullable<string>;
	lastUpdateFormatted: string;
	cardLine1: INullable<string>;
	cardLine2: INullable<string>;
}

interface IPlantPicId {
	plantId: number;
	picId: number;
	key: string;
	pvt?: number;
}

interface IPlantPrice {
	plantId: number;
	potSizeId: number;
	price: INullable<number>;
	isAvailable: boolean;
}

interface IPlantToggle {
	plantId: number;
	val: boolean;
}

interface IPotSize {
	id: number;
	potDescription: string;
	potShorthand: string;
	sortOrder: number;
}

interface IvwFlagSummary {
	flag: INullable<string>;
	plantCount: INullable<number>;
	lastUpdate: INullable<string>;
	lastUpdateFormatted: string;
}

interface IvwListedPlant {
	plantId: number;
	genus: string;
	species: string;
	family: string;
	description: string;
	plantSize: string;
	plantType: string;
	plantZone: string;
	pictureLocation: string;
	isNwNative: boolean;
	pics: string;
	isFeatured: boolean;
	slug: string;
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
	isValid: INullable<boolean>;
}

interface IvwShoppingListItem {
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	sortOrder: number;
	qty: number;
	price: number;
	currentPrice: INullable<number>;
	isCurrentlyAvailable: INullable<boolean>;
}

interface IvwShoppingListSummary {
	wlId: number;
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	userFullName: string;
	email: string;
	totalCount: number;
	totalPretax: number;
	createdDateFormatted: string;
	lastUpdateDateFormatted: string;
	emailedDateFormatted: string;
}

interface IvwUserDetail {
	userId: number;
	email: string;
	fullName: string;
	isAdmin: boolean;
	createdDate: string;
	lastLoginDate: string;
	loginCount: number;
	countAll: number;
	countPending: number;
	countClosed: number;
	createdDateFormatted: string;
	lastLoginDateFormatted: string;
}

interface IvwWishListEmail {
	wlId: number;
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
	isClosed: boolean;
	email: string;
	fullName: string;
	items: Array<IvwWishListEmailItem>;
}

interface IvwWishListEmailItem {
	wlId: number;
	plantId: number;
	plantName: string;
	potSizeId: number;
	potDescription: string;
	price: number;
	qty: number;
}

interface IvwWishListFlat {
	userId: number;
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
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
	createdDate: string;
	lastUpdateDate: string;
	emailedDate: INullable<string>;
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

