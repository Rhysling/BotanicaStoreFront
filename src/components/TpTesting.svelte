<script lang="js">
	let foo = [1, 2, 3];

	const arrow = (e) => {
		switch(e.key) {
			case "ArrowRight":
				alert("Right Arrow");
				break;
			case "ArrowLeft":
				alert("Left Arrow");
				break;
			default:
				// noop
		}

	};

</script>

<svelte:window on:keydown={(e) => arrow(e)} />

{#each foo as item}
	<div>
		Foo says: {item}
	</div>
{/each}

<div class="moog">Bar</div>

<style lang="scss">
	.moog {
		color: aquamarine;
		font-weight: bold;
	}
</style>