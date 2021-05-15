<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../stores/httpclient-store";

  let calList: ICalendar[] = [];

  $ax.get("/api/Calendar/GetAllFuture")
    .then((response: AxiosResponse<ICalendar[]>) => calList = response.data)
    .catch((err) => console.log({err}));

</script>

<div>
  {#each calList as c}
    {#if c.isSpecial}
    <div class="special-title">* * * Special Sale * * *</div>
    {/if}
    <div class="item" class:is-special={c.isSpecial === true ? true : undefined}>
      <div class="dates">
        <div class="date">{c.beginDateFormatted}</div>
        {#if c.endDate}
        <div class="date-sep">through</div>
        <div class="date">{c.endDateFormatted}</div>
        {/if}
        <div class="time">{c.eventTime}</div>
      </div>
      <div class="details">
        <div class="title">{c.title}</div>
        <div class="description">{c.description}</div>
        <div class="location">{c.location}</div>
      </div>
    </div>
  {:else}
    No listings.
  {/each}
</div>

<style lang="scss">
  @import "../styles/_custom-variables.scss";

  .item {
    display: flex;
    margin: 0.4rem 3vw 0;
    border: 1px solid black;

    @media screen and (max-width: $bp-small) {
      margin: 0.4rem 0 0;
    }
  }

  .dates {
    flex: 0 1 40%;
    padding: 0.4rem;

    > div {
      margin-top: 0.2rem;
    }

    .date {
      font-size: 0.9rem;
    }

    .date-sep {
      font-size: 0.8rem;
      padding-left: 2rem;
      color: lighten($text-color, 5%);
    }

    .time {
      font-size: 0.8rem;
    }
  }

  .details {
    flex: 0 1 60%;
    padding: 0.4rem 0.4rem 0.4rem 0;

    > div {
      margin-top: 0.2rem;
    }

    .title {
      font-weight: bold;
    }

    .description {
      font-size: 0.9rem;
    }

    .location {
      font-size: 0.85rem;
      color: #8B4513;
    }
  }

  .special-title {
    font-weight: bold;
    font-style: italic;
    width: 100%;
    text-align: center;
    margin-top: 0.6rem;
    color: $main-color;
  }

  .is-special {
    background-color: #eeffee;
  }

</style>