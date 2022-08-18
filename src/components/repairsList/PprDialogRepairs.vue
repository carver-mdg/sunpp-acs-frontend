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
        Перечень выполненых работ в ППР
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="У-22"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="У-23"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="У-24"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="ПБР-2"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="ПБР-3"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="им. МЭО"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="им. эл. мотор"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="Схема АР"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="Схема ДУ"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="Схема ЭЧ"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            disable
            expand-separator
            icon="construction"
            label="Сопротивление изоляции контрольного кабеля"
            caption="msp"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <!-- <q-btn color="primary" label="Cancel" @click="onCancelClick" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from "quasar";
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";
import * as utils from "src/utils";

export default {
  name: "PprDialogRepairs",
  props: {},

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
};
</script>
