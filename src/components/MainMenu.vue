<template>
  <!-- Home -->
  <q-item clickable @click="router.push('/')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="home" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Home </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Positions -->
  <q-item clickable @click="router.push('/positions')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="ballot" />
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

  <!-- У-22  -->
  <q-item
    clickable
    @click="expandEquipments_U22"
    v-ripple.early
    v-if="isEquip_Expanded"
    class="menu-lvl-1"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-22 </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon :name="Equipments_U22_ExpandedIcon" />
    </q-item-section>
  </q-item>

  <!-- У-22 (БУТ) -->
  <q-item
    clickable
    @click="router.push('/equipments/u22/but')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U22_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> БУТ </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-22 (БТ) -->
  <q-item
    clickable
    @click="router.push('/equipments/u22/bt')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U22_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> БТ </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-22 (ремонты) -->
  <q-item
    clickable
    @click="router.push('/equipments/u22/repairs')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U22_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Ремонты </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-23 -->
  <q-item
    clickable
    @click="router.push('/equipments/u23')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-23 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-24  -->
  <q-item
    clickable
    @click="expandEquipments_U24"
    v-ripple.early
    v-if="isEquip_Expanded"
    class="menu-lvl-1"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-24 </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon :name="Equipments_U24_ExpandedIcon" />
    </q-item-section>
  </q-item>

  <!-- У-24 (БУ) -->
  <q-item
    clickable
    @click="router.push('/equipments/u24/bu')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U24_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> БУ </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-24 (БП) -->
  <q-item
    clickable
    @click="router.push('/equipments/u24/bp')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U24_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> БП </q-item-label>
    </q-item-section>
  </q-item>

  <!-- У-24 (ремонты) -->
  <q-item
    clickable
    @click="router.push('/equipments/u24/repairs')"
    class="menu-lvl-2"
    v-ripple.early
    v-if="isEquip_U24_Expanded && isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Ремонты </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ПБР-2 -->
  <q-item
    clickable
    @click="router.push('/equipments/pbr2')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-2 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ПБР-3 -->
  <q-item
    clickable
    @click="router.push('/equipments/pbr3')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-3 </q-item-label>
    </q-item-section>
  </q-item>

  <!-- МЭО -->
  <q-item
    clickable
    @click="router.push('/equipments/im_meo')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МЭО </q-item-label>
    </q-item-section>
  </q-item>

  <!-- im_motor -->
  <q-item
    clickable
    @click="router.push('/equipments/im_motor')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Эл. Мотор </q-item-label>
    </q-item-section>
  </q-item>

  <!-- МСП -->
  <q-item
    clickable
    @click="router.push('/equipments/msp')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МСП </q-item-label>
    </q-item-section>
  </q-item>

  <q-separator class="menu-lvl-1" v-if="isEquip_Expanded" />

  <!-- АР -->
  <q-item
    clickable
    @click="router.push('/equipments/ar')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Схема АР </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ДУ -->
  <q-item
    clickable
    @click="router.push('/equipments/du')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Схема ДУ </q-item-label>
    </q-item-section>
  </q-item>

  <!-- ЭЧ -->
  <q-item
    clickable
    @click="router.push('/equipments/ech')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Схема ЭЧ </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Сопротивление изоляции контрольного кабеля -->
  <q-item
    clickable
    @click="router.push('/equipments/ech')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="construction" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Сопротивление изоляции контрольного кабеля </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Импорт ремонтов из Excel -->
  <q-separator />
  <q-item
    clickable
    @click="router.push('/equipments/repairs_import')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isEquip_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="file_download" color="amber-14" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-amber-14"> Импорт ремонтов из Excel </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Repairs folder -->
  <!-- <q-item clickable @click="expandRepairs" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="folder_open" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Repairs </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon :name="Repairs_ExpandedIcon" />
    </q-item-section>
  </q-item> -->

  <!-- У-22 -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/u22')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-22 </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- У-23 -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/u23')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-23 </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- У-24 -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/u24')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> У-24 </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- ПБР-2 -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/pbr2')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-2 </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- ПБР-3 -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/pbr3')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ПБР-3 </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- МЭО -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/im_meo')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МЭО </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- im_motor -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/im_motor')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Эл. Мотор </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- МСП -->
  <!-- <q-item
    clickable
    @click="router.push('/repairs/msp')"
    class="menu-lvl-1"
    v-ripple.early
    v-if="isRepairs_Expanded"
  >
    <q-item-section avatar>
      <q-icon name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label> МСП </q-item-label>
    </q-item-section>
  </q-item> -->

  <!-- Measuring Devices -->
  <q-item clickable @click="router.push('/measuring_devices')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="electric_meter" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Measuring Devices </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Workers -->
  <q-item clickable @click="router.push('/workers')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="people" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Workers </q-item-label>
    </q-item-section>
  </q-item>

  <!-- PPR -->
  <q-item clickable @click="router.push('/ppr')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="history" />
    </q-item-section>

    <q-item-section>
      <q-item-label> ППР </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Reports -->
  <q-item clickable @click="router.push('/reports')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="assignment" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Reports </q-item-label>
    </q-item-section>
  </q-item>

  <!-- Handbook -->
  <q-item clickable @click="router.push('/handbook')" v-ripple.early>
    <q-item-section avatar>
      <q-icon name="help_center" />
    </q-item-section>

    <q-item-section>
      <q-item-label> Handbook </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MenuHandBook",
  props: {},

  setup() {
    const router = useRouter();

    let isEquip_Expanded = ref(false);
    let Equipments_ExpandedIcon = ref("expand_more");
    let isEquip_U22_Expanded = ref(false);
    let Equipments_U22_ExpandedIcon = ref("expand_more");
    let isEquip_U24_Expanded = ref(false);
    let Equipments_U24_ExpandedIcon = ref("expand_more");
    let isRepairs_Expanded = ref(false);
    let Repairs_ExpandedIcon = ref("expand_more");

    function expandEquipments() {
      isEquip_Expanded.value = !isEquip_Expanded.value;
      if (isEquip_Expanded.value) Equipments_ExpandedIcon.value = "expand_less";
      else Equipments_ExpandedIcon.value = "expand_more";
    }

    function expandEquipments_U22() {
      isEquip_U22_Expanded.value = !isEquip_U22_Expanded.value;
      if (isEquip_U22_Expanded.value)
        Equipments_U22_ExpandedIcon.value = "expand_less";
      else Equipments_U22_ExpandedIcon.value = "expand_more";
    }

    function expandEquipments_U24() {
      isEquip_U24_Expanded.value = !isEquip_U24_Expanded.value;
      if (isEquip_U24_Expanded.value)
        Equipments_U24_ExpandedIcon.value = "expand_less";
      else Equipments_U24_ExpandedIcon.value = "expand_more";
    }

    function expandRepairs() {
      isRepairs_Expanded.value = !isRepairs_Expanded.value;
      if (isRepairs_Expanded.value) Repairs_ExpandedIcon.value = "expand_less";
      else Repairs_ExpandedIcon.value = "expand_more";
    }

    return {
      router,
      expandEquipments,
      expandEquipments_U22,
      expandEquipments_U24,
      expandRepairs,
      isEquip_Expanded,
      Equipments_ExpandedIcon,
      isEquip_U22_Expanded,
      Equipments_U22_ExpandedIcon,
      isEquip_U24_Expanded,
      Equipments_U24_ExpandedIcon,
      isRepairs_Expanded,
      Repairs_ExpandedIcon,
    };
  },

  // data() {
  //   return {
  //     isEquip_Expanded: false,
  //     Equipments_ExpandedIcon: "expand_more",
  //     isRepairs_Expanded: false,
  //     Repairs_ExpandedIcon: "expand_more",
  //   };
  // },

  // methods: {
  //   expandEquipments() {
  //     this.isEquip_Expanded = !this.isEquip_Expanded;
  //     if (this.isEquip_Expanded) this.Equipments_ExpandedIcon = "expand_less";
  //     else this.Equipments_ExpandedIcon = "expand_more";
  //   },
  // },

  // mounted() {},

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
.menu-lvl-3 {
  margin-left: 60px;
}
</style>
