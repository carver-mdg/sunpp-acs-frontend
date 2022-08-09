import { defineStore } from 'pinia';
import { api } from "boot/axios";
import RepairTypeModel from "src/models/equipments/RepairTypeModel";
import MspRepairModel from "src/models/equipments/msp/MspRepairModel";

export const useMspRepairsStore = defineStore('mspRepairs', {
  state: () => ({
    isShowRepairsListDialog: false,
    isShowRepairEditDialog: false,
    curEditRepair: null,
    curEditRepairTypeRepairModelValue: null,
    curEditRepairPosInstalledModelValue: null,
    curEditRepairPosInstalledOptions: [],
    curEditRepairPosRemovedModelValue: null,
    curEditRepairPosRemovedOptions: [],
    curEditRepairWorkersModelValue: [],
    curEditRepairMsp: null,
    typeRepairs: [],
    repairs: []
  }),

  getters: {
    getTypeRepairById: (state) => {
      return (id) => state.typeRepairs.find(typeRepair => typeRepair.id == id);
    },

    getRepairsIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.repairs.length; idx++)
          if (state.repairs[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} errFunc 
     */
    async loadTypeRepairs(errFunc) {
      api
        .get("api/v1/equipments/msp/repairs/type_repairs")
        .then((response) => {
          this.typeRepairs = [];
          for (let idx in response.data)
            this.typeRepairs.push(new RepairTypeModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     * @param {*} errFunc 
     */
    async loadRepairsByMspId({ mspId, errFunc } = {}) {
      api
        .get(`api/v1/equipments/msp/${mspId}/repairs`)
        .then((response) => {
          this.repairs = [];
          for (let idx in response.data)
            this.repairs.push(new MspRepairModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async saveRepair({ mspRepair, okFunc, errFunc } = {}) {
      api
        .post("api/v1/equipments/msp/repairs", mspRepair)
        .then((response) => {
          this.repairs.push(new MspRepairModel(response.data));
          okFunc()
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async updateRepair({ mspRepair, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/equipments/msp/repairs/${mspRepair.id}`, mspRepair)
        .then((response) => {
          let found_idx = this.getRepairsIdxArrById(mspRepair.id);
          if (found_idx == null)
            throw (`Error updateRepair: id not found`);

          this.repairs[found_idx] = mspRepair;

          okFunc();
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async deleteRepairsById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getRepairsIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/equipments/msp/repairs/${this.repairs[found_idx].id}`)
        .then((response) => {
          this.repairs.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err);
        })
    },
  }
})
