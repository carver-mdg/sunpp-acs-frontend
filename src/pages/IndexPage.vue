<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />

    <q-file
      v-model="file_excel"
      label="Pick one file"
      filled
      style="max-width: 300px"
      @update:model-value="onPickFile"
    />

    <SimpleGallery :galleryID="galleryID" :images="images" />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import SimpleGallery from "src/components/SimpleGallery.vue";
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

    return {
      file_excel: ref(null),
      galleryID: ref("id111"),
      images: ref([
        {
          largeURL:
            "1.svg",
            thumbnailURL: "1.svg",
          width: 640,
          height: 480,
          alt: "img 1",
        },
      ]),
      onPickFile,
    };
  },
});
</script>
