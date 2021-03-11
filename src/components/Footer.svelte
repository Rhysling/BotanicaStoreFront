<script>
  import NavBar from "./NavBar.svelte";

  let yr = new Date().getFullYear() - 2000;
  let isFooter = true;

let scrollToTop = () => {
  window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
	});
};

</script>

<footer>
  <div>
    Remember, plant selections change dramatically throughout the season!
  </div>
  <NavBar {isFooter} />
  <div>
    <a href="/" on:click|preventDefault={scrollToTop}>Top</a> | &copy;2001-{yr} Pamela Harlow
  </div>
</footer>


<style>
  
</style>