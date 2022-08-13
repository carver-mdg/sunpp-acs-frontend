import { defineStore } from 'pinia';
import { api } from "boot/axios";
import WorkerModel from "src/models/workers/WorkerModel";
import WorkerPhotoModel from "src/models/workers/WorkerPhotoModel";

export const useWorkersStore = defineStore('workers', {
  state: () => ({
    workers: [],
    jobPositions: [],
    isShowEditWorkerDialog: false,
    curEditWorker: null,
    curEditWorkerJobPositionsValue: null,
    curEditWorkerPhotosTaggedDeleted: [],
    curEditWorkerPhotosTaggedUploaded: [],
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

    getWorkerById: (state) => {
      return (id) => state.workers.find((worker) => worker.id == id);
    },

    getWorkerByNameSecond: (state) => {
      return (nameSecond) => state.workers.find((worker) => worker.nameSecond == nameSecond);
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
    async loadWorkers({ errFunc } = {}) {
      api
        .get("api/v1/workers")
        .then((response) => {
          this.workers = [];
          for (let idx in response.data)
            this.workers.push(new WorkerModel(response.data[idx]));

          this.loadJobPositions({ errFunc })
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     * @param {*} errFunc 
     */
    async loadJobPositions({ errFunc } = {}) {
      api
        .get("api/v1/job_positions")
        .then((response) => {
          this.jobPositions = response.data;
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async saveWorker({ onUploadProgressFunc, okFunc, errFunc } = {}) {
      this.curEditWorker.fkJobPositionId = this.curEditWorkerJobPositionsValue;

      api
        .post("api/v1/workers", this.curEditWorker)
        .then((response) => {
          let newWorker = new WorkerModel(response.data);
          this.workers.push(newWorker);

          newWorker.photos = [];

          // upload new photos
          let photoObjTaggedUploadedItem = null;
          while (photoObjTaggedUploadedItem = this.curEditWorkerPhotosTaggedUploaded.pop()) {
            this.saveWorkerPhotoByWorkerId({
              workerId: newWorker.id,
              formDataFiles: photoObjTaggedUploadedItem.
                formDataFiles, onUploadProgressFunc,
              errFunc
            });

            newWorker.photos.push(photoObjTaggedUploadedItem.obj);
          }

          okFunc()
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     */
    async updateWorker({ onUploadProgressFunc, okFunc, errFunc } = {}) {
      this.curEditWorker.fkJobPositionId = this.curEditWorkerJobPositionsValue;

      api
        .put(`api/v1/workers/${this.curEditWorker.id}`, this.curEditWorker)
        .then((response) => {
          let found_idx = this.getWorkerIdxArrById(this.curEditWorker.id);
          if (found_idx == null)
            throw (`Error updateWorker: id not found`);

          this.workers[found_idx] = this.curEditWorker;


          // delete photos
          let photoObjTaggedDeletedItem = null;
          while (photoObjTaggedDeletedItem = this.curEditWorkerPhotosTaggedDeleted.pop()) {
            this.deleteWorkerPhotoById({
              worker: this.workers[found_idx],
              photoId: photoObjTaggedDeletedItem.id,
              errFunc
            });
          }

          // upload new photos
          let photoObjTaggedUploadedItem = null;
          while (photoObjTaggedUploadedItem = this.curEditWorkerPhotosTaggedUploaded.pop()) {
            this.saveWorkerPhotoByWorkerId({
              workerId: this.curEditWorker.id,
              formDataFiles: photoObjTaggedUploadedItem.
                formDataFiles, onUploadProgressFunc,
              errFunc
            });
          }

          okFunc();
        })
        .catch((err) =>
          errFunc(err.response?.data?.message_error || err))
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
          errFunc(err.response?.data?.message_error || err);
        })
    },


    /**
     * 
     * @param {*} param0 
     */
    async deleteWorkerPhotoById({ worker, photoId, okFunc, errFunc } = {}) {
      api
        .delete(`api/v1/workers/photos/${photoId}`)
        .then((response) => {
          worker.photos = worker.photos.filter(workerPhoto =>
            workerPhoto.id != photoId
          )
          // okFunc();
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },

    /**
     * 
     */
    async saveWorkerPhotoByWorkerId({ workerId, formDataFiles, onUploadProgressFunc, okFunc, errFunc } = {}) {
      api
        .post(`api/v1/workers/${workerId}/photos/`, formDataFiles, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            onUploadProgressFunc(percentCompleted);
          }
        })
        .then((response) => {
        })
        .catch((err) => {
          errFunc(err.response?.data?.message_error || err);
        })
    },

  }
})
