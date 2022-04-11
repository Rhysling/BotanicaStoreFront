<script lang="ts">
  import type { AxiosResponse } from "axios";
  import { httpClient as ax } from "../../stores/httpclient-store";
  import { navTo } from "../../stores/route-store";
  import Swal from "sweetalert2";

  let list: IvwFlagSummary[] = [];

  const navToPlantList = (e: MouseEvent, flag: string) => {
    navTo(e, "/plant-admin", { filterFlag: flag });
  };

  const getColorCards = async (flag: string) => {
    try {
      let fileName = `ColorCards_${flag}_${(new Date()).toISOString().substring(0, 19).replace("T", "_").replace(/:/g, "")}.docx`;

      const response = await $ax({
        url: `/api/admin/ColorCard/ForFlag/${flag}`,
        method: "GET",
        responseType: "blob", // important
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    }
    catch (error) {
      console.error(error);
    }
  };

  const killFlag = async (flag: string) => {
    try {
      const result: any = await Swal.fire({
        title: `Remove flag '${flag}'<br />from all plants?'`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: "primary swal-confirm-button",
          cancelButton: "swal-confirm-button"
        },
        buttonsStyling: false
      });
      
      if (result.isConfirmed) {
        await $ax.post(`/api/admin/Plants/RemoveFlag?flag=${encodeURIComponent(flag)}`);
        list = list.filter(a => a.flag != flag);
      }
    }
    catch (error) {
      console.error(error);
    }
  };



// *** Init ***

  let init = () => {
    $ax.get("/api/admin/Plants/FlagSummaries")
    .then((response: AxiosResponse<IvwFlagSummary[]>) => {
      list = response.data;
    })
    .catch((err) => console.error({err}));

  };

  init();

</script>

<div class="table">
  <div class="title right">Flag</div>
  <div class="title right">Plants</div>
  <div class="title">Last Update</div>
  <div class="title">Goto List</div>
  <div class="title">Make Cards</div>
  <div class="title">Unflag</div>
    
  {#each list as a, i (a.flag)}
    { @const alt = (i % 2) == 0 }
    <div class="item right" class:alt>{a.flag}</div>
    <div class="item right" class:alt>{a.plantCount}</div>
    <div class="item" class:alt>{a.lastUpdateFormatted}</div>
    <div class="item" class:alt><a href="/" on:click|preventDefault={ (e) => { navToPlantList(e, a.flag || "") }}>GoTo List</a></div>
    <div class="item" class:alt><a href="/" on:click|preventDefault={() => { getColorCards(a.flag || "") }}>Make Cards</a></div>
    <div class="item" class:alt><a href="/" on:click|preventDefault={() => { killFlag(a.flag || "") }}>Kill Flag {a.flag}</a></div>
  {/each}
</div>


<style lang="scss">
  @import "../../styles/_custom-variables.scss";

  .table {
    display: grid;
    grid-template-columns: 3fr 3fr 8fr 5fr 5fr 5fr;
    align-items: stretch;
    font-size: 0.8rem;
    margin: 2rem 6rem;
    padding: 1rem 0.1rem;
  
    @media screen and (max-width: $bp-small) {
      margin: 1rem 2rem;
    }
  }

  .title {
    font-size: 0.8rem;
    font-weight: bold;
    color: $main-color;
    padding: 0.4rem;
  }

  .item {
    padding: 0.4rem;

    &.right {
      padding-right: 1rem;
    }
  }

  .alt {
    background-color: azure;
  }

  .right {
    text-align: right;
  }

</style>