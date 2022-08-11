class ImMotorRepairModel {
    constructor(imMotorRepair) {
        this.id = imMotorRepair?.id;
        this.fkTypeRepairId = imMotorRepair?.fkTypeRepairId;
        this.fkImMotorId = imMotorRepair?.fkImMotorId;
        this.fkPosRemovedId = imMotorRepair?.fkPosRemovedId;
        this.fkPosInstalledId = imMotorRepair?.fkPosInstalledId;
        
        this.resistanceInsulation = imMotorRepair?.resistanceInsulation;
        this.resistanceWindingAB = imMotorRepair?.resistanceWindingAB;
        this.resistanceWindingBC = imMotorRepair?.resistanceWindingBC;
        this.resistanceWindingAC = imMotorRepair?.resistanceWindingAC;

        this.currentNoLoadA = imMotorRepair?.currentNoLoadA;
        this.currentNoLoadB = imMotorRepair?.currentNoLoadB;
        this.currentNoLoadC = imMotorRepair?.currentNoLoadC;
        
        this.dateRepair = imMotorRepair?.dateRepair;
        this.desc = imMotorRepair?.desc;
        this.fkWorkersIds = imMotorRepair?.fkWorkersIds || [];
    }
}

export default ImMotorRepairModel;