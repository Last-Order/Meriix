const { app } = require('electron').remote;
export default class System {
    static getGPUInfo() {
        return app.getGPUInfo('complete');
    }
    static async getAvailableEncoders() {
        const GPUDevices = (await System.getGPUInfo()).gpuDevice;
        const availableEncoders = ['x264'];
        for (const device of GPUDevices) {
            const vendor = device.driverVendor;
            if (vendor.toLowerCase().startsWith('intel')) {
                availableEncoders.push('qsvencc');
            }
            if (vendor.toLowerCase().startsWith('nvidia')) {
                availableEncoders.push('nvencc');
            }
        }
        return availableEncoders;
    }
}