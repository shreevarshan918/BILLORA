import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateInvoice() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    const [customerId, setCustomerId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [dueDate, setDueDate] = useState("");

    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);

    const [items, setItems] = useState([
        {
            description: "",
            quantity: 1,
            price: 0
        }
    ]);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("billora_token");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    // Load customers
    useEffect(() => {

        const loadCustomers = async () => {

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

            }

        };

        loadCustomers();

    }, []);


    // Update item
    const updateItem = (index, field, value) => {

        const updatedItems = [...items];

        updatedItems[index][field] = value;

        setItems(updatedItems);

    };


    // Add item
    const addItem = () => {

        setItems([
            ...items,
            {
                description: "",
                quantity: 1,
                price: 0
            }
        ]);

    };


    // Remove item
    const removeItem = (index) => {

        if (items.length === 1) {
            return;
        }

        setItems(
            items.filter((_, i) => i !== index)
        );

    };


    // Calculate subtotal
    const subtotal = items.reduce(
        (total, item) => {

            return total +
                Number(item.quantity || 0) *
                Number(item.price || 0);

        },
        0
    );


    const discountAmount = Number(discount || 0);

    const taxAmount = Number(tax || 0);

    const total =
        subtotal -
        discountAmount +
        taxAmount;


    // Save invoice
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!customerId) {

            setError("Please select a customer.");

            return;
        }


        if (items.some(item => !item.description.trim())) {

            setError("Every item needs a description.");

            return;
        }


        if (items.some(item => Number(item.quantity) <= 0)) {

            setError("Quantity must be greater than zero.");

            return;
        }


        setSaving(true);

        try {

            await api.post(
                "/invoices",
                {
                    customer_id: Number(customerId),
                    invoice_date: invoiceDate,
                    due_date: dueDate || null,
                    discount: discountAmount,
                    tax: taxAmount,
                    items: items.map(item => ({
                        description: item.description,
                        quantity: Number(item.quantity),
                        price: Number(item.price)
                    }))
                },
                { headers }
            );


            navigate("/invoices");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create invoice"
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div className="invoice-page">

            <nav className="dashboard-nav">

                <Link
                    to="/dashboard"
                    className="logo"
                >
                    Billora
                </Link>

                <Link
                    to="/invoices"
                    className="back-link"
                >
                    Invoices
                </Link>

            </nav>


            <main className="invoice-content">

                <div className="page-header">

                    <div>
                        <h1>Create Invoice</h1>

                        <p>
                            Create a professional invoice for your customer.
                        </p>
                    </div>

                </div>


                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                <form
                    className="invoice-builder"
                    onSubmit={handleSubmit}
                >


                    {/* Invoice Details */}

                    <section className="invoice-section">

                        <h2>Invoice Details</h2>


                        <div className="invoice-details-grid">

                            <div>

                                <label>
                                    Customer *
                                </label>

                                <select
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(e.target.value)
                                    }
                                    required
                                >

                                    <option value="">
                                        Select customer
                                    </option>

                                    {customers.map(customer => (

                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div>

                                <label>
                                    Invoice Date
                                </label>

                                <input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) =>
                                        setInvoiceDate(e.target.value)
                                    }
                                />

                            </div>


                            <div>

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) =>
                                        setDueDate(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </section>


                    {/* Items */}

                    <section className="invoice-section">

                        <div className="section-title-row">

                            <h2>Items</h2>

                            <button
                                type="button"
                                className="add-item-button"
                                onClick={addItem}
                            >
                                + Add Item
                            </button>

                        </div>


                        <div className="invoice-items">

                            <div className="item-header">

                                <span>Description</span>
                                <span>Quantity</span>
                                <span>Price</span>
                                <span>Amount</span>
                                <span></span>

                            </div>


                            {items.map((item, index) => {

                                const amount =
                                    Number(item.quantity || 0) *
                                    Number(item.price || 0);


                                return (

                                    <div
                                        className="item-row"
                                        key={index}
                                    >

                                        <input
                                            type="text"
                                            placeholder="e.g. Website Development"
                                            value={item.description}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />


                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.price}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                        />


                                        <strong>
                                            ₹{amount.toFixed(2)}
                                        </strong>


                                        <button
                                            type="button"
                                            className="remove-item"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                );

                            })}

                        </div>

                    </section>


                    {/* Totals */}

                    <section className="invoice-total-section">

                        <div className="totals">

                            <div className="total-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal.toFixed(2)}
                                </strong>

                            </div>


                            <div className="total-input-row">

                                <span>
                                    Discount
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(e.target.value)
                                    }
                                />

                            </div>


                            <div className="total-input-row">

                                <span>
                                    Tax
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={tax}
                                    onChange={(e) =>
                                        setTax(e.target.value)
                                    }
                                />

                            </div>


                            <div className="grand-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{total.toFixed(2)}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* Actions */}

                    <div className="invoice-actions">

                        <Link
                            to="/invoices"
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
                                : "Save Invoice"}
                        </button>

                    </div>

                </form>

            </main>

        </div>

    );

}

export default CreateInvoice;