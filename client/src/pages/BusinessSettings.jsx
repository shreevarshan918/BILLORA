import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function BusinessSettings() {

    const token = localStorage.getItem("billora_token");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstin: "",
        upi_id: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    useEffect(() => {

        const loadBusiness = async () => {

            try {

                const response = await api.get(
                    "/business",
                    { headers }
                );

                if (response.data) {

                    setForm({
                        name: response.data.business_name || "",
                        email: response.data.email || "",
                        phone: response.data.phone || "",
                        address: response.data.address || "",
                        gstin: response.data.gstin || "",
                        upi_id: response.data.upi_id || ""
                    });

                }

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load business profile"
                );

            } finally {

                setLoading(false);

            }

        };

        loadBusiness();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!form.name.trim()) {

            setError("Business name is required.");

            return;
        }

        setSaving(true);

        try {

            await api.post(
                "/business",
                form,
                { headers }
            );

            setMessage(
                "Business profile saved successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to save business profile"
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="settings-page">
                <div className="empty-state">
                    Loading business profile...
                </div>
            </div>
        );

    }


    return (

        <div className="settings-page">

            <nav className="dashboard-nav">

                <Link
                    to="/dashboard"
                    className="logo"
                >
                    Billora
                </Link>

                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    Dashboard
                </Link>

            </nav>


            <main className="settings-content">

                <div className="page-header">

                    <div>

                        <h1>
                            Business Settings
                        </h1>

                        <p>
                            Manage the business information
                            shown on your invoices.
                        </p>

                    </div>

                </div>


                <div className="settings-card">

                    {message && (

                        <div className="success-message">
                            {message}
                        </div>

                    )}


                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="settings-section">

                            <h2>
                                Business Information
                            </h2>

                            <p className="section-description">
                                These details will appear on
                                your invoices.
                            </p>


                            <div className="settings-grid">

                                <div className="form-group full-width">

                                    <label>
                                        Business Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. ABC Technologies"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Business Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="business@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+91 9876543210"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group full-width">

                                    <label>
                                        Business Address
                                    </label>

                                    <textarea
                                        name="address"
                                        rows="3"
                                        placeholder="Bangalore, Karnataka, India"
                                        value={form.address}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        GSTIN
                                    </label>

                                    <input
                                        type="text"
                                        name="gstin"
                                        placeholder="29ABCDE1234F1Z5"
                                        value={form.gstin}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group">

    <label>
        UPI ID
    </label>

    <input
        type="text"
        name="upi_id"
        placeholder="yourname@upi"
        value={form.upi_id}
        onChange={handleChange}
    />

</div>

                            </div>

                        </div>


                        <div className="settings-actions">

                            <Link
                                to="/dashboard"
                                className="cancel-button"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Business Profile"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>

    );

}

export default BusinessSettings;