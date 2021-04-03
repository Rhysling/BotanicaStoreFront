import { localStore } from './localstorage-store';
import { derived } from 'svelte/store';

const emptyUser = {
  email: "",
  fullName: "",
  token: "",
  isAdmin: false 
};

const u = localStore<UserClient>("user", emptyUser);

export const user = {
  ...u,
  logOut: () => u.update(a => emptyUser)
};

export const isLoggedIn = derived(
  user,
  $user => !!$user.email
);