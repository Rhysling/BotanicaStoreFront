type Route = {
  title: string;
  page: string;
  slug: string;
  isAdmin?: boolean;
  children?: Route[];
};


type UserClient = {
  email: string;
  fullName: string;
  token: string;
  isAdmin: boolean;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type PageState = {
  itemsPerPage: number;
  itemCount: number;
  currentPage: number;
  startIndex?: number;
  endIndex?: number;
};

type PlantToggle = {
  plantId: number;
  val: boolean;
  column?: "isListed" | "isFeatured"
};