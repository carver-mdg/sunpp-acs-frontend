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
        label="Add new ppr"
        @click="onClickFabActAddNewPpr"
      />
     
      <q-fab-action
        disable
        color="primary"
        icon="filter_alt"
        label="Filter"
        @click="onClickFabActFilterPpr"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePprsStore } from "stores/ppr";
import PprDateTimeModel from "src/models/repairsList/PprDateTimeModel";

export default defineComponent({
  name: "PprsPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storePpr = usePprsStore();

    /**
     *
     */
    const onClickFabActAddNewPpr = () => {
      storePpr.isShowEditDialog = true;
      storePpr.curEditPpr = new PprDateTimeModel();
      // storePpr.curEditPositionWorkerManagerModelValue = null;
    };

    /**
     *
     */
    const onClickFabActFilterPpr = () => {};

    return {
      onClickFabActAddNewPpr,
      onClickFabActFilterPpr,
    };
  },
});
</script>
