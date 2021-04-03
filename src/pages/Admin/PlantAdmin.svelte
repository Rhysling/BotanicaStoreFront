<script lang="ts">
  // import type { AxiosResponse } from "axios";
  import { listedPlants } from "../../stores/listedplants-store";
  
  let genus = "", species = "", count = 0;

  $: {
    count = $listedPlants.length;
    if (count) {
      genus = $listedPlants[0].genus;
      species = $listedPlants[0].species;
    }
  }

</script>

<h1>Claims:</h1>
<p>Listed plant count: {count}</p>
<p>Genus: {genus}, Species: {species}</p>