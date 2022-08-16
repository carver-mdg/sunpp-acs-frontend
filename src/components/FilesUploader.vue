<template>
  <!-- @dragover.prevent -->
  <div
    @dragover.prevent
    @dragover="dragoverFilesToUpload"
    @dragleave="dragleaveFilesToUpload"
    @drop.prevent
    @drop="dropFilesToUpload"
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
        />
      </div>
      <div class="col-7">
        <div class="text-subtitle2">Upload your files</div>
        <div class="text-caption">
          {{ filesAddedToUploadTotalSizeLabel }} /
          {{ filesAddedToUploadPercentUpload }} %
        </div>
      </div>
      <div class="col q-gutter-xs">
        <q-btn
          disable
          flat
          dense
          square
          icon="add"
          color="black"
          @click="onClickBtnAddFilesToUpload"
        />
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
        />
      </div>
    </div>
    <div class="row no-wrap" style="height: 200px">
      <q-list bordered separator class="scroll full-width">
        <q-item clickable v-for="file in filesAddedToUpload" :key="file.obj.id">
          <q-item-section side>
            <q-img
              class="q-pa-lg"
              :src="getFileExtensionIcon(file.obj.name)"
              fit="contain"
            >
              <template v-slot:error>
                <div
                  class="absolute-full flex flex-center bg-negative text-white"
                >
                  Cannot load image
                </div>
              </template>
            </q-img>
          </q-item-section>
          <q-item-section class="overflow-hidden">
            <q-item-label>
              {{ file.obj.name }}
            </q-item-label>
            <q-item-label caption>
              {{ file.obj.desc }}
            </q-item-label>
            <q-item-label caption>
              <q-separator />
              {{ file.obj.dateTimeAdded }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div>
              <q-btn
                flat
                dense
                icon="edit"
                color="primary"
                @click="onClickBtnFileAddedDescEdit(file)"
              >
                <q-tooltip>Редактировать описание</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                @click="onClickBtnFileAddedDelete(file)"
              >
                <q-tooltip>Удалить файл</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-if="filesAddedToUpload.length == 0"
          class="row justify-center items-center full-height"
        >
          <div>
            Drop files to upload
            <q-img  src="icons/drop_file.svg" fit="contain" style="max-width: 100px" />
          </div>
          
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import FileModel from "src/models/FileModel.js";
import { api } from "boot/axios";
import * as utils from "src/utils";

export default defineComponent({
  name: "FilesUploader",
  props: {
    files: Array,
  },

  setup(props, context) {
    const $q = useQuasar();

    let dropZoneClass = ref("");

    // let filesAttachment = ref(props.files);
    let filesAddedToUpload = ref([]);
    // filesAttachment.value.push({
    //   id: "id1",
    //   name: "dsf.png",
    //   desc: "sdf",
    //   dateTimeAdded: "dd",
    // });
    // let filesAttachmentFiltered = ref([...filesAttachment.value]);
    // let filesReadyToUpload = ref([]);
    let filesAddedToUploadTotalSize = 0;
    let filesAddedToUploadTotalSizeLabel = ref(
      utils.bytesToSize(filesAddedToUploadTotalSize)
    );
    let filesAddedToUploadPercentUpload = ref(0);
    let arrPercentagesUpload = ref({}); // object of download files (nameFile = percent upload)
    let countFilesBeforeUpload = 0;
    let isUploadingFilesLoading = ref(false);
    // let isShowSearchBar = ref(false);
    // let mSearchFiles = ref(null);

    /**
     *
     * @param {*} value
     */
    const oUpdateSearchFiles = (searchText) => {
      if (searchText == null) {
        filesAttachmentFiltered.value = [...filesAttachment.value];
        return;
      }

      filesAttachmentFiltered.value = filesAttachment.value.filter(
        (fileObj) =>
          fileObj?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
          fileObj?.desc?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
          fileObj?.date?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
    };

    /**
     *
     */
    const onClickBtnAddFilesToUpload = () => {};

    /**
     *
     */
    const onClickBtnUploadFilesToUpload = () => {
      filesAddedToUpload.value.map((file) => {
        let reader = new FileReader();
        reader.onload = (function (thFile) {
          return function (e) {
            isUploadingFilesLoading.value = true;
            arrPercentagesUpload.value[file.obj.name] = 0;

            let formDataSender = new FormData();
            formDataSender.append("fileUpload", thFile);
            formDataSender.append(
              "fileModelObj",
              JSON.stringify(new FileModel(file.obj))
            );

            api
              .post(`api/v1/file/`, formDataSender, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  // accept: "application/json",
                },
                onUploadProgress: (progressEvent) => {
                  let percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );

                  arrPercentagesUpload.value[file.obj.name] = percent;
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
                console.log(err);
                // @WARNING:  add external errFunc
                // errFunc(err.response?.data?.message_error || err);
              });
          };
        })(file.blob);

        reader.readAsBinaryString(file.blob);
      });
    };

    /**
     *
     */
    const onClickBtnFileAddedDescEdit = (fileItem) => {
      console.log(fileItem);
    };

    /**
     *
     */
    const onClickBtnFileAddedDelete = (fileItem) => {
      console.log(fileItem);
      deleteFileAddedToUpload(fileItem);
    };

    /**
     *
     * @param {*} fileName
     */
    const getFileExtensionIcon = (fileName) => {
      switch (fileName.split(".").pop()?.toLowerCase()) {
        case "doc":
        case "docx":
          return "icons/file_extension/icon_docx.svg";

        case "ppt":
        case "pptx":
          return "icons/file_extension/icon_pptx.svg";

        case "xls":
        case "xlsx":
          return "icons/file_extension/icon_xlsx.svg";

        case "rtf":
          return "icons/file_extension/icon_rtf.svg";

        case "txt":
          return "icons/file_extension/icon_txt.svg";

        case "dwg":
          return "icons/file_extension/icon_dwg.svg";

        case "exe":
          return "icons/file_extension/icon_exe.svg";

        case "jpg":
          return "icons/file_extension/icon_jpg.svg";

        case "png":
          return "icons/file_extension/icon_png.svg";

        case "svg":
          return "icons/file_extension/icon_svg.svg";

        case "pdf":
          return "icons/file_extension/icon_pdf.svg";

        case "zip":
          return "icons/file_extension/icon_zip.svg";

        case "rar":
          return "icons/file_extension/icon_rar.svg";

        default:
          return "icons/file_extension/icon_unknow.svg";
      }
      return "icons/file_extension/icon_unknow.svg";
    };

    /**
     *
     */
    const deleteFileAddedToUpload = (fileItem) => {
      let filtered = filesAddedToUpload.value.filter((fm) => {
        if (fm.obj.name == fileItem?.obj.name) {
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
     * @param {*} e
     */
    const uploadFile = (e) => {
      // console.log(e.target.files);
      filesReadyToUpload.value.push(...e.target.files);
    };

    /**
     *
     */
    const dragoverFilesToUpload = (e) => {
      console.log("dragoverFilesToUpload");
      dropZoneClass.value = "drop-zone";
    };

    /**
     *
     */
    const dragleaveFilesToUpload = (e) => {
      console.log("dragleaveFilesToUpload");
      dropZoneClass.value = "";
    };

    /**
     *
     * @param {*} e
     */
    const dropFilesToUpload = (e) => {
      dropZoneClass.value = "";

      [...e.dataTransfer.files].map((file) => {
        // disallow duplicate files
        if (
          filesAddedToUpload.value.find((fau) => fau?.obj?.name == file.name) !=
          null
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
          return;
        }

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

        let dateTimeUTC = utils.getDateTimeUTCFromStr(
          dateTime.replace(",", "")
        );

        filesAddedToUpload.value.push({
          blob: file,
          obj: new FileModel({
            name: file.name,
            desc: "dgfd",
            dateTimeAdded: dateTime,
            dateTimeUTCAdded: dateTimeUTC,
          }),
        });
      });
      return;
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
      oUpdateSearchFiles,
      getFileExtensionIcon,
      onClickBtnFileDescEdit,
      onClickBtnFileDelete,
      onClickBtnFileAddedDescEdit,
      onClickBtnFileAddedDelete,
      onClickBtnClearFilesToUpload,
      onClickBtnAddFilesToUpload,
      onClickBtnUploadFilesToUpload,
      uploadFile,
      dropFilesToUpload,
      dragoverFilesToUpload,
      dragleaveFilesToUpload,

      dropZoneClass,
      // isShowSearchBar,
      filesAddedToUpload,
      filesAddedToUploadTotalSizeLabel,
      filesAddedToUploadPercentUpload,
      arrPercentagesUpload,
      // filesAttachment,
      // filesAttachmentFiltered,
      // filesReadyToUpload,
      isUploadingFilesLoading,
      // mSearchFiles,
    };
  },
});
</script>

<style scoped>
.drop-zone {
  border: 3px dashed #ccc;
  opacity: 0.4;
}
</style>
