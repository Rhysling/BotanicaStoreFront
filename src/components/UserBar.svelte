<script lang="ts">
	import ShoppingListSummary from "./ShoppingListSummary.svelte";
	import SignIn from "./SignIn.svelte";
</script>

<div class="user-bar">
	<div>
		<ShoppingListSummary />
	</div>
	<div>
		<SignIn />
	</div>
</div>

<style lang="scss">
	@use "../styles/_custom-variables.scss" as c;

	.user-bar {
		margin: 0;
		padding: 0.25rem 1rem;
		color: c.$second-color;
		font-size: 0.75rem;
		background-color: c.$beige-lighter;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;

		@media screen and (max-width: c.$bp-small) {
			padding: 0.25rem 0.5rem;
		}
	}
</style>
