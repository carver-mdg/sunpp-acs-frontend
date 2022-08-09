<template>
  <q-form greedy ref="formEditDevice">
    <q-dialog
      v-model="storeMeasuringDevices.isShowEditDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">СИТ</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div class="q-gutter-md q-px-lg">
            <q-select
              outlined
              clearable
              stack-label
              v-model="storeMeasuringDevices.curEditDeviceTypeModelValue"
              :options="storeMeasuringDevices.curEditDeviceTypeOptions"
              @update:model-value="onChangeQselDeviceType"
              option-value="id"
              :option-label="
                (item) => (item === null ? 'Null value' : `${item?.name}`)
              "
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
              emit-value
              map-options
              label="Тип устройства"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                Тип устройства
              </template>
            </q-select>

            <q-input
              outlined
              clearable
              v-model="storeMeasuringDevices.curEditDevice.model"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                Модель
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storeMeasuringDevices.curEditDevice.serialNumber"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                Серийный номер
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storeMeasuringDevices.curEditDevice.dateCheckNext"
              label-slot
              mask="##.##.####"
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="calendar_today" /> Дата следующей проверки
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="
                        storeMeasuringDevices.curEditDevice.dateCheckNext
                      "
                      mask="DD.MM.YYYY"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
            v-if="storeMeasuringDevices.curEditDevice.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdateDevice"
          />
          <q-btn v-else label="Save" color="positive" @click="onSaveDevice" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMeasuringDevicesStore } from "stores/measuringDevices";

export default {
  name: "MeasuringDeviceFormEdit",

  setup() {
    const $q = useQuasar();
    const storeMeasuringDevices = useMeasuringDevicesStore();
    let formEditDevice = ref(null);

    /**
     *
     * @param {*} val
     */
    const onChangeQselDeviceType = (val) => {
      storeMeasuringDevices.curEditDevice.fkDeviceTypeId = val || null;
    };

    /**
     *
     */
    const onSaveDevice = async () => {
      let result_validate = await formEditDevice.value.validate();
      if (!result_validate) return;

      storeMeasuringDevices.saveDevice({
        device: storeMeasuringDevices.curEditDevice,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Device has been added",
            progress: true,
          });

          storeMeasuringDevices.isShowEditDialog = false;
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
    const onUpdateDevice = async () => {
      let result_validate = await formEditDevice.value.validate();
      if (!result_validate) return;

      storeMeasuringDevices.updateDevice({
        device: storeMeasuringDevices.curEditDevice,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Device has been updated",
            progress: true,
          });

          storeMeasuringDevices.isShowEditDialog = false;
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
      storeMeasuringDevices,
      formEditDevice,
      onChangeQselDeviceType,
      onSaveDevice,
      onUpdateDevice,
    };
  },
};
</script>
