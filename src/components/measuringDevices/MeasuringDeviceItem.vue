<template>
  <q-card class="bg-grey-1 col-2 self-start" style="width: 180px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ measuringDevice.model }} ({{ measuringDevice.serialNumber }})
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item
                  clickable
                  @click="onEditMeasuringDevice(measuringDevice)"
                >
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item clickable disable>
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="checklist" class="col" />
                      <div class="col">Проверки</div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item clickable disable>
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="send" class="col" />
                      <div class="col">Сдать на проверку</div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item clickable disable>
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="call_received" class="col" />
                      <div class="col">Принять из проверки</div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  @click="onDeleteMeasuringDevice(measuringDevice.id)"
                >
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
      <div class="text-caption text-grey-6">Тип устройства</div>
      <div class="text-body2">
        {{
          storeMeasuringDevices.getDeviceTypeById(
            measuringDevice.fkDeviceTypeId
          )?.name
        }}
      </div>

      <div class="text-caption text-grey-6">Модель</div>
      <div class="text-body2">{{ measuringDevice.model || "-" }}</div>

      <div class="text-caption text-grey-6">Серийный номер</div>
      <div class="text-body2">{{ measuringDevice.serialNumber || "-" }}</div>

      <div class="text-caption text-grey-6">Дата след. проверки</div>
      <div class="text-body2">{{ measuringDevice.dateCheckNext || "-" }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useMeasuringDevicesStore } from "stores/measuringDevices";

export default {
  name: "MeasuringDeviceItem",
  props: {
    measuringDevice: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storeMeasuringDevices = useMeasuringDevicesStore();

    /**
     *
     * @param {*} worker
     */
    const onEditMeasuringDevice = (device) => {
      storeMeasuringDevices.isShowEditDialog = true;
      storeMeasuringDevices.curEditDevice = Object.assign({}, device);
      storeMeasuringDevices.curEditDeviceTypeModelValue = {
        id: device.fkDeviceTypeId,
        name: storeMeasuringDevices.getDeviceTypeById(device.fkDeviceTypeId)
          ?.name,
      };
      storeMeasuringDevices.curEditDeviceTypeOptions =
        storeMeasuringDevices.deviceTypes.slice();
    };

    /**
     *
     * @param {*} id
     */
    const onDeleteMeasuringDevice = (id) => {
      $q.dialog({
        title: "Delete device",
        message: `Are you sure you want to permanently 
                    delete this device (
                        ${props.measuringDevice.model} / 
                        ${props.measuringDevice.serialNumber} 
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeMeasuringDevices.deleteDeviceById({
            id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Device has been deleted",
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
      storeMeasuringDevices,
      onEditMeasuringDevice,
      onDeleteMeasuringDevice,
    };
  },
};
</script>
