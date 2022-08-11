<template>
  <q-card class="bg-grey-1 col-2 self-start" style="min-width: 150px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ imMeo.serialNumber }} / {{ imMeo.yearManufacture }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list style="min-width: 120px">
                <q-item clickable @click="onEditImMeo(imMeo)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onRepairsImMeo(imMeo)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="construction" class="col" />
                      <div class="col">Repairs</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDeleteImMeo(imMeo.id)">
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
      <div class="text-body2">{{ imMeo.imMeoModel || "-" }}</div>

      <div class="text-caption text-grey-6">Номер</div>
      <div class="text-body2">{{ imMeo.serialNumber || "-" }}</div>

      <div class="text-caption text-grey-6">Год</div>
      <div class="text-body2">{{ imMeo.yearManufacture || "-" }}</div>

      <div class="text-caption text-grey-6">Производитель</div>
      <div class="text-body2">{{ imMeo.manufacturerName || "-" }}</div>

      <div class="text-caption text-grey-6">Номинальная мощность (КВт)</div>
      <div class="text-body2">{{ imMeo.powerRated || "-" }}</div>

      <div class="text-caption text-grey-6">Номинальный ток (А)</div>
      <div class="text-body2">{{ imMeo.currentRated || "-" }}</div>

      <div class="text-caption text-grey-6">Позиция</div>
      <div class="text-body2">
        {{ storePositions.getPositionById(imMeo.fkPosInstalledId)?.pos || "-" }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useImMeoStore } from "stores/equipments/imMeo/imMeo";
import { useImMeoRepairsStore } from "stores/equipments/imMeo/imMeoRepairs";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "ImMeoItem",
  props: {
    imMeo: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storeImMeo = useImMeoStore();
    const storeImMeoRepairs = useImMeoRepairsStore();
    const storePositions = usePositionsStore();

    const onEditImMeo = (imMeo) => {
      storeImMeo.isShowEditDialog = true;
      storeImMeo.curEditImMeo = Object.assign({}, imMeo);
      storeImMeo.curEditImMeoPosModelValue = {
        id: storeImMeo.curEditImMeo?.fkPosInstalledId,
        pos: storePositions.getPositionById(
          storeImMeo.curEditImMeo?.fkPosInstalledId
        )?.pos,
      };
      storeImMeo.curEditImMeoPosOptions = storePositions.positions.slice(); // return copy array
    };

    const onDeleteImMeo = (id) => {
      $q.dialog({
        title: "Delete imMeo",
        message: `Are you sure you want to permanently 
                    delete this imMeo (
                        ${props.imMeo.serialNumber} /
                        ${props.imMeo.yearManufacture} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeImMeo.deleteImMeoById({
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

    const onRepairsImMeo = (imMeo) => {
      storeImMeoRepairs.isShowRepairsListDialog = true;
      storeImMeoRepairs.curEditRepairImMeo = imMeo;
      storeImMeoRepairs.loadRepairsByImMeoId({
        imMeoId: imMeo.id,
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
      storeImMeo,
      storeImMeoRepairs,
      storePositions,
      onEditImMeo,
      onDeleteImMeo,
      onRepairsImMeo,
    };
  },
});
</script>
