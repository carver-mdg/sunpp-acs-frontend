<template>
  <q-page class="q-pa-sm">
    <PprFormEdit />

    <q-table
      title="Treats"
      :rows="storePprs.pprs"
      :columns="columns"
      :visible-columns="[
        'name',
        'numPowerUnit',
        'dateTimeBegin',
        'dateTimeEnd',
        'actions',
      ]"
      :rows-per-page-options="[0]"
      :filter="tableFilter"
      row-key="name"
      dense
    >
      <template v-slot:top="props">
        Список планово-предупредительных ремонтов (ППР)
        <q-space />
        <q-input
          dense
          clearable
          debounce="300"
          v-model="tableFilter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-tr :props="props">
          <q-td key="actions" :props="props">
            <q-btn
              flat
              dense
              icon="edit"
              color="primary"
              hi
              @click="onClickBtnPprEdit(props.row)"
            >
              <q-tooltip> Редактировать </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="assignment_returned"
              color="orange-8"
              @click="onClickBtnPprPrintProtocols(props.row)"
            >
              <q-tooltip> Генерация протоколов </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense

              icon="construction"
              color="blue-grey-4"
              @click="onClickBtnPprRepairs(props.row)"
            >
              <q-tooltip> Посмотреть выполненные ремонты </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="onClickBtnPprDelete(props.row)"
            >
              <q-tooltip> Удалить </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <PprsPageStickyButton />
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePprsStore } from "stores/ppr";
import PprFormEdit from "src/components/pprs/PprFormEdit.vue";
import PprsPageStickyButton from "src/components/pprs/PprsPageStickyButton.vue";
import { api } from "boot/axios";
import * as utils from "src/utils";

const columns = [
  {
    name: "id",
    label: "id",
    field: (row) => row.id,
    format: (val) => `${val}`,
  },
  {
    name: "name",
    label: "name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: "numPowerUnit",
    label: "numPowerUnit",
    align: "left",
    field: (row) => row.numPowerUnit,
    format: (val) => `${val}`,
  },
  {
    name: "dateTimeBegin",
    required: true,
    label: "Дата начала",
    align: "left",
    field: (row) => row.dateTimeBegin,
    format: (val) => `${val}`,
  },
  {
    name: "dateTimeEnd",
    required: true,
    label: "Дата окончания",
    align: "left",
    field: (row) => row.dateTimeEnd,
    format: (val) => `${val}`,
  },
  {
    name: "actions",
    label: "actions",
    align: "left",
  },
];

export default defineComponent({
  name: "PprsPage",
  components: {
    PprFormEdit,
    PprsPageStickyButton,
  },

  setup() {
    const $q = useQuasar();
    const storePprs = usePprsStore();
    let tableFilter = ref("");

    storePprs.loadPprs((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    /**
     *
     */
    const onClickBtnPprEdit = (ppr) => {
      storePprs.isShowEditDialog = true;
      storePprs.curEditPpr = Object.assign({}, ppr);
    };

    /**
     *
     */
    const onClickBtnPprDelete = (ppr) => {
      $q.dialog({
        title: "Delete ppr",
        message: `Are you sure you want to permanently 
                    delete this ppr (
                        ${ppr.name} /
                        ${ppr.numPowerUnit} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storePprs.deletePprById({
            id: ppr.id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Ppr has been deleted",
                progress: true,
              });
            },
            errFunc: (err) => {
              $q.notify({
                color: "negative",
                position: "top",
                message: `Failed to delete from server: ${err}`,
                icon: "report_problem",
                progress: true,
              });
            },
          });
        })
        .onCancel(() => {});
    };

    /**
     *
     */
    const onClickBtnPprPrintProtocols = (ppr) => {
      const notif = $q.notify({
        group: false,
        timeout: 0,
        spinner: true,
        message: "Download protocols...",
      });

      storePprs.downloadProtocols({
        ppr,
        onUploadProgressFunc: (percentage) => {
          notif({
            caption: `${percentage} %`,
          });

          if (percentage >= 100) {
            notif({
              icon: "done",
              spinner: false,
              message: "Downloading done!",
              timeout: 300,
            });
          }
        },
        okFunc: () => {
          notif({
            timeout: 1,
          });
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to download data from server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    return {
      storePprs,
      columns,
      tableFilter,
      onClickBtnPprEdit,
      onClickBtnPprDelete,
      onClickBtnPprPrintProtocols,
    };
  },
});
</script>
