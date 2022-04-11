type Route = {
  title: string;
  navName?: string;
  page: string;
  path: string;
  isAdmin?: boolean;
  isHidden?: boolean;
  isExpanded?: boolean;
  hasParam?: boolean;
  children?: Route[];
};


type UserClient = {
  userId: number;
  email: string;
  fullName: string;
  token: string;
  isAdmin: boolean;
  taxRate: number;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type PageState = {
  itemsPerPage: number;
  itemCount: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
};

type PlantToggle = {
  plantId: number;
  val: boolean;
  column?: "isListed" | "isFeatured"
};

type PlantPriceMatrix = {
	potSizeId: number;
	potDescription: string;
	potShorthand: string;
	plantId: number;
	price: string | null;
	isAvailable: boolean;
};

type PlantFilter = {
	filterText: string;
  isNwNativeOnly: boolean;
  includeNotAvailable: boolean;
};

type PlantAdminFilter = {
  filterType: "genus" | "all";
	filterText: string;
  filterFlag: string;
  isListedOnly: boolean;
  isNwNativeOnly: boolean;
};

interface ILinkEdit extends ILink {
  sortOrderEntered: string;
}