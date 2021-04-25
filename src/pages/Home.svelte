<script>
  import HomeFeaturedPlant from "../components/HomeFeaturedPlant.svelte";
  import { navTo } from "../stores/route-store.js";
  
  // async function getWeather() {
	// 	gettingWx = true;
	// 	const res = await fetch("https://localhost:44370/WeatherForecast");
	// 	wx = await res.json();
	// 	console.log(wx);
	// 	gettingWx = false;
  // }
</script>

<div class="content">
	<div class="left">
		<div class="card-oldfriend">
			<img src="./assets/img/bench-350x230.jpg" alt="Hello, old friend" />
			<div class="small">An old friend...</div>
		</div>
		<div class="card-special">
			<div class="title">
				Now Available at<br />
				Seattle Audubon
			</div>
			<div>
				<img src="https://picsum.photos/100/75" alt="placeholder" />
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, fugiat, dolor pariatur, voluptate quo mollitia
				error odit cupiditate perspiciatis sequi quas nobis quae aut sit deserunt harum fuga recusandae ab.
			</div>
		</div>
	</div>
	<div class="right">
		<div class="card-shop">
			<div class="t1">Shop Online!</div>
			<div class="t2">
				<strong>Botanica Plants</strong> are now available for pickup in the Wallingford neighborhood (Seattle, WA).
			</div>
			<div>
				Create your "wish list" here. We will prepare your order, cooridnate with
				you on any changes or adjustments, and let you know when it is ready for pickup.
			</div>
			<a href="/">Start your plant wish list...</a>
		</div>
		<HomeFeaturedPlant />
		<div class="card-calendar">
			<div class="title">Next Plant Sale</div>
			<div class="t2">No Events Posted</div>
			<div>Please check back again as plant sale season approaches.</div>
			<a
				href="/"
				on:click={navTo}
				data-dest="/calendar">See Calendar of Upcoming Plant Sales</a>
		</div>
	</div>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.content {
		display: flex;
		// border: 1px solid black;
		// padding: 1px;
		margin-top: 2px;
		font-size: 0.9rem;
	}

	.left, .right {
		display: flex;
		flex-flow: column nowrap;
	}

	.left {
		flex: 1 1 40%;

		& > div {
			margin: 0 2px 2px 0;
			padding: 0.3rem;
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
		color: $main-color;
		text-align: center;
		width: 100%;
		margin: 0.5rem 0;
	}

	.card-oldfriend {
		flex: 0 0 auto;

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

	.card-special {
		flex: 1 0 auto;
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
			color: $second-color;
		}

		a {
			display: block;
		}
	}

	.card-calendar {
		flex: 0 0 auto;
		border: 1px solid black;

		div {
			margin-bottom: 0.5rem;
		}

		.t2 {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
			width: 100%;
			margin: 0.5rem 0;
		}

		a {
			display: block;
		}
	}

</style>