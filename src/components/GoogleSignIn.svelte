<script>
  let user = {};
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
    });
  };

</script>

<svelte:head>
  <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
</svelte:head>

<div class="modal" on:click={() => showModal(false)} style="display:{isShowModal ? "block" : "none"}">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div id="g-signin" style="display:{isLoggedIn ? "none" : "block"}" />
  </div>
</div>

{#if isLoggedIn}
  {user.name} <button on:click={signOut}>Sign out</button>
{:else}
  <button on:click={() => showModal(true)}>Sign in</button>
{/if}

<style>
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
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  .close {
    color: #aaa;
    float: right;
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