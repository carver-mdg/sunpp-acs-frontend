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

    <WorkersPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useWorkersStore } from "stores/workers";
import WorkerFormEdit from "src/components/workers/WorkerFormEdit.vue";
import WorkerItem from "components/workers/WorkerItem.vue";
import WorkersPageStickyButton from "components/workers/WorkersPageStickyButton.vue";

export default {
  name: "WorkersPage",
  components: {
    WorkerFormEdit,
    WorkerItem,
    WorkersPageStickyButton,
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

    return {
      storeWorkers,
    };
  },
};
</script>
