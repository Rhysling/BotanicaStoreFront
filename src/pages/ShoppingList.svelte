<script lang="ts">
	import Modal from "../components/Modal.svelte";
	import {
		wishListStore as wls,
		wlPlantNames as wlp,
	} from "../stores/wishlist-store";
	import {
		availablePlantsStore as aps,
		availablePlantNames as apn,
	} from "../stores/availableplants-store";
	import { user } from "../stores/user-store";
	import { navTo, currentParams } from "../stores/route-store";

	let isEditMode = false;
	let isValid = true;
	let sendMsg = "";
	let isSent = false;
	let isShowPotSizes = false;

	let taxRate = $user.taxRate;
	let wlSubtotal = 0;
	let stashQty = 0;

	// *** Initialize and Test for User ***
	if ($user.userId == 0) navTo(null, "/");

	if (!wls.isInitialized) wls.init();

	// *** Validations

	let validateQty = (inp: string | number | null) => {
		if (inp === undefined || inp === null || inp === "") return false;

		let val = Number(inp);
		if (isNaN(val)) return false;
		if (!Number.isInteger(val)) return false;
		return val < 99 && val >= 0;
	};

	let validateQtyInput = (inp: string | number | null) => {
		isValid = validateQty(inp);
	};

	// *** ShoppingList Edits

	let editItem = (plantId: number, potSizeId: number, qty: number) => {
		if (!isValid || isEditMode) return;

		wls.setEditMode(plantId, potSizeId);
		stashQty = qty;
		isEditMode = true;
	};

	let removeItem = (plantId: number, potSizeId: number) => {
		if (!isValid || isEditMode) return;
		wls.updateQty(plantId, potSizeId, 0);
	};

	let saveItem = (plantId: number, potSizeId: number, qty: number) => {
		if (!isValid) return;

		wls.updateQty(plantId, potSizeId, qty);
		wls.setEditMode(0, 0);
		isValid = true;
		isEditMode = false;
	};

	let revertItem = (plantId: number, potSizeId: number) => {
		isValid = true;
		saveItem(plantId, potSizeId, stashQty);
	};

	// *** Reactivity

	$: wlSubtotal = $wls.reduce((tot, cv) => (tot += cv.qty * cv.price), 0);

	// Add ***

	let plantToAdd: IPlantIdName = {
		plantId: 0,
		plantName: "[select plant to add]",
	};

	let apsFiltered: IvwPlantsAvailable[] = [];
	let apnAll: IPlantIdName[] = [plantToAdd, ...$apn];

	if ($currentParams && $currentParams.plantId) {
		let p = apnAll.find((a) => a.plantId === $currentParams.plantId);
		if (p) plantToAdd = p;
	}

	$: apsFiltered = plantToAdd.plantId
		? $aps.filter((a) => a.plantId === plantToAdd.plantId)
		: [];

	let validateAddQty = (qty: string, isOkEmpty: boolean) => {
		if (!qty && isOkEmpty) return true;
		let val = Number(qty);
		if (isNaN(val)) return false;
		if (!Number.isInteger(val)) return false;
		return val <= 99 && val > 0;
	};

	let calcExt = (price: number, qty: string) => {
		if (!qty) return "";

		return validateQty(qty) ? (price * +qty).toFixed(2) : "Error";
	};

	let addItem = (plantId: number, potSizeId: number, qtyEntered: string) => {
		let ap = apsFiltered.find(
			(a) => a.plantId === plantId && a.potSizeId == potSizeId,
		);

		if (ap) {
			if (!validateAddQty(qtyEntered, false)) {
				ap.isValid = false;
				apsFiltered = apsFiltered;
				return;
			}

			// Add the item
			wls.addItem(ap, +qtyEntered);

			ap.qtyEntered = "";
			ap.isValid = undefined;
			apsFiltered = apsFiltered;
		}
	};

	let cancelAddItem = (plantId: number, potSizeId: number) => {
		let ap = apsFiltered.find(
			(a) => a.plantId === plantId && a.potSizeId == potSizeId,
		);

		if (ap) {
			ap.qtyEntered = "";
			ap.isValid = undefined;
			apsFiltered = apsFiltered;
		}
	};

	let sendList = () => {
		if (!isValid || isEditMode) return;

		wls.sendList().then((resp) => {
			if (resp && resp.status < 299) {
				isSent = true;
			} else {
				sendMsg =
					"Something went wrong:" +
					(resp
						? resp.data
						: "Please try again; if it still doesn't work, let us know.");
				isSent = false;
			}
		});
	};

	// ** Pot Size Modal **
	let setModal = (val: boolean) => (isShowPotSizes = val);

	//let noop = () => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="container" on:click={(e) => e.stopPropagation()}>
	{#if !isSent}
		<div class="content">
			<a
				href="/"
				class="pot-sizes"
				on:click|preventDefault={() => setModal(true)}>pot sizes</a
			>
			<div class="title">
				Shopping List for {$user.fullName
					? `${$user.fullName} (${$user.email})`
					: $user.email}
			</div>

			<div class="wl-header row">
				<div class="description">Plant / Pot Size</div>
				<div class="qty">Qty</div>
				<div class="price">Price</div>
				<div class="ext">Ext</div>
				<div class="edit">&nbsp;</div>
			</div>

			{#each $wlp as p (p.plantId)}
				<div class="wl-plantname">
					{p.plantName}
				</div>
				{#each $wls.filter((a) => a.plantId === p.plantId) as w (w.potSizeId)}
					<div class="wl-item row">
						<div class="description">{w.potDescription}</div>
						<div class="qty">
							{#if w.isEditMode}
								<input
									type="text"
									bind:value={w.qty}
									on:keyup={(e) => validateQtyInput(e.currentTarget.value)}
									class:error-input={!isValid}
								/>
							{:else}
								{w.qty}
							{/if}
						</div>
						<div class="price">{w.price.toFixed(2)}</div>
						<div class="ext">{(w.price * w.qty).toFixed(2)}</div>
						<div class="edit">
							{#if !w.isEditMode}
								<a
									href="/"
									on:click|preventDefault={() =>
										editItem(w.plantId, w.potSizeId, w.qty)}
									data-disabled={isEditMode ? true : undefined}
									title="Edit quantity"><i class="fas fa-edit"></i></a
								>
								<a
									href="/"
									on:click|preventDefault={() =>
										removeItem(w.plantId, w.potSizeId)}
									data-disabled={isEditMode ? true : undefined}
									title="Remove"><i class="fas fa-trash"></i></a
								>
							{:else}
								<a
									href="/"
									on:click|preventDefault={() =>
										saveItem(w.plantId, w.potSizeId, w.qty)}
									data-disabled={!isValid ? true : undefined}
									title="Save new quantity"><i class="fas fa-save"></i></a
								>
								<a
									href="/"
									on:click|preventDefault={() =>
										revertItem(w.plantId, w.potSizeId)}
									title="Cancel"><i class="fas fa-undo"></i></a
								>
							{/if}
						</div>
					</div>
				{/each}
			{/each}

			<div class="wl-footer row">
				<div class="description">Subtotal</div>
				<div class="ext">{wlSubtotal.toFixed(2)}</div>
				<div class="edit">&nbsp;</div>
			</div>

			<div class="wl-footer row">
				<div class="description">
					Estimated tax @ {(taxRate * 100).toFixed(2)}%
				</div>
				<div class="ext">{(wlSubtotal * taxRate).toFixed(2)}</div>
				<div class="edit">&nbsp;</div>
			</div>

			<div class="wl-footer row grand-total">
				<div class="description">Projected Total</div>
				<div class="ext">${(wlSubtotal * (1 + taxRate)).toFixed(2)}</div>
				<div class="edit">&nbsp;</div>
			</div>

			<div class="wl-add">
				<div class="wl-add-title">Add a Plant</div>
				<div class="wl-add-name">
					<select bind:value={plantToAdd}>
						{#each apnAll as p (p.plantId)}
							<option value={p}>
								{p.plantName}
							</option>
						{/each}
					</select>
				</div>

				{#each apsFiltered as a (a.potSizeId)}
					<div class="wl-add-item row">
						<div class="description">{a.potDescription}</div>
						<div class="qty">
							<input
								type="text"
								bind:value={a.qtyEntered}
								class:error-input={validateAddQty(a.qtyEntered, true) === false
									? true
									: undefined}
							/>
						</div>
						<div class="price">{a.price.toFixed(2)}</div>
						<div class="ext">{calcExt(a.price, a.qtyEntered)}</div>
						<div class="edit">
							<a
								href="/"
								on:click|preventDefault={() =>
									addItem(a.plantId, a.potSizeId, a.qtyEntered)}
								data-disabled={validateAddQty(a.qtyEntered, false)
									? undefined
									: true}
								title="Add plant"><i class="fas fa-save"></i></a
							>
							<a
								href="/"
								on:click|preventDefault={() =>
									cancelAddItem(a.plantId, a.potSizeId)}
								title="Reset"><i class="fas fa-undo"></i></a
							>
						</div>
					</div>
				{/each}
			</div>

			<div class="buttons">
				<button
					on:click={sendList}
					class="primary"
					disabled={!isValid || isEditMode}>Send My List</button
				>
			</div>
			{#if sendMsg}<div class="error-box">{sendMsg}</div>{/if}
			<div>
				This emails the list to you and Pamela. You can make changes later when
				you coordinate on the final details or change your mind.
			</div>
		</div>
	{:else}
		<div class="result">
			<div>The list is sent to Pamela with a copy to you.</div>
			<div>Check your email.</div>
			<div><a href="/" on:click={(e) => navTo(e, "/")}>Home</a></div>
		</div>
	{/if}
</div>
<Modal isShowModal={isShowPotSizes} on:setmodal={() => setModal(false)}>
	<div class="pot-size-container">
		<div class="title">Pot Sizes</div>
		<img src="./assets/img/pot-size-comparison.jpg" alt="Pot Size Comparison" />
	</div>
</Modal>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.container {
		position: relative;
		margin: 2rem auto;
		padding: 2rem 1rem;
		max-width: 610px;
		background-color: antiquewhite;

		@media screen and (max-width: $bp-small) {
			margin: 1rem 0;
		}
	}

	.title {
		font-size: 1.1rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 1rem;
	}

	.content {
		margin: 0 auto;
		max-width: 400px;

		.pot-sizes {
			position: absolute;
			top: 0;
			right: 0;
			margin: 0.4rem 0.4rem 0 0;
			font-size: 0.75rem;
			font-style: italic;
		}

		// *** Common ***

		.row {
			display: flex;
			align-items: baseline;

			.description {
				flex: 0 1 195px;
			}

			.qty {
				flex: 0 1 35px;
				text-align: right;
				padding-left: 0.5em;
				position: relative;
				min-height: 0.8rem;

				input {
					width: 30px;
					text-align: right;
					position: absolute;
					top: -0.4rem;
					right: -0.4rem;
				}
			}

			.price {
				flex: 0 1 50px;
				text-align: right;
				padding-left: 0.5em;
			}

			.ext {
				flex: 0 1 70px;
				text-align: right;
				padding-left: 0.5em;
			}

			.edit {
				flex: 0 1 50px;
				text-align: left;
				padding-left: 0.5em;

				a {
					display: inline-block;
					color: $main-color;
					margin-right: 0.25em;

					&[data-disabled] {
						color: $text-disabled;
						cursor: default;
					}
				}
			}
		}

		.wl-header {
			//justify-content: center;
			font-weight: bold;
			font-size: 0.9rem;
		}

		.wl-plantname {
			font-weight: bold;
			font-size: 0.85rem;
			margin-top: 0.5rem;
		}

		.wl-item {
			margin-top: 0.2rem;
			font-weight: normal;
			font-size: 0.8rem;

			.description {
				margin-left: 0.5rem;
			}
			// @media screen and (max-width: $bp-small) {
			//   font-size: 0.8rem;
			// }
		}

		.wl-footer {
			margin-top: 0.5rem;
			font-size: 0.85rem;

			.description {
				flex: 0 1 280px;
				text-align: right;
			}

			&.grand-total {
				font-weight: bold;
				margin-bottom: 0.5rem;
			}
		}

		.wl-add {
			border: 2px solid $main-color;
			border-radius: 5px;
			background-color: #eeffee;
			padding: 0.6rem;

			@media screen and (max-width: $bp-small) {
				font-size: 0.9rem;
			}

			.wl-add-title {
				font-weight: bold;
				font-size: 0.9em;
				margin-bottom: 0.8em;
			}
			.wl-add-name {
				font-size: 0.8em;
				margin-bottom: 0.8em;

				select {
					min-width: 70%;
					max-width: 100%;
					padding: 0.2rem;
				}
			}

			.wl-add-item {
				margin-bottom: 0.8em;
				font-weight: normal;
				font-size: 0.8em;

				.description {
					padding-left: 0.5em;
				}

				.qty {
					input {
						top: -0.2em;
						right: -0.2em;
						padding: 0.2em;
					}
				}

				.ext {
					flex: 0 1 60px;
					text-align: right;
				}
			}
		}
	}

	.result {
		text-align: center;
	}

	.buttons {
		margin: 1.5rem 0 0;
		text-align: center;
	}

	.error-input {
		box-shadow: 0 0 2px 2px $error-secondary;
		border: 1px solid $error-primary;
		color: darken($error-primary, 10%);
		background-color: lighten($error-secondary, 5%);
	}

	.error-box {
		border: 1px solid $error-primary;
		color: darken($error-primary, 10%);
		background-color: lighten($error-secondary, 5%);
	}

	.pot-size-container {
		position: absolute;
		top: 5rem;
		right: 5rem;
		bottom: 5rem;
		left: 5rem;
		padding: 3rem;
		background-color: antiquewhite;

		img {
			display: block;
			max-width: 100%;
			max-height: 100%;
			margin: 0 auto;
		}

		@media screen and (max-width: $bp-small) {
			top: 2rem;
			right: 2rem;
			bottom: 2rem;
			left: 2rem;
			padding: 2rem;
		}
	}
</style>
