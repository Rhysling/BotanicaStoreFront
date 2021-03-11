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

<p>Home Here</p>
<p>
  <a href="/" on:click={navTo} data-dest="/how-arc-works">
    NavTo Link here
  </a>
</p>

<h1>The Title</h1>
<p>bar says: { bar }.</p>

<p>
  <button on:click={getWeather}>Get Weather</button>
</p>

<p>
	Bars-solid: <i class="fas fa-bars" style="font-size: 3rem;"></i>
</p>

<br />
<br />
<br />
<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat voluptate quia beatae. Optio nostrum aperiam totam id consequuntur, ipsam repudiandae, eveniet illum ullam voluptatibus provident, dolore nemo quis quisquam porro unde quia obcaecati minima. Aspernatur modi quas nostrum dolores inventore, ea ipsam explicabo commodi, est accusantium, reprehenderit velit id facere?
</p>

<br />
<br />
<br />
<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat voluptate quia beatae. Optio nostrum aperiam totam id consequuntur, ipsam repudiandae, eveniet illum ullam voluptatibus provident, dolore nemo quis quisquam porro unde quia obcaecati minima. Aspernatur modi quas nostrum dolores inventore, ea ipsam explicabo commodi, est accusantium, reprehenderit velit id facere?
</p>

<br />
<br />
<br />
<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat voluptate quia beatae. Optio nostrum aperiam totam id consequuntur, ipsam repudiandae, eveniet illum ullam voluptatibus provident, dolore nemo quis quisquam porro unde quia obcaecati minima. Aspernatur modi quas nostrum dolores inventore, ea ipsam explicabo commodi, est accusantium, reprehenderit velit id facere?
</p>
<br />

<br />
<br />
<br />
<br />
<br />
<br />
<br />

<p>
	Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat voluptate quia beatae. Optio nostrum aperiam totam id consequuntur, ipsam repudiandae, eveniet illum ullam voluptatibus provident, dolore nemo quis quisquam porro unde quia obcaecati minima. Aspernatur modi quas nostrum dolores inventore, ea ipsam explicabo commodi, est accusantium, reprehenderit velit id facere?
</p>

{#each wx as w, i}
<p>{ i+1 }. { w.date }</p>
{/each}

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	h1 {
		color: $main-color;
		font-size: 2rem;
		font-weight: 800;
	}

  .tile img {
    display: block;
    margin: 0 auto;
  }
</style>