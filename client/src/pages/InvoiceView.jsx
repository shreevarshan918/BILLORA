import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function InvoiceView() {

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("billora_token");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    useEffect(() => {

        const loadData = async () => {

            try {

                const [invoiceResponse, businessResponse] =
                    await Promise.all([
                        api.get(`/invoices/${id}`, { headers }),
                        api.get("/business", { headers })
                    ]);

                setData(invoiceResponse.data);
                setBusiness(businessResponse.data);

            } catch (error) {

                console.error(
                    "Failed to load invoice:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [id]);


    if (loading) {

        return (
            <div className="empty-state">
                Loading invoice...
            </div>
        );

    }


    if (!data) {

        return (
            <div className="empty-state">
                Invoice not found.
            </div>
        );

    }


    const { invoice, items } = data;
    const updateStatus = async (status) => {

    try {

        await api.patch(
            `/invoices/${id}/status`,
            { status },
            { headers }
        );

        setData({
            ...data,
            invoice: {
                ...invoice,
                status
            }
        });

    } catch (error) {

        console.error(
            "Failed to update invoice status:",
            error
        );

        alert("Failed to update invoice status.");

    }

};

    return (

        <div className="invoice-view-page">

            {/* Navigation */}

            <nav className="dashboard-nav no-print">

                <Link
                    to="/dashboard"
                    className="logo"
                >
                    Billora
                </Link>


                <div className="invoice-nav-actions">

    <Link
        to="/invoices"
        className="back-link"
    >
        Back
    </Link>


    {String(invoice.status).toUpperCase() !== "PAID" && (

        <button
            onClick={() => updateStatus("PAID")}
            className="paid-button"
        >
            Mark as Paid
        </button>

    )}


    <button
        onClick={() => window.print()}
        className="primary-button"
    >
        Print / Save PDF
    </button>

</div>

            </nav>


            {/* Invoice */}

            <main className="invoice-view-content">

                <div className="invoice-paper">


                    {/* Header */}

                    <div className="invoice-top">

                        <div className="business-header">

                            <h1>
                                {business?.business_name ||
                                    "Your Business"}
                            </h1>


                            {business?.address && (

                                <p>
                                    {business.address}
                                </p>

                            )}


                            {business?.phone && (

                                <p>
                                    {business.phone}
                                </p>

                            )}


                            {business?.email && (

                                <p>
                                    {business.email}
                                </p>

                            )}


                            {business?.gstin && (

                                <p>
                                    GSTIN: {business.gstin}
                                </p>

                            )}


                            {business?.upi_id && (

                                <p>
                                    UPI: {business.upi_id}
                                </p>

                            )}

                        </div>


                        <div className="invoice-heading">

                            <h2>
                                INVOICE
                            </h2>

                            <strong>
                                {invoice.invoice_number}
                            </strong>

                        </div>

                    </div>


                    {/* Customer + Dates */}

                    <div className="invoice-meta">


                        <div>

                            <span>
                                BILL TO
                            </span>


                            <strong>
                                {invoice.customer_name}
                            </strong>


                            {invoice.customer_email && (

                                <p>
                                    {invoice.customer_email}
                                </p>

                            )}


                            {invoice.customer_phone && (

                                <p>
                                    {invoice.customer_phone}
                                </p>

                            )}


                            {invoice.customer_address && (

                                <p>
                                    {invoice.customer_address}
                                </p>

                            )}

                        </div>


                        <div className="invoice-dates">

                            <p>

                                <span>
                                    Invoice Date
                                </span>

                                {new Date(
                                    invoice.invoice_date
                                ).toLocaleDateString()}

                            </p>


                            {invoice.due_date && (

                                <p>

                                    <span>
                                        Due Date
                                    </span>

                                    {new Date(
                                        invoice.due_date
                                    ).toLocaleDateString()}

                                </p>

                            )}


                            <p>

                                <span>
                                    Status
                                </span>

                                {invoice.status}

                            </p>

                        </div>

                    </div>


                    {/* Items */}

                    <table className="invoice-items-table">

                        <thead>

                            <tr>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Qty
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Amount
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {items.map(item => (

                                <tr key={item.id}>

                                    <td>
                                        {item.description}
                                    </td>

                                    <td>
                                        {item.quantity}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            item.price
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            item.amount
                                        ).toFixed(2)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>


                    {/* Totals */}

                    <div className="invoice-bottom">


                        <div className="invoice-thankyou">

                            <strong>
                                Thank you for your business.
                            </strong>

                            {business?.upi_id && (

                                <p>
                                    Payment UPI:{" "}
                                    {business.upi_id}
                                </p>

                            )}

                        </div>


                        <div className="invoice-summary">


                            <div>

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        invoice.subtotal
                                    ).toFixed(2)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Discount
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        invoice.discount
                                    ).toFixed(2)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Tax
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        invoice.tax
                                    ).toFixed(2)}
                                </strong>

                            </div>


                            <div className="invoice-grand-total">

                                <span>
                                    TOTAL
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        invoice.total
                                    ).toFixed(2)}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default InvoiceView;
