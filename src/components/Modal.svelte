<script>
  import { createEventDispatcher } from 'svelte';

  export let isShowModal = false;

  const dispatch = createEventDispatcher();

  function setModal(val) {
		dispatch('setmodal', { val });
  }

</script>

<div class="modal" on:click={() => setModal(false)} style="display:{isShowModal ? "block" : "none"}">
  <div class="modal-content" on:click={(e) => e.stopPropagation()}>
    <i class="close fas fa-times" on:click={() => setModal(false)}></i>
    <slot />
  </div>
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .modal {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }

  .modal-content {
    position: relative;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 40px 20px 30px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    
    &:hover,
    &:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }

</style>