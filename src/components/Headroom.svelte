<script>
  import { createEventDispatcher } from "svelte";

  export let duration = "300ms";
  export let offset = 0;
  export let tolerance = 0;

  let headerClass = "pin";
  let lastHeaderClass = "pin";
  let y = 0;
  let lastY = 0;

  const dispatch = createEventDispatcher();

  function deriveClass(y = 0, scrolled = 0) {
    if (y < offset) return "pin";
    if (!scrolled || Math.abs(scrolled) < tolerance) return headerClass;
    const dir = scrolled < 0 ? "down" : "up";
    if (dir === "up") return "pin";
    if (dir === "down") return "unpin";
    return headerClass;
  }

  function updateClass(y = 0) {
    const scrolledPxs = lastY - y;
    const result = deriveClass(y, scrolledPxs);
    lastY = y;
    return result;
  }

  function action(node) {
    node.style.transitionDuration = duration;
  }

  $: {
    headerClass = updateClass(y);
    if (headerClass !== lastHeaderClass) {
      dispatch(headerClass);
    }
    lastHeaderClass = headerClass;
  }
</script>

<style>
  div {
    position: sticky;
    width: 100%;
    top: 0;
    transition: transform 300ms linear;
    z-index: 10;
  }
  .pin {
    transform: translateY(0%);
  }
  .unpin {
    transform: translateY(-100%);
  }
</style>

<svelte:window bind:scrollY={y} />
<div use:action class={headerClass}>
  <slot />
</div>
