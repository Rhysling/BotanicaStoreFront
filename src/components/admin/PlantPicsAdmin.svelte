<script lang="ts">
	import Modal from "../Modal.svelte";
	import Dropzone from "svelte-file-dropzone";
	import { createEventDispatcher } from "svelte";
	import { picPaths } from "../../stores/utils";

	export let plant: IPlant;

	const dispatch = createEventDispatcher();

	let paths: PicPaths;
	let hasSmallPic = false;

	$: {
		paths = picPaths(plant.plantId, plant.pics);
		hasSmallPic = !paths.smPath.endsWith("no-pic.jpg");
	}

	const handlePicDropped = (e: CustomEvent, isSmall: boolean) => {
		const { acceptedFiles, fileRejections } = e.detail;

		if (fileRejections.length) {
			alert("Can only take 'jpg' or 'jpeg' files.");
			return;
		}

		if (acceptedFiles.length) {
			const formData = new FormData();
			formData.append("file", acceptedFiles[0]);
			formData.append("plantId", plant.plantId.toString());
			formData.append("type", isSmall ? "sm" : "lg");
			dispatch("savePic", formData);
		}

		//console.log({ acceptedFiles, fileRejections });
	};

	const handlePicDroppedSmall = (e: CustomEvent) => handlePicDropped(e, true);
	const handlePicDroppedLarge = (e: CustomEvent) => handlePicDropped(e, false);

	const stopProp = (e: Event) => e.stopPropagation();

	const deletePic = (plantId: number, picId: number) => {
		dispatch("deletePic", { plantId, picId });
	};
</script>

<Modal isShowModal={true} on:setmodal>
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="editor" on:click={(e) => e.stopPropagation()}>
		<div class="title">Edit Pictures</div>
		<div class="t1">Plant Id: {plant.plantId}</div>
		<div class="t2">{plant.genus} {plant.species}</div>
		<div class="error"></div>
		<div class="t3">Small Picture - Only One</div>
		<div class="gallery">
			<div class="pic">
				<img src={paths.smPath} alt="{plant.genus} {plant.species}" />
				{#if hasSmallPic}
					<div>
						<a
							href="/"
							on:click|preventDefault={() => deletePic(plant.plantId, 0)}
							>Delete</a
						>
					</div>
				{/if}
			</div>
			<div class="dz-frame">
				<Dropzone
					on:drop={handlePicDroppedSmall}
					on:click={stopProp}
					containerClasses={"dz-wrap"}
					accept=".jpg,.jpeg"
				>
					<p>Drop new small picture here or click to search for file.</p>
				</Dropzone>
			</div>
		</div>
		<div class="t3">Big Pictures</div>
		<div class="gallery">
			{#each paths.lgPaths as bp}
				<div class="pic">
					<img src={bp.path} alt="pic {bp.picId}" />
					<div>
						<a
							href="/"
							on:click|preventDefault={() => deletePic(plant.plantId, bp.picId)}
							>Delete</a
						>
					</div>
				</div>
			{/each}
			<div class="dz-frame">
				<Dropzone
					on:drop={handlePicDroppedLarge}
					on:click={stopProp}
					containerClasses={"dz-wrap"}
					accept=".jpg,.jpeg"
				>
					<p>Drop new big picture here or click to search for file.</p>
				</Dropzone>
			</div>
		</div>
	</div>
</Modal>

<style lang="scss">
	@import "../../styles/_custom-variables.scss";

	.editor {
		margin: 5rem 5rem;
		padding: 3rem;
		background-color: antiquewhite;

		.title {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
		}

		.t1 {
			font-size: 0.9rem;
		}

		.t2 {
			font-weight: bold;
		}

		.t3 {
			font-size: 1.1rem;
			font-weight: bold;
			margin: 1rem 0;
			padding: 0 0 0.3rem 0;
			border-bottom: 1px solid black;
		}

		.gallery {
			display: flex;
			flex-flow: row wrap;
			align-items: flex-start;
			margin: 0;

			.pic {
				margin: 0.5rem 0.5rem 0.5rem 0;
			}

			.pic > img {
				display: block;
				max-height: 180px;
				width: auto;
			}

			.pic > div {
				text-align: center;
				margin-top: 0.3rem;
			}
		}
	}

	:global(.dz-wrap) {
		height: 176px;
		width: 170px;
		margin: 0;
		// border: 2px solid $main-color;
	}

	.dz-frame {
		border: 2px solid $main-color;
		margin: 0.5rem 0 0 0;

		&:hover {
			box-shadow: 0 0 2px 2px $main-color;
		}
	}
</style>
