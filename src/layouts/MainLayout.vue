<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ $route.meta.title }} </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
        
        <q-btn
        flat
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        />
      </q-toolbar>

      <!-- <q-tabs>
        <q-route-tab to="/positions" replace label="Positions" />
        <q-route-tab to="/equipments" replace label="Equipments" />
        <q-route-tab
          to="/measuring_devices"
          replace
          label="Measuring Devices"
        />
        <q-route-tab to="/workers" replace label="Workers" />
        <q-route-tab to="/repairs" replace label="Repairs" />
        <q-route-tab to="/reports" replace label="Reports" />
        <q-route-tab to="/handbook" replace label="Handbook" />
      </q-tabs> -->
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit q-pa-sm">
        <MainMenu />
        <!-- <q-list>
          <q-item-section>
            <q-item clickable tag="a" href="#/positions"> Positions </q-item>
            <q-item clickable tag="a" href="#/equipments"> Equipments </q-item>
            <q-item clickable tag="a" href="#/measuring_devices"> Measuring Devices </q-item>
            <q-item clickable tag="a" href="#/workers"> Workers </q-item>
            <q-item clickable tag="a" href="#/repairs"> Repairs </q-item>
            <q-item clickable tag="a" href="#/reports"> Reports </q-item>
            <q-item clickable tag="a" href="#/handbook"> Handbook </q-item>
          </q-item-section>
        </q-list> -->
        <!-- <q-list dense bordered class="fixed-bottom">
          <q-item-section>
            <q-item
              clickable
              v-ripple
              @click="wndSettings_model = !wndSettings_model"
            >
              <q-icon name="settings" size="sm" /> Settings
            </q-item>

            <q-item>
              <q-toggle v-model="darkTheme" @update:model-value="toogleTheme">
                Dark Theme
              </q-toggle>
            </q-item>
          </q-item-section>
        </q-list> -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

    <!-- <q-dialog v-model="wndSettings_model" persistent>
      <q-card class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Settings: <q-separator /></div>
        </q-card-section>

        <q-item dense>
          <q-input
            outlined
            v-model="settings_model.backend_ip"
            label="Backend IP:"
          />
        </q-item>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Save"
            class="bg-warning"
            v-close-popup
            @click="onSettingsSaveChanges"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-layout>
</template>

<script>
// import { settings } from "../settings.js";
import { useQuasar } from "quasar";
import { ref } from "vue";
import MainMenu from "components/MainMenu";

export default {
  // name: 'LayoutName',

  components: {
    MainMenu,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    // const darkTheme = ref(false);

    // let settings_model = ref(settings);
    // let wndSettings_model = ref(false);

    // function toogleTheme(val) {
    //   $q.dark.set(val);
    // }

    return {
      leftDrawerOpen,
      MainMenu,

      // darkTheme,
      // toogleTheme,

      // settings_model,
      // wndSettings_model,

      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      // onSettingsSaveChanges() {
      //   localStorage.setItem("settings", JSON.stringify(settings_model.value));
      // },
    };
  },
};
</script>
