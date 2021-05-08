import { writable, derived, get } from "svelte/store";
import { user } from "./user-store";

let getBaseRoutes = (): Route => {

	return {
		title: "Home",
		page: "Home",
		slug: "/",
		children: [
			{
				title: "Botanica Plants",
				page: "Plants",
				slug: "/plants",
				children: []
			},
			{
				title: "Plant Sale Calendar",
				page: "Calendar",
				slug: "/calendar",
				children: []
			},
			{
				title: "About Botanica",
				page: "About",
				slug: "/about",
				children: []
			},
			{
				title: "Contact Us",
				page: "Contact",
				slug: "/contact",
				children: []
			},{
				title: "Wish List",
				page: "WishList",
				slug: "/wish-list",
				isHidden: true,
				children: []
			},
			{
				title: "Admin",
				page: "Admin",
				slug: "/admin",
				isAdmin: true,
				children: [
					{
						title: "Plant Admin",
						page: "PlantAdmin",
						slug: "/plant-admin",
						isAdmin: true
					},
					{
						title: "Plant Availability",
						page: "PlantAvailability",
						slug: "/plant-availability",
						isAdmin: true
					},
					{
						title: "Calendar Admin",
						page: "CalendarAdmin",
						slug: "/calendar-admin",
						isAdmin: true
					}
				]
			}
		]
	};
};

function filterAdminRoutes (node: Route) {
	if (node.children)
		node.children = node.children.filter(a => a.isAdmin !== true).map(a => filterAdminRoutes(a));

	return node;
}



function findRoute(routeRoot: Route, slug: string): Route | undefined {
	let cr: Route | undefined;

	function traverse(node: Route): Route | undefined {

		if (node.slug === slug)
			return node;

		let cr: Route | undefined;

		if (node.children && node.children.length) {
			for (let i = 0; i < node.children.length; i += 1) {
				cr = traverse(node.children[i]);

				if (cr)
					return cr;
			}
		}
	}

	cr = traverse(routeRoot);

	return cr;
}

// Stores

export const routes = derived(user, ($user) => {
	let r = getBaseRoutes();

	if (!$user.isAdmin)
		r = filterAdminRoutes(r)

	return r;
});

export const currentSlug = writable("/");

export const currentRoute = derived([routes, currentSlug], ([$routes, $currentSlug]) => {
	let r = findRoute($routes, $currentSlug);
	if (r) return r;

	$currentSlug = "/";
	return $routes;
});

// Public Functions

export const navFromUrl = function () {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (r) {
		currentSlug.set(pathName);
		document.title = `Botanica - ${r.title}`;
	} else {
		window.location.replace(window.location.origin);
	}
};

export const navTo = function (e: any) {
	e.preventDefault();

	let pathName = e.currentTarget.dataset.dest;
	window.history.pushState({}, pathName, window.location.origin + pathName);
	currentSlug.set(pathName);

	let r = findRoute(get(routes), pathName);

	if (r) document.title = "Botanica - " + r.title;
};

// Back Button

window.onpopstate = () => {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (r) {
		currentSlug.set(pathName);
	} else {
		window.location.replace(window.location.origin);
	}
};
