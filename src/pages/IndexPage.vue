<template>
  <q-page>
    <q-file
      v-model="file_excel"
      label="Pick one file"
      filled
      style="max-width: 300px"
      @update:model-value="onPickFile"
    />

    <div style="max-width: 500px; overflow: scroll;">
      <SimpleGallery :galleryID="galleryID" :images="images" />
    </div>

    <div >
      <apexchart
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import SimpleGallery from "src/components/SimpleGallery.vue";
// import VueApexCharts from "vue3-apexcharts";
import { axios } from "src/boot/axios";

let XLSX = require("xlsx");

export default defineComponent({
  name: "IndexPage",
  components: {
    SimpleGallery,
  },

  setup() {
    const $q = useQuasar();
    const storePositions = usePositionsStore();

    storePositions.loadPositions((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    // console.log(storePositions.positions);

    const onPickFile = (file) => {
      let reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
          cellText: false,
          cellDates: true,
        });

        workbook.SheetNames.forEach(function (sheetName) {
          let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            raw: false,
            dateNF: "dd-mm-yyyy",
          });
          console.log(json);
        });
      };

      reader.onerror = function (ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };

    let images = ref([]);
    for (let i = 0; i < 10; i++) {
      images.value.push({
        largeURL: `https://placeimg.com/500/300/nature?t=${i}`,
        thumbnailURL: `https://placeimg.com/500/300/nature?t=${i}`,
        width: 500,
        height: 300,
        alt: `image ${i}`,
      });
    }

    let options = ref({
      chart: {
        id: "vuechart-example",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    });
    let series = ref([
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ]);

    return {
      file_excel: ref(null),
      galleryID: ref("id111"),
      images,
      options,
      series,
      onPickFile,
    };
  },
});
</script>
