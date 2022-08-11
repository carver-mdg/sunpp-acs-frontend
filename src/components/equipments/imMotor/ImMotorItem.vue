<template>
  <q-card class="bg-grey-1 col-2 self-start" style="min-width: 150px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ imMotor.serialNumber }} / {{ imMotor.yearManufacture }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list style="min-width: 120px">
                <q-item clickable @click="onEditImMotor(imMotor)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onRepairsImMotor(imMotor)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="construction" class="col" />
                      <div class="col">Repairs</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDeleteImMotor(imMotor.id)">
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
      <div class="text-caption text-grey-6">Номер</div>
      <div class="text-body2">{{ imMotor.serialNumber || "-" }}</div>

      <div class="text-caption text-grey-6">Год</div>
      <div class="text-body2">{{ imMotor.yearManufacture || "-" }}</div>

      <div class="text-caption text-grey-6">Производитель</div>
      <div class="text-body2">{{ imMotor.manufacturerName || "-" }}</div>

      <div class="text-caption text-grey-6">Номинальная мощность (КВт)</div>
      <div class="text-body2">{{ imMotor.powerRated || "-" }}</div>

      <div class="text-caption text-grey-6">Номинальный ток (А)</div>
      <div class="text-body2">{{ imMotor.currentRated || "-" }}</div>

      <div class="text-caption text-grey-6">Позиция</div>
      <div class="text-body2">
        {{ storePositions.getPositionById(imMotor.fkPosInstalledId)?.pos || "-" }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useImMotorStore } from "stores/equipments/imMotor/imMotor";
import { useImMotorRepairsStore } from "stores/equipments/imMotor/imMotorRepairs";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "ImMotorItem",
  props: {
    imMotor: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storeImMotor = useImMotorStore();
    const storeImMotorRepairs = useImMotorRepairsStore();
    const storePositions = usePositionsStore();

    const onEditImMotor = (imMotor) => {
      storeImMotor.isShowEditDialog = true;
      storeImMotor.curEditImMotor = Object.assign({}, imMotor);
      storeImMotor.curEditImMotorPosModelValue = {
        id: storeImMotor.curEditImMotor?.fkPosInstalledId,
        pos: storePositions.getPositionById(
          storeImMotor.curEditImMotor?.fkPosInstalledId
        )?.pos,
      };
      storeImMotor.curEditImMotorPosOptions = storePositions.positions.slice(); // return copy array
    };

    const onDeleteImMotor = (id) => {
      $q.dialog({
        title: "Delete imMotor",
        message: `Are you sure you want to permanently 
                    delete this imMotor (
                        ${props.imMotor.serialNumber} /
                        ${props.imMotor.yearManufacture} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeImMotor.deleteImMotorById({
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

    const onRepairsImMotor = (imMotor) => {
      storeImMotorRepairs.isShowRepairsListDialog = true;
      storeImMotorRepairs.curEditRepairImMotor = imMotor;
      storeImMotorRepairs.loadRepairsByImMotorId({
        imMotorId: imMotor.id,
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
      storeImMotor,
      storeImMotorRepairs,
      storePositions,
      onEditImMotor,
      onDeleteImMotor,
      onRepairsImMotor,
    };
  },
});
</script>
