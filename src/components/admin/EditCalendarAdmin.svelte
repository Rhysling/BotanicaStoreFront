<svelte:options runes={true} />

<script lang="ts">
	import Modal from "../Modal.svelte";

	let {
		item,
		editError = "",
		handleFinishEdit = () => {},
	}: {
		item: ICalendar;
		editError: string;
		handleFinishEdit: (val: Partial<ICalendar>) => void;
	} = $props();

	const newItem: ICalendar = {
		itemId: 0,
		beginDate: "",
		endDate: null,
		eventTime: "",
		title: "",
		location: "",
		description: "",
		isSpecial: false,
		beginDateFormatted: "",
		endDateFormatted: "",
	};

	//*** State ***//
	let c = $state({ ...newItem });

	let valMsgBeginDate = $state("");
	let valMsgEndDate = $state("");
	let valMsgTitle = $state("");
	let isValid: boolean = $derived(
		(valMsgBeginDate + valMsgEndDate + valMsgTitle).length === 0,
	);

	//*** Validation Functions ***//
	const testRequired = (str: string) => {
		if (!str) return "Required.";
		if (str.trim().length == 0) return "Required.";
		return "";
	};

	const testIsDate = (str: string) => {
		if (!str) return "";
		let d = Date.parse(str);
		if (isNaN(d)) return "Not a valid date.";
		let dOld = Date.parse("2000-01-01");
		let dNew = Date.parse("2050-01-01");
		if (d < dOld || d > dNew) return "Not a valid date.";
		return "";
	};

	const testIsAfter = (str: string, firstDate: string) => {
		if (!str) return "";
		let d = Date.parse(str);
		let df = Date.parse(firstDate);
		if (df >= d) return "Must be later than first date.";
		return "";
	};

	const validateBeginDate = (str: string) => {
		valMsgBeginDate = [testRequired(str), testIsDate(str)].join(" ").trim();
	};

	const validateEndDate = (str: string, first: string) => {
		valMsgEndDate = [testIsDate(str), testIsAfter(str, first)].join(" ").trim();
	};

	const validateTitle = (str: string) => {
		valMsgTitle = testRequired(str);
	};

	const validate = () => {
		validateBeginDate(c.beginDate || "");
		validateEndDate(c.endDate || "", c.beginDate || "");
		validateTitle(c.title || "");
		//isValid = (valMsgBeginDate + valMsgEndDate + valMsgTitle).length === 0;
	};

	const resetValidation = () => {
		valMsgBeginDate = "";
		valMsgEndDate = "";
		valMsgTitle = "";
		isValid = true;
	};

	const save = () => {
		validate();
		if (isValid) handleFinishEdit(c);
	};

	const cancel = () => {
		handleFinishEdit({ itemId: -1 });
		c = { ...newItem };
		resetValidation();
	};

	// Startup
	let hasRun = false;
	$effect(() => {
		if (!hasRun) {
			c = { ...item };
			hasRun = true;
			resetValidation();
		}
	});
</script>

<Modal isShowModal={true} on:setmodal>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="editor" onclick={(e) => e.stopPropagation()}>
		<div class="title">Add / Edit Calendar Item</div>
		{#if editError}
			<div class="error">
				Something went wrong: {editError}
			</div>
		{/if}

		<div class="entry">
			<div class="label required">Item Id</div>
			<div class="info">
				{c.itemId || "New Event"}
			</div>
		</div>

		<div class="entry">
			<div class="label required">Begin Date</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.beginDate}
					onblur={() => validateBeginDate(c.beginDate || "")}
					class:error-box={valMsgBeginDate ? true : null}
					placeholder="Begin Date"
				/>
				{#if valMsgBeginDate}<span class="error">{valMsgBeginDate}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label">End Date</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.endDate}
					onblur={() => validateEndDate(c.endDate || "", c.beginDate || "")}
					class:error-box={valMsgEndDate ? true : null}
					placeholder="End Date"
				/>
				{#if valMsgEndDate}<span class="error">{valMsgEndDate}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label">Event Time</div>
			<div class="info">
				<input type="text" bind:value={c.eventTime} placeholder="Event Time" />
			</div>
		</div>

		<div class="entry">
			<div class="label required">Title</div>
			<div class="info">
				<input
					type="text"
					bind:value={c.title}
					onblur={() => validateTitle(c.title || "")}
					class:error-box={valMsgTitle ? true : null}
					placeholder="Title"
				/>
				{#if valMsgTitle}<span class="error">{valMsgTitle}</span>{/if}
			</div>
		</div>

		<div class="entry">
			<div class="label">Description</div>
			<div class="info">
				<textarea bind:value={c.description} placeholder="Description"
				></textarea>
				<div class="small">HTML is ok.</div>
			</div>
		</div>

		<div class="entry">
			<div class="label">Location</div>
			<div class="info">
				<input type="text" bind:value={c.location} placeholder="Location" />
			</div>
		</div>

		<div class="entry">
			<div class="label">Is Special</div>
			<div class="info">
				<input class="sm" type="checkbox" bind:checked={c.isSpecial} />
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
				.small {
					font-size: 0.75rem;
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
