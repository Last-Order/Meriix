import X264Encoder from "./encoders/x264";
import QsvenccEncoder from "./encoders/qsvencc";
import NvenccEncoder from "./encoders/nvencc";

export default function EncoderLoader(encoderName) {
    const encoders = [X264Encoder, QsvenccEncoder, NvenccEncoder];

    const encoder = encoders.find((e) => e.encoderName === encoderName);

    if (!encoder) {
        throw new Error(
            `Failed to load encoder: No encoder named ${encoderName}`
        );
    }

    return encoder;
}
