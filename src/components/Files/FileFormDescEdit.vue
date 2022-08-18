<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :maximized="$q.platform.is.mobile ? true : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin">
      <div class="q-pa-sm bg-amber text-subtitle2">
        Edit file description, tags
      </div>
      <q-separator />

      <q-card-section>
        <q-input
          outlined
          clearable
          v-model="mInpFileDesc"
          label="desc"
          type="textarea"
        />
      </q-card-section>

      <!-- <q-card-section>
        <q-btn
          dense
          square
          icon="add_box"
          color="primary"
          @click="onClickBtnAddTag"
        >
          <q-tooltip>Add tag</q-tooltip>
        </q-btn>
        <q-btn
          dense
          square
          icon="queue"
          color="primary"
          @click="onClickBtnAddTag"
        >
          <q-tooltip>Add group tag</q-tooltip>
        </q-btn>
      </q-card-section> -->

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
    let mInpFileDesc = ref(props.fileObj.desc);

    // let mChips = ref([]);
    // le

    /**
     *
     */
    const onOKClick = () => {
      onDialogOK({
        desc: mInpFileDesc.value,
      });
    };

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,

      mInpFileDesc,
    };
  },
});
</script>
