<template>
  <div v-show="isShow">
    <q-card-section v-show="isShow">
      <div>Component U23</div>
      <!-- <q-input
    outlined
    clearable
    :model-value="model_insulation_resistance"
    :label="label_insulation_resistance"
    :hint="label_insulation_resistance"
  >
    <q-tooltip>
      {{ label_insulation_resistance }}
    </q-tooltip>
  </q-input> -->
      <div>
        <!-- <input type="text" v-model="formData.name" placeholder="Your name" />
      <input type="number" v-model.number="formData.age" /> -->
        <q-select
          filled
          v-model="equip.model_type_repair"
          fill-input
          input-debounce="0"
          :options="equip.type_repair_options"
          :hint="equip.type_repair_hint"
          :label="equip.type_repair_label"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-space />

      <q-btn
        label="Cancel-1"
        color="primary"
        v-close-popup
        @click="onAddRepairCancel"
      />
      <q-btn
        label="add-1"
        class="bg-warning"
        v-close-popup
        @click="onAddRepair"
      />
    </q-card-actions>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "U23",

  props: {
    isShow: {
      required: false,
      default: true,
    },
    equip_data: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    let equip = ref({});
    equip.value = {
      model_type_repair: ref(null),
      type_repair_options: ref(props.equip_data.type_repairs),
      type_repair_hint: ref("hint"),
      type_repair_label: ref("label"),
    };

    return {
      equip,
    };
  },

  // watch: {
  //   equip: {
  //     handler: function () {
  //       // this.$emit("newdata", [this.formData.name, this.formData.age]);
  //       // this.$emit("newdata", this.formData);
  //       this.$emit("newdata", this.equip);
  //     },
  //     deep: true,
  //   },
  // },
});
</script>
