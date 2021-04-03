
type UserClient = {
  email: string;
  fullName: string;
  token: string;
  isAdmin: boolean;
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
