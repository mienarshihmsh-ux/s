'use server';

import Midtrans from 'midtrans-client';

/**
 * Server action untuk membuat transaksi Midtrans.
 * Menggunakan Server Key yang diberikan oleh user.
 */
export async function createPaymentToken(orderData: {
  amount: number;
  orderId: string;
  customerName: string;
  email?: string;
}) {
  try {
    // Inisialisasi Snap client dengan Server Key Sandbox
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-yllL5VMGkjeO9dIEHKFY9wdA',
      clientKey: 'SB-Mid-client-FBGELqULvvZ8eF0E'
    });

    const parameter = {
      transaction_details: {
        order_id: orderData.orderId,
        gross_amount: orderData.amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: orderData.customerName,
        email: orderData.email || 'santri@aliman.com',
      },
      item_details: [
        {
          id: 'REG-001',
          price: orderData.amount,
          quantity: 1,
          name: 'Biaya Pendaftaran Santri Baru',
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    return { token: transaction.token, redirect_url: transaction.redirect_url };
  } catch (error: any) {
    console.error('Midtrans Error:', error);
    throw new Error(error.message || 'Gagal membuat token pembayaran');
  }
}
