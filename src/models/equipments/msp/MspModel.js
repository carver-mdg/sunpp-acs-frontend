class MspModel {
    constructor(msp) {
        this.id = msp?.id;
        this.mspModel = msp?.mspModel;
        this.serialNumber = msp?.serialNumber;
        this.yearManufacture = msp?.yearManufacture;
        this.fkPosInstalledId = msp?.fkPosInstalledId;
    }
}

export default MspModel;