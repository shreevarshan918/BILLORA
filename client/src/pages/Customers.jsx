import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("billora_token");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    const fetchCustomers = async () => {

        try {

            const response = await api.get(
                "/customers",
                { headers }
            );

            setCustomers(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load customers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCustomers();
    }, []);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const resetForm = () => {

        setForm({
            name: "",
            email: "",
            phone: "",
            address: ""
        });

        setEditingId(null);
        setShowForm(false);
        setError("");

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/customers/${editingId}`,
                    form,
                    { headers }
                );

            } else {

                await api.post(
                    "/customers",
                    form,
                    { headers }
                );

            }

            await fetchCustomers();

            resetForm();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
    };


    const handleEdit = (customer) => {

        setForm({
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || ""
        });

        setEditingId(customer.id);
        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/customers/${id}`,
                { headers }
            );

            await fetchCustomers();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete customer"
            );

        }
    };


    const filteredCustomers = customers.filter((customer) => {

        const text = `
            ${customer.name}
            ${customer.email || ""}
            ${customer.phone || ""}
        `.toLowerCase();

        return text.includes(search.toLowerCase());

    });


    return (

        <div className="customers-page">

            <nav className="dashboard-nav">

                <Link to="/dashboard" className="logo">
                    Billora
                </Link>

                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    Dashboard
                </Link>

            </nav>


            <main className="customers-content">

                <div className="page-header">

                    <div>
                        <h1>Customers</h1>

                        <p>
                            Manage your customers and their details.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        + Add Customer
                    </button>

                </div>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <div className="customer-toolbar">

                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


                {showForm && (

                    <div className="customer-form-card">

                        <div className="form-header">

                            <h2>
                                {editingId
                                    ? "Edit Customer"
                                    : "Add Customer"}
                            </h2>

                            <button onClick={resetForm}>
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div>

                                    <label>
                                        Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Customer name"
                                    />

                                </div>


                                <div>

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="customer@example.com"
                                    />

                                </div>


                                <div>

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                    />

                                </div>


                                <div>

                                    <label>
                                        Address
                                    </label>

                                    <input
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Customer address"
                                    />

                                </div>

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    {editingId
                                        ? "Update Customer"
                                        : "Save Customer"}
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                <div className="customers-table-card">

                    {loading ? (

                        <div className="empty-state">
                            Loading customers...
                        </div>

                    ) : filteredCustomers.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                No customers found
                            </h2>

                            <p>
                                Add your first customer to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredCustomers.map(
                                        (customer) => (

                                            <tr key={customer.id}>

                                                <td>
                                                    <strong>
                                                        {customer.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {customer.email || "—"}
                                                </td>

                                                <td>
                                                    {customer.phone || "—"}
                                                </td>

                                                <td>
                                                    {customer.address || "—"}
                                                </td>

                                                <td>

                                                    <div className="table-actions">

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(customer)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(customer.id)
                                                            }
                                                            className="delete-button"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>

    );
}

export default Customers;