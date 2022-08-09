class MeasuringDeviceTestModel {
    constructor(measuringDevice) {
        this.id = measuringDevice?.id;
        this.fkMeasuringDeviceId = measuringDevice?.fkMeasuringDeviceId;
        this.dateSending = measuringDevice?.dateSending;
        this.dateReceiving = measuringDevice?.dateReceiving;
    }
}

export default MeasuringDeviceTestModel;