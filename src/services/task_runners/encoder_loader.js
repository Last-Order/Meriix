export default function EncoderLodaer(encoderName) {
    let encoder;
    try {
        encoder = require("./encoders/" + encoderName).default;
    } catch (e) {
        throw new Error(`Failed to load encoder: No encoder named ${encoderName}`);
    }
    return encoder;
}
