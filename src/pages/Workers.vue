<template>
  <q-page padding>
    <div v-if="isLoadingData" class="fixed-center">
      <div class="loader"></div>
      <div class="">Please wait...</div>
    </div>

    <q-list
      bordered
      class="rounded-borders"
      v-for="worker in workers"
      :key="worker.id"
    >
      <q-expansion-item>
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="account_box" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            {{ worker.nameFirst }}
            &nbsp;{{ worker.nameSecond }} &nbsp;{{ worker.nameMiddle }}
          </q-item-section>
        </template>
        <q-form
          greedy
          :ref="
            (el) => {
              worker.__formWorker = el;
            }
          "
        >
          <q-card class="q-px-sm q-pb-md">
            <div class="row">
              <q-img
                src="imgs/no-image-user.png"
                spinner-color="white"
                class="user-image col"
              />
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input
                  outlined
                  v-model="worker.nameFirst"
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
                  v-model="worker.nameSecond"
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
                  v-model="worker.nameMiddle"
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
                  v-model="worker.personnelNumber"
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
                  v-model="worker.__model_job_pos"
                  :options="jobPositionOptions"
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
                  v-model="worker.__model_date"
                  label-slot
                  mask="date"
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
                        <q-date v-model="worker.__model_date">
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
                  v-model="worker.address"
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
                  v-model="worker.phoneNumber"
                  label="phoneNumber"
                  label-slot
                  type="tel"
                >
                  <template v-slot:label>
                    <q-icon name="phone" /> phoneNumber
                  </template>
                </q-input>

                <br />
                <q-item dense>
                  <span class="text-weight-bold text-red">*</span>
                  Indicates required fields
                </q-item>
              </div>
            </div>
            <q-card-actions align="left">
              <q-btn
                label="Remove"
                color="negative"
                @click="onRemoveWorker(worker)"
              />
              <q-btn
                label="Save"
                class="bg-warning"
                @click="onSaveWorker(worker)"
              />
            </q-card-actions>
          </q-card>
        </q-form>
      </q-expansion-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab icon="add" direction="up" color="accent">
        <q-fab-action
          color="primary"
          icon="add"
          label="add worker"
          @click="onAddNewWorker"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { ref, onBeforeUpdate } from "vue";

export default {
  // name: 'PageName',

  setup() {
    const $q = useQuasar();

    let workers = ref([]);
    let jobPositionOptions = ref([]);
    let isLoadingData = ref(true);

    onBeforeUpdate(() => {
      workers.value.forEach((k, v) => {
        k["__formWorker"].value = null;
      });
    });

    // load jobPositions
    async function loadJobPositions() {
      api
        .get("api/v1/job_positions")
        .then((response) => {
          jobPositionOptions.value = response.data;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    // load workers
    async function loadWorkers() {
      await loadJobPositions();
      api
        .get("api/v1/workers")
        .then((response) => {
          workers.value = response.data;

          workers.value.forEach((k, v) => {
            let cur_job_pos = jobPositionOptions.value.find((obj) => {
              return obj.id === k["fk_job_position"];
            });

            k["__model_job_pos"] = ref(cur_job_pos.id);
            k["__model_date"] = ref(k.birthDate);
            k["__formWorker"] = ref(null);
          });

          isLoadingData.value = false;
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err.message}`,
            icon: "report_problem",
            progress: true,
          });
        });
    }

    loadWorkers();

    /**
     *
     */
    function onAddNewWorker() {
      let id_uniq = "temp_id";
      for (let i = 0; i < 3; i++)
        id_uniq += Math.random().toString(16).slice(2);

      workers.value.push(
        Object.assign(
          {
            __isNew: true,
            __model_job_pos: ref(null),
            __model_date: ref(null),
            __formWorker: ref(null),
            __temp_uniq_id: id_uniq,
          },
          null
        )
      );
    }

    /**
     *
     */
    async function onSaveWorker(worker) {
      let result_validate = await worker.__formWorker.validate();
      if (!result_validate) return;

      if (worker["__model_job_pos"] !== null)
        worker["fk_job_position"] = worker["__model_job_pos"];
      if (worker["__model_date"] !== null)
        worker["birthDate"] = worker["__model_date"];

      if (worker.__isNew) {
        api
          .post(`api/v1/workers`, worker)
          .then((response) => {
            worker.id = response.data.id;

            $q.notify({
              color: "green-4",
              textColor: "white",
              position: "top",
              icon: "cloud_done",
              message: "Worker has been added",
            });
          })
          .catch((err) => {
            let msg_err = `Failed to save to server: ${err.message}`;

            $q.notify({
              color: "negative",
              position: "top",
              message: msg_err,
              icon: "report_problem",
              progress: true,
            });
          });
      } else {
        api
          .put(`api/v1/workers/${worker.id}`, worker)
          .then((response) => {
            $q.notify({
              color: "green-4",
              textColor: "white",
              position: "top",
              icon: "cloud_done",
              message: "Worker has been updated",
            });
          })
          .catch((err) => {
            let msg_err = `Failed to save to server: ${err.message}`;

            $q.notify({
              color: "negative",
              position: "top",
              message: msg_err,
              icon: "report_problem",
              progress: true,
            });
          });
      }
    }

    /**
     *
     */
    async function onRemoveWorker(worker) {
      $q.dialog({
        title: "Removing",
        message: "Remove worker ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          if (worker.id === undefined) {
            // worker was been added but was not saved to server and don't have id
            let idx = workers.value.findIndex((obj, idx) => {
              return obj?.__temp_uniq_id === worker.__temp_uniq_id;
            });

            workers.value.splice(idx, 1);
          } else {
            // worker was been loaded from server and have id from server
            api
              .delete(`api/v1/workers/${worker.id}`)
              .then((response) => {
                let idx = workers.value.findIndex((obj, idx) => {
                  return obj.id === worker.id;
                });

                workers.value.splice(idx, 1);

                $q.notify({
                  color: "green-4",
                  textColor: "white",
                  position: "top",
                  icon: "cloud_done",
                  message: "Worker has been removed",
                });
              })
              .catch((err) => {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: `Failed to remove from server: ${err.message}`,
                  icon: "report_problem",
                  progress: true,
                });
              });
          }
        })
        .onCancel(() => {});
    }

    return {
      workers,
      jobPositionOptions,
      isLoadingData,
      onAddNewWorker,
      onSaveWorker,
      onRemoveWorker,
    };
  },
};
</script>

<style scoped>
.user-image {
  height: 140px;
  max-width: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
