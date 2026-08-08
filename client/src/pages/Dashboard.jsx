import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("billora_user")
    );

    const token = localStorage.getItem("billora_token");

    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const logout = () => {

        localStorage.removeItem("billora_token");
        localStorage.removeItem("billora_user");

        navigate("/login");

    };


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [invoiceResponse, customerResponse] =
                    await Promise.all([
                        api.get("/invoices", { headers }),
                        api.get("/customers", { headers })
                    ]);


                // Handle either array responses
                // or { invoices: [...] } responses.

                const invoiceData =
                    Array.isArray(invoiceResponse.data)
                        ? invoiceResponse.data
                        : invoiceResponse.data.invoices || [];


                const customerData =
                    Array.isArray(customerResponse.data)
                        ? customerResponse.data
                        : customerResponse.data.customers || [];


                setInvoices(invoiceData);
                setCustomers(customerData);


            } catch (error) {

                console.error(
                    "Dashboard loading error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, [token]);


    /*
     * Calculate dashboard statistics
     */

    const totalRevenue = invoices.reduce(
        (sum, invoice) =>
            sum + Number(invoice.total || 0),
        0
    );


    const paidAmount = invoices
        .filter(invoice =>
            String(invoice.status).toLowerCase() === "paid"
        )
        .reduce(
            (sum, invoice) =>
                sum + Number(invoice.total || 0),
            0
        );


    const pendingAmount = invoices
        .filter(invoice =>
            ["pending", "sent", "unpaid"]
                .includes(
                    String(invoice.status).toLowerCase()
                )
        )
        .reduce(
            (sum, invoice) =>
                sum + Number(invoice.total || 0),
            0
        );


    const overdueAmount = invoices
        .filter(invoice =>
            String(invoice.status).toLowerCase() === "overdue"
        )
        .reduce(
            (sum, invoice) =>
                sum + Number(invoice.total || 0),
            0
        );


    const formatCurrency = (amount) => {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount);

    };


    /*
     * Recent invoices
     */

    const recentInvoices = [...invoices]
        .sort(
            (a, b) =>
                new Date(b.invoice_date || b.created_at) -
                new Date(a.invoice_date || a.created_at)
        )
        .slice(0, 5);


    return (

        <div className="dashboard">


            {/* NAVIGATION */}

            <nav className="dashboard-nav">

                <div className="logo">
                    Billora
                </div>


                <div className="dashboard-user">

                    <span>
                        {user?.name}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </nav>


            {/* CONTENT */}

            <main className="dashboard-content">


                <div className="dashboard-heading">

                    <div>

                        <h1>
                            Welcome, {user?.name}
                        </h1>

                        <p>
                            Here's what's happening with your business.
                        </p>

                    </div>


                    <button
                        className="dashboard-new-invoice"
                        onClick={() =>
                            navigate("/invoices/new")
                        }
                    >
                        + New Invoice
                    </button>

                </div>


                {/* STAT CARDS */}

                <div className="dashboard-cards">


                    <div className="stat-card">

                        <span>
                            Total Revenue
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : formatCurrency(totalRevenue)}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Paid
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : formatCurrency(paidAmount)}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Pending
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : formatCurrency(pendingAmount)}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Overdue
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : formatCurrency(overdueAmount)}
                        </strong>

                    </div>

                </div>


                {/* SECONDARY STATS */}

                <div className="dashboard-secondary-stats">


                    <div>

                        <span>
                            Total Invoices
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : invoices.length}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total Customers
                        </span>

                        <strong>
                            {loading
                                ? "..."
                                : customers.length}
                        </strong>

                    </div>


                </div>


                {/* RECENT INVOICES */}

                <section className="recent-invoices">


                    <div className="section-header">

                        <div>

                            <h2>
                                Recent Invoices
                            </h2>

                            <p>
                                Your latest invoices
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/invoices")
                            }
                        >
                            View All
                        </button>

                    </div>


                    {loading ? (

                        <div className="dashboard-empty">

                            <p>
                                Loading invoices...
                            </p>

                        </div>

                    ) : recentInvoices.length === 0 ? (

                        <div className="dashboard-empty">

                            <h2>
                                No invoices yet
                            </h2>

                            <p>
                                Create your first invoice
                                to get started.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/invoices/new")
                                }
                            >
                                Create Invoice
                            </button>

                        </div>

                    ) : (

                        <div className="recent-invoice-list">

                            {recentInvoices.map(invoice => (

                                <div
                                    className="recent-invoice-row"
                                    key={invoice.id}
                                >

                                    <div>

                                        <strong>
                                            {invoice.invoice_number ||
                                                `Invoice #${invoice.id}`}
                                        </strong>

                                        <span>
                                            {invoice.customer_name ||
                                                "Customer"}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {formatCurrency(
                                                Number(
                                                    invoice.total || 0
                                                )
                                            )}
                                        </strong>

                                        <span
                                            className={`invoice-status ${
                                                String(
                                                    invoice.status || ""
                                                ).toLowerCase()
                                            }`}
                                        >
                                            {invoice.status ||
                                                "Pending"}
                                        </span>

                                    </div>


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/invoices/${invoice.id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* QUICK ACTIONS */}

                <section className="dashboard-actions-section">

                    <h2>
                        Quick Actions
                    </h2>


                    <div className="dashboard-actions">

                        <button
                            onClick={() =>
                                navigate("/invoices/new")
                            }
                        >
                            + New Invoice
                        </button>


                        <button
                            onClick={() =>
                                navigate("/customers")
                            }
                        >
                            Customers
                        </button>


                        <button
                            onClick={() =>
                                navigate("/invoices")
                            }
                        >
                            View Invoices
                        </button>


                        <button
                            onClick={() =>
                                navigate("/settings/business")
                            }
                        >
                            Business Settings
                        </button>

                    </div>

                </section>


            </main>

        </div>

    );

}

export default Dashboard;