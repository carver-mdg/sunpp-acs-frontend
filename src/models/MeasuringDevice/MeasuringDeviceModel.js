class MeasuringDeviceModel {
    constructor(measuringDevice) {
        this.id = measuringDevice?.id;
        this.fkDeviceTypeId = measuringDevice?.fkDeviceTypeId;
        this.model = measuringDevice?.model;
        this.serialNumber = measuringDevice?.serialNumber;
        this.dateCheckNext = measuringDevice?.dateCheckNext;
    }
}

export default MeasuringDeviceModel;