import { defineStore } from 'pinia';
import { api } from "boot/axios";

export const usePositionsStore = defineStore('positions', {
  state: () => ({
    positions: []
  }),

  getters: {
    getPositionById: (state) => {
      return (id) => state.positions.find((pos) => pos.id == id);
    },

    getIdByPosition: (state) => {
      return (pos_title) => state.positions.find((pos) => pos.pos.toLowerCase().includes(pos_title.toLowerCase()));
    },
  },

  actions: {
    async loadPositions(errFunc) {
      api
        .get("api/v1/positions")
        .then((response) => {
          this.positions = response.data;
        })
        .catch((err) => {
          errFunc(err);
        })


      // try {
      //   let response = api.get("api/v1/positionss");
      //   this.positions = await response.data;
      // }
      // catch (err) {
      //   // if (errFunc) 
      //   errFunc(err);
      // }
    }
  }
})
