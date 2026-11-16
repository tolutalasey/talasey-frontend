import QRCode from 'qrcode';

// A QR code as an image address, so a phone camera or authenticator app can scan it off screen.
export async function qrCodeImage(text: string): Promise<string> {
  const svg = await QRCode.toString(text, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
