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
        label="Add new msp"
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
        icon="search"
        label="Search"
        @click="onSearchMSP"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMspStore } from "stores/equipments/msp/msp";
import { usePositionsStore } from "stores/positions";
import MspModel from "../../../models/equipments/msp/MspModel";
import * as xlsx from "xlsx";

export default defineComponent({
  name: "MspPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storeMsp = useMspStore();
    const storePositions = usePositionsStore();

    /**
     *
     */
    let onAddNewMSP = () => {
      storeMsp.isShowEditDialog = true;
      storeMsp.curEditMsp = new MspModel();
      storeMsp.curEditMspPosModelValue = "";
      storeMsp.curEditMspPosOptions = storePositions.positions.slice(); // return copy array
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

            if (!workbook.Sheets.hasOwnProperty("МСП"))
              throw "В файле не найден рабочий лист 'МСП'";

            let json = xlsx.utils.sheet_to_json(workbook.Sheets["МСП"], {
              raw: false,
              dateNF: "dd-mm-yyyy",
            });

            json.forEach((row) => {
              if (!row.hasOwnProperty("Номер"))
                throw "В файле не найдена колонка 'Номер'";
              if (!row.hasOwnProperty("Год"))
                throw "В файле не найдена колонка 'Год'";
              if (!row.hasOwnProperty("Позиция"))
                throw "В файле не найдена колонка 'Позиция'";

              storeMsp.saveMsp({
                msp: new MspModel({
                  serialNumber: row["Номер"],
                  yearManufacture: row["Год"],
                  fkPosInstalledId: storePositions.getIdByPosition(
                    row["Позиция"]
                  )?.id,
                }),
                okFunc: () => {
                  $q.notify({
                    color: "green-4",
                    textColor: "white",
                    position: "top",
                    icon: "cloud_done",
                    message: "Msp has been added",
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
      storeMsp.msp_s.forEach((msp) => {
        data_export.push({
          Номер: msp?.serialNumber,
          Год: msp.yearManufacture,
          Позиция: storePositions.getPositionById(msp?.fkPosInstalledId)?.pos,
        });
      });

      let workbook = xlsx.utils.book_new();
      let worksheet = xlsx.utils.json_to_sheet(data_export);
      workbook.SheetNames.push("МСП");
      workbook.Sheets["МСП"] = worksheet;

      let xlsbin = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "binary",
      });

      let buffer = new ArrayBuffer(xlsbin.length);
      let array = new Uint8Array(buffer);
      for (let i = 0; i < xlsbin.length; i++) {
        array[i] = xlsbin.charCodeAt(i) & 0xff;
      }
      let xlsblob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      let url = window.URL.createObjectURL(xlsblob);
      let anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "МСП список.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    };

    /**
     *
     */
    let onSearchMSP = () => {
      $q.dialog({
        title: "Search",
        message: "What to look for ?",
        prompt: {
          model: storeMsp.searchText,
          type: "text", // optional
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          storeMsp.searchText = data;
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    };

    return {
      storeMsp,
      onAddNewMSP,
      onImportFromExcel,
      onExportToExcel,
      onSearchMSP,
    };
  },
});
</script>
