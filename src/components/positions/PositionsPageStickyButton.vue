<template>
  <div
    class="fixed-bottom text-center text-weight-bold text-orange-14"
    v-if="storePositions.searchText"
  >
    Finded: {{ storePositions.searchedCount }} records
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
        label="Add new pos"
        @click="onAddNewPosition"
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
        @click="onSearchPosition"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import PositionModel from "src/models/positions/PositionModel";
import * as xlsx from "xlsx";

export default defineComponent({
  name: "PositionsPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storePositions = usePositionsStore();
    const storeWorkers = useWorkersStore();

    /**
     *
     */
    let onAddNewPosition = () => {
      storePositions.isShowEditDialog = true;
      storePositions.curEditPosition = new PositionModel();
      storePositions.curEditPositionWorkerManagerModelValue = null;
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

            if (!workbook.Sheets.hasOwnProperty("Позиции"))
              throw "В файле не найден рабочий лист 'Позиции'";

            let json = xlsx.utils.sheet_to_json(workbook.Sheets["Позиции"], {
              raw: false,
              dateNF: "dd-mm-yyyy",
              //   header: 1,
              defval: "",
              //   blankrows: true,
            });

            json.forEach((row) => {
              if (!row.hasOwnProperty("Позиция"))
                throw "В файле не найдена колонка 'Позиция'";
              if (!row.hasOwnProperty("Номер блока"))
                throw "В файле не найдена колонка 'Номер блока'";
              if (!row.hasOwnProperty("Система безопасности"))
                throw "В файле не найдена колонка 'Система безопасности'";
              if (!row.hasOwnProperty("Сборки эл.питания"))
                throw "В файле не найдена колонка 'Сборки эл.питания'";
              if (!row.hasOwnProperty("Описание короткое"))
                throw "В файле не найдена колонка 'Описание короткое'";
              if (!row.hasOwnProperty("Описание"))
                throw "В файле не найдена колонка 'Описание'";
              if (!row.hasOwnProperty("Расположение"))
                throw "В файле не найдена колонка 'Расположение'";
              if (!row.hasOwnProperty("Шкаф управления"))
                throw "В файле не найдена колонка 'Шкаф управления'";
              if (!row.hasOwnProperty("Шкаф токовый"))
                throw "В файле не найдена колонка 'Шкаф токовый'";
              if (!row.hasOwnProperty("Manager"))
                throw "В файле не найдена колонка 'Manager'";

              storePositions.savePosition({
                position: new PositionModel({
                  pos: row["Позиция"],
                  unitNum: row["Номер блока"],
                  systemSecurity: row["Система безопасности"],
                  rtzo_sher: row["Сборки эл.питания"],
                  descShort: row["Описание короткое"],
                  desc: row["Описание"],
                  zoneLocation: row["Расположение"],
                  cabinetRemoteControl: row["Шкаф управления"],
                  cabinetCurrentDistributor: row["Шкаф токовый"],
                  fkManagerId: storeWorkers.getWorkerByNameSecond(
                    row["Manager"]
                  )?.id,
                }),
                okFunc: () => {
                  $q.notify({
                    color: "green-4",
                    textColor: "white",
                    position: "top",
                    icon: "cloud_done",
                    message: "Position has been added",
                    progress: true,
                  });
                },
                errFunc: (err) => {
                  $q.notify({
                    color: "negative",
                    position: "top",
                    message: `Failed to save position to server: ${err}`,
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
      storePositions.positions.forEach((position) => {
        data_export.push({
          Позиция: position.pos,
          "Номер блока": position.unitNum,
          "Система безопасности": position.systemSecurity,
          "Сборки эл.питания": position.rtzo_sher,
          "Описание короткое": position.descShort,
          Описание: position.desc,
          Расположение: position.zoneLocation,
          "Шкаф управления": position.cabinetRemoteControl,
          "Шкаф токовый": position.cabinetCurrentDistributor,
          Manager:
            storeWorkers.getWorkerById(position.fkManagerId)?.nameSecond || "-",
        });
      });

      let workbook = xlsx.utils.book_new();
      let worksheet = xlsx.utils.json_to_sheet(data_export);
      xlsx.utils.book_append_sheet(workbook, worksheet, "Позиции");

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
      anchor.download = "Позиции регуляторов.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    };

    /**
     *
     */
    let onSearchPosition = () => {
      $q.dialog({
        title: "Search",
        message: "What to look for ?",
        prompt: {
          model: storePositions.searchText,
          type: "text",
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          storePositions.searchText = data;
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    };

    return {
      storePositions,
      onAddNewPosition,
      onImportFromExcel,
      onExportToExcel,
      onSearchPosition,
    };
  },
});
</script>
