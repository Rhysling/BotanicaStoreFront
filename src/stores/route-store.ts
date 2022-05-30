import { writable, derived, get } from "svelte/store";
import { user } from "./user-store";

let getBaseRoutes = (): Route => {

	return {
		title: "Home",
		page: "Home",
		path: "/",
		children: [
			{
				title: "Botanica Plants",
				page: "Plants",
				path: "/plants",
				children: []
			},
			{
				title: "Plant Sale Calendar",
				page: "Calendar",
				path: "/calendar",
				children: []
			},
			{
				title: "More...",
				page: "More",
				path: "/more",
				isExpanded: undefined,
				children: [
					{
						title: "Interesting Links",
						page: "Links",
						path: "/links",
						children: []
					},{
						title: "About Botanica",
						page: "About",
						path: "/about",
						children: []
					},
					{
						title: "Contact Us",
						page: "Contact",
						path: "/contact",
						children: []
					}
				]
			},
			{
				title: "Shopping List",
				page: "ShoppingList",
				path: "/shopping-list",
				isHidden: true,
				children: []
			},
			{
				title: "Plant",
				page: "Plant",
				path: "/plant",
				isHidden: true,
				hasParam: true,
				children: []
			},
			{
				title: "Admin",
				page: "Admin",
				path: "/admin",
				isAdmin: true,
				isExpanded: undefined,
				children: [
					{
						title: "Plant Admin",
						navName: "Plant Admin",
						page: "PlantAdmin",
						path: "/plant-admin",
						isAdmin: true
					},
					{
						title: "Plant Availability",
						navName: "Availability",
						page: "PlantAvailability",
						path: "/plant-availability",
						isAdmin: true
					},
					{
						title: "Calendar Admin",
						navName: "Calendar Admin",
						page: "CalendarAdmin",
						path: "/calendar-admin",
						isAdmin: true
					},
					{
						title: "Links Admin",
						navName: "Links Admin",
						page: "LinksAdmin",
						path: "/links-admin",
						isAdmin: true
					},
					{
						title: "Shopping Lists",
						navName: "Shopping Lists",
						page: "ShoppingListAdmin",
						path: "/shopping-list-admin",
						isAdmin: true
					},
					{
						title: "User Admin",
						navName: "Users",
						page: "UserAdmin",
						path: "/user-admin",
						isAdmin: true
					},
					{
						title: "Color Cards",
						navName: "ColorCards",
						page: "ColorCards",
						path: "/color-cards",
						isAdmin: true
					},
					{
						title: "Pic Audit",
						navName: "Pic Audit",
						page: "PicAudit",
						path: "/pic-audit",
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



function findRoute(routeRoot: Route, path: string): Route | undefined {
	let cr: Route | undefined;

	function traverse(node: Route): Route | undefined {

		if (node.path === path)
			return node;

		if (node.hasParam && path.startsWith(node.path + "/")) {
			return { ...node, path };
		}

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

export const currentPath = writable("/");
export const currentParams = writable<any>({});
export const isLiveOnlineShopping = writable(false);

export const currentRoute = derived([routes, currentPath], ([$routes, $currentPath]) => {
	let r = findRoute($routes, $currentPath);
	if (r) return r;

	$currentPath = "/";
	return $routes;
});

// Param functions

let paramStringToObj = (inp: string) => {
	let entries = (new URLSearchParams(inp)).entries();
	let p: any = {};
	for(let [key, val] of entries) {
		switch(val) {
			case "true":
				p[key] = true;
				break;
			case "false":
				p[key] = false;
				break;
			default:
				p[key] = val;
		}
	}
	return p;
};

let objToParamString = (inp: any) => {
	if (!inp) return "";

	let entries = Object.entries(inp);

	if (!entries.length) return "";

	let p = new URLSearchParams();
	for(let [key, val] of entries) {
		if (val === null || val === undefined || val ==="") continue;
		p.append(key, <string>val);
	}

	return "?" + p.toString();
};

// Public Functions

export const navFromUrl = function () {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (!r) {
		window.location.replace(window.location.origin);
		currentPath.set("/");
		return;
	}

	let p: any;

	if (r.hasParam) {
		const re = /.*\/([^\/]+)\/?$/;
		let match = pathName.match(re);
		if (!match) {
			window.location.replace(window.location.origin);
			return;
		}
		p = { id: match[1] };
	}
	else {
		p = paramStringToObj(window.location.search);
	}

	currentPath.set(pathName);
	currentParams.set(p);
	document.title = `Botanica - ${r.title}`;
};

export const paramsFromUrl = () => {
	const p = paramStringToObj(window.location.search);
	currentParams.set(p);
	return p;
};

export const navTo = function (e: MouseEvent | null, pathName: string, params?: any) {
	e && e.preventDefault();
	let url = window.location.origin + pathName;

	let r = findRoute(get(routes), pathName);
	if (!r) {
		window.location.replace(window.location.origin);
		currentPath.set("/");
		return;
	}

	if (r.hasParam) {
		const re = /.*\/([^\/]+)\/?$/;
		let match = pathName.match(re);
		if (!match) {
			window.location.replace(window.location.origin);
			return;
		}
		params = { id: match[1] };
		currentParams.set(params);
	}
	else {
		if (params) {
			url += objToParamString(params);
			currentParams.set(params);
		}
		else {
			currentParams.set({});
		}
	}

	currentPath.set(pathName);
	document.title = `Botanica - ${r.title}`;

	window.history.pushState({}, pathName, url);
};

// Back Button

window.onpopstate = () => {
	let pathName = window.location.pathname;
	let r = findRoute(get(routes), pathName);

	if (r) {
		currentPath.set(pathName);
	} else {
		window.location.replace(window.location.origin);
	}
};
