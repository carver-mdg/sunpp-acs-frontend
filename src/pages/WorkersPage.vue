<template>
  <q-page class="q-pa-sm">
    <WorkerFormEdit />
    <div class="row q-gutter-sm flex-center">
      <WorkerItem
        v-for="worker in storeWorkers.workers"
        :key="worker.id"
        :worker="worker"
      />
    </div>

    <q-page-sticky position="bottom-right" :offset="[32, 18]">
      <q-fab icon="add" direction="up" color="accent">
        <q-fab-action
          color="primary"
          icon="add"
          label="add worker"
          @click="onAddNewWorker"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useWorkersStore } from "stores/workers";
import WorkerFormEdit from "src/components/workers/WorkerFormEdit.vue";
import WorkerItem from "components/workers/WorkerItem.vue";
import WorkerModel from "../models/WorkerModel";

export default {
  name: "WorkersPage",
  components: {
    WorkerFormEdit,
    WorkerItem,
  },

  setup() {
    const $q = useQuasar();
    const storeWorkers = useWorkersStore();

    storeWorkers.loadWorkers((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    const onAddNewWorker = () => {
      storeWorkers.isShowEditWorkerDialog = true;
      storeWorkers.curEditWorker = new WorkerModel();
      storeWorkers.curEditWorkerJobPositionsValue = "";
    };

    return {
      storeWorkers,
      onAddNewWorker,
    };
  },
};
</script>
