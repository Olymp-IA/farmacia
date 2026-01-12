/**
 * Hardware Abstraction: Thermal Printer Service
 * ESC/POS compatible for future integration
 */

interface PrinterConfig {
    type: 'bluetooth' | 'usb' | 'network';
    address?: string;
    port?: number;
}

interface ReceiptLine {
    text: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    size?: 'normal' | 'large';
}

class PrinterService {
    private connected: boolean = false;
    private config: PrinterConfig | null = null;

    async connect(config: PrinterConfig): Promise<boolean> {
        console.log('[PrinterService] Connecting to printer:', config);
        // TODO: Implement actual connection via react-native-bluetooth-escpos-printer
        // or react-native-usb-serial
        this.config = config;
        this.connected = true;
        return true;
    }

    async disconnect(): Promise<void> {
        console.log('[PrinterService] Disconnecting printer');
        this.connected = false;
        this.config = null;
    }

    async printReceipt(lines: ReceiptLine[]): Promise<boolean> {
        if (!this.connected) {
            console.error('[PrinterService] Printer not connected');
            return false;
        }

        console.log('[PrinterService] Printing receipt:');
        lines.forEach(line => {
            const prefix = line.bold ? '[B]' : '';
            const align = line.align || 'left';
            console.log(`  ${prefix}[${align}] ${line.text}`);
        });

        // TODO: Convert to ESC/POS commands
        // Example ESC/POS:
        // ESC @ - Initialize
        // ESC a n - Select justification
        // ESC E n - Bold on/off
        // GS V m - Cut paper

        return true;
    }

    async printSaleReceipt(sale: {
        items: Array<{ name: string; qty: number; price: number }>;
        total: number;
        date: Date;
    }): Promise<boolean> {
        const lines: ReceiptLine[] = [
            { text: 'FARMACIA NORDIC', align: 'center', bold: true, size: 'large' },
            { text: '------------------------', align: 'center' },
            { text: sale.date.toLocaleString('es-CL'), align: 'center' },
            { text: '', align: 'left' },
        ];

        sale.items.forEach(item => {
            lines.push({
                text: `${item.qty}x ${item.name}`,
                align: 'left',
            });
            lines.push({
                text: `$${(item.price * item.qty).toLocaleString('es-CL')}`,
                align: 'right',
            });
        });

        lines.push({ text: '------------------------', align: 'center' });
        lines.push({ text: `TOTAL: $${sale.total.toLocaleString('es-CL')}`, align: 'right', bold: true });
        lines.push({ text: '', align: 'left' });
        lines.push({ text: 'Gracias por su compra', align: 'center' });

        return this.printReceipt(lines);
    }

    isConnected(): boolean {
        return this.connected;
    }
}

export const printerService = new PrinterService();
export type { PrinterConfig, ReceiptLine };
