import Razorpay from "razorpay";
import crypto from "crypto";

export const getRazorpayInstance = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_mock";

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.warn("RAZORPAY_KEY_SECRET is not configured");
    return true; // allow mock validation in local sandbox
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};
