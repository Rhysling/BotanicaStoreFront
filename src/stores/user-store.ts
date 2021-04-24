import { localStore } from './localstorage-store';
import { derived } from 'svelte/store';

const getEmptyUser = () => {
  return {
    email: "",
    fullName: "",
    token: "",
    isAdmin: false 
  }
};

const u = localStore<UserClient>("user", getEmptyUser());

export const user = {
  ...u,
  logOut: () => u.set(getEmptyUser())
};

export const isLoggedIn = derived(
  user,
  $user => !!$user.email
);