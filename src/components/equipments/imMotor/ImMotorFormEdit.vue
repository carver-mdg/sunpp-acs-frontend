<template>
  <q-form greedy ref="formEditImMotor">
    <q-dialog
      v-model="storeImMotor.isShowEditDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">им. Мотор</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storeImMotor.curEditImMotor.serialNumber"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Номер
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              type="number"
              v-model="storeImMotor.curEditImMotor.yearManufacture"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Год
              </template>
            </q-input>

            <q-select
              outlined
              clearable
              v-model="storeImMotor.curEditImMotor.manufacturerName"
              :options="['ВАЗ', 'Bernard', 'Siemens', 'Other', 'Unknown']"
              label="Производитель"
            />
            <br />

            <q-input
              outlined
              clearable
              type="number"
              v-model="storeImMotor.curEditImMotor.powerRated"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Номинальная мощность (КВт)
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              type="number"
              v-model="storeImMotor.curEditImMotor.currentRated"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Номинальный ток (А)
              </template>
            </q-input>

            <q-select
              outlined
              v-model="storeImMotor.curEditImMotorPosModelValue"
              use-input
              clearable
              input-debounce="0"
              :options="storeImMotor.curEditImMotorPosOptions"
              option-value="id"
              option-label="pos"
              emit-value
              map-options
              @filter="filterQselPositions"
              @update:model-value="onChangeQselPositions"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Позиция
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
            v-if="storeImMotor.curEditImMotor.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdateImMotor"
          />
          <q-btn v-else label="Save" color="positive" @click="onSaveImMotor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useImMotorStore } from "stores/equipments/imMotor/imMotor";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "ImMotorFormEdit",
  setup() {
    const $q = useQuasar();
    const storeImMotor = useImMotorStore();
    const storePositions = usePositionsStore();

    let formEditImMotor = ref(null);

    /**
     *
     * @param {*} val
     * @param {*} update
     * @param {*} abort
     */
    const filterQselPositions = (val, update, abort) => {
      update(() => {
        if (val.length <= 0) return;

        const needle = val.toLowerCase();
        storeImMotor.curEditImMotorPosOptions = storePositions.positions.filter(
          (pos) => pos.pos.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    /**
     *
     * @param {*} val
     */
    const onChangeQselPositions = (val) => {
      storeImMotor.curEditImMotor.fkPosInstalledId = val || null;
    };

    /**
     *
     */
    const onSaveImMotor = async () => {
      let result_validate = await formEditImMotor.value.validate();
      if (!result_validate) return;

      storeImMotor.saveImMotor({
        imMotor: storeImMotor.curEditImMotor,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "ImMotor has been added",
            progress: true,
          });

          storeImMotor.isShowEditDialog = false;
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
    const onUpdateImMotor = async () => {
      let result_validate = await formEditImMotor.value.validate();
      if (!result_validate) return;

      storeImMotor.updateImMotor({
        imMotor: storeImMotor.curEditImMotor,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "ImMotor has been updated",
            progress: true,
          });

          storeImMotor.isShowEditDialog = false;
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
      formEditImMotor,
      storeImMotor,
      storePositions,
      onSaveImMotor,
      onUpdateImMotor,
      filterQselPositions,
      onChangeQselPositions,
    };
  },
});
</script>
