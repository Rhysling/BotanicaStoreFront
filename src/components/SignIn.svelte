<script lang="ts">
  import axios from "axios";
  import Modal from "./Modal.svelte";
  import { user, isLoggedIn } from "../stores/user-store";
  
  $: isShowModal = false;
  let showModal = (val: boolean) => isShowModal = val;
  let setModal = (e: any) => isShowModal = e.detail.val;
  
  let userLogin: UserLogin;

  let isValidEmail: boolean | null = null; // null / true / false
  let emailValidationMessage = "";
  let submitErrorMessage = "";
  let isShowName = false;
  let isShowPw = false;

  let resetUser = () => {
    $user = {
      email: "",
      fullName: "",
      token: "",
      isAdmin: false 
    };
  };

  let resetUserLogin = () => {
    
    isValidEmail = null;
    emailValidationMessage = "";

    isShowName = false;
    isShowPw = false;

    userLogin = {
      email: "",
      fullName: "", 
      pw: "" 
    };
  };

  resetUserLogin();


  let signOut = () => {
    resetUser();
  };


  let validateEmail = function() {
    emailValidationMessage = "";
    userLogin.email = userLogin.email.trim();

    if (userLogin.email == "") {
      emailValidationMessage = "Email required.";
      isValidEmail = false;
      return;
    }

    isValidEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(userLogin.email);

    if (!isValidEmail)
      emailValidationMessage = "Email address doesn't look right.";

    isShowPw = userLogin.email.endsWith("polson.com");
  };

  
  let showName = () => isShowName = true;


  let signIn = function() {
    validateEmail();

    if (!isValidEmail) return;

    axios.post("http://localhost:54151/api/Login", userLogin)
    .then(function (response) {
      $user = response.data;
      resetUserLogin();
      isShowModal = false;
      let userLoginInfo = $user;
      console.log({userLoginInfo});
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  let cancel = function() {
    resetUserLogin();
    isShowModal = false;
  }

</script>

<div class="user-bar">
  {#if $isLoggedIn}
    {$user.fullName || $user.email} <a href="/" on:click|preventDefault={signOut}>Sign out</a>
  {:else}
    <a href="/" on:click|preventDefault={() => showModal(true)}>Sign in</a>
  {/if}
</div>

<Modal { isShowModal } on:setmodal={setModal}>
  <div class="title">
    Provide your email address to save your plant wish list.
  </div>
  <div class="content">
    <input
      type="text"
      class="signin"
      placeholder="Email"
      bind:value={userLogin.email}
      on:blur={validateEmail} />
    <div class="error">{emailValidationMessage}</div>

    <a href="/" on:click|preventDefault={showName} style="display:{isShowName ? "none" : "block"}">Optional: Include your name</a>
    <input
      type="text"
      class="signin"
      style="display:{isShowName ? "block" : "none"}"
      placeholder="Your Name"
      bind:value={userLogin.fullName} />

    <input
      type="password"
      class="signin"
      style="display:{isShowPw ? "block" : "none"}"
      placeholder="Password"
      bind:value={userLogin.pw} />

    <button on:click={signIn} class="primary" disabled={isValidEmail === false}>Save</button>
    <button on:click={cancel} >Cancel</button>
    <div class="error">{submitErrorMessage}</div>
  </div>
</Modal>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .user-bar {
    margin: 0;
    padding: 0.25rem 1rem;
    color: $second-color;
    font-size: 0.75rem;
    background-color: $beige-lighter;
    width: 100%;
    text-align: right;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
    width : 100%;
    margin-top: 1.25rem;
  }

  .content {
    width : 100%;
    padding-left: 35%;
    
    input {
      margin: 1rem 1rem 0 0;
      width: 200px;
    }

    a {
      display: block;
      margin: 1rem 0 0;
      font-size: 0.85rem;
    }

    button {
      display: inline-block;
      margin: 1rem 0 0;
    }
  }

  .error {
    display: inline-block;
    margin: 0;
    height: 1rem;
    color: red;
    font-size: 0.75rem;
  }

</style>