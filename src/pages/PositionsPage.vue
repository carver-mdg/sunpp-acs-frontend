<template>
  <q-page padding>
    <q-form greedy ref="formPosition">
      <q-dialog v-model="isShowWndPosition" persistent>
        <q-card class="q-px-sm q-pb-md">
          <q-card-section>
            <div class="text-h6" v-if="isPositionEdit">Edit Position</div>
            <div class="text-h6" v-if="isPositionAdd">Add Position</div>
          </q-card-section>

          <div class="q-gutter-md">
            <q-input
              outlined
              clearable
              v-model="pos_form.pos"
              label="pos"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                pos
              </template>
            </q-input>

            <q-select
              outlined
              clearable
              v-model="pos_form.unit_num"
              :options="['1 ЭБ', '2 ЭБ', '3 ЭБ', '1 СВО', '2 СВО']"
              label="unit_num"
            />

            <q-select
              outlined
              clearable
              v-model="pos_form.__manager"
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
              label="manager"
            />

            <q-select
              outlined
              clearable
              v-model="pos_form.systemSecurity"
              :options="['1 СБ', '2 СБ', '3 СБ', 'СВБ', 'СНЭ']"
              label="systemSecurity"
            />

            <q-input
              outlined
              clearable
              v-model="pos_form.rtzo_sher"
              label="rtzo_sher"
              type="textarea"
            />

            <q-input
              outlined
              clearable
              v-model="pos_form.descShort"
              label="descShort"
            />

            <q-input
              outlined
              clearable
              v-model="pos_form.desc"
              label="desc"
              type="textarea"
            />

            <q-select
              outlined
              clearable
              v-model="pos_form.zoneLocation"
              :options="['машинный зал', 'зона']"
              label="zoneLocation"
            />

            <q-input
              outlined
              clearable
              v-model="pos_form.cabinetRemoteControl"
              label="cabinetRemoteControl"
            />

            <q-input
              outlined
              clearable
              v-model="pos_form.cabinetCurrentDistributor"
              label="cabinetCurrentDistributor"
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
              v-if="isPositionEdit"
              @click="onRemovePosition"
            />
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn
              label="Update"
              class="bg-warning"
              v-if="isPositionEdit"
              @click="onUpdatePosition"
            />
            <q-btn
              label="Add"
              class="bg-warning"
              v-if="isPositionAdd"
              @click="onAddPosition"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-form>

    <div>
      <q-table
        title="Позиции"
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
        name: "pos",
        required: true,
        label: "pos",
        align: "left",
        field: (row) => row.pos,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "unit_num",
        required: true,
        label: "unit_num",
        align: "left",
        field: (row) => row.unit_num,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "fk_manager_id",
        required: true,
        label: "manager",
        align: "left",
        field: (row) => row.fk_manager_id,
        format: (val) => {
          let manager = workers.value.find((obj) => {
            return obj.id === val;
          });

          return `${manager?.nameSecond ?? "-"} ${manager?.nameFirst ?? "-"} ${
            manager?.nameMiddle ?? "-"
          }`;
        },
        sortable: true,
      },
      {
        name: "systemSecurity",
        required: true,
        label: "systemSecurity",
        align: "left",
        field: (row) => row.systemSecurity,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "rtzo_sher",
        required: true,
        label: "rtzo_sher",
        align: "left",
        field: (row) => row.rtzo_sher,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "descShort",
        required: true,
        label: "descShort",
        align: "left",
        field: (row) => row.descShort,
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
        name: "zoneLocation",
        required: true,
        label: "zoneLocation",
        align: "left",
        field: (row) => row.zoneLocation,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "cabinetRemoteControl",
        required: true,
        label: "cabinetRemoteControl",
        align: "left",
        field: (row) => row.cabinetRemoteControl,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
      {
        name: "cabinetCurrentDistributor",
        required: true,
        label: "cabinetCurrentDistributor",
        align: "left",
        field: (row) => row.cabinetCurrentDistributor,
        format: (val) => `${val ?? "-"}`,
        sortable: true,
      },
    ];

    let formPosition = ref(null);
    let isShowWndPosition = ref(false);
    let isPositionEdit = ref(false);
    let isPositionAdd = ref(false);

    let positions = ref([]);
    let pos_selected_idx = 0;
    let pos_form = ref(Object.assign({}, null));
    let workers = ref([]);

    // load workers
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

    // load positions
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

    /**
     *
     */
    function onRowClick(e, row) {
      isShowWndPosition.value = true;
      isPositionEdit.value = true;
      isPositionAdd.value = false;

      positions.value.findIndex((pos, idx) => {
        if (pos.id === row.id) {
          let manager = workers.value.find((worker) => {
            return worker.id === pos.fk_manager_id;
          });

          pos_form.value = Object.assign(
            {
              __manager: ref(manager),
            },
            pos
          );

          pos_selected_idx = idx;
        }
      });
    } // /onRowClick

    /**
     *
     */
    async function onAddPosition() {
      let result_validate = await formPosition.value.validate();
      if (!result_validate) return;
      isShowWndPosition.value = false;

      pos_form.value["fk_manager_id"] = pos_form.value["__manager"];

      api
        .post("api/v1/positions", pos_form.value)
        .then((response) => {
          positions.value.push(response.data);
          pos_form.value = Object.assign({}, null);

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
            msg_err = `Позиция (${pos_form.value.pos}/${pos_form.value.unit_num}) уже существует`;
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
      let result_validate = await formPosition.value.validate();
      if (!result_validate) return;
      isShowWndPosition.value = false;

      // if the value has not been changed first time, 
      // in this case q-select return the object  and not value
      if (typeof pos_form.value["__manager"] !== "object")
        pos_form.value["fk_manager_id"] = pos_form.value["__manager"];

      api
        .put(`api/v1/positions/${pos_form.value.id}`, pos_form.value)
        .then((response) => {
          positions.value[pos_selected_idx] = pos_form.value;

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
            msg_err = `Позиция (${pos_form.value.pos}/${pos_form.value.unit_num}) уже существует`;
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
            .delete(`api/v1/positions/${pos_form.value.id}`)
            .then((response) => {
              positions.value.splice(pos_selected_idx, 1);

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
      isShowWndPosition.value = true;
      isPositionEdit.value = false;
      isPositionAdd.value = true;
      pos_form.value = Object.assign({ __manager: ref(null) }, null);
    } // /onAddItem

    return {
      filter: ref(""),
      columns: columns,
      rows: positions,
      onRowClick,
      onUpdatePosition,
      onRemovePosition,
      onAddPosition,
      onAddItem,
      isPositionAdd,
      isPositionEdit,
      isShowWndPosition,
      pos_form,
      //   manager,
      workers,

      formPosition,
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
