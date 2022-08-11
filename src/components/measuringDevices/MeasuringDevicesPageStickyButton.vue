<template>
  <div
    class="fixed-bottom text-center text-weight-bold text-orange-14"
    v-if="storeMeasuringDevices.searchText"
  >
    Finded: {{ storeMeasuringDevices.searchedCount }} records
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
        label="Measuring device"
        @click="onAddNewMeasuringDevice"
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
        @click="onFilterMeasuringDevice"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMeasuringDevicesStore } from "stores/measuringDevices";
import MeasuringDeviceModel from "src/models/MeasuringDevice/MeasuringDeviceModel";
import * as xlsx from "xlsx";

export default {
  name: "MeasuringDevicesPageStickyButton",

  setup() {
    const $q = useQuasar();
    const storeMeasuringDevices = useMeasuringDevicesStore();

    /**
     *
     */
    const onAddNewMeasuringDevice = () => {
      storeMeasuringDevices.isShowEditDialog = true;
      storeMeasuringDevices.curEditDevice = new MeasuringDeviceModel();
      storeMeasuringDevices.curEditDeviceTypeModelValue = null;
      storeMeasuringDevices.curEditDeviceTypeOptions =
        storeMeasuringDevices.deviceTypes.slice(); // return copy array
    };

    /**
     *
     */
    const onImportFromExcel = () => {
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

            if (!workbook.Sheets.hasOwnProperty("СИТ"))
              throw "В файле не найден рабочий лист 'СИТ'";

            let json = xlsx.utils.sheet_to_json(workbook.Sheets["СИТ"], {
              raw: false,
              dateNF: "dd-mm-yyyy",
              defval: "",
            });

            json.forEach((row) => {
              if (!row.hasOwnProperty("Тип устройства"))
                throw "В файле не найдена колонка 'Тип устройства'";
              if (!row.hasOwnProperty("Модель"))
                throw "В файле не найдена колонка 'Модель'";
              if (!row.hasOwnProperty("Серийный номер"))
                throw "В файле не найдена колонка 'Серийный номер'";
              if (!row.hasOwnProperty("Дата след. проверки"))
                throw "В файле не найдена колонка 'Дата след. проверки'";

              storeMeasuringDevices.saveDevice({
                device: new MeasuringDeviceModel({
                  fkDeviceTypeId: storeMeasuringDevices.getDeviceTypeByName(
                    row["Тип устройства"]
                  ).id,
                  model: row["Модель"],
                  serialNumber: row["Серийный номер"],
                  dateCheckNext: row["Дата след. проверки"].replaceAll(
                    "-",
                    "."
                  ),
                }),
                okFunc: () => {
                  $q.notify({
                    color: "green-4",
                    textColor: "white",
                    position: "top",
                    icon: "cloud_done",
                    message: "Msp has been added",
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
    const onExportToExcel = () => {
      let data_export = [];
      storeMeasuringDevices.devices.forEach((device) => {
        data_export.push({
          "Тип устройства": storeMeasuringDevices.getDeviceTypeById(
            device.fkDeviceTypeId
          ).name,
          Модель: device.model,
          "Серийный номер": device.serialNumber,
          "Дата след. проверки": device.dateCheckNext,
        });
      });

      let workbook = xlsx.utils.book_new();
      let worksheet = xlsx.utils.json_to_sheet(data_export);
      xlsx.utils.book_append_sheet(workbook, worksheet, "СИТ");

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
      anchor.download = "СИТ список.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    };

    /**
     *
     */
    const onFilterMeasuringDevice = () => {
      $q.dialog({
        title: "Search",
        message: "What to look for ?",
        prompt: {
          model: storeMeasuringDevices.searchText,
          type: "text",
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          storeMeasuringDevices.searchText = data;
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    };

    return {
      storeMeasuringDevices,
      onAddNewMeasuringDevice,
      onImportFromExcel,
      onExportToExcel,
      onFilterMeasuringDevice,
    };
  },
};
</script>
