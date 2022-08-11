class ImMeoRepairModel {
    constructor(imMeoRepair) {
        this.id = imMeoRepair?.id;
        this.fkTypeRepairId = imMeoRepair?.fkTypeRepairId;
        this.fkImMeoId = imMeoRepair?.fkImMeoId;
        this.fkPosRemovedId = imMeoRepair?.fkPosRemovedId;
        this.fkPosInstalledId = imMeoRepair?.fkPosInstalledId;
        
        this.resistanceGrounding = imMeoRepair?.resistanceGrounding;
        this.resistanceWindingAB = imMeoRepair?.resistanceWindingAB;
        this.resistanceWindingBC = imMeoRepair?.resistanceWindingBC;
        this.resistanceWindingAC = imMeoRepair?.resistanceWindingAC;
        this.resistanceInsulation = imMeoRepair?.resistanceInsulation;

        this.currentUpClose = imMeoRepair?.currentUpClose;
        this.currentUpOpen = imMeoRepair?.currentUpOpen;
        this.current = imMeoRepair?.current;
        
        this.dateRepair = imMeoRepair?.dateRepair;
        this.desc = imMeoRepair?.desc;
        this.fkWorkersIds = imMeoRepair?.fkWorkersIds || [];
    }
}

export default ImMeoRepairModel;