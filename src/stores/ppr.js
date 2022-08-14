import { defineStore } from 'pinia';
import { api } from "boot/axios";
import PprDateTimeModel from "src/models/pprs/PprDateTimeModel";
import * as utils from "src/utils";


export const usePprsStore = defineStore('pprs', {
  state: () => ({
    pprs: [],
    isShowEditDialog: false,
    curEditPpr: null,
  }),

  getters: {
    getPprIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.pprs.length; idx++)
          if (state.pprs[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} param0 
     */
    async loadPprs({ errFunc } = {}) {
      api
        .get("api/v1/pprs/dateTimes/")
        .then((response) => {
          this.pprs = [];
          for (let idx in response.data) {
            let pprDateTime = new PprDateTimeModel(response.data[idx]);

            pprDateTime.dateTimeBegin = utils.getDateTimeLocalFromUTCStr(pprDateTime.dateTimeUTCBegin);
            pprDateTime.dateTimeEnd = utils.getDateTimeLocalFromUTCStr(pprDateTime.dateTimeUTCEnd);


            this.pprs.push(pprDateTime);
          }
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },

    /**
         * 
         */
    async savePpr({ ppr, okFunc, errFunc } = {}) {
      api
        .post("api/v1/pprs/dateTimes/", ppr)
        .then((response) => {
          this.pprs.push(new PprDateTimeModel(response.data));
          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updatePPr({ ppr, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/pprs/dateTimes/${ppr.id}`, ppr)
        .then((response) => {
          let found_idx = this.getPprIdxArrById(ppr.id);
          if (found_idx == null)
            throw (`Error updatePPr: id not found`);

          this.pprs[found_idx] = ppr;

          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async deletePprById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getPprIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/pprs/dateTimes/${this.pprs[found_idx].id}`)
        .then((response) => {
          this.pprs.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },
  }
})
