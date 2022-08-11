<template>
  <q-page-sticky position="bottom-right" :offset="[32, 18]">
    <q-fab
      icon="keyboard_arrow_up"
      label="Actions"
      direction="up"
      color="accent"
    >
      <q-fab-action
        color="primary"
        icon="add"
        label="Add new worker"
        @click="onAddNewWorker"
      />
      <q-fab-action
        disable
        color="primary"
        icon="file_download"
        label="Import from excel"
        @click="onImportFromExcel"
      />
      <q-fab-action
        disable
        color="primary"
        icon="file_upload"
        label="Export to excel"
        @click="onExportToExcel"
      />
      <q-fab-action
        disable
        color="primary"
        icon="filter_alt"
        label="Filter"
        @click="onFilterWorkers"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useWorkersStore } from "stores/workers";
import WorkerModel from "src/models/workers/WorkerModel";
import * as xlsx from "xlsx";

export default defineComponent({
  name: "WorkersPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storeWorkers = useWorkersStore();

    /**
     *
     */
    const onAddNewWorker = () => {
      storeWorkers.isShowEditWorkerDialog = true;
      storeWorkers.curEditWorker = new WorkerModel();
      storeWorkers.curEditWorkerJobPositionsValue = null;
    };

    /**
     *
     */
    const onImportFromExcel = () => {};

    /**
     *
     */
    const onExportToExcel = () => {};

    /**
     *
     */
    const onFilterWorkers = () => {};

    return {
      storeWorkers,
      onAddNewWorker,
      onImportFromExcel,
      onExportToExcel,
      onFilterWorkers,
    };
  },
});
</script>
