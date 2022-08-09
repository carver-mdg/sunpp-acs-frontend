<template>
  <q-page class="q-pa-sm">
    <MeasuringDeviceFormEdit />

    <div class="row q-gutter-sm flex-center">
      <MeasuringDeviceItem
        v-for="measuringDevice in storeMeasuringDevices.searchDevices(storeMeasuringDevices.searchText)"
        :key="measuringDevice.id"
        :measuringDevice="measuringDevice"
      />
    </div>

    <MeasuringDevicesPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useMeasuringDevicesStore } from "stores/measuringDevices";
import MeasuringDevicesPageStickyButton from "src/components/measuringDevices/MeasuringDevicesPageStickyButton.vue";
import MeasuringDeviceFormEdit from "src/components/measuringDevices/MeasuringDeviceFormEdit.vue";
import MeasuringDeviceItem from "src/components/measuringDevices/MeasuringDeviceItem.vue";

export default {
  name: "MeasuringDevicesPage",

  components: {
    MeasuringDeviceFormEdit,
    MeasuringDeviceItem,
    MeasuringDevicesPageStickyButton,
  },

  setup() {
    const $q = useQuasar();
    const storeMeasuringDevices = useMeasuringDevicesStore();

    storeMeasuringDevices.loadDevices({
      errFunc: (err) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: `Failed to load data from server: ${err}`,
          icon: "report_problem",
          progress: true,
        });
      },
    });

    return {
      storeMeasuringDevices,
    };
  },
};
</script>
