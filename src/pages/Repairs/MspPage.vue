<template>
  <q-page padding>
    <q-form greedy ref="refFormHistoryRepair">
      <q-dialog v-model="isShowWndHistoryRepair" persistent>
        <q-card class="q-px-sm q-pb-md">
          <q-card-section>
            <div class="text-h6" v-if="isHistoryRepairEdit">Edit Position</div>
            <div class="text-h6" v-if="isHistoryRepairAdd">Add Position</div>
          </q-card-section>

          <div class="q-gutter-md">
            <q-select
              outlined
              clearable
              v-model="history_repairs_form.fk_type_repair_id"
              :options="type_repairs"
              option-value="id"
              :option-label="
                (item) => (item === null ? 'Null value' : `${item?.title}`)
              "
              emit-value
              map-options
              label="type_repairs"
            />

            <q-select
              outlined
              clearable
              v-model="history_repairs_form.fk_msp_id"
              :options="equipments"
              option-value="id"
              :option-label="
                (item) =>
                  item === null
                    ? 'Null value'
                    : `${item?.serial_number}/${item?.year_manufacture}`
              "
              emit-value
              map-options
              label="equipments"
            />

            <q-select
              outlined
              clearable
              v-model="history_repairs_form.fk_pos_removed_id"
              :options="positions"
              option-value="id"
              :option-label="
                (item) => (item === null ? 'Null value' : `${item?.pos}`)
              "
              emit-value
              map-options
              label="positions removed"
            />

            <q-select
              outlined
              clearable
              v-model="history_repairs_form.fk_pos_installed_id"
              :options="positions"
              option-value="id"
              :option-label="
                (item) => (item === null ? 'Null value' : `${item?.pos}`)
              "
              emit-value
              map-options
              label="positions installed"
            />

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.ro_8_7"
              label="ro_8_7"
            />

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.ro_8_9"
              label="ro_8_9"
            />

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.voltage"
              label="voltage"
            />

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.current"
              label="current"
            />

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.power"
              label="power"
            />

            <!-- NOTE append date -->

            <q-input
              outlined
              clearable
              v-model="history_repairs_form.desc"
              label="desc"
              type="textarea"
            />

            <q-select
              outlined
              clearable
              multiple
              use-chips
              stack-label
              v-model="history_repairs_form.fk_workers"
              :options="workers"
              option-value="id"
              :option-label="
                (item) =>
                  item === null
                    ? 'Null value'
                    : `${item?.nameSecond} ${item?.nameFirst} ${item?.nameMiddle}`
              "
              emit-value
              map-options
              label="fk_workers"
            />

            <q-item dense>
              <span class="text-weight-bold text-red">*</span>
              Indicates required fields
            </q-item>
          </div>

          <q-card-actions align="right">
            <q-btn
              label="Remove"
              color="negative"
              v-close-popup
              v-if="isHistoryRepairEdit"
              @click="onRemovePosition"
            />
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn
              label="Update"
              class="bg-warning"
              v-if="isHistoryRepairEdit"
              @click="onUpdatePosition"
            />
            <q-btn
              label="Add"
              class="bg-warning"
              v-if="isHistoryRepairAdd"
              @click="onAddPosition"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-form>

    <div>
      <q-table
        title="История ремонтов МСП"
        :rows="rows"
        :columns="columns"
        row-key="name"
        separator="cell"
        :filter="filter"
        :rows-per-page-options="[0]"
        grid
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab icon="add" direction="up" color="accent">
        <q-fab-action
          color="primary"
          icon="add"
          @click="onAddItem"
          label="add item"
        />
      </q-fab>
    </q-page-sticky>

    <q-page-scroller
      position="bottom-left"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { ref, onMounted, onBeforeUpdate } from "vue";

