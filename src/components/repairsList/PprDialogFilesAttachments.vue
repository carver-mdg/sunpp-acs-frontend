<template>
  <!-- notice dialogRef here -->
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :maximized="$q.platform.is.mobile ? true : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section
        class="bg-amber text-black text-subtitle2 text-weight-bold"
      >
        {{ dialogTitleFileAttachment }} <br />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <FilesUploader
          :urlUpload="urlUploadFiles"
          :urlTags="urlTags"
          style="max-width: 400px"
          @onUploadedFile="onUploadedFile"
        />
      </q-card-section>

      <q-card-section>
        <FileList
          :files="filesAttachments"
          :headerBar="true"
          :urlTags="urlTags"
          class="full-width"
          @onUpdate="onEventUpdateFile"
          @onDelete="onEventDeleteFile"
        />
      </q-card-section>

      <q-separator />
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from "quasar";
import { defineComponent, ref } from "vue";
import FileModel from "src/models/files/FileModel";
import FileList from "src/components/Files/FileList";
import FilesUploader from "src/components/Files/FilesUploader.vue";
import { api } from "boot/axios";
import * as utils from "src/utils";

export default {
  name: "PprDialogFilesAttachments",
  props: {
    pprId: {
      type: String,
      required: true,
    },
    dialogTitleFileAttachment: {
      type: String,
    },
  },
  components: {
    FilesUploader,
    FileList,
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props, context) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    let filesToUpload = ref([]);
    let filesAttachments = ref([]);

    let urlUploadFiles = ref(
      `api/v1/repairs/pprs/${props.pprId}/fileAttachment/`
    );
    let urlTags = ref(`api/v1/repairs/pprs/${props.pprId}/fileAttachment/tags/?timestamp=${new Date().getTime()}`);
    // let urlTags = ref(`api/v1/repairs/pprs/${props.pprId}/fileAttachment/tags/`);

    /**
     * Load attachments files
     */
    (async () => {
      api
        .get(`api/v1/repairs/pprs/${props.pprId}/fileAttachment/`)
        .then((response) => {
          for (let idx in response.data) {
            filesAttachments.value.push(new FileModel(response.data[idx]));
          }
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to load data from server: ${err}`,
            icon: "report_problem",
            progress: true,
            closeBtn: true,
          });

          console.error(err.response?.data?.message_error || err);
        });
    })();

    /**
     *
     * @param {FileModel} file
     */
    const onUploadedFile = async (file) => {
      filesAttachments.value.push(file);
    };

    /**
     *
     * @param {*} fileItem
     */
    const onEventUpdateFile = (fileItem) => {
      // console.log(fileItem);
      api
        .put(`api/v1/repairs/pprs/${props.pprId}/fileAttachment/${fileItem.id}`, fileItem)
        .then((response) => {
          // for (let idx in response.data) {
          //   filesAttachments.value.push(new FileModel(response.data[idx]));
          // }

          for(let idx = 0; idx < filesAttachments.value.length; idx++)
            if(filesAttachments.value[idx].id == fileItem.id) {
              filesAttachments.value[idx] = new FileModel(response.data);
              break;
            }
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to update data on server`,
            caption: `${err}`,
            icon: "report_problem",
            progress: true,
            closeBtn: true,
          });

          console.error(err.response?.data?.message_error || err);
        });
    };

    /**
     *
     * @param {*} fileItem
     */
    const onEventDeleteFile = (fileItem) => {
      api
        .delete(
          `api/v1/repairs/pprs/${props.pprId}/fileAttachment/${fileItem.id}`
        )
        .then((response) => {
          let findedIdx = null;
          for (let idx = 0; idx < filesAttachments.value.length; idx++)
            if (filesAttachments.value[idx].id == fileItem.id) {
              findedIdx = idx;
              break;
            }

          if (findedIdx != null) filesAttachments.value.splice(findedIdx, 1);
        })
        .catch((err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to update data on server`,
            caption: `${err}`,
            icon: "report_problem",
            progress: true,
            closeBtn: true,
          });

          console.error(err.response?.data?.message_error || err);
        });
    };

    /**
     *
     */
    const onOKClick = () => onDialogOK();

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
      onUploadedFile,
      onEventUpdateFile,
      onEventDeleteFile,

      filesToUpload,
      filesAttachments,
      urlUploadFiles,
      urlTags,
    };
  },
};
</script>
