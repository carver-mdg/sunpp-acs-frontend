<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :maximized="$q.platform.is.mobile ? true : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        {{fileObj}}
      </q-card-section>

      <q-separator />
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from "quasar";
import { defineComponent, ref } from "vue";
import FileModel from "src/models/FileModel.js";
import { api } from "boot/axios";
import * as utils from "src/utils";

export default defineComponent({
  name: "FileFormDescEdit",
  props: {
    fileObj: {
      type: Object,
      required: true,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props, context) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    /**
     *
     */
    const onOKClick = () => onDialogOK();

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
