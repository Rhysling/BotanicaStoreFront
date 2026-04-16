<svelte:options runes={true} />

<script lang="ts">
	import { routeStore, navTo } from "../stores/route-store.svelte.js";

	let allRoutes: Route[] = $state([
		{ ...routeStore.routes },
		...(routeStore.routes.children?.filter((a) => !a.isHidden) || []),
	]);

	let isOpenRoot = $state(false);

	$effect(() => {
		allRoutes[0].children = [];
	});

	let setOpenRoot = (val: boolean) => {
		isOpenRoot = val;
		toggleOpenDropdown("");
	};

	let toggleOpenDropdown = (pathName: string) => {
		// let r = allRoutes.find(a => a.slug == slug);
		// if (r) r.isExpanded = !r.isExpanded;
		for (let r of allRoutes) {
			r.isExpanded = r.path == pathName ? !r.isExpanded : false;
		}
	};

	let nav = (e: MouseEvent, path: string) => {
		e.stopPropagation();
		navTo(e, path);
		setOpenRoot(false);
	};
</script>

<div class="nav-vertical" class:open={isOpenRoot ? true : undefined}>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="nav-toggle"
		role="navigation"
		onmouseenter={() => setOpenRoot(true)}
		onclick={(e) => {
			e.stopPropagation();
			setOpenRoot(!isOpenRoot);
		}}
	>
		<i class="fas fa-bars"></i>
	</div>
	<nav>
		{#each allRoutes as r}
			{#if r.children && r.children.length}
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div
					role="navigation"
					onclick={(e) => {
						e.stopPropagation();
						toggleOpenDropdown(r.path);
					}}
					class="dropdown"
					class:open={r.isExpanded ? true : undefined}
				>
					<span class="icon">{r.page}</span>
					<div class="dropdown-content">
						{#each r.children.filter((a) => !a.isHidden) as c}
							<a
								href="/"
								onclick={(e) => {
									e.preventDefault();
									nav(e, c.path);
								}}
								class:selected={c.path === routeStore.currentPath}
								>{c.navName || c.page}</a
							>
						{/each}
					</div>
				</div>
			{:else}
				<a
					href="/"
					onclick={(e) => {
						e.preventDefault();
						nav(e, r.path);
					}}
					class:selected={r.path === routeStore.currentPath}
					>{r.navName || r.page}</a
				>
			{/if}
		{/each}
	</nav>
</div>

<svelte:body on:click={() => setOpenRoot(false)} />

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;
	@use "sass:color";

	.icon::after {
		display: inline-block;
		font-style: normal;
		font-variant: normal;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		margin-left: 0.5em;
	}

	nav {
		display: flex;
		background-color: c.$nav-bg-color;

		a,
		.dropdown {
			color: c.$link-color;
			display: block;
			box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.2);
			border-radius: 5px;
			padding: 0.5em;
			margin: 0.5em;
		}

		// a:first-child {
		//   margin: 0.5em 0.5em 0.5em 0.25rem;
		// }

		a:hover,
		.dropdown:hover {
			color: c.$link-hover;
			background-color: color.scale(
				c.$nav-bg-color,
				$lightness: -10%,
				$space: oklch
			);
			cursor: pointer;
		}

		a.selected {
			color: #eee;
			box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.6);
			background-color: c.$main-color;
			cursor: default;

			&:hover {
				text-decoration: none;
			}
		}

		.dropdown {
			position: relative;
			display: block;
		}

		.icon::after {
			font-family: "Font Awesome 5 Free";
			font-weight: 900;
			content: "\f107";
		}

		.dropdown-content {
			display: none;
			position: absolute;
			background-color: c.$nav-drop-bg-color;
			min-width: 160px;
			box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
			padding: 0.5em 0.75em;
			z-index: 1;

			a {
				display: block;
				margin: 0;
				font-size: 0.85em;
			}

			a:hover {
				background-color: color.scale(
					c.$nav-drop-bg-color,
					$lightness: -10%,
					$space: oklch
				);
			}

			a.selected:hover {
				background-color: c.$main-color;
			}
		}

		// .dropdown:hover .dropdown-content {
		//   display: block;
		// }

		.dropdown.open .dropdown-content {
			display: block;
		}
	}

	.nav-toggle {
		display: none;
	}

	@media screen and (max-width: c.$bp-small) {
		.nav-toggle {
			display: block;
			background-color: c.$nav-bg-color;
			padding: 0.5em;

			i {
				display: block;
				font-size: 1.2em;

				&:hover {
					cursor: pointer;
				}
			}
		}

		.nav-vertical {
			nav {
				display: none;
				position: absolute;
				z-index: 1;
				transition: height 0.5s ease 0;

				.icon::after {
					font-family: "Font Awesome 5 Free";
					font-weight: 900;
					content: "\f105";
				}

				a {
					display: block;
					min-width: 160px;
					box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
					padding: 0.5em 0.75em;
				}

				a,
				a:first-child {
					margin: 0.5em;
				}
			}

			// &:hover nav {
			//   display: block;
			// }

			&.open nav {
				display: block;
			}
		}
	}
</style>
