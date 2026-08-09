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

    const [logoUrl, setLogoUrl] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

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

                    setLogoUrl(response.data.logo_url || "");
                    setLogoPreview(response.data.logo_url || "");

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


    const handleLogoChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            setError("Please select an image file.");

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            setError("Logo must be smaller than 5 MB.");

            return;

        }


        setError("");
        setMessage("");

        setLogoFile(file);

        setLogoPreview(URL.createObjectURL(file));

    };


    const uploadLogo = async () => {

        if (!logoFile) {

            setError("Please select a logo first.");

            return;

        }


        setUploadingLogo(true);
        setMessage("");
        setError("");


        try {

            const formData = new FormData();

            formData.append("logo", logoFile);


            const response = await api.post(
                "/business/logo",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            setLogoUrl(response.data.logo_url);
            setLogoPreview(response.data.logo_url);
            setLogoFile(null);

            setMessage(
                "Business logo uploaded successfully."
            );


        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to upload business logo."
            );

        } finally {

            setUploadingLogo(false);

        }

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


                            {/* BUSINESS LOGO */}

                            <div className="form-group full-width">

                                <label>
                                    Business Logo
                                </label>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px",
                                        marginTop: "10px"
                                    }}
                                >

                                    {logoPreview ? (

                                        <img
                                            src={logoPreview}
                                            alt="Business logo"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                objectFit: "contain",
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                background: "#fff"
                                            }}
                                        />

                                    ) : (

                                        <div
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "1px dashed #bbb",
                                                borderRadius: "8px",
                                                color: "#777",
                                                fontSize: "13px",
                                                textAlign: "center"
                                            }}
                                        >
                                            No logo
                                        </div>

                                    )}


                                    <div>

                                        <input
                                            id="business-logo"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleLogoChange}
                                        />

                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={uploadLogo}
                                            disabled={
                                                !logoFile ||
                                                uploadingLogo
                                            }
                                            style={{
                                                marginTop: "10px"
                                            }}
                                        >
                                            {uploadingLogo
                                                ? "Uploading..."
                                                : "Upload Logo"}
                                        </button>

                                        <p
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "8px"
                                            }}
                                        >
                                            PNG, JPG or WebP. Maximum 5 MB.
                                        </p>

                                    </div>

                                </div>

                            </div>


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