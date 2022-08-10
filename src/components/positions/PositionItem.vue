<template>
  <q-card class="bg-grey-1 col-2 self-start" style="min-width: 200px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ position.pos }} / {{ position.unitNum }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list style="min-width: 120px">
                <q-item clickable @click="onEditPosition(position)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDeletePosition(position.id)">
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
      <div class="text-caption text-grey-6">Позиция</div>
      <div class="text-body2">{{ position.pos || "-" }}</div>

      <div class="text-caption text-grey-6">Номер блока</div>
      <div class="text-body2">{{ position.unitNum || "-" }}</div>

      <div class="text-caption text-grey-6">Система безопасности</div>
      <div class="text-body2">{{ position.systemSecurity || "-" }}</div>

      <div class="text-caption text-grey-6">Сборки эл.питания</div>
      <div class="text-body2">{{ position.rtzo_sher || "-" }}</div>

      <div class="text-caption text-grey-6">Описание короткое</div>
      <div class="text-body2">{{ position.descShort || "-" }}</div>

      <div class="text-caption text-grey-6">Описание</div>
      <div class="text-body2">{{ position.desc || "-" }}</div>

      <div class="text-caption text-grey-6">Расположение</div>
      <div class="text-body2">{{ position.zoneLocation || "-" }}</div>

      <div class="text-caption text-grey-6">Шкаф управления</div>
      <div class="text-body2">{{ position.cabinetRemoteControl || "-" }}</div>

      <div class="text-caption text-grey-6">Шкаф токовый</div>
      <div class="text-body2">
        {{ position.cabinetCurrentDistributor || "-" }}
      </div>

      <div class="text-caption text-grey-6">Manager</div>
      <div class="text-body2">
        {{
          storeWorkers.getWorkerById(position.fkManagerId)?.nameSecond || "-"
        }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";

export default defineComponent({
  name: "PositionItem",
  props: {
    position: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storePositions = usePositionsStore();
    const storeWorkers = useWorkersStore();

    const onEditPosition = (position) => {
      storePositions.isShowEditDialog = true;
      storePositions.curEditPosition = Object.assign({}, position);

      storePositions.curEditPositionWorkerManagerModelValue =
        storeWorkers.getWorkerById(position.fkManagerId).id;

      //   storeMsp.curEditMspPosModelValue = {
      //     id: storeMsp.curEditMsp?.fkPosInstalledId,
      //     pos: storePositions.getPositionById(
      //       storeMsp.curEditMsp?.fkPosInstalledId
      //     )?.pos,
      //   };
      //   storeMsp.curEditMspPosOptions = storePositions.positions.slice(); // return copy array
    };

    const onDeletePosition = (id) => {
      $q.dialog({
        title: "Delete Position",
        message: `Are you sure you want to permanently 
                    delete this position (
                        ${props.position.pos} /
                        ${props.position.unitNum} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storePositions.deletePositionById({
            id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Position has been deleted",
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
      storePositions,
      storeWorkers,
      onEditPosition,
      onDeletePosition,
    };
  },
});
</script>
