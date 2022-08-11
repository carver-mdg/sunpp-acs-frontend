import { defineStore } from 'pinia';
import { api } from "boot/axios";
import ImMotorModel from "src/models/equipments/imMotor/ImMotorModel";
import { usePositionsStore } from "stores/positions";

const storePositions = usePositionsStore();

export const useImMotorStore = defineStore('imMotor', {
  state: () => ({
    imMotor_s: [],
    isShowEditDialog: false,
    curEditImMotor: null,
    curEditImMotorPosModelValue: null,
    curEditImMotorPosOptions: [],
    searchText: '',
    searchedCount: 0,
  }),

  getters: {
    searchImMotor: (state) => {
      return (text) => {
        let imMotorFiltered = state.imMotor_s.filter(imMotor => {
          let searchText = text.toLowerCase();
          if (
            imMotor.serialNumber.toLowerCase().includes(searchText) ||
            imMotor.yearManufacture.toString().toLowerCase().includes(searchText) ||
            storePositions.getPositionById(imMotor.fkPosInstalledId)?.pos.toLowerCase().includes(searchText)
          ) return true;
        })

        state.searchedCount = imMotorFiltered.length;
        return imMotorFiltered;
      }
    },

    getImMotorIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.imMotor_s.length; idx++)
          if (state.imMotor_s[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} errFunc 
     */
    async loadImMotor_s(errFunc) {
      api
        .get("api/v1/equipments/imMotor/")
        .then((response) => {

          this.imMotor_s = [];
          for (let idx in response.data)
            this.imMotor_s.push(new ImMotorModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async saveImMotor({ imMotor, okFunc, errFunc } = {}) {
      api
        .post("api/v1/equipments/imMotor", imMotor)
        .then((response) => {
          this.imMotor_s.push(response.data);
          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updateImMotor({ imMotor, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/equipments/imMotor/${imMotor.id}`, imMotor)
        .then((response) => {
          let found_idx = this.getImMotorIdxArrById(imMotor.id);
          if (found_idx == null)
            throw (`Error updateImMotor: id not found`);

          this.imMotor_s[found_idx] = imMotor;

          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async deleteImMotorById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getImMotorIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/equipments/imMotor/${this.imMotor_s[found_idx].id}`)
        .then((response) => {
          this.imMotor_s.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },
  }
})
