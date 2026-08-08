import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Invoices() {

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("billora_token");

    const headers = {
        Authorization: `Bearer ${token}`
    };


    const fetchInvoices = async () => {

        try {

            const response = await api.get(
                "/invoices",
                { headers }
            );

            setInvoices(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchInvoices();
    }, []);


    const deleteInvoice = async (id) => {

        const confirmed = window.confirm(
            "Delete this invoice?"
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/invoices/${id}`,
                { headers }
            );

            fetchInvoices();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete invoice"
            );

        }

    };


    return (

        <div className="invoices-page">

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


            <main className="invoices-content">

                <div className="page-header">

                    <div>

                        <h1>
                            Invoices
                        </h1>

                        <p>
                            Create and manage your invoices.
                        </p>

                    </div>


                    <Link
                        to="/invoices/new"
                        className="primary-button"
                    >
                        + New Invoice
                    </Link>

                </div>


                <div className="invoices-table-card">

                    {loading ? (

                        <div className="empty-state">
                            Loading invoices...
                        </div>

                    ) : invoices.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                No invoices yet
                            </h2>

                            <p>
                                Create your first invoice.
                            </p>

                            <Link
                                to="/invoices/new"
                                className="primary-button"
                            >
                                Create Invoice
                            </Link>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Invoice
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {invoices.map(invoice => (

                                        <tr
                                            key={invoice.id}
                                        >

                                            <td>

                                                <strong>
                                                    {invoice.invoice_number}
                                                </strong>

                                            </td>


                                            <td>
                                                {invoice.customer_name}
                                            </td>


                                            <td>
                                                {new Date(
                                                    invoice.invoice_date
                                                ).toLocaleDateString()}
                                            </td>


                                            <td>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        invoice.total
                                                    ).toFixed(2)}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="status-badge">
                                                    {invoice.status}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="table-actions">

                                                    <Link
                                                        to={`/invoices/${invoice.id}`}
                                                        className="view-button"
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteInvoice(
                                                                invoice.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>

    );

}

export default Invoices;