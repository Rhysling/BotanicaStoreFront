<div class="content">
  <div class="left">
    <img src="./assets/img/window-woodcut.jpg" class="pic" alt="Window Woodcut">
  </div>
  <div class="right">
    <div class="title">
      Pamela Harlow
    </div>
    <div class="info">
      <div>By Email</div>
      <div><a href="mailto:pamela@polson.com?subject=Botanica Inquiry">pamela@polson.com</a></div>
    </div>
    <div class="info">
      <div>By Phone</div>
      <div>206-634-1370</div>
    </div>	
    <div class="note">
      Please be patient if I cannot respond promptly, especially during plant sale season.
    </div>
  </div>
</div>

<style lang="scss">
	@import "../styles/_custom-variables.scss";

	.content {
    display: flex;
		margin: 2rem;

  }

  .left {
    flex: 1 1 40%;
    text-align: right;
    padding-right: 1em;
  }

  .right {
    flex: 1 1 60%;
    padding-left: 1em;
  }

  .pic {
    display: inline-block;
    width: clamp(75px, 20vw, 200px);
    height: auto;
  }

  .title {
    font-family: 'Arrus-BT-Bold', 'Times New Roman', Times, serif;
    font-size: 1.1rem;
    color: $main-color;
    text-align: center;
    margin-bottom: 1rem;
  }

  .info {
    width: 100%;
    margin-bottom: 0.5em;

    div:first-child {
      display: inline-block;
      font-weight: bold;
      text-align: right;
      width: 40%;
    }

    div:last-child {
      display: inline-block;
      width: 55%;
    }
  }

  .note {
    font-size: 0.9rem;
    margin-top: 1em;
  }

  @media screen and (max-width: $bp-small) {
    .content {
      display: block;
    }

    .left {
      display: none;
    }
  }
</style>