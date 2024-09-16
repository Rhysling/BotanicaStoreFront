<script lang="ts">
	import { slide } from "svelte/transition";
	import type { AxiosResponse, AxiosError } from "axios";
	import { httpClient as ax } from "../../stores/httpclient-store";
	import PicGallery from "../../components/admin/PicGallery.svelte";

	let auditResult: IPicAuditResult | undefined;
	let plants: IPlant[] = [];
	let missingMsg = "";
	let editPlantId = 0;

	const getAudit = async () => {
		try {
			const response = await $ax.get<IPicAuditResult>(
				"/api/admin/Pictures/GetAudit",
			);
			auditResult = response.data;
			//console.log({auditResult});
			plants = [];
			editPlantId = 0;
		} catch (error) {
			//let err = <AxiosError>error;
			console.error({ error });
		}
	};

	const moveOrphans = async () => {
		auditResult = undefined;

		try {
			const response = await $ax.post<IPicAuditResult>(
				"/api/admin/Pictures/MoveOrphans",
			);
			auditResult = response.data;
			plants = [];
			editPlantId = 0;
		} catch (error) {
			//let err = <AxiosError>error;
			console.error({ error });
		}
	};

	const loadPlants = async () => {
		try {
			const ids = auditResult?.plantIdsMissingPics || [];
			const response = await $ax.put<IPlant[]>(
				"/api/admin/Plants/GetForIds",
				ids,
			);
			plants = response.data;
		} catch (e) {
			//let err = <AxiosError>error;
			console.error({ e });
		}
	};

	const toggleGalleryForPlant = (plantId: number) => {
		editPlantId = editPlantId === plantId ? 0 : plantId;
	};

	const handleSavePicture = (e: CustomEvent<FormData>) => {
		$ax
			.post("/api/admin/Pictures/SavePicture", e.detail, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response: AxiosResponse<IPlantPicId>) => {
				let ppid = response.data;
				let p = plants.find((a) => a.plantId === ppid.plantId);

				if (p) {
					let ppidList: IPlantPicId[] = (JSON.parse(p.pics) || []).filter(
						(a: IPlantPicId) => a.picId !== ppid.picId,
					);
					ppidList = [...ppidList, ppid].sort((a, b) => a.picId - b.picId);
					p.pics = JSON.stringify(ppidList);
					plants = plants.map((a) => (a.plantId === p?.plantId ? p : a));
				}
			})
			.catch((e: AxiosError) => {
				console.error(e);
			});
	};

	const handleDeletePicture = (e: CustomEvent<IPlantPicId>) => {
		let ppid = e.detail;
		$ax
			.post("/api/admin/Pictures/DeletePicture", ppid)
			.then(() => {
				let p = plants.find((a) => a.plantId === ppid.plantId);
				if (p) {
					p.pics = JSON.stringify(
						(JSON.parse(p.pics) || []).filter(
							(a: IPlantPicId) => a.picId !== ppid.picId,
						),
					);
					plants = plants.map((a) => (a.plantId === p?.plantId ? p : a));
				}
			})
			.catch((e: AxiosError) => {
				console.error(e);
			});
	};

	// *** Reactive ***
	$: missingMsg = auditResult?.missingPicNames.length
		? `${auditResult?.missingPicNames.length} pics in ${auditResult?.plantIdsMissingPics.length} plants`
		: "None";

	// *** Init ***
	getAudit();
</script>

{#if auditResult}
	<div class="section">
		<a href="/" on:click|preventDefault={getAudit}>Refresh</a>
	</div>
	<div class="section">
		<div class="title">
			Orphans: {auditResult.orphanPicNames.length || "None"}
		</div>
		{#if auditResult.orphanPicNames.length}
			<div class="info">
				<a href="/" on:click|preventDefault={moveOrphans}>Archive Orphans</a>
			</div>
		{/if}
	</div>

	<div class="section">
		<div class="title">
			Missing: {missingMsg}
		</div>
		{#if auditResult.missingPicNames.length && !plants.length}
			<div class="info">
				<a href="/" on:click|preventDefault={loadPlants}>Load Plants</a>
			</div>
		{/if}
		<div class="plants">
			{#each plants as p (p.plantId)}
				<div class="plant" class:active={editPlantId === p.plantId}>
					<a
						href="/"
						on:click|preventDefault={() => toggleGalleryForPlant(p.plantId)}
						>{p.genus} {p.species}</a
					>
				</div>
				{#if editPlantId === p.plantId}
					<div transition:slide>
						<PicGallery
							plant={p}
							on:savePic={handleSavePicture}
							on:deletePic={handleDeletePicture}
						/>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<div class="loading">Loading...</div>
{/if}

<style lang="scss">
	@import "../../styles/_custom-variables.scss";

	.section {
		margin: 1.5rem 0 0.5rem;

		.title {
			font-weight: bold;
		}

		.info {
			font-size: 0.9rem;
		}
	}

	.plants {
		margin: 0.5rem 0 0 1rem;

		.plant {
			padding: 0.3rem 0 0 0.3rem;
			font-size: 0.9rem;

			&.active {
				background-color: antiquewhite;
			}
		}
	}

	.loading {
		width: 100%;
		padding: 5rem 0;
		font-size: 4rem;
		text-align: center;
	}
</style>
