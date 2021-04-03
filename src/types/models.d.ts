// Using MSBuild ver. 16.9.31129.286 to load projects.
// Generated - 2021/04/01-14:02:15

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
	offered: string;
	isAvailable: boolean;
	isSoldOut: boolean;
	isFeatured: boolean;
	showDescription: boolean;
	lastUpdate: any;
	flag: string;
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
	offered: string;
	isListed: boolean;
	isFeatured: boolean;
	lastUpdate: any;
	flag: string;
}

// NAMESPACE: BotanicaStoreBack.Models.Core

interface INameValueItem {
	name: string;
	value: string;
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

