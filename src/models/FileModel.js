class FileModel {
    constructor(fileObj) {
        this.id = fileObj?.id;
        this.name = fileObj?.name || "";
        this.url = fileObj?.url;
        this.blob = fileObj?.blob;
        this.desc = fileObj?.desc;
        this.dateTimeRawAdded = fileObj?.dateTimeRawAdded;
        this.dateTimeUTCAdded = fileObj?.dateTimeUTCAdded;
    }
}

export default FileModel;