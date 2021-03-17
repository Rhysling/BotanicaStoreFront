import { writable, readable, derived, get } from "svelte/store";

const r = {
	title: "Home",
	page: "Home",
	slug: "/",
	children: [
		{
			title: "Plants Available",
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
		},
		{
			title: "Admin",
			page: "Admin",
			slug: "/admin",
			isAdmin: true,
			children: [
				{
					title: "Plant Admin",
					page: "Plant Admin",
					slug: "/plant-admin",
					isAdmin: true
				},
				{
					title: "Calendar Admin",
					page: "Calendar Admin",
					slug: "/calendar-admin",
					isAdmin: true
				}
			]
		}
	]
};

function findRoute(routeRoot, slug) {
	let cr = null,
		isFound = false;

	function traverse(node) {
		if (isFound || !node) return;

		if (node.slug === slug) {
			cr = node;
			isFound = true;
		}

		if (node.children && node.children.length) {
			for (let i = 0; i < node.children.length; i += 1) {
				traverse(node.children[i]);
				if (isFound) break;
			}
		}
	}

	traverse(routeRoot);

	return cr;
}

// Stores

export const routes = readable(r, function start(set) {
	// noop
	return function stop() {
		// noop
	};
});

export const currentSlug = writable("/");

export const currentRoute = derived([routes, currentSlug], ([$routes, $currentSlug]) =>
	findRoute($routes, $currentSlug)
);

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

export const navTo = function (e) {
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
