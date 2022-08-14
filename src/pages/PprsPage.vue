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
        Даты ППР
        <q-space />
        <q-input dense clearable debounce="300" v-model="tableFilter" placeholder="Search">
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
              @click="onClickBtnPprEdit(props.row)"
            />
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              @click="onClickBtnPprDelete(props.row)"
            />
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
    let tableFilter = ref('');

    storePprs.loadPprs((err) => {
      $q.notify({
        color: "negative",
        position: "top",
        message: `Failed to load data from server: ${err}`,
        icon: "report_problem",
        progress: true,
      });
    });

    // new Date("2022-02-15T08:12:10").toUTCString()
    // 'Tue, 15 Feb 2022 06:12:10 GMT'

    // new Date('Tue, 15 Feb 2022 06:12:10 GMT').toLocaleString()
    // '15.02.2022, 08:12:10'

    /**
     *
     */
    const onClickBtnPprEdit = (ppr) => {
      //   console.log(ppr);
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
                        ${ppr.name} 
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

    return {
      storePprs,
      columns,
      tableFilter,
      onClickBtnPprEdit,
      onClickBtnPprDelete,
    };
  },
});
</script>
