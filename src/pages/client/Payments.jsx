import { useEffect, useState } from "react";

import {
  IndianRupee,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  createPaymentOrder,
  verifyPayment,
  getClientPayments,
} from "../../Services/paymentService";

import "../../Styles/Payments.css";

const Payments = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [amount, setAmount] = useState("");
  const [projectId, setProjectId] = useState("");

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);

      const response = await getClientPayments();

      console.log("CLIENT PAYMENTS:", response);

      const paymentList =
        response?.payments ||
        response?.data ||
        response ||
        [];

      setPayments(
        Array.isArray(paymentList)
          ? paymentList
          : []
      );
    } catch (error) {
      console.error(
        "LOAD PAYMENTS ERROR:",
        error
      );
    } finally {
      setLoadingPayments(false);
    }
  };

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        console.log(
          "RAZORPAY SCRIPT LOADED"
        );

        resolve(true);
      };

      script.onerror = () => {
        console.error(
          "RAZORPAY SCRIPT FAILED"
        );

        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // HANDLE PAYMENT
  // =====================================================

  const handlePayment = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ===================================================
    // PROJECT ID VALIDATION
    // ===================================================

    const trimmedProjectId =
      projectId.trim();

    if (!trimmedProjectId) {
      setError(
        "Please enter the Project ID."
      );
      return;
    }

    // ===================================================
    // AMOUNT VALIDATION
    // ===================================================

    const numericAmount =
      Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    console.log(
      "======================================"
    );

    console.log(
      "STARTING PAYMENT"
    );

    console.log(
      "PROJECT ID:",
      trimmedProjectId
    );

    console.log(
      "AMOUNT:",
      numericAmount
    );

    console.log(
      "======================================"
    );

    try {
      setLoading(true);

      // =================================================
      // LOAD RAZORPAY CHECKOUT
      // =================================================

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded."
        );
      }

      // =================================================
      // CREATE PAYMENT ORDER
      // =================================================

      console.log(
        "CREATING PAYMENT ORDER..."
      );

      const orderResponse =
        await createPaymentOrder({
          amount: numericAmount,
          projectId: trimmedProjectId,
        });

      console.log(
        "======================================"
      );

      console.log(
        "ORDER RESPONSE:",
        orderResponse
      );

      console.log(
        "======================================"
      );

      // =================================================
      // GET ORDER
      // =================================================

      const order =
        orderResponse?.order ||
        orderResponse?.data?.order;

      // =================================================
      // GET RAZORPAY KEY
      // =================================================

      const keyId =
        orderResponse?.keyId ||
        orderResponse?.data?.keyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      // =================================================
      // ORDER VALIDATION
      // =================================================

      if (!order?.id) {
        throw new Error(
          "Razorpay order ID was not returned by the server."
        );
      }

      if (!order?.amount) {
        throw new Error(
          "Razorpay order amount was not returned by the server."
        );
      }

      if (!keyId) {
        throw new Error(
          "Razorpay Key ID is missing."
        );
      }

      console.log(
        "RAZORPAY ORDER ID:",
        order.id
      );

      console.log(
        "RAZORPAY ORDER AMOUNT:",
        order.amount
      );

      console.log(
        "RAZORPAY KEY ID:",
        keyId
      );

      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {
        key: keyId,

        amount: order.amount,

        currency:
          order.currency || "INR",

        name: "SkillForge",

        description:
          "SkillForge Project Payment",

        order_id: order.id,

        handler: async function (
          response
        ) {
          try {
            setLoading(true);

            setError("");

            console.log(
              "======================================"
            );

            console.log(
              "RAZORPAY PAYMENT SUCCESS"
            );

            console.log(
              "RAZORPAY RESPONSE:",
              response
            );

            console.log(
              "======================================"
            );

            // =========================================
            // VERIFY PAYMENT
            // =========================================

            const verificationResponse =
              await verifyPayment({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                projectId:
                  trimmedProjectId,
              });

            console.log(
              "======================================"
            );

            console.log(
              "PAYMENT VERIFIED:"
            );

            console.log(
              verificationResponse
            );

            console.log(
              "======================================"
            );

            // =========================================
            // SUCCESS
            // =========================================

            setSuccess(
              "Payment successful and verified!"
            );

            setAmount("");

            setProjectId("");

            // =========================================
            // REFRESH PAYMENT HISTORY
            // =========================================

            await loadPayments();
          } catch (error) {
            console.error(
              "======================================"
            );

            console.error(
              "PAYMENT VERIFICATION ERROR:"
            );

            console.error(
              error.response?.data ||
                error.message
            );

            console.error(
              "======================================"
            );

            setError(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },

        // =================================================
        // PREFILL
        // =================================================

        prefill: {
          name: "Client",
          email: "",
          contact: "",
        },

        // =================================================
        // NOTES
        // =================================================

        notes: {
          projectId:
            trimmedProjectId,
        },

        // =================================================
        // THEME
        // =================================================

        theme: {
          color: "#7c3aed",
        },

        // =================================================
        // MODAL
        // =================================================

        modal: {
          ondismiss: function () {
            console.log(
              "RAZORPAY WINDOW CLOSED"
            );

            setLoading(false);

            setError(
              "Payment window was closed."
            );
          },
        },
      };

      // =================================================
      // CHECK RAZORPAY
      // =================================================

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is not available."
        );
      }

      // =================================================
      // OPEN RAZORPAY
      // =================================================

      const razorpay =
        new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "======================================"
          );

          console.error(
            "RAZORPAY PAYMENT FAILED:"
          );

          console.error(
            response.error
          );

          console.error(
            "======================================"
          );

          setError(
            response.error?.description ||
              "Payment failed."
          );

          setLoading(false);
        }
      );

      // =================================================
      // OPEN CHECKOUT
      // =================================================

      razorpay.open();
    } catch (error) {
      console.error(
        "======================================"
      );

      console.error(
        "PAYMENT ERROR:"
      );

      console.error(
        error.response?.data ||
          error.message
      );

      console.error(
        "======================================"
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="payments-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payments-header">

        <div>

          <span className="payments-eyebrow">
            PAYMENTS
          </span>

          <h1>
            Project Payments
          </h1>

          <p>
            Manage your SkillForge project
            payments securely.
          </p>

        </div>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="payment-alert success">

          <CheckCircle2 size={20} />

          <span>
            {success}
          </span>

        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="payment-alert error">

          <AlertCircle size={20} />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          PAYMENT GRID
      ================================================= */}

      <div className="payment-grid">

        {/* =================================================
            PAYMENT FORM
        ================================================= */}

        <div className="payment-card">

          <div className="payment-card-header">

            <div className="payment-icon">

              <CreditCard size={22} />

            </div>

            <div>

              <h2>
                Make a Payment
              </h2>

              <p>
                Pay for your project securely
                using Razorpay.
              </p>

            </div>

          </div>

          <form
            onSubmit={handlePayment}
            className="payment-form"
          >

            {/* =============================================
                PROJECT ID
            ============================================= */}

            <div className="payment-form-group">

              <label>
                Project ID
              </label>

              <input
                type="text"
                value={projectId}
                onChange={(event) =>
                  setProjectId(
                    event.target.value
                  )
                }
                placeholder="Enter project ID"
                disabled={loading}
                required
              />

            </div>

            {/* =============================================
                AMOUNT
            ============================================= */}

            <div className="payment-form-group">

              <label>
                Amount
              </label>

              <div className="payment-input">

                <IndianRupee size={18} />

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="9000"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* =============================================
                PAY BUTTON
            ============================================= */}

            <button
              type="submit"
              className="pay-button"
              disabled={loading}
            >

              <CreditCard size={18} />

              {loading
                ? "Processing..."
                : "Pay with Razorpay"}

            </button>

          </form>

        </div>

        {/* =================================================
            SECURE PAYMENT INFO
        ================================================= */}

        <div className="payment-card payment-info">

          <div className="payment-card-header">

            <div className="payment-icon">

              <IndianRupee size={22} />

            </div>

            <div>

              <h2>
                Secure Payment
              </h2>

              <p>
                Your payment is processed
                through Razorpay.
              </p>

            </div>

          </div>

          <div className="payment-info-list">

            <div>

              <CheckCircle2 size={17} />

              <span>
                Secure Razorpay Checkout
              </span>

            </div>

            <div>

              <CheckCircle2 size={17} />

              <span>
                UPI and card payments
              </span>

            </div>

            <div>

              <CheckCircle2 size={17} />

              <span>
                Payment verification
              </span>

            </div>

            <div>

              <CheckCircle2 size={17} />

              <span>
                Project payment tracking
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          PAYMENT HISTORY
      ================================================= */}

      <div className="payment-history-card">

        <div className="payment-history-header">

          <div>

            <span className="payments-eyebrow">
              HISTORY
            </span>

            <h2>
              Payment History
            </h2>

          </div>

        </div>

        {/* ===============================================
            LOADING
        =============================================== */}

        {loadingPayments ? (

          <div className="payment-empty">

            Loading payments...

          </div>

        ) : payments.length === 0 ? (

          /* =============================================
             EMPTY
          ============================================= */

          <div className="payment-empty">

            No payments found.

          </div>

        ) : (

          /* =============================================
             TABLE
          ============================================= */

          <div className="payment-table">

            <div className="payment-table-head">

              <span>
                Payment ID
              </span>

              <span>
                Amount
              </span>

              <span>
                Status
              </span>

              <span>
                Date
              </span>

            </div>

            {payments.map(
              (payment, index) => (

                <div
                  className="payment-table-row"
                  key={
                    payment._id ||
                    payment.id ||
                    index
                  }
                >

                  <span>
                    {payment.razorpay_payment_id ||
                      payment.paymentId ||
                      payment.id ||
                      "-"}
                  </span>

                  <span>
                    ₹
                    {payment.amount ||
                      0}
                  </span>

                  <span
                    className={`payment-status ${
                      payment.status ===
                        "success" ||
                      payment.status ===
                        "paid" ||
                      payment.status ===
                        "captured"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {payment.status ||
                      "Pending"}
                  </span>

                  <span>
                    {payment.createdAt
                      ? new Date(
                          payment.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default Payments;