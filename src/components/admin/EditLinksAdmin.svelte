<svelte:options runes={true} />

<script lang="ts">
	import Modal from "../Modal.svelte";

	const newItem: ILinkEdit = {
		linkId: 0,
		title: "",
		description: "",
		url: "",
		sortOrder: 0,
		isDeleted: false,
		sortOrderEntered: "",
	};

	let {
		editedItem,
		editError = "",
		handleFinishEdit = () => {},
	}: {
		editedItem: ILinkEdit;
		editError?: string;
		handleFinishEdit: (linkItem: Partial<ILink>) => void;
	} = $props();

	let c = $state({ ...newItem });

	let valMsgTitle = $state("");
	let valMsgUrl = $state("");
	let valMsgSortOrder = $state("");
	let isValid = $derived(
		(valMsgTitle + valMsgUrl + valMsgSortOrder).length === 0,
	);

	let testRequired = (str: string | undefined) => {
		if (!str) return "Required.";
		if (str.trim().length == 0) return "Required.";
		return "";
	};

	let testIsUrl = (str: string | undefined) => {
		if (!str) return "";
		if (!str.startsWith("http")) return "Need to include 'http'.";
		return "";
	};

	let testIsPositiveInteger = (str: string | undefined) => {
		if (!str) return "";

		let val = Number(str);
		if (isNaN(val)) return "Must be a number.";
		if (!Number.isInteger(val) || val < 1) return "Must be a positive integer.";
		return "";
	};

	let validateTitle = (str: string | undefined) => {
		valMsgTitle = testRequired(str);
	};

	let validateUrl = (str: string | undefined) => {
		valMsgUrl = testRequired(str);

		if (!valMsgUrl) valMsgUrl = testIsUrl(str);
	};

	let validateSortOrder = (str: string | undefined) => {
		valMsgSortOrder = testRequired(str);

		if (!valMsgSortOrder) valMsgSortOrder = testIsPositiveInteger(str);
	};

	let validate = () => {
		validateTitle(c.title);
		validateUrl(c.url);
		validateSortOrder(c.sortOrderEntered);
	};

	let save = () => {
		validate();
		if (isValid) {
			c.description = c.description || "";
			c.sortOrder = Number(c.sortOrderEntered);
			handleFinishEdit(c);
		}
	};

	let cancel = () => {
		handleFinishEdit({ linkId: -1 });
	};

	// Startup
	let hasRun = false;
	$effect(() => {
		if (!hasRun) {
			c = { ...editedItem };
			hasRun = true;
		}
	});
</script>

<Modal isShowModal={true}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="editor" role="form" onclick={(e) => e.stopPropagation()}>
		<div class="title">Add / Edit Link Item</div>
		{#if editError}
			<div class="error">
				Something went wrong: {editError}
			</div>
		{/if}

		<div class="entry">
			<div class="label required">Item Id</div>
			<div class="info">
				{c.linkId || "New Event"}
			</div>
		</div>

		<div class="entry">
			<div class="label required">Title</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.title}
					onblur={() => validateTitle(c.title)}
					class:error-box={valMsgTitle ? true : null}
					placeholder="Title"
				/>
				{#if valMsgTitle}<span class="error">{valMsgTitle}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label required">URL</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.url}
					onblur={() => validateUrl(c.url)}
					class:error-box={valMsgUrl ? true : null}
					placeholder="URL"
				/>
				{#if valMsgUrl}<span class="error">{valMsgUrl}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label">Description</div>
			<div class="info">
				<textarea bind:value={c.description} placeholder="Description"
				></textarea>
			</div>
		</div>

		<div class="entry">
			<div class="label required">Sort Order</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.sortOrderEntered}
					onblur={() => validateSortOrder(c.sortOrderEntered)}
					class:error-box={valMsgSortOrder ? true : null}
					placeholder="Sort Order"
				/>
				{#if valMsgSortOrder}<span class="error">{valMsgSortOrder}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label">Is Deleted</div>
			<div class="info">
				<input type="checkbox" bind:checked={c.isDeleted} />
			</div>
		</div>

		<div class="buttons">
			<button
				onclick={save}
				class="primary"
				disabled={isValid ? undefined : true}>Save</button
			>
			<button onclick={cancel}>Cancel</button>
		</div>
	</div>
</Modal>

<style lang="scss">
	@use "../../styles/_custom-variables.scss" as c;
	@use "sass:color";

	.editor {
		margin: 5rem 5rem;
		padding: 3rem;
		background-color: antiquewhite;

		.title {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
			margin-bottom: 0.8rem;
		}

		.entry {
			display: flex;
			align-items: flex-start;
			margin-bottom: 0.5rem;
			font-size: 0.9rem;

			.label {
				flex: 1 1 40%;
				text-align: right;
			}

			.required {
				font-weight: bold;
			}

			.info {
				flex: 1 1 60%;
				padding-left: 1rem;

				input[type="text"],
				textarea {
					width: 100%;
				}
			}
		}

		.error {
			color: c.$error-primary;
			font-size: 0.9rem;
		}

		.error-box {
			box-shadow: 0 0 2px 2px c.$error-secondary;
			border: 1px solid c.$error-primary;
			color: color.scale(c.$error-primary, $lightness: -10%, $space: oklch);
			background-color: color.scale(
				c.$error-secondary,
				$lightness: 5%,
				$space: oklch
			);
		}

		.buttons {
			margin: 1rem 0 0;
			text-align: center;
		}
	}
</style>
