<script>
	import { onMount } from "svelte";

	import GlobalCss from "./components/GlobalCss.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	import Home from "./pages/Home.svelte";
	import Plants from "./pages/Plants.svelte";
	import Calendar from "./pages/Calendar.svelte";
	import Contact from "./pages/Contact.svelte";
	import About from "./pages/About.svelte";
	import PlantAdmin from "./pages/Admin/PlantAdmin.svelte";

	// import About from "./pages/About.svelte";
	// import Contact from "./pages/Contact.svelte";

	import { currentRoute, navFromUrl } from "./stores/route-store.js";
	
	let slug = "/";
	let page = "Home";

	onMount(() => {
		navFromUrl();
	});


	let pages = {
		Home,
		Plants,
		Calendar,
		Contact,
		About,
		PlantAdmin
	};

	$: {
		slug = $currentRoute.slug;
		page = $currentRoute?.page ?? "Home";
		//console.log({currentRoute: $currentRoute});

		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth"
		});
	}

</script>

<GlobalCss />
<main>
	<Header />
	<svelte:component this={ pages[page] } />
	<Footer {slug} />

</main>

<style lang="scss">
  @import "./styles/_custom-variables.scss";

	main {
		background-color: #fff;
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
	}

	@media only screen and (max-width: $bp-small) {
		
	}
</style>