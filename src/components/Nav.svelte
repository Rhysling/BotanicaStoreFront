<script>

  //export let isFooter = false;

</script>

<div class="nav-toggle"><i class="fas fa-bars"></i></div>
<nav>
  <a href="/">Home</a>
  <a href="/">News</a>
  <a href="/">Contact</a>
  <a href="/" class="dropdown">
    <span>Mouse over me</span>
    <div class="dropdown-content">
      <a href="/">Item One</a>
      <a href="/">Longer Item Here</a>
      <a href="/">Third Item</a>
    </div>
  </a>
  <a href="/">About</a>
</nav>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .nav-toggle {
    display: block;
    background-color: $nav-bg-color;
    padding: 0.5em;

    i {
      display: block;
      font-size: 1.2em;

      &:hover {
        cursor: pointer;
      }
    }
  }

  nav {
    display: flex;
    background-color: $nav-bg-color;

    a {
      margin: 0.5em 1em;
    }

    a:first-child {
      margin: 0.5em 1em 0.5em 0;
    }


    .dropdown {
      position: relative;
      display: block;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      padding: 0.5em 0.75em;
      z-index: 1;

      a {
        display: block;
        margin: 0;
        font-size: 0.75em;
      }
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }
  }

  @media screen and (max-width: $bp-small) {
   
  }

</style>