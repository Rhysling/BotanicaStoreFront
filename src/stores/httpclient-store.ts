import axios from "axios";
import { derived } from "svelte/store";
import { user } from "./user-store";

declare var baseURL: string;

export const httpClient = derived(
	user,
	$user => {
    let opts = { baseURL };

    if ($user.token)
      opts = { ...opts, ...{ headers: { Authorization: $user.token } } };

    return  axios.create(opts);
  }
);
