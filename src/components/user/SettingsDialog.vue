<template>
  <q-form greedy ref="formWorker">
    <q-dialog
      ref="dialogRef"
      @hide="onDialogHide"
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">{{ $t("Settings") }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="mInpServerIP"
              label="serverIP"
              @update:model-value="onUpdateInpServerIP"
            />

            <br />
            <q-select
              v-model="locale"
              :options="localeOptions"
              :label="$t('Language')"
              outlined
              borderless
              emit-value
              map-options
              options-selected-class="text-deep-orange"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img :src="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:selected>
                <q-img
                  :src="getLanguageIconByValue"
                  style="max-width: 30px; max-height: 30px"
                  contain
                />
                <q-space /> {{ getLanguageLabelByValue }}
              </template>
            </q-select>
            <!-- {{globalVars.serverIP }} -->
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn color="primary" label="OK" @click="onOKClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from "quasar";
import {
  defineComponent,
  defineAsyncComponent,
  computed,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "SettingsDialog",
  components: {},
  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const { locale } = useI18n({ useScope: "global" });
    let localeOptions = [
      { value: "en-US", label: "English", icon: "icons/flags/usa.svg" },
      { value: "ru", label: "Русский", icon: "icons/flags/russia.svg" },
      { value: "ua", label: "Українська", icon: "icons/flags/ukraine.svg" },
    ];
    let mInpServerIP = ref(api.defaults.baseURL);

    /**
     *
     */
    const getLanguageIconByValue = computed(() => {
      for (const item of localeOptions)
        if (item.value == locale.value) return item.icon;
      return null;
    });

    /**
     *
     */
    const getLanguageLabelByValue = computed(() => {
      for (const item of localeOptions)
        if (item.value == locale.value) return item.label;
      return null;
    });

    /**
     *
     * @param {*} value
     */
    const onUpdateInpServerIP = (value) =>
      (api.defaults.baseURL = mInpServerIP.value);

    /**
     *
     */
    const onOKClick = () => onDialogOK();
    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
      onUpdateInpServerIP,
      getLanguageIconByValue,
      getLanguageLabelByValue,

      mInpServerIP,
      locale,
      localeOptions,
    };
  },
});
</script>
