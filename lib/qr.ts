import "server-only";
import QRCode from "qrcode";

export async function qrToSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#047857", light: "#ffffff" },
  });
}
