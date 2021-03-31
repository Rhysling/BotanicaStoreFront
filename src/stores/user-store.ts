import { localStore } from './localstorage-store';
import { derived } from 'svelte/store';

export const user = localStore<UserClient>("user", {
  email: "",
  fullName: "",
  token: "",
  isAdmin: false 
});

export const isLoggedIn = derived(
	user,
	$user => !!$user.email
);