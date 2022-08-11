<template>
  <q-form greedy ref="formEditImMeo">
    <q-dialog
      v-model="storeImMeo.isShowEditDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">им. МЭО</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storeImMeo.curEditImMeo.imMeoModel"
              label="Модель"
            />
            <br />

            <q-input
              outlined
              clearable
              v-model="storeImMeo.curEditImMeo.serialNumber"
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
              v-model="storeImMeo.curEditImMeo.yearManufacture"
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
              v-model="storeImMeo.curEditImMeo.manufacturerName"
              :options="['ВАЗ', 'Other', 'Unknown']"
              label="Производитель"
            />
            <br />

            <q-input
              outlined
              clearable
              type="number"
              v-model="storeImMeo.curEditImMeo.powerRated"
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
              v-model="storeImMeo.curEditImMeo.currentRated"
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
              v-model="storeImMeo.curEditImMeoPosModelValue"
              use-input
              clearable
              input-debounce="0"
              :options="storeImMeo.curEditImMeoPosOptions"
              option-value="id"
              option-label="pos"
              emit-value
              map-options
              @filter="filterQselPositions"
              @update:model-value="onChangeQselPositions"
              label="Позиция"
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
            v-if="storeImMeo.curEditImMeo.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdateImMeo"
          />
          <q-btn v-else label="Save" color="positive" @click="onSaveImMeo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useImMeoStore } from "stores/equipments/imMeo/imMeo";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "ImMeoFormEdit",
  setup() {
    const $q = useQuasar();
    const storeImMeo = useImMeoStore();
    const storePositions = usePositionsStore();

    let formEditImMeo = ref(null);

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
        storeImMeo.curEditImMeoPosOptions = storePositions.positions.filter(
          (pos) => pos.pos.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    /**
     *
     * @param {*} val
     */
    const onChangeQselPositions = (val) => {
      storeImMeo.curEditImMeo.fkPosInstalledId = val || null;
    };

    /**
     *
     */
    const onSaveImMeo = async () => {
      let result_validate = await formEditImMeo.value.validate();
      if (!result_validate) return;

      storeImMeo.saveImMeo({
        imMeo: storeImMeo.curEditImMeo,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "ImMeo has been added",
            progress: true,
          });

          storeImMeo.isShowEditDialog = false;
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
    const onUpdateImMeo = async () => {
      let result_validate = await formEditImMeo.value.validate();
      if (!result_validate) return;

      storeImMeo.updateImMeo({
        imMeo: storeImMeo.curEditImMeo,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "ImMeo has been updated",
            progress: true,
          });

          storeImMeo.isShowEditDialog = false;
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
      formEditImMeo,
      storeImMeo,
      storePositions,
      onSaveImMeo,
      onUpdateImMeo,
      filterQselPositions,
      onChangeQselPositions,
    };
  },
});
</script>
