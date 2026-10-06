import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Colors } from '../theme/colors';

export interface BillItem {
  name: string;
  price: number;
}

export interface BillData {
  pharmacyName: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  total: number;
  patientName?: string;
}

export const generatePharmacyBill = async (data: BillData) => {
  try {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .header h1 { color: ${Colors.color3C72F2}; margin: 0; font-size: 28px; }
            .header p { color: #666; margin-top: 5px; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
            .details-col { flex: 1; }
            .details h3 { margin: 0 0 5px 0; color: #444; font-size: 16px; }
            .details p { margin: 0; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; background-color: #f8f9fa; border-bottom: 2px solid #ddd; color: #444; }
            th.right { text-align: right; }
            .totals-row { display: flex; justify-content: flex-end; margin-bottom: 10px; }
            .totals-label { width: 150px; text-align: right; padding-right: 20px; color: #555; }
            .totals-value { width: 100px; text-align: right; font-weight: 600; }
            .grand-total { font-size: 20px; color: ${Colors.color00C473}; font-weight: bold; margin-top: 15px; border-top: 2px solid #ddd; padding-top: 15px; }
            .footer { text-align: center; margin-top: 60px; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Healthcare App</h1>
            <p>Official Pharmacy Invoice</p>
          </div>
          
          <div class="details">
            <div class="details-col">
              <h3>Billed From:</h3>
              <p>${data.pharmacyName}</p>
            </div>
            <div class="details-col" style="text-align: right;">
              <h3>Invoice Details:</h3>
              <p>Date: ${data.date}</p>
              ${data.patientName ? `<p>Patient: ${data.patientName}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="float: right; width: 300px;">
            <div class="totals-row">
              <div class="totals-label">Subtotal:</div>
              <div class="totals-value">₹${data.subtotal}</div>
            </div>
            <div class="totals-row">
              <div class="totals-label">GST (5%):</div>
              <div class="totals-value">₹${data.gst}</div>
            </div>
            <div class="totals-row">
              <div class="totals-label">Delivery Charge:</div>
              <div class="totals-value">${data.deliveryCharge === 0 ? 'FREE' : `₹${data.deliveryCharge}`}</div>
            </div>
            <div class="totals-row grand-total">
              <div class="totals-label" style="font-weight: bold; color: #333;">Total Amount:</div>
              <div class="totals-value">₹${data.total}</div>
            </div>
          </div>
          <div style="clear: both;"></div>

          <div class="footer">
            <p>Thank you for choosing Healthcare App! We wish you a speedy recovery.</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </body>
      </html>
    `;

    // Print to PDF
    const { uri } = await Print.printToFileAsync({ html });
    
    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Bill',
        UTI: 'com.adobe.pdf'
      });
    } else {
      Alert.alert('Error', 'Sharing/Saving is not available on this device');
    }
  } catch (error) {
    console.error('Error generating bill:', error);
    Alert.alert('Error', 'Failed to generate bill');
  }
};
