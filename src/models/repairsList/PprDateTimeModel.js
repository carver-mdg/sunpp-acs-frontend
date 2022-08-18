class PprDateTimeModel {
    constructor(pprDateTime) {
        this.id = pprDateTime?.id;
        this.name = pprDateTime?.name;
        this.dateTimeBegin = pprDateTime?.dateTimeBegin;
        this.dateTimeUTCBegin = pprDateTime?.dateTimeUTCBegin;
        this.dateTimeEnd = pprDateTime?.dateTimeEnd;
        this.dateTimeUTCEnd = pprDateTime?.dateTimeUTCEnd;
        this.numPowerUnit = pprDateTime?.numPowerUnit;
    }
}

export default PprDateTimeModel;