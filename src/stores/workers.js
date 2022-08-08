import { defineStore } from 'pinia';
import { api } from "boot/axios";
import WorkerModel from "../models/WorkerModel"

export const useWorkersStore = defineStore('workers', {
  state: () => ({
    workers: [],
    jobPositions: [],
    isShowEditWorkerDialog: false,
    curEditWorker: null,
    curEditWorkerJobPositionsValue: null,
  }),

  getters: {
    getWorkersByIds: (state) => {
      return (ids) => {
        let workers = [];
        ids.forEach(id => {
          workers.push(state.workers.find(worker => worker.id == id))
        })
        return workers;
      }
    },

    getJobPositionById: (state) => {
      return (id) => state.jobPositions.find((jobPos) => jobPos.id == id);
    },

    getWorkerIdxArrById: (state) => {
      // return (id) => state.workers.find((worker) => worker.id == id);
      return (id) => {
        for (let idx = 0; idx < state.workers.length; idx++)
          if (state.workers[idx].id == id)
            return idx;
      }
    }
  },

  actions: {
    /**
     * 
     * @param {*} errFunc 
     */
    async loadWorkers(errFunc) {
      api
        .get("api/v1/workers")
        .then((response) => {
          // this.workers = response.data;
          // console.log(this.workers);

          this.workers = [];
          for (let idx in response.data)
            this.workers.push(new WorkerModel(response.data[idx]));
        })
        .catch((err) => {
          errFunc(err);
        })
    },

    /**
     * 
     * @param {*} errFunc 
     */
    async loadJobPositions(errFunc) {
      api
        .get("api/v1/job_positions")
        .then((response) => {
          this.jobPositions = response.data;
          // console.log(this.jobPositions);
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async saveWorker({ okFunc, errFunc } = {}) {
      this.curEditWorker.fk_job_position = this.curEditWorkerJobPositionsValue;

      api
        .post("api/v1/workers", this.curEditWorker)
        .then((response) => {
          this.workers.push(response.data);
          okFunc()
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async updateWorker({ okFunc, errFunc } = {}) {
      this.curEditWorker.fk_job_position = this.curEditWorkerJobPositionsValue;
      console.log(this.curEditWorker);

      api
        .put(`api/v1/workers/${this.curEditWorker.id}`, this.curEditWorker)
        .then((response) => {
          let found_idx = this.getWorkerIdxArrById(this.curEditWorker.id);
          if (found_idx == null)
            throw (`Error updateWorker: id not found`);

          this.workers[found_idx] = this.curEditWorker;

          okFunc();
        })
        .catch((err) => {
          errFunc(err);
        })
    },


    /**
     * 
     */
    async deleteWorkerById({ id, okFunc, errFunc } = {}) {
      let found_idx = this.getWorkerIdxArrById(id);
      if (found_idx == null) return;

      api
        .delete(`api/v1/workers/${this.workers[found_idx].id}`)
        .then((response) => {
          this.workers.splice(found_idx, 1);
          okFunc();
        })
        .catch((err) => {
          errFunc(err);
        })
    },
  }
})
