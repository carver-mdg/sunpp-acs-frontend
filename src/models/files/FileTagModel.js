class FileTagModel {
    constructor(fileTag) {
        this.id = fileTag?.id;
        this.name = fileTag?.name;
        this.bgColor = fileTag?.bgColor;
        this.fgColor = fileTag?.fgColor;
        this.imageUrl = fileTag?.imageUrl;
    }
}

export default FileTagModel;