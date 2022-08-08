class RepairTypeModel {
    constructor(repairType) {
        this.id = repairType?.id;
        this.name = repairType?.name;
        this.repairInterval = repairType?.repairInterval;
    }
}

export default RepairTypeModel;