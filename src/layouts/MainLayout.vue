<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-blue-grey-9">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> {{ $route.meta.title }} </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>

        <q-btn
          flat
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        />
        <q-btn round>
          <q-avatar>
            <img src="icons/avatars/user-1.svg" />
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup disable>
                  <q-item-section>{{ $t("Files") }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="onClickBtnSettings">
                  <q-item-section>{{ $t("Settings") }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup disable class="text-negative">
                  <q-item-section>{{ $t("Log_out") }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area class="fit q-pa-sm">
        <MainMenu />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { settings } from "../settings.js";
import { useQuasar } from "quasar";
import { ref } from "vue";
import MainMenu from "components/MainMenu";
import SettingsDialogVue from "components/user/SettingsDialog.vue";

export default {
  // name: 'LayoutName',

  components: {
    MainMenu,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);

    /**
     *
     */
    const onClickBtnSettings = () => {
      $q.dialog({
        component: SettingsDialogVue,
        componentProps: {},
      });
    };

    return {
      leftDrawerOpen,
      MainMenu,

      onClickBtnSettings,

      // toggleLeftDrawer() {
      //   leftDrawerOpen.value = !leftDrawerOpen.value;
      // },
    };
  },
};
</script>
