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
  @import "../styles/_custom-variables.scss";

  .user-bar {
    margin: 0;
    padding: 0.25rem 1rem;
    color: $second-color;
    font-size: 0.75rem;
    background-color: $beige-lighter;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }


</style>