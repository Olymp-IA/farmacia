/**
 * Hardware Abstraction: Barcode Scanner Service
 * Ready for integration with USB/Bluetooth scanners
 */

interface ScannerConfig {
    type: 'camera' | 'bluetooth' | 'usb';
    deviceId?: string;
}

interface ScanResult {
    type: 'barcode' | 'qr';
    data: string;
    format?: string;
    timestamp: Date;
}

type ScanCallback = (result: ScanResult) => void;

class ScannerService {
    private connected: boolean = false;
    private config: ScannerConfig | null = null;
    private onScanCallback: ScanCallback | null = null;

    async connect(config: ScannerConfig): Promise<boolean> {
        console.log('[ScannerService] Connecting to scanner:', config);
        // TODO: Implement actual connection
        // For USB: react-native-usb-serial
        // For Bluetooth: react-native-bluetooth-serial
        this.config = config;
        this.connected = true;
        return true;
    }

    async disconnect(): Promise<void> {
        console.log('[ScannerService] Disconnecting scanner');
        this.connected = false;
        this.config = null;
        this.onScanCallback = null;
    }

    onScan(callback: ScanCallback): void {
        this.onScanCallback = callback;
        console.log('[ScannerService] Scan callback registered');
    }

    // Simulate a scan for testing
    simulateScan(barcode: string): void {
        if (!this.connected) {
            console.error('[ScannerService] Scanner not connected');
            return;
        }

        const result: ScanResult = {
            type: 'barcode',
            data: barcode,
            format: 'EAN-13',
            timestamp: new Date(),
        };

        console.log('[ScannerService] Simulated scan:', result);

        if (this.onScanCallback) {
            this.onScanCallback(result);
        }
    }

    // Start listening for scans (for USB HID scanners that act as keyboard)
    startListening(): void {
        console.log('[ScannerService] Started listening for scans');
        // TODO: Implement keyboard event listener for USB HID scanners
        // Most USB barcode scanners send data as keyboard input
    }

    stopListening(): void {
        console.log('[ScannerService] Stopped listening for scans');
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const scannerService = new ScannerService();
export type { ScannerConfig, ScanResult, ScanCallback };
