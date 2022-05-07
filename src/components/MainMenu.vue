<template>
  <!-- Positions -->
  <q-item clickable tag="a" href="#/positions" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Positions </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Equipments folder -->
  <q-item clickable @click="expandEquipments" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="folder_open" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Equipments </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon :name="Equipments_ExpandedIcon" />
    </q-item-section>
  </q-item>

  <!-- У-22 (БУТ) -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/u22/but"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-22 (БУТ) </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-22 (БТ) -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/u22/bt"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-22 (БТ) </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-23 -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/u23"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-23 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-24 (БУ) -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/u24/bu"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-24 (БУ) </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-24 (БП) -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/u24/bp"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-24 (БП) </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ПБР-2 -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/pbr2"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-2 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ПБР-3 -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/pbr3"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-3 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- МЭО -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/im_meo"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МЭО </q-item-label>
    </q-item-section>
  </q-item>

  <!-- im_motor -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/im_motor"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Эл. Мотор </q-item-label>
    </q-item-section>
  </q-item>

  <!-- МСП -->
  <q-item
    clickable
    tag="a"
    href="#/equipments/msp"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МСП </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Measuring Devices -->
  <q-item clickable tag="a" href="#/measuring_devices" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Measuring Devices </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Workers -->
  <q-item clickable tag="a" href="#/workers" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Workers </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Repairs -->
  <q-item clickable tag="a" href="#/repairs" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Repairs </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Reports -->
  <q-item clickable tag="a" href="#/reports" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Reports </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Handbook -->
  <q-item clickable tag="a" href="#/handbook" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Handbook </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "MenuHandBook",
  props: {},

  data() {
    return {
      isEquip_Expanded: false,
      Equipments_ExpandedIcon: "expand_more",
    };
  },

  methods: {
    expandEquipments() {
      this.isEquip_Expanded = !this.isEquip_Expanded;
      if (this.isEquip_Expanded) this.Equipments_ExpandedIcon = "expand_less";
      else this.Equipments_ExpandedIcon = "expand_more";
    },
  },

  mounted() {},

  // setup() {
  //   let example_1_expanded = ref(false);
  //   let Equipments_ExpandedIcon = ref("expand_more");

  //   function expandEquipments() {
  //     example_1_expanded.value = !example_1_expanded.value;
  //     if (example_1_expanded.value) Equipments_ExpandedIcon.value = "expand_less";
  //     else Equipments_ExpandedIcon.value = "expand_more";

  //     // example1_p1
  //     console.log($this.refs.example1_p1);
  //   }
  //   return {
  //     Equipments_ExpandedIcon,
  //     expandEquipments,
  //   };
  // },
});
</script>

<style scoped>
.menu-lvl-1 {
  margin-left: 20px;
}
.menu-lvl-2 {
  margin-left: 40px;
}
</style>
