class FileModel {
    constructor(fileObj) {
        this.id = fileObj?.id;
        this.name = fileObj?.name || "fdsf";
        this.url = fileObj?.url;
        this.desc = fileObj?.desc;
        this.dateTimeAdded = fileObj?.dateTimeAdded;
        this.dateTimeUTCAdded = fileObj?.dateTimeUTCAdded;


        // this.id = "1";
        // this.name = "1";
        // this.url = "1";
        // this.desc = "1";
        // this.dateTimeAdded = "1";
        // this.dateTimeUTCAdded = "1";
    }
}

export default FileModel;