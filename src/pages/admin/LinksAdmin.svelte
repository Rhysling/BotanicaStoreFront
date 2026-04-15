<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from "svelte";
	import type { AxiosResponse } from "axios";
	import { httpClient as ax } from "../../stores/httpclient-store";
	import EditLinksAdmin from "../../components/admin/EditLinksAdmin.svelte";

	const newItem: ILinkEdit = {
		linkId: 0,
		title: "",
		description: "",
		url: "",
		sortOrder: 0,
		isDeleted: false,
		sortOrderEntered: "",
	};

	//*** State ***//
	let master: ILink[] = $state([]);
	let list: ILink[] = $state([]);
	let includeDeleted = $state(false);
	let editedItem: ILinkEdit | null = $state(null);
	let editError = $state("");

	let editItem = (linkId: number) => {
		if (linkId == 0) {
			editedItem = { ...newItem };
			return;
		}

		let item = list.find((a) => a.linkId == linkId);
		if (!item) {
			editedItem = { ...newItem };
			return;
		}

		let i: ILinkEdit = item;
		i.sortOrderEntered = i.sortOrder.toString();
		editedItem = i;
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

	let handleFinishEdit = (linkItem: Partial<ILink>) => {
		if (linkItem.linkId !== undefined && linkItem.linkId < 0) {
			editedItem = null;
			return;
		}
		saveItem(<ILink>linkItem);
	};

	// *** Init ***
	onMount(() => {
		$ax
			.get("/api/Links/GetAll?includeDeleted=true")
			.then((response: AxiosResponse<ILink[]>) => {
				master = response.data;
			})
			.then(() => filterList(includeDeleted))
			.catch((err) => console.error({ err }));
	});
</script>

<div class="search">
	<div>
		Incl deleted:
		<input
			type="checkbox"
			class="filter-box"
			bind:checked={includeDeleted}
			onchange={() => filterList(includeDeleted)}
		/>
	</div>
	<div class="right">
		<i class="fas fa-caret-right"></i>
		<a
			href="/"
			onclick={(e) => {
				e.preventDefault();
				editItem(0);
			}}>Add</a
		>
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
				onclick={(e) => {
					e.preventDefault();
					editItem(a.linkId);
				}}>Edit</a
			>
		</div>
	{:else}
		<div class="empty">No listings.</div>
	{/each}
</div>

{#if editedItem}
	<EditLinksAdmin {editedItem} {editError} {handleFinishEdit} />
{/if}

<style lang="scss">
	@use "../../styles/_custom-variables.scss" as c;
	@use "sass:color";

	.search {
		display: flex;
		flex-flow: row nowrap;
		align-items: baseline;
		font-size: 0.8rem;
		margin-top: 0.5em;
		padding: 0.2rem 0.4rem;
		background-color: c.$beige-lighter;

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

		@media screen and (max-width: c.$bp-small) {
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
		color: c.$main-color;
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
		color: c.$text-disabled;
		background-color: c.$text-reverse-color;

		.title {
			color: color.scale(c.$main-color, $lightness: 5%, $space: oklch);
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
