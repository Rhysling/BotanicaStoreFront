<script>
  import { text } from "svelte/internal";

  let resetUser = () => {
    return {
      id: "",
      name: "",
      imageUrl: "", 
      email: "",
      id_token: "",
      apiKey: null,
      isAdmin: false 
    };
  };

  let user = resetUser();
  let isLoggedIn = false;
  let isShowModal = false;

  window.onSuccess = (googleUser) => {
    let profile = googleUser.getBasicProfile();
    user.id = profile.getId();
    user.name = profile.getName();
    user.imageUrl = profile.getImageUrl();
    user.email = profile.getEmail();
    user.id_token = googleUser.getAuthResponse().id_token;

    console.log(user);

    isLoggedIn = true;
    isShowModal = false;
  };

  window.onFailure = (error) => {
    console.log(error);
  };

  // window.onLoadCallback = () => {
    /* isLoggedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    if (isLoggedIn) {  
      // Handle login
      alert("User is logged in.");
    }
    else {
      alert("User not logged in.");
    } */
  // }

  window.renderButton = () => {
    gapi.signin2.render('g-signin', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  };

  let showModal = (val) => {
    isShowModal = val;
  };

  let signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      // User is now signed out
      isLoggedIn = false;
      user = resetUser();
    });
  };


  let email = "";
  let isValidEmail = null; // true / false
  let emailValidationMessage = "";

  let validateEmail = function() {
    emailValidationMessage = "";
    email = email.trim();

    if (email == "") {
      emailValidationMessage = "Email required.";
      isValidEmail = false;
      return;
    }

    isValidEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email);

    if (!isValidEmail)
      emailValidationMessage = "Email address doesn't look right.";
  };

  let resetEmail = function() {
    email = "";
    isValidEmail = null;
    emailValidationMessage = "";
  };

  let submitEmail = function() {
    validateEmail();

    if (!isValidEmail) return;

    user.email = email;
    isLoggedIn = true;
    isShowModal = false;
    showModal(false);
    resetEmail();

    console.log(user);
  }

</script>

<svelte:head>
  <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
</svelte:head>

<div class="user-bar">
  {#if isLoggedIn}
    {user.name || user.email} <a href="/" on:click|preventDefault={signOut}>Sign out</a>
  {:else}
    <a href="/" on:click|preventDefault={() => showModal(true)}>Sign in</a>
  {/if}
</div>

<div class="modal" on:click={() => showModal(false)} style="display:{isShowModal ? "block" : "none"}">
  <div class="modal-content" on:click={(e) => e.stopPropagation()}>
    <i class="close fas fa-times" on:click={() => showModal(false)}></i>
    <div id="g-signin" class="g-signin" style="display:{isLoggedIn ? "none" : "block"}" ><div></div></div>
    <div class="or">
      ~ or ~<br>
      Provide your email address to save your plant wish list.
    </div>
    <div class="email">
      <input
        type="text"
        placeholder="Email"
        bind:value={email}
        on:blur={validateEmail} />
      <button on:click={submitEmail} disabled={isValidEmail === false}>Save</button>
    </div>
    <div class="email-error">{emailValidationMessage}</div>
  </div>
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  
  :global(.g-signin > div) {
    margin: 0 auto;
  }

  .user-bar {
    margin: 0;
    padding: 0.25rem 1rem;
    color: $second-color;
    font-size: 0.75rem;
    background-color: $beige-lighter;
    width: 100%;
    text-align: right;
  }

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

  .or {
    font-size: 1.25rem;
    font-weight: bold;
    text-align: center;
    width : 100%;
    margin-top: 1.25rem;
  }

  .email {
    text-align: center;
    width : 100%;
    margin-top: 1.25rem;

    input {
      width: 200px;
    }
  }

  .email-error {
    text-align: center;
    width : 100%;
    margin-top: 0.25rem;
    height: 1rem;
    color: red;
    font-size: 0.75rem;
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>