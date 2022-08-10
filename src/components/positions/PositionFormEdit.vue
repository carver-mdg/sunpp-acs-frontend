<template>
  <q-form greedy ref="formEditPosition">
    <q-dialog
      v-model="storePositions.isShowEditDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">Позиция</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.pos"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Позиция
              </template>
            </q-input>

            <q-select
              outlined
              clearable
              v-model="storePositions.curEditPosition.unitNum"
              :options="['1 ЭБ', '2 ЭБ', '3 ЭБ', '1 СВО', '2 СВО']"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Номер блока
              </template>
            </q-select>

            <q-select
              outlined
              clearable
              v-model="storePositions.curEditPosition.systemSecurity"
              :options="['1 СБ', '2 СБ', '3 СБ', 'СВБ', 'СНЭ']"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Система безопасности
              </template>
            </q-select>

            <q-select
              outlined
              clearable
              v-model="storePositions.curEditPosition.zoneLocation"
              :options="['Машинный зал', 'Зона']"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Расположение
              </template>
            </q-select>

            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.rtzo_sher"
              type="textarea"
              label="Сборки эл.питания"
            />
            <br />

            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.descShort"
              label="Описание короткое"
            />
            <br />

            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.desc"
              type="textarea"
              label="Описание"
            />
            <br />

            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.cabinetRemoteControl"
              label="Шкаф управления"
            />
            <br />

            <q-input
              outlined
              clearable
              v-model="storePositions.curEditPosition.cabinetCurrentDistributor"
              label="Шкаф токовый"
            />
            <br />

            <q-select
              outlined
              v-model="storePositions.curEditPositionWorkerManagerModelValue"
              use-input
              clearable
              input-debounce="0"
              :options="storeWorkers.workers"
              option-value="id"
              :option-label="
                (item) =>
                  item === null
                    ? 'Null value'
                    : `${item?.nameSecond} ${item?.nameFirst} ${item?.nameMiddle}`
              "
              emit-value
              map-options
              @update:model-value="onChangeQselManager"
              label="Позиция"
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Manager
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-weight-bold text-red">*</span>
          Indicates required fields
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn
            v-if="storePositions.curEditPosition.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdatePosition"
          />
          <q-btn v-else label="Save" color="positive" @click="onSavePosition" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePositionsStore } from "stores/positions";
import { useWorkersStore } from "stores/workers";

export default defineComponent({
  name: "PositionFormEdit",
  setup() {
    const $q = useQuasar();
    const storePositions = usePositionsStore();
    const storeWorkers = useWorkersStore();

    let formEditPosition = ref(null);

    /**
     *
     * @param {*} val
     */
    const onChangeQselManager = (val) => {
      storePositions.curEditPosition.fkManagerId = val || null;
    };

    /**
     *
     */
    const onSavePosition = async () => {
      let result_validate = await formEditPosition.value.validate();
      if (!result_validate) return;

      storePositions.savePosition({
        position: storePositions.curEditPosition,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Position has been added",
            progress: true,
          });

          storePositions.isShowEditDialog = false;
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to save data to server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    /**
     *
     */
    const onUpdatePosition = async () => {
      let result_validate = await formEditPosition.value.validate();
      if (!result_validate) return;

      storePositions.updatePosition({
        position: storePositions.curEditPosition,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Position has been updated",
            progress: true,
          });

          storePositions.isShowEditDialog = false;
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to update data to server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    return {
      formEditPosition,
      storePositions,
      storeWorkers,
      onSavePosition,
      onUpdatePosition,
      onChangeQselManager,
    };
  },
});
</script>
