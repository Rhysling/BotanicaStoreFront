<script>
  import Headroom from "./Headroom.svelte"; // Thanks to "svelte-headroom"
  import Nav from "./Nav.svelte";

  //export let slug = "/";
</script>

<div class="page-head subpage">
  <img class="logo" src="./assets/img/botanica-logo-512x512.png" alt="Botanica" />
  <div class="page-title">
    <div class="botanica">Botanica</div>
    <div class="page-name">Plants Available</div>
  </div>
  <img class="logo" src="./assets/img/botanica-logo-512x512.png" alt="Botanica" />
</div>

<Headroom offset={ 110 }>
  <Nav isFooter={ false } />
</Headroom>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid red;
  }

  .logo {
    display: block;
    width: clamp(50px, 22px + 11vw, 110px);
    height: auto;
    filter: drop-shadow(1px 1px 1px #333);
  }

  .page-title {
    font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
    filter: drop-shadow(1px 1px 1px #333);

    .botanica {
      font-size: clamp(30px, 11vw - 3px, 85px);
      text-transform: uppercase;
      text-align: center;
      color: $main-color;
    }

    .page-name {
      display: none;
      text-align: center;
      margin-top: -5px;
    }
  }

  .subpage {
    .logo {
      width: clamp(40px, 10px + 11vw, 85px);
    }

    .botanica {
      font-size: 30px;
      color: $second-color;
    }

    .page-name {
      display: block;
      font-size: clamp(30px, 13vw - 50px, 45px);
      color: darken($main-color, 10%);
    }
  }

  @media screen and (max-width: $bp-small) {
    .page-head {
      display:block;

      .botanica {
        text-align: center;
      }

      .page-name {
        text-align: center;
      }
    }

    .logo {
      display: none;
    }
  }
</style>