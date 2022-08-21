<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    :maximized="$q.platform.is.mobile ? true : false"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin">
      <div v-if="editableTag == null" class="q-pa-sm bg-amber text-subtitle2">
        {{ $t("Create_new_file_tag") }}
      </div>
      <div v-else class="q-pa-sm bg-amber text-subtitle2">
        {{ $t("Edit_file_tag") }}
      </div>
      <q-separator />

      <q-card-section>
        {{ $t("What_will_it_look_like") }}:
        <q-chip
          dense
          square
          :style="{ backgroundColor: mInpTagBgColor, color: mInpTagFgColor }"
        >
          {{ mInpTagName || "Example"}}
        </q-chip>
        <q-separator />
        <br />

        <q-input
          outlined
          clearable
          v-model="mInpTagName"
          bottom-slots
          label-slot
          :error="
            errMessages.mInpTagName.FieldRequired ||
            errMessages.mInpTagName.ConflictTags
          "
        >
          <template v-slot:label>
            <span class="text-weight-bold text-red">*</span>
            <q-icon name="label" /> {{ $t("Title") }}
          </template>
          <template v-slot:error>
            <div v-if="errMessages.mInpTagName.FieldRequired">
              {{ $t("Field_required") }}
            </div>
            <div v-if="errMessages.mInpTagName.ConflictTags">
              {{ $t("Tag_name_conflict") }}
            </div>
          </template>
        </q-input>

        <q-input
          outlined
          readonly
          v-model="mInpTagBgColor"
          :rules="['anyColor']"
          label-slot
          :error="errMessages.mInpTagBgColor.FieldRequired"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="mInpTagBgColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:label>
            <span class="text-weight-bold text-red">*</span>
            <q-icon name="palette" />
            {{ $t("Tag_bg_color") }}
          </template>
          <template v-slot:error>
            <div v-if="errMessages.mInpTagBgColor.FieldRequired">
              {{ $t("Field_required") }}
            </div>
          </template>
        </q-input>

        <q-input
          outlined
          readonly
          v-model="mInpTagFgColor"
          label-slot
          :rules="['anyColor']"
          :error="errMessages.mInpTagFgColor.FieldRequired"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="mInpTagFgColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:label>
            <span class="text-weight-bold text-red">*</span>
            <q-icon name="palette" /> {{ $t("Tag_text_color") }}
          </template>
          <template v-slot:error>
            <div v-if="errMessages.mInpTagFgColor.FieldRequired">
              {{ $t("Field_required") }}
            </div>
          </template>
        </q-input>

        <q-file outlined v-model="mFileSelect" label-slot clearable disable>
          <template v-slot:label>
            <q-icon name="attach_file" />
            {{ $t("Tag_image") }}
          </template>
        </q-file>
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
import { defineComponent, ref, computed } from "vue";
import FileTagModel from "src/models/files/FileTagModel";
import { api } from "boot/axios";
import { i18n } from "boot/i18n";

export default defineComponent({
  name: "FileFormDescEdit",
  props: {
    listTags: {
      type: Array,
      required: true,
    },
    editableTag: {
      type: Object,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props, context) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    let mInpTagName = ref("");
    let mInpTagBgColor = ref("#CCCCCC");
    let mInpTagFgColor = ref("#000000");
    let mFileSelect = ref(null);

    let errMessages = ref({
      mInpTagName: {},
      mInpTagBgColor: {},
      mInpTagFgColor: {},
    });

    /**
     *
     * @param {String} text
     */
    const isEmptyOrOnlySpaces = (text) =>
      text == null || text.length == 0 || text.replace(/\s/g, "").length == 0;

    /**
     *
     */
    const isErrCheckInputs = () => {
      let err = false;

      // check tag name
      if (!isEmptyOrOnlySpaces(mInpTagName.value)) {
        errMessages.value.mInpTagName["FieldRequired"] = false;
        if (!err) err = false;
      } else {
        errMessages.value.mInpTagName["FieldRequired"] = true;
        err = true;
      }

      // check conflict tags names
      errMessages.value.mInpTagName["ConflictTags"] = false;
      for (let tag of props.listTags)
        if (tag["name"] == mInpTagName.value) {
          err = true;
          errMessages.value.mInpTagName["ConflictTags"] = true;
          break;
        }

      // check tag BgColor
      if (!isEmptyOrOnlySpaces(mInpTagBgColor.value)) {
        errMessages.value.mInpTagBgColor["FieldRequired"] = false;
        if (!err) err = false;
      } else {
        errMessages.value.mInpTagBgColor["FieldRequired"] = true;
        err = true;
      }

      // check tag FgColor
      if (!isEmptyOrOnlySpaces(mInpTagFgColor.value)) {
        errMessages.value.mInpTagFgColor["FieldRequired"] = false;
        if (!err) err = false;
      } else {
        errMessages.value.mInpTagFgColor["FieldRequired"] = true;
        err = true;
      }

      return err;
    };

    /**
     *
     */
    const onOKClick = () => {
      if (isErrCheckInputs()) return;

      return onDialogOK(
        new FileTagModel({
          name: mInpTagName.value,
          bgColor: mInpTagBgColor.value,
          fgColor: mInpTagFgColor.value,
          // imageUrl: null  // not realised
        })
      );
    };

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,

      mInpTagName,
      mInpTagBgColor,
      mInpTagFgColor,
      mFileSelect,

      errMessages,
    };
  },
});
</script>
