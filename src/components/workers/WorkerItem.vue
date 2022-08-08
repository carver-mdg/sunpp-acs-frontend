<template>
  <q-card class="bg-grey-1 col-2 self-start" style="width: 180px">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-subtitle2">
            {{ worker.nameSecond }} {{ worker.nameFirst }}
            {{ worker.nameMiddle }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable @click="onEditWorker(worker)">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="edit" class="col" />
                      <div class="col">Edit</div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="onDeleteWorker(worker.id)">
                  <q-item-section>
                    <div class="row items-center">
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
      <div class="text-caption text-grey-6">Имя</div>
      <div class="text-body2">{{ worker.nameFirst || "-" }}</div>

      <div class="text-caption text-grey-6">Фамилия</div>
      <div class="text-body2">{{ worker.nameSecond || "-" }}</div>

      <div class="text-caption text-grey-6">Отчество</div>
      <div class="text-body2">{{ worker.nameMiddle || "-" }}</div>

      <div class="text-caption text-grey-6">Табельный номер</div>
      <div class="text-body2">{{ worker.personnelNumber || "-" }}</div>

      <div class="text-caption text-grey-6">Должность</div>
      <div class="text-body2">
        {{ storeWorkers.getJobPositionById(worker.fk_job_position)?.title }}
      </div>

      <div class="text-caption text-grey-6">Адрес</div>
      <div class="text-body2">{{ worker.address || "-" }}</div>

      <div class="text-caption text-grey-6">Дата рожджения</div>
      <div class="text-body2">{{ worker.birthDate || "-" }}</div>

      <div class="text-caption text-grey-6">Номер телефона</div>
      <div class="text-body2">{{ worker.phoneNumber || "-" }}</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useWorkersStore } from "stores/workers";

export default defineComponent({
  name: "WorkerItem",
  props: {
    worker: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const storeWorkers = useWorkersStore();

    const onEditWorker = (worker) => {
      storeWorkers.isShowEditWorkerDialog = true;
      storeWorkers.curEditWorker = Object.assign({}, worker);
      storeWorkers.curEditWorkerJobPositionsValue = worker.fk_job_position;
    };

    const onDeleteWorker = (id) => {
      $q.dialog({
        title: "Delete worker",
        message: `Are you sure you want to permanently 
                    delete this worker (
                        ${props.worker.nameSecond} 
                        ${props.worker.nameFirst} 
                        ${props.worker.nameMiddle}
                        ) ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          storeWorkers.deleteWorkerById({
            id,
            okFunc: () => {
              $q.notify({
                color: "green-4",
                textColor: "white",
                position: "top",
                icon: "cloud_done",
                message: "Worker has been deleted",
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
      storeWorkers,
      onEditWorker,
      onDeleteWorker,
    };
  },
});
</script>
