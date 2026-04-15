<svelte:options runes={true} />

<script lang="ts">
	import type { AxiosResponse } from "axios";
	import Modal from "./Modal.svelte";
	import { user, isLoggedIn } from "../stores/user-store";
	import { wishListStore as wls } from "../stores/wishlist-store.js";
	import { httpClient as ax } from "../stores/httpclient-store";

	const newUserLogin: IUserLogin = {
		email: "",
		fullName: "",
		pw: "",
	};

	//*** State ***//
	let isShowModal = $state(false);
	let userLogin: IUserLogin = $state({ ...newUserLogin });
	let isValidEmail: ValidationState = $state(undefined);
	let emailValidationMessage = $state("");
	let submitErrorMessage = $state("");
	let isShowName = $state(false);
	let isShowPw = $state(false);

	const setModal = (isOpen: boolean) => {
		isShowModal = isOpen;
		resetUserLogin();
	};

	const showLogin = () => {
		setModal(true);
		setTimeout(() => document.getElementById("login-email")?.focus(), 200);
	};

	const resetUserLogin = () => {
		userLogin = { ...newUserLogin };

		isValidEmail = undefined;
		emailValidationMessage = "";
		submitErrorMessage = "";
		isShowName = false;
		isShowPw = false;
	};

	const validateEmail = () => {
		emailValidationMessage = "";
		userLogin.email = userLogin.email.trim();

		if (userLogin.email == "") {
			emailValidationMessage = "Email required.";
			isValidEmail = false;
			return;
		}

		isValidEmail =
			/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
				userLogin.email,
			);

		if (!isValidEmail)
			emailValidationMessage = "Email address doesn't look right.";

		isShowPw = userLogin.email.endsWith("polson.com");

		if (isShowPw)
			setTimeout(() => document.getElementById("login-pw")?.focus(), 200);
	};

	const showName = () => {
		isShowName = true;
		setTimeout(() => document.getElementById("login-name")?.focus(), 200);
	};

	const signIn = () => {
		validateEmail();

		if (!isValidEmail) return;

		$ax
			.post("/api/Login", userLogin)
			.then(function (response: AxiosResponse<UserClient>) {
				$user = response.data;
				resetUserLogin();
				isShowModal = false;
			})
			.then(() => {
				wls.init();
			})
			.catch(function (error) {
				if (error?.response?.status) {
					let s = +error.response.status;
					submitErrorMessage =
						s >= 400 && s < 500
							? "Email/password incorrect."
							: "Something went wrong.";
				} else {
					submitErrorMessage = "Something went wrong.";
				}
			});
	};

	const signOut = () => {
		user.logOut();
		$wls = [];
	};

	const cancel = () => setModal(false);
</script>

{#if $isLoggedIn}
	{$user.fullName || $user.email}
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			signOut();
		}}>Sign out</a
	>
{:else}
	<a
		href="/"
		onclick={(e) => {
			e.preventDefault();
			showLogin();
		}}>Sign in</a
	>
{/if}

<Modal {isShowModal} {setModal}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="modal-content" role="form" onclick={(e) => e.stopPropagation()}>
		<div class="title">Provide your email address to register.</div>
		<div class="subtitle">We almost never email.</div>
		<div class="content">
			<input
				id="login-email"
				type="email"
				class="signin"
				placeholder="Email"
				bind:value={userLogin.email}
				onblur={validateEmail}
			/>
			<div class="error">{emailValidationMessage}</div>

			<a
				href="/"
				onclick={(e) => {
					e.preventDefault();
					showName();
				}}
				style="display:{isShowName ? 'none' : 'block'}"
				>Optional: Include your name</a
			>
			<input
				id="login-name"
				type="text"
				class="signin"
				style="display:{isShowName ? 'block' : 'none'}"
				placeholder="Your Name"
				bind:value={userLogin.fullName}
			/>

			<input
				id="login-pw"
				type="password"
				class="signin"
				style="display:{isShowPw ? 'block' : 'none'}"
				placeholder="Password"
				bind:value={userLogin.pw}
			/>

			<button onclick={signIn} class="primary" disabled={isValidEmail === false}
				>Go</button
			>
			<button onclick={cancel}>Cancel</button>
			<div class="error">{submitErrorMessage}</div>
		</div>
	</div>
</Modal>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	.modal-content {
		position: relative;
		background-color: #fefefe;
		margin: 15% auto;
		padding: 40px 20px 30px;
		border: 1px solid #888;
		width: 80%;
	}

	.title {
		font-size: 1.25rem;
		font-weight: bold;
		text-align: center;
		text-wrap: balance;
		margin-top: 1.25rem;
	}

	.subtitle {
		font-size: 1rem;
		font-weight: bold;
		text-align: center;
		text-wrap: balance;
		margin-top: 0.5rem;
	}

	.content {
		margin-top: 1rem;
		padding-left: 35%;

		@media screen and (max-width: c.$bp-small) {
			padding-left: 3rem;
		}

		input {
			margin: 1rem 0 0;
			width: 200px;
		}

		a {
			display: block;
			margin: 1rem 0 0;
			font-size: 0.85rem;
		}

		button {
			display: inline-block;
			margin: 1rem 0 0;
		}
	}

	.error {
		display: inline-block;
		margin: 0 0 0 0.75rem;
		height: 1rem;
		color: red;
		font-size: 0.75rem;
	}
</style>
