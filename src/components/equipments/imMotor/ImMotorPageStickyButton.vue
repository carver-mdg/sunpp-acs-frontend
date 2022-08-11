<template>
  <div
    class="fixed-bottom text-center text-weight-bold text-orange-14"
    v-if="storeImMotor.searchText"
  >
    Finded: {{ storeImMotor.searchedCount }} records
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
        label="Add new imMotor"
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
import { useImMotorStore } from "stores/equipments/imMotor/imMotor";
import { usePositionsStore } from "stores/positions";
import ImMotorModel from "src/models/equipments/imMotor/ImMotorModel";
import * as xlsx from "xlsx";

export default defineComponent({
  name: "ImMotorPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storeImMotor = useImMotorStore();
    const storePositions = usePositionsStore();

    /**
     *
     */
    let onAddNewMSP = () => {
      storeImMotor.isShowEditDialog = true;
      storeImMotor.curEditImMotor = new ImMotorModel();
      storeImMotor.curEditImMotorPosModelValue = "";
      storeImMotor.curEditImMotorPosOptions = storePositions.positions.slice(); // return copy array
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

            if (!workbook.Sheets.hasOwnProperty("им.Мотор"))
              throw "В файле не найден рабочий лист 'им.Мотор'";

            let json = xlsx.utils.sheet_to_json(workbook.Sheets["им.Мотор"], {
              raw: false,
              dateNF: "dd-mm-yyyy",
            });

            json.forEach((row) => {
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

              storeImMotor.saveImMotor({
                imMotor: new ImMotorModel({
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
                    message: "ImMotor has been added",
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
      storeImMotor.imMotor_s.forEach((imMotor) => {
        data_export.push({
          Номер: imMotor?.serialNumber,
          Год: imMotor?.yearManufacture,
          Производитель: imMotor?.manufacturerName,
          "Номинальная мощность (КВт)": imMotor?.powerRated,
          "Номинальный ток (А)": imMotor?.currentRated,
          Позиция: storePositions.getPositionById(imMotor?.fkPosInstalledId)
            ?.pos,
        });
      });

      let workbook = xlsx.utils.book_new();
      let worksheet = xlsx.utils.json_to_sheet(data_export);
      workbook.SheetNames.push("им.Мотор");
      workbook.Sheets["им.Мотор"] = worksheet;

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
      anchor.download = "им.Мотор список.xlsx";
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
          model: storeImMotor.searchText,
          type: "text",
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          storeImMotor.searchText = data;
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    };

    return {
      storeImMotor,
      onAddNewMSP,
      onImportFromExcel,
      onExportToExcel,
      onFilterMSP,
    };
  },
});
</script>
