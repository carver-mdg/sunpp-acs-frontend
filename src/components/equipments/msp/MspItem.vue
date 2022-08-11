<template>
  <q-card class="bg-grey-1 col-2 self-start" style="min-width: 150px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ msp.serialNumber }} / {{ msp.yearManufacture }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list style="min-width: 120px">
                <q-item clickable @click="onEditMsp(msp)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onRepairsMsp(msp)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="construction" class="col" />
                      <div class="col">Repairs</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDeleteMsp(msp.id)">
                  <q-item-section>
                    <div class="row items-center text-negative">
                      <q-icon name="delete" class="col" />
                      <div class="col">Delete</div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-caption text-grey-6">Модель</div>
      <div class="text-body2">{{ msp.mspModel || "-" }}</div>

      <div class="text-caption text-grey-6">Номер</div>
      <div class="text-body2">{{ msp.serialNumber || "-" }}</div>

      <div class="text-caption text-grey-6">Год</div>
      <div class="text-body2">{{ msp.yearManufacture || "-" }}</div>

      <div class="text-caption text-grey-6">Позиция</div>
      <div class="text-body2">
        {{ storePositions.getPositionById(msp.fkPosInstalledId)?.pos || "-" }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMspStore } from "stores/equipments/msp/msp";
import { useMspRepairsStore } from "stores/equipments/msp/mspRepairs";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "MspItem",
  props: {
    msp: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storeMsp = useMspStore();
    const storeMspRepairs = useMspRepairsStore();
    const storePositions = usePositionsStore();

    const onEditMsp = (msp) => {
      storeMsp.isShowEditDialog = true;
      storeMsp.curEditMsp = Object.assign({}, msp);
      storeMsp.curEditMspPosModelValue = {
        id: storeMsp.curEditMsp?.fkPosInstalledId,
        pos: storePositions.getPositionById(
          storeMsp.curEditMsp?.fkPosInstalledId
        )?.pos,
      };
      storeMsp.curEditMspPosOptions = storePositions.positions.slice(); // return copy array
    };

    const onDeleteMsp = (id) => {
      $q.dialog({
        title: "Delete msp",
        message: `Are you sure you want to permanently 
                    delete this msp (
                        ${props.msp.serialNumber} /
                        ${props.msp.yearManufacture} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeMsp.deleteMspById({
            id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "MSP has been deleted",
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

    const onRepairsMsp = (msp) => {
      storeMspRepairs.isShowRepairsListDialog = true;
      storeMspRepairs.curEditRepairMsp = msp;
      storeMspRepairs.loadRepairsByMspId({
        mspId: msp.id,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "MSP repairs has been loaded",
            progress: true,
          });
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load repairs from server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    return {
      storeMsp,
      storeMspRepairs,
      storePositions,
      onEditMsp,
      onDeleteMsp,
      onRepairsMsp,
    };
  },
});
</script>
