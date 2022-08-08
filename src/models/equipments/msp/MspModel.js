class MspModel {
    constructor(msp) {
        this.id = msp?.id;
        this.serialNumber = msp?.serialNumber;
        this.yearManufacture = msp?.yearManufacture;
        this.fkPosInstalledId = msp?.fkPosInstalledId;
    }
}

export default MspModel;