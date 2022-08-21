<template>
  <div
    @dragover.prevent
    @dragover="onDragoverFilesToUpload"
    @dragleave="onDragleaveFilesToUpload"
    @drop.prevent
    @drop="onDropFilesToUpload"
    :class="dropZoneClass"
  >
    <div class="q-pa-sm bg-amber row no-wrap">
      <div class="col q-gutter-xs">
        <q-btn
          flat
          dense
          square
          icon="clear_all"
          color="black"
          @click="onClickBtnClearFilesToUpload"
        >
          <q-tooltip>{{$t('clear_all')}}</q-tooltip>
        </q-btn>
      </div>
      <div class="col-7">
        <div class="text-subtitle2">
          {{ $t("upload_your_files") }}
        </div>
        <div class="text-caption">
          {{ filesAddedToUploadTotalSizeLabel }} /
          {{ filesAddedToUploadPercentUpload }} %
        </div>
      </div>
      <div class="col q-gutter-xs">
        <q-btn
          flat
          dense
          square
          icon="add"
          color="black"
          @click="onClickBtnAddFilesToUpload"
        >
          <q-tooltip>{{ $t("add_file_s") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          square
          dark-percentage
          unelevated
          :disable="filesAddedToUpload.length == 0"
          :percentage="filesAddedToUploadPercentUpload"
          :loading="isUploadingFilesLoading"
          icon="cloud_upload"
          color="black"
          @click="onClickBtnUploadFilesToUpload"
        >
          <q-tooltip>{{$t('upload_file_s')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row no-wrap drop-zone" style="height: 200px">
      <div
        v-if="filesAddedToUpload.length == 0"
        class="row justify-center items-center full-height full-width"
      >
        <div>
          {{ $t("drop_files_to_upload") }}
          <q-img
            src="icons/drop_file.svg"
            fit="contain"
            style="max-width: 100px"
          />
        </div>
      </div>

      <FileList
        v-if="filesAddedToUpload.length > 0"
        :files="filesAddedToUpload"
        :urlTags="urlTags"
        :headerBar="false"
        :btnEditdVisibled="false"
        :btnDownloadVisibled="false"
        class="full-width"
        @onUpdate="onUpdateFileDesc"
        @onDelete="onDeleteFile"
      />
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, defineAsyncComponent, ref } from "vue";
import FileModel from "src/models/files/FileModel";
import FileList from "src/components/Files/FileList";
import { api } from "boot/axios";
import * as utils from "src/utils";

export default defineComponent({
  name: "FilesUploader",
  components: {
    FileList,
  },
  props: {
    urlUpload: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    urlTags: {
      type: String,
      required: true,
    }
  },

  emits: ["onUploadedFile"],

  setup(props, { emit }) {
    const $q = useQuasar();

    let dropZoneClass = ref("");

    let filesAddedToUpload = ref([]);
    let filesAddedToUploadTotalSize = 0;
    let filesAddedToUploadTotalSizeLabel = ref(
      utils.bytesToSize(filesAddedToUploadTotalSize)
    );

    let filesAddedToUploadPercentUpload = ref(0);
    let arrPercentagesUpload = ref({}); // (nameFile = percent upload)
    let countFilesBeforeUpload = 0;
    let isUploadingFilesLoading = ref(false);

    /**
     *
     * @param {FileList} files
     */
    const addFilesToUpload = (files) => {
      [...files]
        .filter((file) => {
          if (
            filesAddedToUpload.value.filter((fau) => fau?.name == file.name)
              .length > 0
          ) {
            $q.notify({
              color: "warning",
              textColor: "black",
              position: "top",
              message: `Duplicate files not allowed`,
              caption: `'${file.name}'`,
              icon: "warning",
              progress: true,
              closeBtn: true,
            });

            return false;
          }
          return true;
        })
        .map((file) => {
          filesAddedToUploadTotalSize += file.size;
          filesAddedToUploadTotalSizeLabel.value = utils.bytesToSize(
            filesAddedToUploadTotalSize
          );
          countFilesBeforeUpload++;

          const dateTime = new Date().toLocaleDateString("ru-UA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          let dateTimeUTC = utils.getDateTimeUTCFromStr(dateTime);
          filesAddedToUpload.value.push(
            new FileModel({
              name: file.name,
              blob: file,
              size: file.size,
              desc: null,
              tags: [],
              dateTimeRawAdded: dateTime,
              dateTimeUTCAdded: dateTimeUTC,
            })
          );
        });
    };

    /**
     *
     */
    const onClickBtnAddFilesToUpload = () => {
      let anchor = document.createElement("input");
      anchor.type = "file";
      anchor.accept = "*.*";
      anchor.multiple = props.multiple ? "multiple" : "";
      anchor.click();

      anchor.onchange = function () {
        if (!props.multiple) {
          if (filesAddedToUpload.value.length >= 1) {
            $q.notify({
              color: "warning",
              textColor: "black",
              position: "top",
              message: `Allowed only one file to add`,
              icon: "warning",
              progress: true,
              closeBtn: true,
            });

            return;
          }

          addFilesToUpload([this.files[0]]);
          return;
        }

        addFilesToUpload(this.files);
      };
    };

    /**
     *
     * @param {*} e
     */
    const onDropFilesToUpload = (e) => {
      dropZoneClass.value = "";

      if (!props.multiple) {
        if (filesAddedToUpload.value.length >= 1) {
          $q.notify({
            color: "warning",
            textColor: "black",
            position: "top",
            message: `Allowed only one file to add`,
            icon: "warning",
            progress: true,
            closeBtn: true,
          });

          return;
        }

        addFilesToUpload([e.dataTransfer.files[0]]);
        return;
      }

      addFilesToUpload(e.dataTransfer.files);
    };

    /**
     *
     */
    const onClickBtnUploadFilesToUpload = () => {
      filesAddedToUpload.value.map((file) => {
        let reader = new FileReader();
        reader.onload = (function (thFile) {
          return function (e) {
            isUploadingFilesLoading.value = true;
            arrPercentagesUpload.value[file.name] = 0;

            let fileModel = new FileModel(file);
            delete fileModel["blob"];

            let formDataSender = new FormData();
            formDataSender.append("fileUpload", thFile);
            formDataSender.append("fileModelObj", JSON.stringify(fileModel));

            api
              .post(props.urlUpload, formDataSender, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                  let percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );

                  arrPercentagesUpload.value[file.name] = percent;
                  let sumPercentagesUploadFiles = 0;

                  for (let prop in arrPercentagesUpload.value)
                    sumPercentagesUploadFiles +=
                      arrPercentagesUpload.value[prop];

                  // recalc general percent upload files
                  filesAddedToUploadPercentUpload.value = Math.round(
                    sumPercentagesUploadFiles / countFilesBeforeUpload
                  );
                },
              })
              .then((response) => {
                emit("onUploadedFile", new FileModel(response.data));
                deleteFileAddedToUpload(file);

                // all files downloaded => clear percents
                if (filesAddedToUpload.value.length == 0) {
                  countFilesBeforeUpload = 0;
                  arrPercentagesUpload.value = {};
                  filesAddedToUploadPercentUpload.value = 0;
                  isUploadingFilesLoading.value = false;
                }
              })
              .catch((err) => {
                let errMsg = err.response?.data?.message_error || err;
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: `Error upload ro server`,
                  caption: `'${errMsg}'`,
                  icon: "report_problem",
                  progress: true,
                  closeBtn: true,
                });

                countFilesBeforeUpload = filesAddedToUpload.value.length;
                arrPercentagesUpload.value = {};
                filesAddedToUploadPercentUpload.value = 0;
                isUploadingFilesLoading.value = false;

                console.error(errMsg);
              });
          };
        })(file.blob);

        reader.readAsBinaryString(file.blob);
      });
    };

    /**
     *
     * @param {*} file
     */
    const onUpdateFileDesc = (fileItem) => {
      console.log(fileItem);
    };

    /**
     *
     * @param {*} fileItem
     */
    const onDeleteFile = (fileItem) => {
      deleteFileAddedToUpload(fileItem);
    };

    /**
     *
     */
    const deleteFileAddedToUpload = (fileItem) => {
      let filtered = filesAddedToUpload.value.filter((fm) => {
        if (fm.name == fileItem?.name) {
          filesAddedToUploadTotalSize -= fileItem.blob.size;
          filesAddedToUploadTotalSizeLabel.value = utils.bytesToSize(
            filesAddedToUploadTotalSize
          );
          return false;
        }
        return true;
      });

      filesAddedToUpload.value = [...filtered];
    };

    /**
     *
     */
    const onClickBtnClearFilesToUpload = () => {
      filesAddedToUpload.value = [];
      filesAddedToUploadTotalSize = 0;
      filesAddedToUploadTotalSizeLabel.value = utils.bytesToSize(
        filesAddedToUploadTotalSize
      );
    };

    /**
     *
     */
    const onDragoverFilesToUpload = () => {
      dropZoneClass.value = "drop-zone-dragover";
    };

    /**
     *
     */
    const onDragleaveFilesToUpload = () => {
      dropZoneClass.value = "";
    };

    /**
     *
     */
    const onClickBtnFileDescEdit = (fileItem) => {
      console.log(fileItem);
    };

    /**
     *
     */
    const onClickBtnFileDelete = (fileItem) => {
      console.log(fileItem);
    };

    return {
      onClickBtnFileDescEdit,
      onClickBtnFileDelete,

      onUpdateFileDesc,
      onDeleteFile,

      onClickBtnClearFilesToUpload,
      onClickBtnAddFilesToUpload,
      onClickBtnUploadFilesToUpload,
      onDropFilesToUpload,
      onDragoverFilesToUpload,
      onDragleaveFilesToUpload,

      dropZoneClass,
      filesAddedToUpload,
      filesAddedToUploadTotalSizeLabel,
      filesAddedToUploadPercentUpload,
      arrPercentagesUpload,
      isUploadingFilesLoading,
    };
  },
});
</script>

<style scoped>
.drop-zone {
  border: 1px solid #ccc;
}
.drop-zone-dragover {
  border: 3px dashed #ccc;
  opacity: 0.4;
}
</style>
