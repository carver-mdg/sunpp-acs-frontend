class ImMeoModel {
    constructor(imMeo) {
        this.id = imMeo?.id;
        this.imMeoModel = imMeo?.imMeoModel;
        this.serialNumber = imMeo?.serialNumber;
        this.yearManufacture = imMeo?.yearManufacture;
        this.manufacturerName = imMeo?.manufacturerName;
        this.powerRated = imMeo?.powerRated;
        this.currentRated = imMeo?.currentRated;
        this.fkPosInstalledId = imMeo?.fkPosInstalledId;
    }
}

export default ImMeoModel;