export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    weight: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith("re_mock")) {
    console.log("[EMAIL MOCK] Order Confirmation dispatched to:", payload.customerEmail, {
      orderNumber: payload.orderNumber,
      total: payload.total,
    });
    return { success: true, mocked: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "ND Spices <orders@ndspices.com>",
        to: [payload.customerEmail],
        subject: `Order Confirmed: #${payload.orderNumber} - ND Spices Heritage`,
        html: `
          <div style="font-family: serif, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF7F2; border-radius: 12px; border: 1px solid #E8DFD3;">
            <h1 style="color: #7B241C; margin-bottom: 8px;">Order Confirmed: #${payload.orderNumber}</h1>
            <p style="color: #1E1E1E; font-size: 14px;">Hi ${payload.customerName}, thank you for choosing ND Spices. We are preparing your single-origin spice harvest straight from our Kerala and Kashmir estates.</p>
            <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #E5DCCF;">
              <h3 style="margin-top: 0; color: #196F3D;">Harvest Item Summary</h3>
              <ul style="padding-left: 20px; font-size: 13px; color: #333;">
                ${payload.items.map((i) => `<li>${i.name} (${i.weight}) x ${i.quantity} - ₹${i.price * i.quantity}</li>`).join("")}
              </ul>
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
              <p style="font-size: 14px; margin: 4px 0;"><strong>Total Paid:</strong> ₹${payload.total}</p>
              <p style="font-size: 12px; color: #666; margin: 4px 0;"><strong>Delivery Address:</strong> ${payload.shippingAddress}</p>
            </div>
            <p style="font-size: 12px; color: #888; text-align: center;">ND Spices Heritage &bull; 100% Single-Origin Pure Indian Spices &bull; FSSAI &amp; Lab Certified</p>
          </div>
        `,
      }),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendOrderShippedEmail({
  orderNumber,
  customerName,
  customerEmail,
  trackingNumber,
  courierName,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  courierName: string;
}) {
  console.log(`[EMAIL DISPATCH] Order Shipped #${orderNumber} to ${customerEmail}. Tracking: ${trackingNumber} (${courierName})`);
  return { success: true, mocked: true };
}

export async function sendOrderDeliveredEmail({
  orderNumber,
  customerName,
  customerEmail,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
}) {
  console.log(`[EMAIL DISPATCH] Order Delivered #${orderNumber} to ${customerEmail}. Review invitation triggered.`);
  return { success: true, mocked: true };
}
