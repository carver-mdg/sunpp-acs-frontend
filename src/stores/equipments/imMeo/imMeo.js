import { defineStore } from 'pinia';
import { api } from "boot/axios";
import ImMeoModel from "src/models/equipments/imMeo/ImMeoModel";
import { usePositionsStore } from "stores/positions";

const storePositions = usePositionsStore();

export const useImMeoStore = defineStore('imMeo', {
  state: () => ({
    imMeo_s: [],
    isShowEditDialog: false,
    curEditImMeo: null,
    curEditImMeoPosModelValue: null,
    curEditImMeoPosOptions: [],
    searchText: '',
    searchedCount: 0,
  }),

  getters: {
    searchImMeo: (state) => {
      return (text) => {
        let imMeoFiltered = state.imMeo_s.filter(imMeo => {
          let searchText = text.toLowerCase();
          if (
            imMeo.serialNumber.toLowerCase().includes(searchText) ||
            imMeo.yearManufacture.toString().toLowerCase().includes(searchText) ||
            storePositions.getPositionById(imMeo.fkPosInstalledId)?.pos.toLowerCase().includes(searchText)
          ) return true;
        })

        state.searchedCount = imMeoFiltered.length;
        return imMeoFiltered;
      }
    },

    getImMeoIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.imMeo_s.length; idx++)
          if (state.imMeo_s[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} errFunc 
     */
    async loadImMeo_s(errFunc) {
      api
        .get("api/v1/equipments/imMeo/")
        .then((response) => {

          this.imMeo_s = [];
          for (let idx in response.data)
            this.imMeo_s.push(new ImMeoModel(response.data[idx]));
          console.log(this.imMeo_s)
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async saveImMeo({ imMeo, okFunc, errFunc } = {}) {
      api
        .post("api/v1/equipments/imMeo", imMeo)
        .then((response) => {
          this.imMeo_s.push(response.data);
          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updateImMeo({ imMeo, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/equipments/imMeo/${imMeo.id}`, imMeo)
        .then((response) => {
          let found_idx = this.getImMeoIdxArrById(imMeo.id);
          if (found_idx == null)
            throw (`Error updateImMeo: id not found`);

          this.imMeo_s[found_idx] = imMeo;

          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async deleteImMeoById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getImMeoIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/equipments/imMeo/${this.imMeo_s[found_idx].id}`)
        .then((response) => {
          this.imMeo_s.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },
  }
})
