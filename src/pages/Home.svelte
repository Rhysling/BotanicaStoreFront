<script>
  // import Summary from "../components/Summary.svelte";
  import { navTo } from "../stores/route-store.js";
  
  let bar = "This is bar";

	let gettingWx = false;
	let wx = [];

	async function getWeather() {
		gettingWx = true;
		const res = await fetch("https://localhost:44370/WeatherForecast");
		wx = await res.json();
		console.log(wx);
		gettingWx = false;
  }
</script>

<div class="content">
	<div class="left">
		<div>
			Foo
		</div>
		<div>
			Foo
		</div>
		<div>
			Foo
		</div>
	</div>
	<div class="right">
		<div>
			Foo
		</div>
		<div>
			Foo
		</div>
	</div>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.content {
		display: flex;
		border: 1px solid black;
	}

	.left, .right {
		display: flex;
		flex-flow: column nowrap;
		flex: 1 1 auto;
	}

</style>