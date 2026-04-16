<svelte:options runes={true} />

<script lang="ts">
	import Modal from "./Modal.svelte";

	let {
		bigPicPaths = [],
		isShowModal = false,
		setModal,
	}: {
		bigPicPaths: PicIdPath[];
		isShowModal: boolean;
		setModal: (isOpen: boolean) => void;
	} = $props();

	let ix = $state(0);

	let last = $derived(bigPicPaths.length - 1);
	let hasMultiple = $derived(last > 0);

	const changePic = (n: number) => {
		let i = ix + n;

		if (i < 0) {
			ix = last;
			return;
		}

		if (i > last) {
			ix = 0;
			return;
		}

		ix = i;
	};

	const moveByArrow = (e: KeyboardEvent) => {
		if (!isShowModal || !hasMultiple) return;

		if (e.key == "ArrowRight") {
			changePic(1);
			return;
		}

		if (e.key == "ArrowLeft") {
			changePic(-1);
		}
	};
</script>

<svelte:window onkeydown={(e) => moveByArrow(e)} />
<Modal {isShowModal} {setModal}>
	{#if isShowModal}
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="frame" role="banner" onclick={(e) => e.stopPropagation()}>
			{#if hasMultiple}
				<a
					href="/"
					class="arrow left"
					title="Left"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						changePic(-1);
					}}><i class="fas fa-angle-left"></i></a
				>
			{/if}
			<img src={bigPicPaths[ix].path} alt="Botanica plant" />
			{#if hasMultiple}
				<a
					href="/"
					class="arrow right"
					title="Right"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						changePic(-1);
					}}><i class="fas fa-angle-right"></i></a
				>
			{/if}
		</div>
	{/if}
</Modal>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	.frame {
		position: relative;
		height: 90vh;
		width: 100%;
		margin-top: 5vh;
	}

	img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 95vw;
		max-height: 90vh;
	}

	.arrow {
		display: block;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		font-size: 5rem;
		z-index: 2;

		&.left {
			left: 2rem;
		}

		&.right {
			right: 2rem;
		}
	}

	i {
		color: rgba(255, 255, 255, 0.3);
	}

	a {
		text-decoration: none;

		i {
			color: rgba(255, 255, 255, 0.7);

			&:hover {
				color: rgba(255, 255, 255, 0.9);
			}
		}
	}
</style>
