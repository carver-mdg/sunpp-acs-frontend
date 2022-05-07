<template>
  <q-page padding>
    <q-form greedy ref="formEquipment">
      <q-dialog v-model="isShowWndEquipment" persistent>
        <q-card class="q-px-sm q-pb-md">
          <q-card-section>
            <div class="text-h6" v-if="isEquipmentEdit">Edit MSP</div>
            <div class="text-h6" v-if="isEquipmentAdd">Add MSP</div>
          </q-card-section>

          <q-item dense>
            <q-input
              outlined
              v-model="equip_form.serial_number"
              label="serial_number"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                serial number
              </template>
            </q-input>
          </q-item>
          <q-item dense>
            <q-input
              outlined
              v-model="equip_form.year_manufacture"
              label="year_manufacture"
              type="number"
              label-slot
              reactive-rules
              :rules="[
                (val) => !!val || 'Field is required and must be number',
              ]"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                year of manufacture
              </template>
            </q-input>
          </q-item>

          <q-item dense>
            <span class="text-weight-bold text-red">*</span>
            Indicates required fields
          </q-item>

          <q-card-actions align="right">
            <q-btn
              label="Remove"
              color="negative"
              v-close-popup
              v-if="isEquipmentEdit"
              @click="onRemoveEquipment"
            />
            <q-btn label="Cancel" color="primary" v-close-popup />
            <q-btn
              label="Update"
              class="bg-warning"
              v-if="isEquipmentEdit"
              @click="onUpdateEquipment"
            />
            <q-btn
              label="Add"
              class="bg-warning"
              v-if="isEquipmentAdd"
              @click="onAddEquipment"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-form>

    <div>
      <q-table
        title="МСП"
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
import { ref, onMounted } from "vue";

export default {
  // name: "PageName",

  setup() {
    const $q = useQuasar();

    const columns = [
      {
        name: "serial_number",
        required: true,
        label: "serial number",
        align: "left",
        field: (row) => row.serial_number,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "year_manufacture",
        required: true,
        label: "year of manufacture",
        align: "left",
        field: (row) => row.year_manufacture,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    let formEquipment = ref(null);
    let isShowWndEquipment = ref(false);
    let isEquipmentEdit = ref(false);
    let isEquipmentAdd = ref(false);

    let equipments = ref([]);
    let equip_selected_idx = 0;
    let equip_form = ref(Object.assign({}, null));

    // load data
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

    /**
     *
     */
    function onRowClick(e, row) {
      isShowWndEquipment.value = true;
      isEquipmentEdit.value = true;
      isEquipmentAdd.value = false;

      equipments.value.findIndex((obj, idx) => {
        if (obj.id === row.id) {
          equip_form.value = Object.assign({}, obj);
          equip_selected_idx = idx;
        }
      });
    } // /onRowClick

    /**
     *
     */
    async function onAddEquipment() {
      let result_validate = await formEquipment.value.validate();
      if (!result_validate) return;
      isShowWndEquipment.value = false;

      api
        .post("api/v1/equipments/msp", equip_form.value)
        .then((response) => {
          equipments.value.push(response.data);
          equip_form.value = Object.assign({}, null);

          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Equipment has been saved",
          });
        })
        .catch((err) => {
          let msg_err = "";
          if (err.response.status == 409)
            msg_err = `МСП (${equip_form.value.serial_number}/${equip_form.value.year_manufacture}) уже существует`;
          else msg_err = `Failed to save to server: ${err.message}`;

          $q.notify({
            color: "negative",
            position: "top",
            message: msg_err,
            icon: "report_problem",
            progress: true,
          });
        });
    } // /onAddEquipment

    /**
     *
     */
    async function onUpdateEquipment() {
      let result_validate = await formEquipment.value.validate();
      if (!result_validate) return;
      isShowWndEquipment.value = false;

      api
        .put(`api/v1/equipments/msp/${equip_form.value.id}`, equip_form.value)
        .then((response) => {
          equipments.value[equip_selected_idx] = equip_form.value;

          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Equipment has been updated",
          });
        })
        .catch((err) => {
          let msg_err = "";
          if (err.response.status == 409)
            msg_err = `МСП (${equip_form.value.serial_number}/${equip_form.value.year_manufacture}) уже существует`;
          else msg_err = `Failed to save to server: ${err.message}`;

          $q.notify({
            color: "negative",
            position: "top",
            message: msg_err,
            icon: "report_problem",
            progress: true,
          });
        });
    } // /onUpdateEquipment

    /**
     *
     */
    function onRemoveEquipment() {
      $q.dialog({
        title: "Removing",
        message: "Remove item ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          api
            .delete(
              `api/v1/equipments/msp/${equip_form.value.id}`,
              equip_form.value
            )
            .then((response) => {
              equipments.value.splice(equip_selected_idx, 1);

              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Equipment has been removed",
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
    } // /onRemoveEquipment

    /**
     *
     */
    function onAddItem() {
      isShowWndEquipment.value = true;
      isEquipmentEdit.value = false;
      isEquipmentAdd.value = true;
      equip_form.value = Object.assign({}, null);
    } // /onAddItem

    return {
      filter: ref(""),
      columns: columns,
      rows: equipments,
      onRowClick,
      onUpdateEquipment,
      onRemoveEquipment,
      onAddEquipment,
      onAddItem,
      isEquipmentAdd,
      isEquipmentEdit,
      isShowWndEquipment,
      equip_form,

      formEquipment,
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
