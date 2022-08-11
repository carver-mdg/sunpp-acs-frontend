import { defineStore } from 'pinia';
import { api } from "boot/axios";
import RepairTypeModel from "src/models/equipments/RepairTypeModel";
import ImMotorRepairModel from "src/models/equipments/imMotor/ImMotorRepairModel";

export const useImMotorRepairsStore = defineStore('imMotorRepairs', {
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
    curEditRepairImMotor: null,
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
        .get("api/v1/equipments/imMotor/repairs/type_repairs")
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
    async loadRepairsByImMotorId({ imMotorId, errFunc } = {}) {
      api
        .get(`api/v1/equipments/imMotor/${imMotorId}/repairs`)
        .then((response) => {
          this.repairs = [];
          for (let idx in response.data)
            this.repairs.push(new ImMotorRepairModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async saveRepair({ imMotorRepair, okFunc, errFunc } = {}) {
      api
        .post("api/v1/equipments/imMotor/repairs", imMotorRepair)
        .then((response) => {
          this.repairs.push(new ImMotorRepairModel(response.data));
          okFunc()
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async updateRepair({ imMotorRepair, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/equipments/imMotor/repairs/${imMotorRepair.id}`, imMotorRepair)
        .then((response) => {
          let found_idx = this.getRepairsIdxArrById(imMotorRepair.id);
          if (found_idx == null)
            throw (`Error updateRepair: id not found`);

          this.repairs[found_idx] = imMotorRepair;

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
        .delete(`api/v1/equipments/imMotor/repairs/${this.repairs[found_idx].id}`)
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
