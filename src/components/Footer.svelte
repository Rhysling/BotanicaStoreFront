<script>
  import { getAppVersion } from "../stores/utils";

  export let path = "/";

  let yr = new Date().getFullYear() - 2000;

  let scrollToTop = () => {
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
  };

</script>

<footer>
  <div class="f1">
    {#if path == "/"}
    Remember, plant selections change throughout the season!
    {:else}
    <hr style="width:100%" />
    {/if}
  </div>
  <div class="f2">
    <a href="/" on:click|preventDefault={scrollToTop}>Top</a> | &copy;2001-{yr} Pamela Harlow
    <div class="version">{ getAppVersion() }</div>
  </div>
  <br />
</footer>


<style>

  .f1 {
    font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    width: 100%;
    margin-top: 1rem;

  }

  .f2 {
    position: relative;
    font-size: 0.75rem;
    text-align: center;
    width: 100%;
    margin-top: 0.5rem;
  }

  .version {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 0.6rem;
  }

</style>