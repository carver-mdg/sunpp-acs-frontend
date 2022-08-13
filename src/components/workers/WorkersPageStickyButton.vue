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
        @click="onClickFabActAddNewWorker"
      />
      <q-fab-action
        disable
        color="primary"
        icon="file_download"
        label="Import from excel"
        @click="onClickFabActImportFromExcel"
      />
      <q-fab-action
        disable
        color="primary"
        icon="file_upload"
        label="Export to excel"
        @click="onClickFabActExportToExcel"
      />
      <q-fab-action
        disable
        color="primary"
        icon="filter_alt"
        label="Filter"
        @click="onClickFabActFilterWorkers"
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
    const onClickFabActAddNewWorker = () => {
      storeWorkers.isShowEditWorkerDialog = true;
      storeWorkers.curEditWorker = new WorkerModel();
      storeWorkers.curEditWorkerJobPositionsValue = null;
    };

    /**
     *
     */
    const onClickFabActImportFromExcel = () => {};

    /**
     *
     */
    const onClickFabActExportToExcel = () => {};

    /**
     *
     */
    const onClickFabActFilterWorkers = () => {};

    return {
      storeWorkers,
      onClickFabActAddNewWorker,
      onClickFabActImportFromExcel,
      onClickFabActExportToExcel,
      onClickFabActFilterWorkers,
    };
  },
});
</script>
