class WorkerPhotoModel {
    constructor(workerPhoto) {
        this.id = workerPhoto?.id;
        this.fileNameOriginal = workerPhoto?.fileNameOriginal
        this.fkWorkerId = workerPhoto?.fkWorkerId;
        // this.workerPhotoCacheFileName = workerPhoto?.workerPhotoCacheFileName;
        // this.workerPhotoCacheFileThumbnailName = workerPhoto?.workerPhotoCacheFileThumbnailName;
        this.workerPhotoUrl = workerPhoto?.workerPhotoUrl || '';
        this.workerPhotoThumbnailUrl = workerPhoto?.workerPhotoThumbnailUrl;
        this.workerPhotoWidth = workerPhoto?.workerPhotoWidth;
        this.workerPhotoHeight = workerPhoto?.workerPhotoHeight;
    }
}

export default WorkerPhotoModel;