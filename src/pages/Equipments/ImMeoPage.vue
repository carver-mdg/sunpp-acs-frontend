<template>
  <q-page class="q-pa-sm">
    <ImMeoFormEdit />
    <ImMeoFormRepairsList />
    <ImMeoFormRepairEdit />

    <div class="row q-gutter-sm flex-center">
      <ImMeoItem v-for="imMeo in storeImMeo.searchImMeo(storeImMeo.searchText)" :key="imMeo.id" :imMeo="imMeo" />
    </div>

    <ImMeoPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useImMeoStore } from "stores/equipments/imMeo/imMeo";
import { useImMeoRepairsStore } from "stores/equipments/imMeo/imMeoRepairs";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import ImMeoPageStickyButton from "src/components/equipments/imMeo/ImMeoPageStickyButton.vue";
import ImMeoFormEdit from "src/components/equipments/imMeo/ImMeoFormEdit.vue";
import ImMeoFormRepairsList from "src/components/equipments/imMeo/ImMeoFormRepairsList.vue";
import ImMeoFormRepairEdit from "src/components/equipments/imMeo/ImMeoFormRepairEdit.vue";
import ImMeoItem from "src/components/equipments/imMeo/ImMeoItem.vue";


export default {
  name: "ImMeoPage",
  components: {
    ImMeoPageStickyButton,
    ImMeoFormEdit,
    ImMeoFormRepairsList,
    ImMeoFormRepairEdit,
    ImMeoItem,
  },

  setup() {
    const $q = useQuasar();
    const storeImMeo = useImMeoStore();
    const storePositions = usePositionsStore();
    const storeImMeoRepairs = useImMeoRepairsStore();
    const storeWorkers = useWorkersStore();

    storeImMeo.loadImMeo_s((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    storePositions.loadPositions((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    storeImMeoRepairs.loadTypeRepairs((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    storeWorkers.loadWorkers((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    return {
      storeImMeo,
    };
  },
};
</script>

<style>
input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
