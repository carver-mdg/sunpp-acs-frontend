import { defineStore } from 'pinia';
import { api } from "boot/axios";
import PositionModels from "src/models/positions/PositionModel";
import { useWorkersStore } from "stores/workers";

const storeWorkers = useWorkersStore();

export const usePositionsStore = defineStore('positions', {
  state: () => ({
    positions: [],
    isShowEditDialog: false,
    curEditPosition: null,
    curEditPositionWorkerManagerModelValue: [],
    searchText: '',
    searchedCount: 0,
  }),

  getters: {
    searchPositions: (state) => {
      return (text) => {
        let positionFiltered = state.positions.filter(position => {
          let worker = storeWorkers.getWorkerById(position.fkManagerId);

          if (
            position.pos?.toLowerCase().includes(text.toLowerCase()) ||
            position.unitNum?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.systemSecurity?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.rtzo_sher?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.descShort?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.desc?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.zoneLocation?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.cabinetRemoteControl?.toString().toLowerCase().includes(text.toLowerCase()) ||
            position.cabinetCurrentDistributor?.toString().toLowerCase().includes(text.toLowerCase()) ||
            worker?.nameFirst.toLowerCase().includes(text.toLowerCase()) ||
            worker?.nameSecond.toLowerCase().includes(text.toLowerCase()) ||
            worker?.nameMiddle.toLowerCase().includes(text.toLowerCase())
          ) return true;
        }
        )

        state.searchedCount = positionFiltered.length;
        return positionFiltered;
      }
    },

    getPositionById: (state) => {
      return (id) => state.positions.find((pos) => pos.id == id);
    },

    getPositionByPositionName: (state) => {
      return (posTitle) => state.positions.find((pos) => pos.pos.toLowerCase().includes(posTitle.toLowerCase()));
    },

    getPositionIdxArrById: (state) => {
      return (id) => {
        for (let idx = 0; idx < state.positions.length; idx++)
          if (state.positions[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} param0 
     */
    async loadPositions({ errFunc } = {}) {
      api
        .get("api/v1/positions/")
        .then((response) => {
          this.positions = [];
          for (let idx in response.data)
            this.positions.push(new PositionModels(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },

    /**
         * 
         */
    async savePosition({ position, okFunc, errFunc } = {}) {
      api
        .post("api/v1/positions/", position)
        .then((response) => {
          this.positions.push(response.data);
          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updatePosition({ position, okFunc, errFunc } = {}) {
      api
        .put(`api/v1/positions/${position.id}`, position)
        .then((response) => {
          let found_idx = this.getPositionIdxArrById(position.id);
          if (found_idx == null)
            throw (`Error updatePosition: id not found`);

          this.positions[found_idx] = position;

          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async deletePositionById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getPositionIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/positions/${this.positions[found_idx].id}`)
        .then((response) => {
          this.positions.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },
  }
})
