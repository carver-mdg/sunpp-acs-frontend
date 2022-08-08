<template>
  <q-page class="q-pa-sm">
    <MspFormEdit />
    <MspFormRepairsList />
    <MspFormRepairEdit />

    <div class="row q-gutter-sm flex-center">
      <MspItem v-for="msp in storeMsp.searchMsp(storeMsp.searchText)" :key="msp.id" :msp="msp" />
    </div>

    <MspPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useMspStore } from "stores/equipments/msp/msp";
import { useMspRepairsStore } from "stores/equipments/msp/mspRepairs";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import MspPageStickyButton from "src/components/equipments/msp/MspPageStickyButton.vue";
import MspFormEdit from "src/components/equipments/msp/MspFormEdit.vue";
import MspFormRepairsList from "src/components/equipments/msp/MspFormRepairsList.vue";
import MspFormRepairEdit from "src/components/equipments/msp/MspFormRepairEdit.vue";
import MspItem from "src/components/equipments/msp/MspItem.vue";


export default {
  name: "PageName",
  components: {
    MspPageStickyButton,
    MspFormEdit,
    MspFormRepairsList,
    MspFormRepairEdit,
    MspItem,
  },

  setup() {
    const $q = useQuasar();
    const storeMsp = useMspStore();
    const storePositions = usePositionsStore();
    const storeMspRepairs = useMspRepairsStore();
    const storeWorkers = useWorkersStore();

    storeMsp.loadMsp_s((err) => {
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

    storeMspRepairs.loadTypeRepairs((err) => {
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
      storeMsp,
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