export default {
  name: "PageName",

  setup() {
    const $q = useQuasar();

    const columns = [
      {
        name: "fk_type_repair_id",
        required: true,
        label: "type_repair",
        align: "left",
        field: (row) => row.fk_type_repair_id,
        format: (val) => {
          let type_repair = type_repairs.value.find((obj) => {
            return obj.id === val;
          });

          return `${type_repair?.title ?? "-"}`;
        },
        sortable: true,
      },
      {
        name: "fk_msp_id",
        required: true,
        label: "msp",
        align: "left",
        field: (row) => row.fk_msp_id,
        format: (val) => {
          let equip = equipments.value.find((obj) => {
            return obj.id === val;
          });

          return `МСП (${equip?.serial_number ?? "-"}/${
            equip?.year_manufacture ?? "-"
          })`;
        },
        sortable: true,
      },
      {
        name: "fk_pos_removed_id",
        required: true,
        label: "Pos removed",
        align: "left",
        field: (row) => row.fk_pos_removed_id,
        format: (val) => {
          let pos = positions.value.find((obj) => {
            return obj.id === val;
          });

          return `${pos?.pos ?? "-"}`;
        },
        sortable: true,
      },
      {
        name: "fk_pos_installed_id",
        required: true,
        label: "Pos installed",
        align: "left",
        field: (row) => row.fk_pos_installed_id,
        format: (val) => {
          let pos = positions.value.find((obj) => {
            return obj.id === val;
          });

          return `${pos?.pos ?? "-"}`;
        },
        sortable: true,
      },
      {
        name: "ro_8_7",
        required: true,
        label: "ro_8_7",
        align: "left",
        field: (row) => row.ro_8_7,
        format: (val) => `${val ?? "-"} Ом`,
        sortable: true,
      },
      {
        name: "ro_8_9",
        required: true,
        label: "ro_8_9",
        align: "left",
        field: (row) => row.ro_8_9,
        format: (val) => `${val ?? "-"} Ом`,
        sortable: true,
      },
      {
        name: "voltage",
        required: true,
        label: "voltage",
        align: "left",
        field: (row) => row.voltage,
        format: (val) => `${val ?? "-"} В`,
        sortable: true,
      },
      {
        name: "current",
        required: true,
        label: "current",
        align: "left",
        field: (row) => row.current,
        format: (val) => `${val ?? "-"} мА`,
        sortable: true,
      },
      {
        name: "power",
        required: true,
        label: "power",
        align: "left",
        field: (row) => row.power,
        format: (val) => `${val ?? "-"} ВА`,
        sortable: true,
      },
      {
        name: "date_repair",
        required: true,
        label: "date_repair",
        align: "left",
        field: (row) => row.date_repair,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "desc",
        required: true,
        label: "desc",
        align: "left",
        field: (row) => row.desc,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "fk_workers",
        required: true,
        label: "fk_workers",
        align: "left",
        field: (row) => row.fk_workers,
        format: (val) => {
          let workers_print = "";
          val.map((worker_id) => {
            let worker = workers.value.find((obj) => {
              return obj.id === worker_id;
            });

            workers_print += `${worker?.nameSecond ?? "-"} ${
              worker?.nameFirst ?? "-"
            } ${worker?.nameMiddle ?? "-"}; `;
          });
          return workers_print;
        },
        sortable: true,
      },
    ];

    let refFormHistoryRepair = ref(null);
    let isShowWndHistoryRepair = ref(false);
    let isHistoryRepairEdit = ref(false);
    let isHistoryRepairAdd = ref(false);

    let history_repairs_selected_idx = 0;
    let history_repairs_form = ref(Object.assign({}, null));
    let workers = ref([]);
    let positions = ref([]);
    let equipments = ref([]);
    let type_repairs = ref([]);
    let history_repairs = ref([]);

    async function loadWorkers() {
      api
        .get("api/v1/workers")
        .then((response) => {
          workers.value = response.data;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    async function loadPositions() {
      api
        .get("api/v1/positions")
        .then((response) => {
          positions.value = response.data;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    async function loadEquipmentsMSP() {
      api
        .get("api/v1/equipments/msp")
        .then((response) => {
          equipments.value = response.data;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    async function loadTypeRepairs() {
      api
        .get("api/v1/repairs/msp/type_repairs")
        .then((response) => {
          type_repairs.value = response.data;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    async function loadHistoryRepairMSP() {
      await loadWorkers();
      await loadPositions();
      await loadEquipmentsMSP();
      await loadTypeRepairs();

      api
        .get("api/v1/repairs/msp")
        .then((response) => {
          history_repairs.value = response.data;
          history_repairs.value["fk_workers"] = [1, 2, 3];
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    loadHistoryRepairMSP();

    /**
     *
     */
    function onRowClick(e, row) {
      isShowWndHistoryRepair.value = true;
      isHistoryRepairEdit.value = true;
      isHistoryRepairAdd.value = false;

      history_repairs.value.findIndex((obj, idx) => {
        if (obj.id === row.id) {
          //   let manager = workers.value.find((worker) => {
          //     return worker.id === obj.fk_manager_id;
          //   });

          history_repairs_form.value = Object.assign(
            {
              //   __manager: ref(manager),
            },
            obj
          );

          history_repairs_selected_idx = idx;
        }
      });
    } // /onRowClick

    /**
     *
     */
    async function onAddPosition() {
      let result_validate = await refFormHistoryRepair.value.validate();
      if (!result_validate) return;
      isShowWndHistoryRepair.value = false;

      history_repairs_form.value["fk_manager_id"] =
        history_repairs_form.value["__manager"];

      api
        .post("api/v1/positions", history_repairs_form.value)
        .then((response) => {
          positions.value.push(response.data);
          history_repairs_form.value = Object.assign({}, null);

          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Position has been saved",
          });
        })
        .catch((err) => {
          let msg_err = "";
          if (err.response.status == 409)
            msg_err = `Позиция (${history_repairs_form.value.pos}/${history_repairs_form.value.unit_num}) уже существует`;
          else msg_err = `Failed to save to server: ${err.message}`;

          $q.notify({
            color: "negative",
            position: "top",
            message: msg_err,
            icon: "report_problem",
            progress: true,
          });
        });
    } // /onAddPosition

    /**
     *
     */
    async function onUpdatePosition() {
      let result_validate = await refFormHistoryRepair.value.validate();
      if (!result_validate) return;
      isShowWndHistoryRepair.value = false;

      // if the value has not been changed first time,
      // in this case q-select return the object  and not value
      if (typeof history_repairs_form.value["__manager"] !== "object")
        history_repairs_form.value["fk_manager_id"] =
          history_repairs_form.value["__manager"];

      api
        .put(
          `api/v1/positions/${history_repairs_form.value.id}`,
          history_repairs_form.value
        )
        .then((response) => {
          positions.value[history_repairs_selected_idx] =
            history_repairs_form.value;

          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Position has been updated",
          });
        })
        .catch((err) => {
          let msg_err = "";
          if (err.response.status == 409)
            msg_err = `Позиция (${history_repairs_form.value.pos}/${history_repairs_form.value.unit_num}) уже существует`;
          else msg_err = `Failed to save to server: ${err.message}`;

          $q.notify({
            color: "negative",
            position: "top",
            message: msg_err,
            icon: "report_problem",
            progress: true,
          });
        });
    } // /onUpdatePosition

    /**
     *
     */
    function onRemovePosition() {
      $q.dialog({
        title: "Removing",
        message: "Remove item ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          api
            .delete(`api/v1/positions/${history_repairs_form.value.id}`)
            .then((response) => {
              positions.value.splice(history_repairs_selected_idx, 1);

              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Position has been removed",
              });
            })
            .catch((err) => {
              $q.notify({
                color: "negative",
                position: "top",
                message: `Failed to remove from server: ${err.message}`,
                icon: "report_problem",
                progress: true,
              });
            });
        })
        .onCancel(() => {});
    } // /onRemovePosition

    /**
     *
     */
    function onAddItem() {
      isShowWndHistoryRepair.value = true;
      isHistoryRepairEdit.value = false;
      isHistoryRepairAdd.value = true;
      history_repairs_form.value = Object.assign(
        { __manager: ref(null) },
        null
      );
    } // /onAddItem

    return {
      filter: ref(""),
      columns: columns,
      rows: history_repairs,
      onRowClick,
      onUpdatePosition,
      onRemovePosition,
      onAddPosition,
      onAddItem,
      isHistoryRepairAdd,
      isHistoryRepairEdit,
      isShowWndHistoryRepair,
      history_repairs_form,
      //   manager,
      workers,
      positions,
      equipments,
      type_repairs,

      refFormHistoryRepair,
    };
  },
};
</script>

<style>
input[type="number"] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
