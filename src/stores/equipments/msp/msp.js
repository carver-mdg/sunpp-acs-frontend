import { defineStore } from 'pinia';
import { api } from "boot/axios";
import MspModel from "../../../models/equipments/msp/MspModel";
import { usePositionsStore } from "stores/positions";

const storePositions = usePositionsStore();

export const useMspStore = defineStore('msp', {
  state: () => ({
    msp_s: [],
    isShowEditDialog: false,
    curEditMsp: null,
    curEditMspPosModelValue: null,
    curEditMspPosOptions: [],
    searchText: '',
  }),

  getters: {
    searchMsp: (state) => {
      return (text) => state.msp_s.filter(msp =>
        msp.serialNumber.toLowerCase().includes(text) ||
        msp.yearManufacture.toString().toLowerCase().includes(text) ||
        storePositions.getPositionById(msp.fkPosInstalledId)?.pos.toLowerCase().includes(text))
    },

    getMspIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.msp_s.length; idx++)
          if (state.msp_s[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} errFunc 
     */
    async loadMsp_s(errFunc) {
      api
        .get("api/v1/equipments/msp/")
        .then((response) => {

          this.msp_s = [];
          for (let idx in response.data)
            this.msp_s.push(new MspModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async saveMsp({ msp, okFunc, errFunc } = {}) {
      api
        .post("api/v1/equipments/msp", msp)
        .then((response) => {
          this.msp_s.push(response.data);
          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updateMsp({ msp, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/equipments/msp/${msp.id}`, msp)
        .then((response) => {
          let found_idx = this.getMspIdxArrById(msp.id);
          if (found_idx == null)
            throw (`Error updateMsp: id not found`);

          this.msp_s[found_idx] = msp;

          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async deleteMspById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getMspIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/equipments/msp/${this.msp_s[found_idx].id}`)
        .then((response) => {
          this.msp_s.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },
  }
})
