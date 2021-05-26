<script>
	import { onMount } from "svelte";

	import GlobalCss from "./components/GlobalCss.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";

	import Home from "./pages/Home.svelte";
	import Plants from "./pages/Plants.svelte";
	import Calendar from "./pages/Calendar.svelte";
	import Links from "./pages/Links.svelte";
	import Contact from "./pages/Contact.svelte";
	import About from "./pages/About.svelte";
	import ShoppingList from "./pages/ShoppingList.svelte";
	import PlantAdmin from "./pages/admin/PlantAdmin.svelte";
	import PlantAvailability from "./pages/admin/PlantAvailability.svelte";
	import CalendarAdmin from "./pages/admin/CalendarAdmin.svelte";

	import { currentRoute, navFromUrl } from "./stores/route-store.js";
	import { user } from "./stores/user-store.js";
	import { wishListStore as wls } from "./stores/wishlist-store.js";
  import { availablePlantsStore as aps } from "./stores/availableplants-store";
	
	let slug = "/";
	let page = "Home";

	if ($user.userId)
		wls.init();

	aps.init();

	onMount(() => {
		navFromUrl();
	});


	let pages = {
		Home,
		Plants,
		Calendar,
		Links,
		Contact,
		About,
		ShoppingList,
		PlantAdmin,
		PlantAvailability,
		CalendarAdmin
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