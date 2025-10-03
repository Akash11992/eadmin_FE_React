import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";


const EmailRejectForm = () => {
    // const { company_id } = useParams();
    const params = new URLSearchParams(window.location.search);
    const company_id = (params.get("company_id"));
    const [remark, setRemark] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (remark.trim() === "") {
            setError("Please enter a remark before submitting.");
            return;
        }

        try {
            await axios.get(`${process.env.REACT_APP_API}/api/reject1`, {
                params: { company_id, remark },
            });
            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    const handleChange = (e) => {
        setRemark(e.target.value);
        if (error) setError(""); // Clear error as user types
    };

    return (
        <div style={{
            maxWidth: 700,
            margin: "40px auto",
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            fontFamily: "Arial, sans-serif"
        }}>
            {!submitted ? (
                <>
                    <h2 style={{ marginBottom: 10 }}>Raise query for Petty Cash Amount Approval</h2>
                    <p style={{ marginBottom: 20, fontSize: 15, color: "#555" }}>
                        Please provide a reason for raising this query.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={remark}
                            onChange={handleChange}
                            placeholder="Type your remarks here..."
                            style={{
                                width: "100%",
                                height: 100,
                                padding: 10,
                                fontSize: 14,
                                borderRadius: 5,
                                border: "1px solid #ccc",
                                resize: "none",
                            }}
                        />
                        {error && (
                            <div style={{ color: "#d9534f", marginTop: 8 }}>{error}</div>
                        )}
                        <button
                            type="submit"
                            disabled={remark.trim() === ""}
                            style={{
                                marginTop: 20,
                                padding: "10px 20px",
                                backgroundColor: remark.trim() ? "#dc3545" : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: 5,
                                fontSize: 16,
                                cursor: remark.trim() ? "pointer" : "not-allowed",
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </>
            ) : (
                <div style={{ textAlign: "center", color: "green", fontSize: 18 }}>
                    ✅ Query raised successfully.
                </div>
            )}
        </div>
    );
};

export default EmailRejectForm;