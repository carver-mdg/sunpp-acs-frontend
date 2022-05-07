<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <div>Quasar v{{ $q.platform }}</div>
    <q-separator color="orange" inset />
    <div>Quasar v{{ $q.version }}</div>

    <div class="q-gutter-xs" style="width: 300px;">
      <q-btn color="brown" label="Button" v-for="n in 7" :key="`xs-${n}`" />

      <q-btn color="blue" label="click me" @click="onBtn1"/>
    </div>

    <a href="#/positions">go pos</a>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

// export default {
//   setup() {
//     function onBtn1() {
//       console.log("btn 1 clicked");
//     }

//     return {
//       name: 'PageIndex',
//       onBtn1
//     }
//   }
// }


export default defineComponent({
  name: 'PageIndex',
  methods: {
    onBtn1() {
      console.log("btn 1 clicked");
    }
  }
})
</script>
