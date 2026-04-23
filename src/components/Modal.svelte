<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";

	let {
		isShowModal = false,
		setModal = () => {},
		children,
	}: {
		isShowModal: boolean;
		setModal?: (isOpen: boolean) => void;
		children: Snippet;
	} = $props();

	onMount(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isShowModal) setModal(false);
		};
		document.addEventListener("keydown", handleKeydown);
		return () => document.removeEventListener("keydown", handleKeydown);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-noninteractive-element-interactions -->
<div
	class="modal"
	role="dialog"
	tabindex="0"
	onclick={() => setModal(false)}
	style="display:{isShowModal ? 'block' : 'none'}"
>
	<i
		class="close fas fa-times"
		role="button"
		tabindex="0"
		onclick={() => setModal(false)}
		title="close"
	></i>
	{@render children()}
</div>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	.modal {
		position: fixed;
		z-index: 100;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgb(0, 0, 0);
		background-color: rgba(0, 0, 0, 0.4);
	}

	.close {
		position: absolute;
		top: 2rem;
		right: 2rem;
		color: c.$text-reverse-color;
		font-size: 3rem;
		font-weight: bold;
		z-index: 110;

		&:hover,
		&:focus {
			color: rgba(255, 255, 255, 1);
			text-decoration: none;
			cursor: pointer;
		}
	}
</style>
