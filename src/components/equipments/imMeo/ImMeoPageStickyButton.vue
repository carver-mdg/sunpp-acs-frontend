<template>
  <div
    class="fixed-bottom text-center text-weight-bold text-orange-14"
    v-if="storeImMeo.searchText"
  >
    Finded: {{ storeImMeo.searchedCount }} records
  </div>

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
        label="Add new imMeo"
        @click="onAddNewMSP"
      />
      <q-fab-action
        color="primary"
        icon="file_download"
        label="Import from excel"
        @click="onImportFromExcel"
      />
      <q-fab-action
        color="primary"
        icon="file_upload"
        label="Export to excel"
        @click="onExportToExcel"
      />
      <q-fab-action
        color="primary"
        icon="filter_alt"
        label="Filter"
        @click="onFilterMSP"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useImMeoStore } from "stores/equipments/imMeo/imMeo";
import { usePositionsStore } from "stores/positions";
import ImMeoModel from "src/models/equipments/imMeo/ImMeoModel";
import * as xlsx from "xlsx";

export default defineComponent({
  name: "ImMeoPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storeImMeo = useImMeoStore();
    const storePositions = usePositionsStore();

    /**
     *
     */
    let onAddNewMSP = () => {
      storeImMeo.isShowEditDialog = true;
      storeImMeo.curEditImMeo = new ImMeoModel();
      storeImMeo.curEditImMeoPosModelValue = "";
      storeImMeo.curEditImMeoPosOptions = storePositions.positions.slice(); // return copy array
    };

    /**
     *
     */
    let onImportFromExcel = () => {
      let anchor = document.createElement("input");
      anchor.type = "file";
      anchor.click();

      anchor.onchange = () => {
        let reader = new FileReader();
        reader.onload = function (e) {
          try {
            var data = e.target.result;
            var workbook = xlsx.read(data, {
              type: "binary",
              cellText: false,
              cellDates: true,
            });

            if (!workbook.Sheets.hasOwnProperty("им.МЭО"))
              throw "В файле не найден рабочий лист 'им.МЭО'";

            let json = xlsx.utils.sheet_to_json(workbook.Sheets["им.МЭО"], {
              raw: false,
              dateNF: "dd-mm-yyyy",
              defval: "",
            });

            json.forEach((row) => {
              if (!row.hasOwnProperty("Модель"))
                throw "В файле не найдена колонка 'Модель'";
              if (!row.hasOwnProperty("Номер"))
                throw "В файле не найдена колонка 'Номер'";
              if (!row.hasOwnProperty("Год"))
                throw "В файле не найдена колонка 'Год'";
              if (!row.hasOwnProperty("Производитель"))
                throw "В файле не найдена колонка 'Производитель'";
              if (!row.hasOwnProperty("Номинальная мощность (КВт)"))
                throw "В файле не найдена колонка 'Номинальная мощность (КВт)'";
              if (!row.hasOwnProperty("Номинальный ток (А)"))
                throw "В файле не найдена колонка 'Номинальный ток (А)'";
              if (!row.hasOwnProperty("Позиция"))
                throw "В файле не найдена колонка 'Позиция'";

              storeImMeo.saveImMeo({
                imMeo: new ImMeoModel({
                  imMeoModel: row["Модель"],
                  serialNumber: row["Номер"],
                  yearManufacture: row["Год"].replaceAll("-", "."),
                  manufacturerName: row["Производитель"],
                  powerRated: row["Номинальная мощность (КВт)"],
                  currentRated: row["Номинальный ток (А)"],
                  fkPosInstalledId: storePositions.getPositionByPositionName(
                    row["Позиция"]
                  )?.id,
                }),
                okFunc: () => {
                  $q.notify({
                    color: "green-4",
                    textColor: "white",
                    position: "top",
                    icon: "cloud_done",
                    message: "ImMeo has been added",
                    progress: true,
                  });
                },
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
            });
          } catch (err) {
            $q.notify({
              color: "negative",
              position: "top",
              message: `${err}`,
              icon: "report_problem",
              progress: true,
            });
          }
        };

        reader.onerror = function (ex) {
          console.log(ex);
        };

        reader.readAsBinaryString(anchor.files[0]);
      };
    };

    /**
     *
     */
    let onExportToExcel = () => {
      let data_export = [];
      storeImMeo.imMeo_s.forEach((imMeo) => {
        data_export.push({
          Модель: imMeo?.imMeoModel,
          Номер: imMeo?.serialNumber,
          Год: imMeo?.yearManufacture,
          Производитель: imMeo?.manufacturerName,
          "Номинальная мощность (КВт)": imMeo?.powerRated,
          "Номинальный ток (А)": imMeo?.currentRated,
          Позиция: storePositions.getPositionById(imMeo?.fkPosInstalledId)
            ?.pos,
        });
      });

      let workbook = xlsx.utils.book_new();
      let worksheet = xlsx.utils.json_to_sheet(data_export);
      workbook.SheetNames.push("им.МЭО");
      workbook.Sheets["им.МЭО"] = worksheet;

      let xlsbin = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "binary",
      });

      let buffer = new ArrayBuffer(xlsbin.length);
      let array = new Uint8Array(buffer);
      for (let i = 0; i < xlsbin.length; i++) {
        array[i] = xlsbin.charCodeAt(i) & 0xff;
      }
      let xlsblob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let url = window.URL.createObjectURL(xlsblob);
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "им.МЭО список.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    };

    /**
     *
     */
    let onFilterMSP = () => {
      $q.dialog({
        title: "Search",
        message: "What to look for ?",
        prompt: {
          model: storeImMeo.searchText,
          type: "text",
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          storeImMeo.searchText = data;
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    };

    return {
      storeImMeo,
      onAddNewMSP,
      onImportFromExcel,
      onExportToExcel,
      onFilterMSP,
    };
  },
});
</script>
