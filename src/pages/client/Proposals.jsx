import { useEffect, useState } from "react";

import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import { getClientProposals } from "../../Services/clientService";

export default function Proposals() {

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {

    try {

      const response =
        await getClientProposals();

      const result =
        response?.proposals ||
        response?.data ||
        response;

      setProposals(
        Array.isArray(result) ? result : []
      );

    } catch (error) {

      setError(
        error?.response?.data?.message ||
        "Unable to load proposals."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="client-page">

      <header className="client-topbar">

        <div>

          <span className="client-eyebrow">
            FREELANCER PROPOSALS
          </span>

          <h1>
            Proposals
          </h1>

          <p>
            Review proposals received from freelancers.
          </p>

        </div>

      </header>

      {error && (
        <div className="client-error">
          {error}
        </div>
      )}

      <div className="client-panel">

        <div className="client-panel-header">

          <div>

            <span className="client-panel-label">
              PROPOSALS
            </span>

            <h2>
              Received Proposals
            </h2>

          </div>

          <span className="client-count">
            {proposals.length} Received
          </span>

        </div>

        {loading ? (

          <div className="client-loading-box">
            Loading proposals...
          </div>

        ) : proposals.length === 0 ? (

          <div className="client-empty">

            <FiFileText size={32} />

            <h3>
              No proposals yet
            </h3>

            <p>
              Proposals from freelancers will
              appear here.
            </p>

          </div>

        ) : (

          <div className="client-proposals-list">

            {proposals.map((proposal) => (

              <div
                className="client-proposal-card"
                key={proposal._id}
              >

                <div className="client-proposal-user">

                  <div className="client-avatar small">
                    {proposal.freelancer?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "F"}
                  </div>

                  <div>

                    <strong>
                      {proposal.freelancer?.name ||
                        "Freelancer"}
                    </strong>

                    <span>
                      {proposal.project?.title ||
                        "Project"}
                    </span>

                  </div>

                </div>

                <div className="client-proposal-details">

                  <div>
                    <span>Bid Amount</span>

                    <strong>
                      ₹
                      {Number(
                        proposal.bidAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery</span>

                    <strong>
                      {proposal.deliveryTime || "-"}
                    </strong>
                  </div>

                </div>

                <span
                  className={`client-status ${
                    String(proposal.status || "pending")
                      .toLowerCase()
                  }`}
                >
                  {proposal.status || "Pending"}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}