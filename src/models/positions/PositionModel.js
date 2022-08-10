class PositionModels {
    constructor(position) {
        this.id = position?.id;
        this.pos = position?.pos;
        this.unitNum = position?.unitNum;
        this.systemSecurity = position?.systemSecurity;
        this.rtzo_sher = position?.rtzo_sher;
        this.descShort = position?.descShort;
        this.desc = position?.desc;
        this.zoneLocation = position?.zoneLocation;
        this.cabinetRemoteControl = position?.cabinetRemoteControl;
        this.cabinetCurrentDistributor = position?.cabinetCurrentDistributor;
        this.fkManagerId = position?.fkManagerId;
    }
}

export default PositionModels;