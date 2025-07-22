import "./wasm.d.ts";

import decodeJpeg, { init as initJpegDecodeWasm } from "@jsquash/jpeg/decode";
import encodeJpeg, { init as initJpegEncodeWasm } from "@jsquash/jpeg/encode";
import JPEG_DEC_WASM from "../../../../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm?url";
import JPEG_ENC_WASM from "../../../../../node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url";

export async function recodeJpeg(
	original: ArrayBuffer,
	eventFetch: typeof fetch,
): Promise<ArrayBuffer> {
	{
		const response = await eventFetch(JPEG_DEC_WASM);
		const wasmArrayBuffer = await response.arrayBuffer();
		const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

		await initJpegDecodeWasm(wasmModule);
	}
	{
		const response = await eventFetch(JPEG_ENC_WASM);
		const wasmArrayBuffer = await response.arrayBuffer();
		const wasmModule = new WebAssembly.Module(wasmArrayBuffer);

		await initJpegEncodeWasm(wasmModule);
	}

	return encodeJpeg(await decodeJpeg(original));
}
