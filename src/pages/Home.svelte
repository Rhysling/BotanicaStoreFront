<svelte:options runes={true} />

<script lang="ts">
	import type { AxiosResponse } from "axios";
	import DOMPurify from "dompurify";
	import { httpClient as ax } from "../stores/httpclient-store";
	import { navTo, routeStore } from "../stores/route-store.svelte";
	import { isLoggedIn } from "../stores/user-store.js";
	import { isShowHowWlWorks } from "../stores/wishlist-store.js";
	import HomeFeaturedPlant from "../components/HomeFeaturedPlant.svelte";

	type DisplayAnnouncement = "first" | "second" | "none";

	let nextSale: ICalendar | null = $state(null);
	let displayAnnouncement: DisplayAnnouncement = $derived.by(() => {
		const tsNow = Math.floor(Date.now() / 1000);
		const tsUntil = Math.floor(new Date("2027-05-30").getTime() / 1000);
		if (tsNow > tsUntil) return "none";
		if (nextSale) return "second";
		return "first";
	});

	const dt = new Date();
	dt.setMonth(dt.getMonth() + 4);
	const nextYear = dt.getFullYear();

	$ax
		.get("/api/Calendar/GetNext")
		.then((response: AxiosResponse<ICalendar>) => (nextSale = response.data))
		.catch((err) => console.error({ err }));

	let goToShoppingList = (e: MouseEvent) => {
		e.preventDefault();
		if ($isLoggedIn) navTo(e, "/shopping-list");
		else $isShowHowWlWorks = true;
	};
</script>

