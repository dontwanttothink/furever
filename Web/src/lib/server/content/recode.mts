import "./wasm.d.ts";

import decodeJpeg, { init as initJpegDecodeWasm } from "@jsquash/jpeg/decode";
import encodeJpeg, { init as initJpegEncodeWasm } from "@jsquash/jpeg/encode";
// import * as JPEG_DEC_WASM from "../../../../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm";
// import * as JPEG_ENC_WASM from "../../../../../node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm";
// await initJpegDecodeWasm(JPEG_DEC_WASM);
// await initJpegEncodeWasm(JPEG_ENC_WASM);

export async function recodeJpeg(original: ArrayBuffer): Promise<ArrayBuffer> {
	return encodeJpeg(await decodeJpeg(original));
}
