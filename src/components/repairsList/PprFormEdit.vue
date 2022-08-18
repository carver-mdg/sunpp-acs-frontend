<template>
  <q-form greedy ref="formEditPpr">
    <q-dialog
      v-model="storePprs.isShowEditDialog"
      persistent
      :maximized="$q.platform.is.mobile ? true : false"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div class="text-h6">ППР</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row items-center justify-center">
          <div>
            <q-input
              outlined
              clearable
              v-model="storePprs.curEditPpr.name"
              label="Название"
            />
            <br />

            <q-select
              outlined
              clearable
              v-model="storePprs.curEditPpr.numPowerUnit"
              :options="['1 ЭБ', '2 ЭБ', '3 ЭБ']"
              label-slot
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="perm_identity" /> Номер блока
              </template>
            </q-select>

            <q-input
              outlined
              clearable
              v-model="storePprs.curEditPpr.dateTimeBegin"
              label-slot
              mask="##.##.####, ##:##"
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="calendar_today" /> Дата начала ППР
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyDateTimeBegin"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    class="q-pa-md"
                  >
                    <div class="bg-grey-1">
                      <div class="row items-center justify-center">
                        <q-date
                          v-model="storePprs.curEditPpr.dateTimeBegin"
                          mask="DD.MM.YYYY, HH:mm"
                        />
                        <q-time
                          v-model="storePprs.curEditPpr.dateTimeBegin"
                          mask="DD.MM.YYYY, HH:mm"
                          format24h
                          color="purple"
                        />
                      </div>
                      <br />
                      <q-separator />
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" />
                      </div>
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              outlined
              clearable
              v-model="storePprs.curEditPpr.dateTimeEnd"
              label-slot
              mask="##.##.####, ##:##"
              reactive-rules
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                <span class="text-weight-bold text-red">*</span>
                <q-icon name="calendar_today" /> Дата окончания ППР
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyDateTimeEnd"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    class="q-pa-md"
                  >
                    <div class="bg-grey-1">
                      <div class="row items-center justify-center">
                        <q-date
                          v-model="storePprs.curEditPpr.dateTimeEnd"
                          mask="DD.MM.YYYY, HH:mm"
                        />
                        <q-time
                          v-model="storePprs.curEditPpr.dateTimeEnd"
                          mask="DD.MM.YYYY, HH:mm"
                          format24h
                          color="purple"
                        />
                      </div>
                      <br />
                      <q-separator />
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" />
                      </div>
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-weight-bold text-red">*</span>
          Indicates required fields
        </q-card-section>

        <q-separator />
        <q-card-actions align="right" >
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn
            v-if="storePprs.curEditPpr.id"
            label="Update"
            color="amber-14"
            text-color="black"
            @click="onClickBtnUpdatePpr"
          />
          <q-btn
            v-else
            label="Save"
            color="positive"
            @click="onClickBtnSaveMsp"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { usePprsStore } from "stores/ppr";
import * as utils from "src/utils";

export default defineComponent({
  name: "PprFormEdit",
  setup() {
    const $q = useQuasar();
    const storePprs = usePprsStore();

    let formEditPpr = ref(null);

    /**
     *
     */
    const onClickBtnSaveMsp = async () => {
      let result_validate = await formEditPpr.value.validate();
      if (!result_validate) return;

      //convert dateTime to UTC
      try {
        storePprs.curEditPpr.dateTimeUTCBegin = utils.getDateTimeUTCFromStr(
          storePprs.curEditPpr.dateTimeBegin
        );

        storePprs.curEditPpr.dateTimeUTCEnd = utils.getDateTimeUTCFromStr(
          storePprs.curEditPpr.dateTimeEnd
        );
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "top",
          message: `${err}`,
          icon: "report_problem",
          progress: true,
        });

        console.error(err);
        return;
      }

      storePprs.savePpr({
        ppr: storePprs.curEditPpr,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Ppr has been added",
            progress: true,
          });

          storePprs.isShowEditDialog = false;
        },
        errFunc: (err) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: `Failed to save data to server: ${err}`,
            icon: "report_problem",
            progress: true,
          });
        },
      });
    };

    /**
     *
     */
    const onClickBtnUpdatePpr = async () => {
      let result_validate = await formEditPpr.value.validate();
      if (!result_validate) return;

      // console.log(storePprs.curEditPpr.dateTimeUTCBegin);
      // console.log(storePprs.curEditPpr.dateTimeBegin);

      //convert dateTime to UTC
      try {
        storePprs.curEditPpr.dateTimeUTCBegin = utils.getDateTimeUTCFromStr(
          storePprs.curEditPpr.dateTimeBegin
        );

        storePprs.curEditPpr.dateTimeUTCEnd = utils.getDateTimeUTCFromStr(
          storePprs.curEditPpr.dateTimeEnd
        );
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "top",
          message: `${err}`,
          icon: "report_problem",
          progress: true,
        });

        console.error(err);
        return;
      }

      storePprs.updatePPr({
        ppr: storePprs.curEditPpr,
        okFunc: () => {
          $q.notify({
            color: "green-4",
            textColor: "white",
            position: "top",
            icon: "cloud_done",
            message: "Ppr has been updated",
            progress: true,
          });

          storePprs.isShowEditDialog = false;
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

    return {
      formEditPpr,
      storePprs,
      onClickBtnSaveMsp,
      onClickBtnUpdatePpr,
    };
  },
});
</script>
