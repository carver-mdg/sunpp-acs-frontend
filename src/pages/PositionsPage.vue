<template>
  <q-page class="q-pa-sm">
    <PositionFormEdit />

    <div class="row q-gutter-sm flex-center">
      <PositionItem
        v-for="position in storePositions.searchPositions(storePositions.searchText)"
        :key="position.id"
        :position="position"
      />
    </div>

    <PositionsPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import PositionFormEdit from "src/components/positions/PositionFormEdit.vue";
import PositionItem from "src/components/positions/PositionItem.vue";
import PositionsPageStickyButton from "src/components/positions/PositionsPageStickyButton.vue";

export default defineComponent({
  name: "PositionsPage",
  components: {
    PositionFormEdit,
    PositionItem,
    PositionsPageStickyButton,
  },
  setup() {
    const $q = useQuasar();
    const storePositions = usePositionsStore();
    const storeWorkers = useWorkersStore();

    storePositions.loadPositions({
      errFunc: () => {
        $q.notify({
          color: "negative",
          position: "top",
          message: `Failed to load positions from server: ${err}`,
          icon: "report_problem",
          progress: true,
        });
      },
    });

    storeWorkers.loadWorkers({
      errFunc: () => {
        $q.notify({
          color: "negative",
          position: "top",
          message: `Failed to load workers from server: ${err}`,
          icon: "report_problem",
          progress: true,
        });
      },
    });

    return {
      storePositions,
    };
  },
});
</script>
