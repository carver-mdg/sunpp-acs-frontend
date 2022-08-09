<template>
  <q-form greedy ref="formWorker">
    <q-dialog
      v-model="storeWorkers.isShowEditWorkerDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <!-- <q-bar v-if="$q.platform.is.mobile">
          <q-btn flat icon="close" v-close-popup />
          <q-space />

          <q-btn  flat icon="done" v-close-popup />
        </q-bar> -->

        <q-card-section class="row items-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.nameFirst"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> nameFirst
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.nameSecond"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> nameSecond
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.nameMiddle"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> nameMiddle
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.personnelNumber"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="numbers" /> personnelNumber
              </template>
            </q-input>

            <q-select
              outlined
              clearable
              v-model="storeWorkers.curEditWorkerJobPositionsValue"
              :options="storeWorkers.jobPositions"
              option-value="id"
              option-label="title"
              emit-value
              map-options
              label="Select job position"
              label-slot
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                Select job position
              </template>
            </q-select>

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.birthDate"
              label-slot
              mask="##.##.####"
            >
              <template v-slot:label>
                <q-icon name="calendar_today" /> Date of birth
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
                      v-model="storeWorkers.curEditWorker.birthDate"
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
            <br />

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.address"
              label="address"
              label-slot
              type="textarea"
            >
              <template v-slot:label>
                <q-icon name="edit_location" />
                address
              </template>
            </q-input>
            <br />

            <q-input
              outlined
              clearable
              v-model="storeWorkers.curEditWorker.phoneNumber"
              label="phoneNumber"
              label-slot
              type="tel"
              mask="+### ## ### ####"
            >
              <template v-slot:label>
                <q-icon name="phone" /> phoneNumber
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section>
          <span class="text-weight-bold text-red">*</span>
          Indicates required fields
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn
            v-if="storeWorkers.curEditWorker.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onUpdateWorker"
          />
          <q-btn v-else label="Save" color="positive" @click="onSaveWorker" />
        </q-card-actions>
      </q-card>

      <!-- <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm"
          >You are currently not connected to any network.</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
      </q-card-actions>
    </q-card> -->
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useWorkersStore } from "stores/workers";

export default defineComponent({
  name: "WorkerFormEdit",

  setup(props) {
    const $q = useQuasar();
    const storeWorkers = useWorkersStore();
    let formWorker = ref(null);

    /**
     *
     */
    const onSaveWorker = async () => {
      let result_validate = await formWorker.value.validate();
      if (!result_validate) return;
      storeWorkers.isShowEditWorkerDialog = false;

      storeWorkers.saveWorker({
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Worker has been added",
            progress: true,
          });
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    /**
     *
     */
    const onUpdateWorker = async () => {
      let result_validate = await formWorker.value.validate();
      if (!result_validate) return;
      storeWorkers.isShowEditWorkerDialog = false;

      storeWorkers.updateWorker({
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Worker has been updated",
            progress: true,
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
      formWorker,
      storeWorkers,
      onSaveWorker,
      onUpdateWorker,
    };
  },
});
</script>
