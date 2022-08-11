class WorkerModel {
    constructor(worker) {
        this.id = worker?.id;
        this.nameFirst = worker?.nameFirst
        this.nameSecond = worker?.nameSecond;
        this.nameMiddle = worker?.nameMiddle;
        this.personnelNumber = worker?.personnelNumber;
        this.birthDate = worker?.birthDate;
        this.address = worker?.address;
        this.phoneNumber = worker?.phoneNumber;
        this.fkJobPositionId = worker?.fkJobPositionId;
    }
}

export default WorkerModel;