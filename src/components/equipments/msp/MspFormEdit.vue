<template>
  <q-form greedy ref="formEditMsp">
    <q-dialog
      v-model="storeMsp.isShowEditDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">МСП</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row items-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storeMsp.curEditMsp.serialNumber"
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
              v-model="storeMsp.curEditMsp.yearManufacture"
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
              v-model="storeMsp.curEditMspPosModelValue"
              use-input
              clearable
              input-debounce="0"
              :options="storeMsp.curEditMspPosOptions"
              option-value="id"
              option-label="pos"
              emit-value
              map-options
              @filter="filterQselPositions"
              @update:model-value="onChangeQselPositions"
              label="Позиция"
            >
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

        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn
            v-if="storeMsp.curEditMsp.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdateMsp"
          />
          <q-btn v-else label="Save" color="positive" @click="onSaveMsp" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMspStore } from "stores/equipments/msp/msp";
import { usePositionsStore } from "stores/positions";

export default defineComponent({
  name: "MspFormEdit",
  setup() {
    const $q = useQuasar();
    const storeMsp = useMspStore();
    const storePositions = usePositionsStore();

    let formEditMsp = ref(null);

    /**
     *
     * @param {*} val
     * @param {*} update
     * @param {*} abort
     */
    const filterQselPositions = (val, update, abort) => {
      update(() => {
        if(val.length <= 0) return;

        const needle = val.toLowerCase();
        storeMsp.curEditMspPosOptions = storePositions.positions.filter(
          (pos) => pos.pos.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    /**
     *
     * @param {*} val
     */
    const onChangeQselPositions = (val) => {
      storeMsp.curEditMsp.fkPosInstalledId = val || null;
    };

    /**
     *
     */
    const onSaveMsp = async () => {
      let result_validate = await formEditMsp.value.validate();
      if (!result_validate) return;
      storeMsp.isShowEditDialog = false;

      storeMsp.saveMsp({
        msp: storeMsp.curEditMsp,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Msp has been added",
          });
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
    const onUpdateMsp = async () => {
      let result_validate = await formEditMsp.value.validate();
      if (!result_validate) return;
      storeMsp.isShowEditDialog = false;

      storeMsp.updateMsp({
        msp: storeMsp.curEditMsp,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Msp has been updated",
          });
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
      formEditMsp,
      storeMsp,
      storePositions,
      onSaveMsp,
      onUpdateMsp,
      filterQselPositions,
      onChangeQselPositions,
    };
  },
});
</script>
