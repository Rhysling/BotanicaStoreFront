<script lang="ts">
  import Modal from "../Modal.svelte";
  import Dropzone from "svelte-file-dropzone";
  import { createEventDispatcher } from 'svelte';

  export let plant: IPlant;

  const dispatch = createEventDispatcher();

  $: smSrc = plant.hasSmallPic ? `/plantpics/p${plant.plantId.toString().padStart(4, "0")}_sm.jpg` : "/plantpics/no-pic.jpg";
  $: bigPicsIds = plant.bigPicIds.split(",")
    .filter(a => a !== "");
  $: bigPicPaths = bigPicsIds
    .map(a => [a, `/plantpics/p${plant.plantId.toString().padStart(4, "0")}_${a.padStart(2, "0")}.jpg`]);
  let errorMsg = "";

  let handlePicDropped = (e: any, isSmall: boolean) => {
    const { acceptedFiles, fileRejections } = e.detail;

    if (acceptedFiles.length) {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("plantId", plant.plantId.toString());
      formData.append("type", isSmall ? "sm" : "lg");
      dispatch("savePic", formData);
    }

    
    //console.log({file: acceptedFiles[0], isSmall});

  };
  let deletePic = (plantId: number, picId: string) => {
    dispatch("deletePic", {plantId, picId});
  };

</script>

<Modal isShowModal={true} on:setmodal>
  <div class="editor" on:click={(e) => e.stopPropagation()}>
    <div class="title">Edit Pictures</div>
    <div class="t1">Plant Id: {plant.plantId}</div>
    <div class="t2">{plant.genus} {plant.species}</div>
    <div class="error">

    </div>
    <div class="t3">
      Small Picture
    </div>
    <div class="gallery">
      <div class="pic">
        <img src={smSrc} alt="{plant.genus} {plant.species}" />
        {#if plant.hasSmallPic}
        <div><a href="/" on:click|preventDefault={() => deletePic(plant.plantId, "sm")}>Delete</a></div>
        {/if}
      </div>
      <div class="dz-frame">
        <Dropzone
          on:drop={(e) => handlePicDropped(e, true)}
          on:click={(e) => e.stopPropagation() }
          containerClasses={"dz-wrap"}
          accept=".jpg,.png">
          <p>Drop new small picture here or click to search for file.</p>
        </Dropzone>
      </div>
    </div>    
    <div class="t3">
      Big Pictures
    </div>
    <div class="gallery">
      {#each bigPicPaths as bp}
      <div class="pic">
        <img src={bp[1]} alt="pic {bp[0]}" />
        <div><a href="/" on:click|preventDefault={() => deletePic(plant.plantId, bp[0])}>Delete</a></div>
      </div>
      {/each}
      <div class="dz-frame">
        <Dropzone
          on:drop={(e) => handlePicDropped(e, false)}
          on:click={(e) => e.stopPropagation() }
          containerClasses={"dz-wrap"}
          accept=".jpg,.png">
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
      text-align:center;
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