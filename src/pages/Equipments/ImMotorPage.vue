<template>
  <q-page class="q-pa-sm">
    <ImMotorFormEdit />
    <ImMotorFormRepairsList />
    <ImMotorFormRepairEdit />

    <div class="row q-gutter-sm flex-center">
      <ImMotorItem v-for="imMotor in storeImMotor.searchImMotor(storeImMotor.searchText)" :key="imMotor.id" :imMotor="imMotor" />
    </div>

    <ImMotorPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useImMotorStore } from "stores/equipments/imMotor/imMotor";
import { useImMotorRepairsStore } from "stores/equipments/imMotor/imMotorRepairs";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import ImMotorPageStickyButton from "src/components/equipments/imMotor/ImMotorPageStickyButton.vue";
import ImMotorFormEdit from "src/components/equipments/imMotor/ImMotorFormEdit.vue";
import ImMotorFormRepairsList from "src/components/equipments/imMotor/ImMotorFormRepairsList.vue";
import ImMotorFormRepairEdit from "src/components/equipments/imMotor/ImMotorFormRepairEdit.vue";
import ImMotorItem from "src/components/equipments/imMotor/ImMotorItem.vue";


export default {
  name: "ImMotorPage",
  components: {
    ImMotorPageStickyButton,
    ImMotorFormEdit,
    ImMotorFormRepairsList,
    ImMotorFormRepairEdit,
    ImMotorItem,
  },

  setup() {
    const $q = useQuasar();
    const storeImMotor = useImMotorStore();
    const storePositions = usePositionsStore();
    const storeImMotorRepairs = useImMotorRepairsStore();
    const storeWorkers = useWorkersStore();

    storeImMotor.loadImMotor_s((err) => {
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

    storeImMotorRepairs.loadTypeRepairs((err) => {
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
      storeImMotor,
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
