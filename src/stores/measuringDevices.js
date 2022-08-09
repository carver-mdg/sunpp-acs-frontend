import { defineStore } from 'pinia';
import { api } from "boot/axios";
// import MeasuringDeviceModel from "../models/MeasuringDevice/MeasuringDeviceModel";
import MeasuringDeviceModel from "src/models/MeasuringDevice/MeasuringDeviceModel";
import MeasuringDeviceTypeModel from "src/models/MeasuringDevice/MeasuringDeviceTypeModel";

export const useMeasuringDevicesStore = defineStore('measuringDevices', {
    state: () => ({
        devices: [],
        deviceTypes: [],
        isShowEditDialog: false,
        curEditDevice: null,
        curEditDeviceTypeModelValue: null,
        curEditDeviceTypeOptions: [],
        searchText: ''
    }),

    getters: {
        getDeviceTypeById: (state) => {
            return (id) => state.deviceTypes.find((deviceType) => deviceType.id == id);
        },

        getDeviceTypeByName: (state) => {
            return (name) => state.deviceTypes.find((deviceType) => deviceType.name == name);
        },

        searchDevices: (state) => {
            return (text) => state.devices.filter(device =>
                device.model.toLowerCase().includes(text) ||
                device.serialNumber.toString().toLowerCase().includes(text))
        },

        getDeviceIdxArrById: (state) => {
            return (id) => {
                for (let idx = 0; idx < state.devices.length; idx++)
                    if (state.devices[idx].id == id)
                        return idx;
            }
        }
    },

    actions: {
        /**
         * 
         * @param {*} errFunc 
         */
        async loadDeviceTypes({ errFunc } = {}) {
            api
                .get("api/v1/measuringDevices/types/")
                .then((response) => {

                    this.deviceTypes = [];
                    for (let idx in response.data)
                        this.deviceTypes.push(new MeasuringDeviceTypeModel(response.data[idx]));
                })
                .catch((err) => {
                    errFunc(err.response.data.message_error || err);
                })
        },

        /**
         * 
         * @param {*} errFunc 
         */
        async loadDevices({ errFunc } = {}) {
            api
                .get("api/v1/measuringDevices/")
                .then((response) => {
                    this.devices = [];
                    for (let idx in response.data)
                        this.devices.push(new MeasuringDeviceModel(response.data[idx]));

                    this.loadDeviceTypes({ errFunc });
                })
                .catch((err) => {
                    errFunc(err.response.data.message_error || err);
                })
        },


        /**
         * 
         */
        async saveDevice({ device, okFunc, errFunc } = {}) {
            api
                .post("api/v1/measuringDevices/", device)
                .then((response) => {
                    this.devices.push(response.data);
                    okFunc()
                })
                .catch((err) => {
                    errFunc(err.response.data.message_error || err);
                })
        },


        /**
         * 
         */
        async updateDevice({ device, okFunc, errFunc } = {}) {
            api
                .put(`api/v1/measuringDevices/${device.id}`, device)
                .then((response) => {
                    let found_idx = this.getDeviceIdxArrById(device.id);
                    if (found_idx == null)
                        throw (`Error updateDevice: id not found`);

                    this.devices[found_idx] = device;

                    okFunc();
                })
                .catch((err) => {
                    errFunc(err.response.data.message_error || err);
                })
        },


        /**
         * 
         */
        async deleteDeviceById({ id, okFunc, errFunc } = {}) {
            let found_idx = this.getDeviceIdxArrById(id);
            if (found_idx == null) return;

            api
                .delete(`api/v1/measuringDevices/${this.devices[found_idx].id}`)
                .then((response) => {
                    this.devices.splice(found_idx, 1);
                    okFunc();
                })
                .catch((err) => {
                    errFunc(err.response.data.message_error || err);
                })
        },
    }
})
