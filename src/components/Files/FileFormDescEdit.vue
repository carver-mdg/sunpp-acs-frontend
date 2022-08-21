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
        <br />

        <q-select
          outlined
          v-model="mSelTags"
          use-input
          use-chips
          multiple
          input-debounce="0"
          :options="tagsOptions"
          @filter="onFilterTags"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          label="tags"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-chip
                  dense
                  square
                  :style="{
                    backgroundColor: scope.opt.bgColor,
                    color: scope.opt.fgColor,
                  }"
                >
                  {{ scope.opt.name }}
                </q-chip>
              </q-item-section>
              <q-item-section></q-item-section>
              <q-item-section side>
                <q-icon v-if="scope.itemProps.active" name="check" />
              </q-item-section>
              <q-separator />
            </q-item>
          </template>

          <template v-slot:selected>
            <q-chip
              v-for="itemId in mSelTags"
              :key="itemId"
              dense
              square
              :style="{
                backgroundColor: getObjectTagById(itemId)?.bgColor,
                color: getObjectTagById(itemId)?.fgColor,
              }"
            >
              {{ getObjectTagById(itemId)?.name }}
            </q-chip>
          </template>
        </q-select>
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
import FileDialogEditTag from "components/Files/FileDialogEditTag";

export default defineComponent({
  name: "FileFormDescEdit",
  props: {
    fileObj: {
      type: Object,
      required: true,
    },
    listTags: {
      type: Array,
      required: true,
    },
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    let mInpFileDesc = ref(props.fileObj.desc);
    let mSelTags = ref(props.fileObj.tags.map((item) => item.id));
    let tagsOptions = ref(props.listTags);

    /**
     *
     * @param {*} id
     */
    const getObjectTagById = (id) => {
      for (let item of tagsOptions.value) if (item.id == id) return item;
      return null;
    };

    /**
     *
     * @param {*} val
     * @param {*} done
     */
    const onFilterTags = (val, update, abort) => {
      update(() => {
        if (val.length == 0) {
          tagsOptions.value = props.listTags;
          return;
        }

        tagsOptions.value = props.listTags.filter(
          (tag) => tag.name.toLowerCase().indexOf(val?.toLowerCase()) > -1
        );
      });
    };

    /**
     *
     */
    const onOKClick = () => {
      onDialogOK({
        desc: mInpFileDesc.value,
        tags: mSelTags.value,
      });
    };

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
      onFilterTags,
      getObjectTagById,

      mInpFileDesc,
      mSelTags,
      tagsOptions,
    };
  },
});
</script>
