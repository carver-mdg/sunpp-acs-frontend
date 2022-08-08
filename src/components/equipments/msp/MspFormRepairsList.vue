<template>
  <q-dialog
    v-model="storeMspRepairs.isShowRepairsListDialog"
    persistent
    :maximized="$q.platform.is.mobile ? true : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-card-section class="row items-center no-wrap">
        <div class="text-h6">Repairs</div>
        <span>
          ({{ storeMspRepairs.curEditRepairMsp.serialNumber }} /
          {{ storeMspRepairs.curEditRepairMsp.yearManufacture }})
        </span>
        <q-space />
        <q-btn
          flat
          label="new"
          icon="add"
          color="positive"
          @click="onAddNewRepair"
        />
        <q-space />
        <q-btn flat icon="close" v-close-popup />
      </q-card-section>
      <q-separator />

      <!-- <q-card-section class="row items-center">
        <q-btn label="Add" color="positive" @click="onAddNewRepair" />
      </q-card-section>
      <q-separator /> -->

      <!-- <q-card-section style="max-height: 55vh" class="scroll"> -->
      <q-card-section class="scroll">
        <!-- <q-card-section class="row items-center"> -->
        <!-- <div class="column full-height"> -->
        <q-table
          title="Treats"
          :rows="storeMspRepairs.repairs"
          :columns="columns"
          :visible-columns="[
            'dateRepair',
            'fkTypeRepairId',
            'fkWorkersIds',
            'actions',
          ]"
          :rows-per-page-options="[0]"
          row-key="name"
          dense
        >
          <template v-slot:top="props">
            Repairs
            <q-space />
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
                  @click="onEditRepair(props.row)"
                />
                <q-btn
                  flat
                  dense
                  icon="delete"
                  color="negative"
                  @click="onDeleteRepair(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <!-- </div> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMspRepairsStore } from "stores/equipments/msp/mspRepairs";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";
import MspRepairModel from "../../../models/equipments/msp/MspRepairModel";
import WorkerModel from "src/models/WorkerModel";

export default defineComponent({
  name: "MspFormRepairsList",

  setup() {
    const $q = useQuasar();
    const storeMspRepairs = useMspRepairsStore();
    const storePositions = usePositionsStore();
    const storeWorkers = useWorkersStore();

    const columns = [
      {
        name: "id",
        label: "id",
      },
      {
        name: "dateRepair",
        required: true,
        label: "Дата",
        align: "left",
        field: (row) => row.dateRepair,
        format: (val) => `${val}`,
        sortable: true,
        sort: (a, b, rowA, rowB) => {
          let day_a = parseInt(a.split(".")[0]);
          let month_a = parseInt(a.split(".")[1]);
          let year_a = parseInt(a.split(".")[2]);

          let day_b = parseInt(b.split(".")[0]);
          let month_b = parseInt(b.split(".")[1]);
          let year_b = parseInt(b.split(".")[2]);

          return (
            day_a +
            month_a * 100 +
            year_a * 1000 -
            (day_b + month_b * 100 + year_b * 1000)
          );
        },
      },
      {
        name: "fkTypeRepairId",
        required: true,
        label: "Тип ремонта",
        align: "center",
        field: (row) =>
          storeMspRepairs.getTypeRepairById(row.fkTypeRepairId).name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "fkPosRemovedId",
        required: true,
        label: "Поз. демонт.",
        align: "left",
        field: (row) => storePositions.getPositionById(row.fkPosRemovedId).pos,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "fkPosInstalledId",
        required: true,
        label: "Поз. устан.",
        align: "left",
        field: (row) =>
          storePositions.getPositionById(row.fkPosInstalledId).pos,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "fkWorkersIds",
        required: true,
        label: "Исполнители",
        align: "left",
        field: (row) => {
          let workers_print = "";
          storeWorkers
            .getWorkersByIds(row.fkWorkersIds)
            .map((worker) => (workers_print += `${worker.nameSecond}; `));
          return workers_print;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "actions",
        label: "actions",
      },
    ];

    /**
     *
     */
    const onAddNewRepair = () => {
      storeMspRepairs.isShowRepairEditDialog = true;
      storeMspRepairs.curEditRepair = new MspRepairModel();
      storeMspRepairs.curEditRepairTypeRepairModelValue = null;
      storeMspRepairs.curEditRepairPosInstalledModelValue = "";
      storeMspRepairs.curEditRepairPosInstalledOptions =
        storePositions.positions.slice();
      storeMspRepairs.curEditRepairPosRemovedModelValue = "";
      storeMspRepairs.curEditRepairPosRemovedOptions =
        storePositions.positions.slice();
      storeMspRepairs.curEditRepairWorkersModelValue = [];
    };

    /**
     *
     * @param {*} row
     */
    const onEditRepair = (row) => {
      storeMspRepairs.isShowRepairEditDialog = true;
      storeMspRepairs.curEditRepair = new MspRepairModel(row);
      storeMspRepairs.curEditRepairTypeRepairModelValue =
        storeMspRepairs.getTypeRepairById(row.fkTypeRepairId).id;
      storeMspRepairs.curEditRepairPosInstalledModelValue =
        storePositions.getPositionById(row.fkPosInstalledId).pos;
      storeMspRepairs.curEditRepairPosInstalledOptions =
        storePositions.positions.slice();
      storeMspRepairs.curEditRepairPosRemovedModelValue =
        storePositions.getPositionById(row.fkPosRemovedId).pos;
      storeMspRepairs.curEditRepairPosRemovedOptions =
        storePositions.positions.slice();

      storeMspRepairs.curEditRepairWorkersModelValue = [];
      storeWorkers
        .getWorkersByIds(row.fkWorkersIds)
        .forEach((worker) =>
          storeMspRepairs.curEditRepairWorkersModelValue.push(worker.id)
        );
    };

    /**
     *
     * @param {*} row
     */
    const onDeleteRepair = (row) => {
      $q.dialog({
        title: "Удалить ремонт",
        message: `Вы уверены что хотите безвозвратно удалить ремонт (
                        ${row.dateRepair} / ${
          storeMspRepairs.getTypeRepairById(row.fkTypeRepairId).name
        }
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeMspRepairs.deleteRepairsById({
            id: row.id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: `Ремонт (${row.dateRepair} / ${
                  storeMspRepairs.getTypeRepairById(row.fkTypeRepairId).name
                }) был удалён`,
              });
            },
            errFunc: (err) => {
              $q.notify({
                color: "negative",
                position: "top",
                message: `Ошибка удаления ремонта (${row.dateRepair} / ${
                  storeMspRepairs.getTypeRepairById(row.fkTypeRepairId).name
                }): ${err}`,
                icon: "report_problem",
                progress: true,
              });
            },
          });
        })
        .onCancel(() => {});
    };

    return {
      storeMspRepairs,
      columns,
      onAddNewRepair,
      onEditRepair,
      onDeleteRepair,
    };
  },
});
</script>
