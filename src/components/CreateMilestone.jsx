import React, { useState } from "react";
import { createMilestone } from "../Services/milestoneServices";

const CreateMilestone = ({ projectId, onCreated }) => {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.title.trim()) {
            setError("Milestone title is required");
            return;
        }

        if (!formData.amount) {
            setError("Amount is required");
            return;
        }

        if (!formData.dueDate) {
            setError("Due date is required");
            return;
        }

        try {
            setLoading(true);

            const data = {
                title: formData.title,
                description: formData.description,
                amount: Number(formData.amount),
                dueDate: formData.dueDate
            };

            console.log("CREATING MILESTONE:");
            console.log("Project ID:", projectId);
            console.log("Data:", data);

            const response = await createMilestone(
                projectId,
                data
            );

            console.log("MILESTONE CREATED:", response);

            setSuccess("Milestone created successfully!");

            setFormData({
                title: "",
                description: "",
                amount: "",
                dueDate: ""
            });

            if (onCreated) {
                onCreated(response.milestone);
            }

        } catch (err) {

            console.error(
                "CREATE MILESTONE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create milestone"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="milestone-create-card">

            <h2>Create Milestone</h2>

            {error && (
                <div className="milestone-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="milestone-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label>
                        Milestone Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Example: Frontend Development"
                        value={formData.title}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        placeholder="Describe what should be completed..."
                        value={formData.description}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        name="amount"
                        placeholder="Example: 5000"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Milestone"}
                </button>

            </form>

        </div>
    );
};

export default CreateMilestone;