class MspRepairModel {
    constructor(mspRepair) {
        this.id = mspRepair?.id;
        this.fkTypeRepairId = mspRepair?.fkTypeRepairId;
        this.fkMspId = mspRepair?.fkMspId;
        this.fkPosRemovedId = mspRepair?.fkPosRemovedId;
        this.fkPosInstalledId = mspRepair?.fkPosInstalledId;
        this.ro_8_7 = mspRepair?.ro_8_7;
        this.ro_8_9 = mspRepair?.ro_8_9;
        this.voltage = mspRepair?.voltage;
        this.current = mspRepair?.current;
        this.power = mspRepair?.power;
        this.dateRepair = mspRepair?.dateRepair;
        this.desc = mspRepair?.desc;
        this.fkWorkersIds = mspRepair?.fkWorkersIds || [];
    }
}

export default MspRepairModel;