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
        subject: `Order Confirmed: ${payload.orderNumber} - ND Spices`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #FAF7F2; border-radius: 8px;">
            <h1 style="color: #D96B27; margin-bottom: 8px;">Thank you for your order!</h1>
            <p style="color: #43281C;">Hi ${payload.customerName}, your artisanal spices from ND Spices are being prepared.</p>
            <div style="background: #ffffff; padding: 16px; border-radius: 6px; margin: 16px 0;">
              <h3 style="margin-top: 0; color: #2D6A4F;">Order #${payload.orderNumber}</h3>
              <p><strong>Total Paid:</strong> ₹${payload.total}</p>
              <p><strong>Shipping to:</strong> ${payload.shippingAddress}</p>
            </div>
            <p style="font-size: 12px; color: #888;">ND Spices • 100% Single Origin & Pure Heritage Spices</p>
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
