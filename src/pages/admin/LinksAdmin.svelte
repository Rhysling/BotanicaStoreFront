<script lang="ts">
	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../../stores/httpclient-store";
	import EditLinksAdmin from "../../components/admin/EditLinksAdmin.svelte";

	let master: ILink[] = [];
	let list: ILink[] = [];
	let includeDeleted = false;
	let editedItem: ILinkEdit | null = null;
	let editError = "";

	let editItem = (linkId: number) => {
		if (linkId == 0) {
			editedItem = {
				linkId: 0,
				title: "",
				description: "",
				url: "",
				sortOrder: 0,
				isDeleted: false,
				sortOrderEntered: "",
			};

			return;
		}

		let item = list.find((a) => a.linkId == linkId);

		if (item) {
			let i: ILinkEdit = item;
			i.sortOrderEntered = i.sortOrder.toString();
			editedItem = i;
		}
	};

	let saveItem = (item: ILink) => {
		$ax
			.post("/api/Links/Save", item)
			.then((response: AxiosResponse<ILink>) => {
				let item = response.data;

				master = [item, ...master.filter((a) => a.linkId !== item.linkId)].sort(
					(a, b) => a.sortOrder - b.sortOrder,
				);
			})
			.then(() => filterList(includeDeleted))
			.then(() => (editedItem = null))
			.catch((err) => console.error({ err }));
	};

	let filterList = (includeDeleted: boolean) => {
		if (!includeDeleted) list = master.filter((a) => !a.isDeleted);
		else list = master;
	};

	let handleEditModal = (e: CustomEvent<{ val: boolean }>) => {
		if (!e.detail.val) editedItem = null;
	};

	let handleFinishEdit = (e: CustomEvent<ILink>) => {
		if (e.detail.linkId < 0) {
			editedItem = null;
			return;
		}
		saveItem(e.detail);
	};

	// *** Init ***

	let init = () => {
		$ax
			.get("/api/Links/GetAll?includeDeleted=true")
			.then((response: AxiosResponse<ILink[]>) => {
				master = response.data;
			})
			.then(() => filterList(includeDeleted))
			.catch((err) => console.error({ err }));
	};

	init();
</script>

<div class="search">
	<div>
		Incl deleted:
		<input
			type="checkbox"
			class="filter-box"
			bind:checked={includeDeleted}
			on:change={() => filterList(includeDeleted)}
		/>
	</div>
	<div class="right">
		<i class="fas fa-caret-right"></i>
		<a href="/" on:click|preventDefault={() => editItem(0)}>Add</a>
	</div>
</div>

<div>
	{#each list as a}
		<div class="item" class:is-deleted={a.isDeleted ? true : undefined}>
			<div class="title">{a.title}</div>
			<div class="url"><a href={a.url} target="_blank">{a.url}</a></div>
			<div class="description">{a.description}</div>
			<div class="sort-order">Sort: {a.sortOrder}</div>
			<a
				class="edit-link"
				href="/"
				on:click|preventDefault={() => editItem(a.linkId)}>Edit</a
			>
		</div>
	{:else}
		<div class="empty">No listings.</div>
	{/each}
</div>

{#if editedItem}
	<EditLinksAdmin
		item={editedItem}
		{editError}
		on:setmodal={handleEditModal}
		on:finishEdit={handleFinishEdit}
	/>
{/if}

<style lang="scss">
	@import "../../styles/_custom-variables.scss";

	.search {
		display: flex;
		flex-flow: row nowrap;
		align-items: baseline;
		font-size: 0.8rem;
		margin-top: 0.5em;
		padding: 0.2rem 0.4rem;
		background-color: $beige-lighter;

		input {
			position: relative;
			top: 2px;
		}

		.right {
			flex: 1 1 50%;
			text-align: right;
		}
	}

	.item {
		display: block;
		position: relative;
		margin: 0.4rem 3vw 0;
		padding: 0.4rem;
		border: 1px solid black;
		font-size: 0.9rem;

		@media screen and (max-width: $bp-small) {
			margin: 0.4rem 0 0;
		}

		.edit-link {
			position: absolute;
			top: 0.4rem;
			right: 0.4rem;
		}
	}

	.title {
		font-size: 1rem;
		font-weight: bold;
		color: $main-color;
	}

	.url {
		font-size: 0.85rem;

		&:hover {
			text-decoration: underline;
		}
	}

	.sort-order {
		font-size: 0.85rem;
	}

	.is-deleted {
		color: $text-disabled;
		background-color: $text-reverse-color;

		.title {
			color: lighten($main-color, 5%);
		}
	}

	.empty {
		width: 100%;
		text-align: center;
		font-weight: bold;
		font-size: 1.2rem;
		padding: 5rem 0;
	}
</style>
