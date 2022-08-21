class FileModel {
    constructor(fileObj) {
        this.id = fileObj?.id;
        this.name = fileObj?.name || "";
        this.url = fileObj?.url;
        this.blob = fileObj?.blob;
        this.size = fileObj?.size || 0;
        this.desc = fileObj?.desc;
        this.dateTimeRawAdded = fileObj?.dateTimeRawAdded;
        this.dateTimeUTCAdded = fileObj?.dateTimeUTCAdded;
        this.tags = fileObj?.tags || [];
    }
}

export default FileModel;