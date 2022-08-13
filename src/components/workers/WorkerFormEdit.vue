<template>
  <q-form greedy ref="formWorker">
    <q-dialog
      v-model="storeWorkers.isShowEditWorkerDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">Worker</div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <SimpleGallery
            :galleryID="`formEditGalleryID-${storeWorkers.curEditWorker.id}`"
            :images="storeWorkers.curEditWorker.photos"
            :imagesBindingNames="{
              imageUrl: 'workerPhotoUrl',
              imageThumbnailUrl: 'workerPhotoThumbnailUrl',
              imageWidth: 'workerPhotoWidth',
              imageHeight: 'workerPhotoHeight',
            }"
            btnDelete
            :onClickBtnDelete="onClickGalleryBtnDelete"
          />

          <q-btn
            flat
            icon="add_a_photo"
            color="primary"
            @click="onClickBtnCreatePhoto"
          />
          <q-btn
            flat
            icon="add_photo_alternate"
            color="primary"
            @click="onClickBtnUpLoadPhotoFiles"
          />
        </q-card-section>
        <q-separator />

        <q-card-section class="row items-center justify-center">
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
                <q-icon name="perm_identity" /> Имя
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
                <q-icon name="perm_identity" /> Фамилия
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
                <q-icon name="perm_identity" /> Отчество
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
                <q-icon name="key" /> Табельный номер
              </template>
            </q-input>

            <q-select
              outlined
              clearable
              v-model="storeWorkers.curEditWorkerJobPositionsValue"
              :options="storeWorkers.jobPositions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Должность"
              label-slot
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                Должность
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
                <q-icon name="calendar_today" /> Дата рождения
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
                Домашний адрес
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
                <q-icon name="phone" /> Номер телефона
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
          <q-btn label="Cancel" color="primary" @click="onClickBtnCancel" />
          <q-btn
            v-if="storeWorkers.curEditWorker.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onClickBtnUpdateWorker"
          />
          <q-btn
            v-else
            label="Save"
            color="positive"
            @click="onClickBtnSaveWorker"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useWorkersStore } from "stores/workers";
// import SimpleGallery from "src/components/SimpleGallery.vue";
import WorkerPhotoModel from "src/models/workers/WorkerPhotoModel";
import { api } from "boot/axios";

export default defineComponent({
  name: "WorkerFormEdit",
  components: {
    // SimpleGallery,
    SimpleGallery: defineAsyncComponent(() =>
      import("src/components/SimpleGallery.vue")
    ),
  },

  setup(props) {
    const $q = useQuasar();
    const storeWorkers = useWorkersStore();
    let formWorker = ref(null);

    /**
     *
     */
    const onClickGalleryBtnDelete = async (photoObj) => {
      $q.dialog({
        title: "Delete worker photo",
        message: `Are you sure you want to delete photo ?`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          if (!photoObj.id.startsWith("genClient-"))
            storeWorkers.curEditWorkerPhotosTaggedDeleted.push(photoObj);

          storeWorkers.curEditWorker.photos =
            storeWorkers.curEditWorker.photos.filter(
              (workerPhoto) => workerPhoto.id != photoObj.id
            );
        })
        .onCancel(() => {});
    };

    /**
     *
     */
    const onClickBtnSaveWorker = async () => {
      let result_validate = await formWorker.value.validate();
      if (!result_validate) return;

      const notif = $q.notify({
        group: false,
        timeout: 0,
        spinner: true,
        message: "Saving...",
      });

      storeWorkers.saveWorker({
        onUploadProgressFunc: (percentage) => {
          notif({
            caption: `${percentage} %`,
          });

          if (percentage >= 100) {
            notif({
              icon: "done",
              spinner: false,
              message: "Uploading done!",
              timeout: 300,
            });
          }
        },
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Worker has been added",
            progress: true,
          });

          storeWorkers.isShowEditWorkerDialog = false;
          notif({
            timeout: 1,
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
    const onClickBtnCancel = async () => {
      storeWorkers.isShowEditWorkerDialog = false;
      storeWorkers.curEditWorkerPhotosTaggedDeleted = [];
      storeWorkers.curEditWorkerPhotosTaggedUploaded = [];
    };

    /**
     *
     */
    const onClickBtnUpdateWorker = async () => {
      let result_validate = await formWorker.value.validate();
      if (!result_validate) return;

      const notif = $q.notify({
        group: false,
        timeout: 0,
        spinner: true,
        message: "Updating...",
        // caption: "0%",
      });

      storeWorkers.updateWorker({
        onUploadProgressFunc: (percentage) => {
          notif({
            caption: `${percentage} %`,
          });

          if (percentage >= 100) {
            notif({
              icon: "done",
              spinner: false,
              message: "Uploading done!",
              timeout: 300,
            });
          }
        },
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Worker has been updated",
            progress: true,
          });

          storeWorkers.isShowEditWorkerDialog = false;
          notif({
            timeout: 1,
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

    /**
     *
     */
    const onClickBtnCreatePhoto = async () => {};

    /**
     *
     */
    const onClickBtnUpLoadPhotoFiles = async () => {
      let anchor = document.createElement("input");
      anchor.type = "file";
      anchor.accept = "image/png, image/gif, image/jpeg";
      anchor.multiple = "multiple";
      anchor.click();

      anchor.onchange = function () {
        [].forEach.call(this.files, function (file, index) {
          var reader = new FileReader();
          reader.onload = (function (theFile) {
            return function (e) {
              const imageUrl = URL.createObjectURL(theFile);
              const image = new Image();
              image.src = imageUrl;
              const imageThumbnailUrl = imageUrl; //temp

              image.onload = () => {
                let workerPhotoObject = new WorkerPhotoModel({
                  id: `genClient-${Math.random()
                    .toString(16)
                    .slice(2)}${Math.random().toString(16).slice(2)}`,
                  fileNameOriginal: theFile.name,
                  fkWorkerId: storeWorkers.curEditWorker.id,
                  workerPhotoUrl: imageUrl,
                  workerPhotoThumbnailUrl: imageThumbnailUrl,
                  workerPhotoWidth: image.width,
                  workerPhotoHeight: image.height,
                });

                let formDataFiles = new FormData();
                formDataFiles.append("files", theFile);

                storeWorkers.curEditWorkerPhotosTaggedUploaded.push({
                  obj: workerPhotoObject,
                  formDataFiles,
                });
                storeWorkers.curEditWorker.photos.push(
                  workerPhotoObject
                );
              };
            };
          })(file);

          reader.readAsBinaryString(file);
        });
      };
    };

    return {
      formWorker,
      storeWorkers,
      onClickBtnSaveWorker,
      onClickBtnUpdateWorker,
      onClickBtnCreatePhoto,
      onClickBtnUpLoadPhotoFiles,
      onClickGalleryBtnDelete,
      onClickBtnCancel,
    };
  },
});
</script>
