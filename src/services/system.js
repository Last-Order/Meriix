const { app } = require("electron").remote;
export const VendorIds = {
    NVIDIA: 0x10de,
    INTEL: 0x8086,
    AMD: 0x1002,
};
export default class System {
    static getGPUInfo() {
        return app.getGPUInfo("complete");
    }
    static async getAvailableEncoders() {
        const GPUDevices = (await System.getGPUInfo("complete")).gpuDevice;
        const availableEncoders = ["x264"];
        for (const device of GPUDevices) {
            const vendorId = device.vendorId;
            if (vendorId === VendorIds.INTEL) {
                availableEncoders.push("qsvencc");
            }
            if (vendorId === VendorIds.NVIDIA) {
                availableEncoders.push("nvencc");
            }
        }
        return availableEncoders;
    }
}