{#snippet analog()}
	<img src="/assets/img/analog-header.png" alt="Analog Magazine" />
	<p class="ask">Read My Story</p>
	<p class="title">The Enigma of the Lost Ones</p>
	<p class="author">by Pamela Harlow</p>
	<p class="issue">Jan/Feb 2027 Issue</p>
	<p class="available">available December 2026</p>
{/snippet}

<div class="content">
	<div class="left">
		<div class="card-announcement">
			<p class="title">Plants are Available All Year</p>
			<p class="txt">See something you like? Email for details.</p>
			<p class="txt">Pickup in the Wallingford neighborhood of Seattle.</p>
			<p class="title">Or pick up at a Plant Sale</p>
			<p class="txt">
				Let me know ahead of time, and I can bring the plants you want – no
				obligation.
			</p>
			<p class="txt">
				<a href="mailto:pamela@polson.com?subject=Botanica Inquiry"
					>pamela@polson.com</a
				>
			</p>
		</div>
		{#if displayAnnouncement === "none"}
			<div class="card-oldfriend">
				<img src="/assets/img/bench-350x230.jpg" alt="Hello, old friend" />
				<div class="small" style="display:none;">An old friend...</div>
			</div>
		{:else}
			<div class="card-analog">
				{@render analog()}
			</div>
		{/if}
		<div class="card-special" style="display:none;">
			<div class="title" style="display:none;">
				Now Available at<br />
				Seattle Audubon
			</div>
			<div>
				<img
					src="/assets/img/botanica-logo-512x512.png"
					alt="Botanica"
					style="max-width:100%;height:auto;"
				/>
			</div>
		</div>
	</div>
	<div class="right">
		{#if routeStore.isLiveOnlineShopping}
			<div class="card-shop">
				<div class="t1">Shop Online!</div>
				<div class="t2">
					<strong>Botanica Plants</strong> are now available for pickup in the Wallingford
					neighborhood (Seattle, WA).
				</div>
				<div>
					Create your &quot;shopping list&quot; here. We will prepare your
					order, coordinate with you on any changes or adjustments, and let you
					know when it is ready for pickup.
				</div>
				<a href="/" onclick={(e) => goToShoppingList(e)}
					>Start your plant shopping list...</a
				>
			</div>
		{/if}
		<HomeFeaturedPlant />
		<div class="card-calendar">
			<div class="title">Next Plant Sale</div>
			{#if nextSale}
				{#if nextSale.isSpecial}
					<div class="special-title">* * * Special Sale * * *</div>
				{/if}
				<div
					class="item"
					class:is-special={nextSale.isSpecial === true ? true : undefined}
				>
					<div class="dates">
						<div class="date">{nextSale.beginDateFormatted}</div>
						{#if nextSale.endDate}
							<div class="date-sep">through</div>
							<div class="date">{nextSale.endDateFormatted}</div>
						{/if}
						<div class="time">{nextSale.eventTime}</div>
					</div>
					<div class="details">
						<div class="title">{nextSale.title}</div>
						<div class="description">
							{@html DOMPurify.sanitize(nextSale.description)}
						</div>
						<div class="location">{nextSale.location}</div>
					</div>
				</div>
				<a href="/" onclick={(e) => navTo(e, "/calendar")}
					>See Calendar of Upcoming Plant Sales</a
				>
			{:else}
				<div class="title">No Events Posted</div>
				<div>Please check back as {nextYear} plant sale season approaches.</div>
				<div>&nbsp;</div>
			{/if}
		</div>
		{#if displayAnnouncement !== "none"}
			<div
				class="card-analog-right"
				style="order:{displayAnnouncement === 'second' ? 3 : 1};"
			>
				{@render analog()}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;
	@use "sass:color";

	.content {
		display: flex;
		// border: 1px solid black;
		// padding: 1px;
		margin-top: 2px;
		font-size: 0.9rem;
	}

	.left,
	.right {
		display: flex;
		flex-flow: column nowrap;
	}

	.left {
		flex: 1 1 40%;

		& > div {
			margin: 0 2px 2px 0;
			padding: 0;
		}
	}

	.right {
		flex: 1 1 60%;

		& > div {
			margin: 0 0 2px 2px;
			padding: 0.3rem;
		}
	}

	.title {
		font-weight: bold;
		color: c.$main-color;
		text-align: center;
		text-wrap: balance;
		margin: 0.8rem 0.5rem 0.5rem;
	}

	.txt {
		margin: 0.5rem 1rem;
	}

	.card-announcement {
		background-color: #f6deff;
		flex: 1 1 auto;
	}

	.card-oldfriend {
		flex: 0 1 auto;

		img {
			display: block;
			max-width: 100%;
			height: auto;
			margin: 0 auto;
		}

		.small {
			font-size: 0.7rem;
			text-align: center;
			margin-top: 0.5rem;
		}
	}

	.card-analog,
	.card-analog-right {
		img {
			display: block;
			max-width: min(100%, 350px);
			height: auto;
			margin: 0 auto;
		}

		p {
			margin: 0.2rem 0 0;
			text-align: center;
			text-wrap: balance;

			&.ask {
				font-weight: bold;
			}
			&.title {
				font-size: 1.1rem;
			}
			&.author {
				font-style: italic;
			}
		}
	}

	.card-special {
		flex: 1 1 auto;
		border: 1px solid black;

		img {
			display: block;
			float: right;
			margin: 0 0 0.3rem 0.3rem;
		}
	}

	.card-shop {
		flex: 0 0 auto;
		border: 1px solid black;

		div {
			margin-bottom: 0.5rem;
		}

		.t1 {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
			width: 100%;
			margin: 0.5rem 0;
		}

		.t2 {
			color: c.$second-color;
		}

		a {
			display: block;
		}
	}

	.card-calendar {
		flex: 0 0 auto;
		border: 1px solid black;
		padding: 0.4rem;
		order: 2;

		> a {
			display: block;
		}

		.dates {
			text-align: center;
		}

		.date {
			font-size: 0.9rem;
		}

		.date-sep {
			font-size: 0.8rem;
			color: color.scale(c.$text-color, $lightness: 5%, $space: oklch);
		}

		.time {
			font-size: 0.8rem;
		}

		.title {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
			width: 100%;
			margin: 0.5rem 0;
		}

		.special-title {
			color: c.$main-color;
			font-size: 1rem;
			font-weight: bold;
			text-align: center;
			width: 100%;
			margin: 0.5rem 0;
		}

		.description {
			font-size: 0.9rem;
			margin-bottom: 0.4rem;
		}

		.location {
			font-size: 0.85rem;
			color: #8b4513;
			margin-bottom: 0.4rem;
		}
	}

	.card-analog-right {
		display: none;
	}

	@media screen and (max-width: c.$bp-small) {
		.content {
			display: block;

			.left {
				display: none;
			}

			.right {
				flex: 1 1 100%;

				& > div {
					margin: 0.2rem 0;
					padding: 0.5rem;
				}
			}
		}

		.card-analog-right {
			display: block;
			border: 1px solid black;
			padding: 0.4rem;
		}
	}
</style>
