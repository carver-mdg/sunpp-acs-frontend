class ImMotorModel {
    constructor(imMotor) {
        this.id = imMotor?.id;
        this.serialNumber = imMotor?.serialNumber;
        this.yearManufacture = imMotor?.yearManufacture;
        this.manufacturerName = imMotor?.manufacturerName;
        this.powerRated = imMotor?.powerRated;
        this.currentRated = imMotor?.currentRated;
        this.fkPosInstalledId = imMotor?.fkPosInstalledId;
    }
}

export default ImMotorModel;