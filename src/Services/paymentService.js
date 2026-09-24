// =========================================================
// SKILLFORGE PAYMENT SERVICE
// =========================================================

import api from "./api";

// =========================================================
// CREATE RAZORPAY ORDER
// =========================================================

export const createPaymentOrder = async ({
  amount,
  projectId,
}) => {
  try {
    const payload = {
      amount: Number(amount),
      projectId: String(projectId || "").trim(),
    };

    console.log("======================================");
    console.log("CREATE PAYMENT ORDER");
    console.log("======================================");
    console.log("RAW AMOUNT:", amount);
    console.log("RAW PROJECT ID:", projectId);
    console.log("FINAL PAYLOAD:", payload);
    console.log("JSON PAYLOAD:", JSON.stringify(payload));
    console.log("======================================");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!payload.projectId) {
      throw new Error("Project ID is required.");
    }

    if (
      !Number.isFinite(payload.amount) ||
      payload.amount <= 0
    ) {
      throw new Error("Valid payment amount is required.");
    }

    // -----------------------------
    // API REQUEST
    // -----------------------------

    const response = await api.post(
      "/payments/create-order",
      payload
    );

    console.log("======================================");
    console.log("CREATE ORDER SUCCESS");
    console.log("======================================");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    console.log("======================================");

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("CREATE PAYMENT ORDER ERROR");
    console.error("======================================");

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND RESPONSE:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "REQUEST URL:",
      error.config?.url
    );

    console.error(
      "REQUEST METHOD:",
      error.config?.method
    );

    console.error(
      "REQUEST DATA:",
      error.config?.data
    );

    console.error("======================================");

    throw error;
  }
};


// =========================================================
// VERIFY RAZORPAY PAYMENT
// =========================================================

export const verifyPayment = async (paymentData) => {
  try {
    console.log("======================================");
    console.log("VERIFY PAYMENT");
    console.log("======================================");

    console.log(
      "VERIFY DATA:",
      paymentData
    );

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!paymentData) {
      throw new Error(
        "Payment verification data is required."
      );
    }

    if (!paymentData.razorpay_order_id) {
      throw new Error(
        "Razorpay Order ID is required."
      );
    }

    if (!paymentData.razorpay_payment_id) {
      throw new Error(
        "Razorpay Payment ID is required."
      );
    }

    if (!paymentData.razorpay_signature) {
      throw new Error(
        "Razorpay Signature is required."
      );
    }

    // -----------------------------
    // API REQUEST
    // -----------------------------

    const response = await api.post(
      "/payments/verify",
      paymentData
    );

    console.log("======================================");
    console.log("PAYMENT VERIFICATION SUCCESS");
    console.log("======================================");

    console.log(
      "STATUS:",
      response.status
    );

    console.log(
      "DATA:",
      response.data
    );

    console.log("======================================");

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("PAYMENT VERIFICATION ERROR");
    console.error("======================================");

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND RESPONSE:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "REQUEST URL:",
      error.config?.url
    );

    console.error(
      "REQUEST DATA:",
      error.config?.data
    );

    console.error("======================================");

    throw error;
  }
};


// =========================================================
// GET CLIENT PAYMENTS
// =========================================================
// Backend route:
//
// GET /api/payments/client
//
// Backend:
// router.get("/client", protect, getMyPayments)
// =========================================================

export const getClientPayments = async () => {
  try {
    console.log("======================================");
    console.log("GET CLIENT PAYMENTS");
    console.log("======================================");

    // IMPORTANT:
    // Do NOT use:
    // api.get("/payments")
    //
    // Backend does NOT have GET /api/payments
    //
    // Correct route:
    // GET /api/payments/client

    const response = await api.get(
      "/payments/client"
    );

    console.log("======================================");
    console.log("CLIENT PAYMENTS SUCCESS");
    console.log("======================================");

    console.log(
      "STATUS:",
      response.status
    );

    console.log(
      "DATA:",
      response.data
    );

    console.log("======================================");

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("GET CLIENT PAYMENTS ERROR");
    console.error("======================================");

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND RESPONSE:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "REQUEST URL:",
      error.config?.url
    );

    console.error(
      "REQUEST METHOD:",
      error.config?.method
    );

    console.error("======================================");

    throw error;
  }
};


// =========================================================
// GET PAYMENT BY ID
// =========================================================

export const getPaymentById = async (
  paymentId
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    console.log("======================================");
    console.log("GET PAYMENT BY ID");
    console.log("======================================");

    console.log(
      "PAYMENT ID:",
      paymentId
    );

    const response = await api.get(
      `/payments/${paymentId}`
    );

    console.log(
      "PAYMENT DETAILS:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("GET PAYMENT BY ID ERROR");
    console.error("======================================");

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND RESPONSE:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error("======================================");

    throw error;
  }
};


// =========================================================
// UPDATE PAYMENT STATUS
// =========================================================

export const updatePaymentStatus = async (
  paymentId,
  status
) => {
  try {
    if (!paymentId) {
      throw new Error(
        "Payment ID is required."
      );
    }

    if (!status) {
      throw new Error(
        "Payment status is required."
      );
    }

    const response = await api.put(
      `/payments/${paymentId}/status`,
      {
        status,
      }
    );

    console.log(
      "PAYMENT STATUS UPDATED:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("======================================");
    console.error("UPDATE PAYMENT STATUS ERROR");
    console.error("======================================");

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND RESPONSE:",
      error.response?.data
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error("======================================");

    throw error;
  }
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default {
  createPaymentOrder,
  verifyPayment,
  getClientPayments,
  getPaymentById,
  updatePaymentStatus,
};