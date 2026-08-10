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

    const currencySymbol = (currency) => {
        switch (currency) {
            case "USD":
                return "$";
            case "EUR":
                return "€";
            case "GBP":
                return "£";
            case "INR":
            default:
                return "₹";
        }
    };

    const formatMoney = (value, currency) => {
        return `${currencySymbol(currency)}${Number(value || 0).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    useEffect(() => {
        const loadInvoice = async () => {
            try {
                const response = await api.get(
                    `/invoices/${id}`,
                    { headers }
                );

                setData(response.data);
                setBusiness(response.data.business || null);
            } catch (error) {
                console.error("Failed to load invoice:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInvoice();
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

    const { invoice, items = [] } = data;

    const symbol = currencySymbol(invoice.currency);

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
            console.error("Failed to update invoice status:", error);

            alert("Failed to update invoice status.");
        }
    };

    return (
        <div className="invoice-view-page">

            {/* =========================
                SCREEN NAVIGATION
            ========================= */}

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


            {/* =========================
                INVOICE
            ========================= */}

            <main className="invoice-view-content">

                <div className="invoice-paper landscape-invoice">


                    {/* =========================
                        TOP HEADER
                    ========================= */}

                    <div className="gst-invoice-header">

                        <div className="gst-business-left">

                            <div className="gst-logo-area">

                                {business?.logo_url ? (
                                    <img
                                        src={business.logo_url}
                                        alt="Business Logo"
                                        className="gst-business-logo"
                                    />
                                ) : (
                                    <div className="gst-logo-placeholder">
                                        LOGO
                                    </div>
                                )}

                            </div>

                            <div className="gst-business-details">

                                <h1>
                                    {business?.business_name ||
                                        "Your Business"}
                                </h1>

                                {business?.legal_name && (
                                    <p>
                                        {business.legal_name}
                                    </p>
                                )}

                                {business?.address && (
                                    <p>
                                        {business.address}
                                    </p>
                                )}

                                {(business?.state ||
                                    business?.pincode) && (
                                    <p>
                                        {business?.state || ""}
                                        {business?.pincode
                                            ? ` - ${business.pincode}`
                                            : ""}
                                    </p>
                                )}

                                {business?.phone && (
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {business.phone}
                                    </p>
                                )}

                                {business?.email && (
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {business.email}
                                    </p>
                                )}

                                {business?.website && (
                                    <p>
                                        <strong>Web:</strong>{" "}
                                        {business.website}
                                    </p>
                                )}

                                {business?.gstin && (
                                    <p>
                                        <strong>GSTIN:</strong>{" "}
                                        {business.gstin}
                                    </p>
                                )}

                                {business?.pan && (
                                    <p>
                                        <strong>PAN:</strong>{" "}
                                        {business.pan}
                                    </p>
                                )}

                            </div>

                        </div>


                        <div className="gst-invoice-title">

                            <div className="original-copy">
                                ORIGINAL FOR RECIPIENT
                            </div>

                            <h2>
                                TAX INVOICE
                            </h2>

                            <div className="invoice-status-print">
                                {invoice.status}
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        INVOICE INFORMATION
                    ========================= */}

                    <div className="invoice-info-grid">

                        {/* CUSTOMER */}

                        <div className="info-box customer-box">

                            <div className="section-title">
                                CUSTOMER DETAIL
                            </div>

                            <div className="detail-row">
                                <strong>M/S</strong>
                                <span>
                                    {invoice.customer_name}
                                </span>
                            </div>

                            {invoice.customer_address && (
                                <div className="detail-row">
                                    <strong>Address</strong>
                                    <span>
                                        {invoice.customer_address}
                                    </span>
                                </div>
                            )}

                            {invoice.customer_phone && (
                                <div className="detail-row">
                                    <strong>Phone</strong>
                                    <span>
                                        {invoice.customer_phone}
                                    </span>
                                </div>
                            )}

                            {invoice.customer_gstin && (
                                <div className="detail-row">
                                    <strong>GSTIN</strong>
                                    <span>
                                        {invoice.customer_gstin}
                                    </span>
                                </div>
                            )}

                            {invoice.customer_state && (
                                <div className="detail-row">
                                    <strong>State</strong>
                                    <span>
                                        {invoice.customer_state}
                                        {invoice.customer_state_code
                                            ? ` (${invoice.customer_state_code})`
                                            : ""}
                                    </span>
                                </div>
                            )}

                        </div>


                        {/* INVOICE DETAILS */}

                        <div className="info-box invoice-meta-box">

                            <div className="section-title">
                                INVOICE DETAILS
                            </div>

                            <div className="detail-row">
                                <strong>Invoice No.</strong>
                                <span>
                                    {invoice.invoice_number}
                                </span>
                            </div>

                            <div className="detail-row">
                                <strong>Invoice Date</strong>
                                <span>
                                    {formatDate(invoice.invoice_date)}
                                </span>
                            </div>

                            {invoice.due_date && (
                                <div className="detail-row">
                                    <strong>Due Date</strong>
                                    <span>
                                        {formatDate(invoice.due_date)}
                                    </span>
                                </div>
                            )}

                            {invoice.payment_terms && (
                                <div className="detail-row">
                                    <strong>Payment Terms</strong>
                                    <span>
                                        {invoice.payment_terms} Days
                                    </span>
                                </div>
                            )}

                            <div className="detail-row">
                                <strong>Status</strong>
                                <span>
                                    {invoice.status}
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        ITEM TABLE
                    ========================= */}

                    <table className="gst-items-table">

                        <thead>

                            <tr>
                                <th rowSpan="2" className="sr-col">
                                    Sr.
                                    <br />
                                    No.
                                </th>

                                <th rowSpan="2" className="description-col">
                                    Name of Product / Service
                                </th>

                                <th rowSpan="2" className="hsn-col">
                                    HSN / SAC
                                </th>

                                <th rowSpan="2" className="qty-col">
                                    Qty
                                </th>

                                <th rowSpan="2" className="rate-col">
                                    Rate
                                </th>

                                <th rowSpan="2" className="taxable-col">
                                    Taxable Value
                                </th>

                                {invoice.tax_type === "IGST" ? (
                                    <>
                                        <th colSpan="2">
                                            IGST
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th colSpan="2">
                                            CGST
                                        </th>

                                        <th colSpan="2">
                                            SGST
                                        </th>
                                    </>
                                )}

                                <th rowSpan="2" className="total-col">
                                    Total
                                </th>
                            </tr>


                            <tr>

                                {invoice.tax_type === "IGST" ? (
                                    <>
                                        <th>%</th>
                                        <th>Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th>%</th>
                                        <th>Amount</th>
                                        <th>%</th>
                                        <th>Amount</th>
                                    </>
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {items.map((item, index) => {

                                const amount =
                                    Number(item.amount || 0);

                                const taxRate =
                                    Number(item.tax_rate || 0);

                                const taxAmount =
                                    Number(item.tax_amount || 0);

                                const cgstRate =
                                    invoice.tax_type === "GST"
                                        ? Number(invoice.cgst_rate || 0)
                                        : 0;

                                const sgstRate =
                                    invoice.tax_type === "GST"
                                        ? Number(invoice.sgst_rate || 0)
                                        : 0;

                                const igstRate =
                                    invoice.tax_type === "IGST"
                                        ? Number(invoice.igst_rate || 0)
                                        : 0;

                                let cgstAmount = 0;
                                let sgstAmount = 0;
                                let igstAmount = 0;

                                if (invoice.tax_type === "GST") {
                                    cgstAmount =
                                        amount * cgstRate / 100;

                                    sgstAmount =
                                        amount * sgstRate / 100;
                                }

                                if (invoice.tax_type === "IGST") {
                                    igstAmount =
                                        amount * igstRate / 100;
                                }

                                return (
                                    <tr key={item.id || index}>

                                        <td className="center">
                                            {index + 1}
                                        </td>

                                        <td>
                                            <strong>
                                                {item.description}
                                            </strong>
                                        </td>

                                        <td className="center">
                                            {item.hsn_sac || "-"}
                                        </td>

                                        <td className="center">
                                            {item.quantity}
                                        </td>

                                        <td className="number">
                                            {formatMoney(
                                                item.price,
                                                invoice.currency
                                            )}
                                        </td>

                                        <td className="number">
                                            {formatMoney(
                                                amount,
                                                invoice.currency
                                            )}
                                        </td>


                                        {invoice.tax_type === "IGST" ? (
                                            <>
                                                <td className="center">
                                                    {igstRate.toFixed(2)}
                                                </td>

                                                <td className="number">
                                                    {formatMoney(
                                                        igstAmount ||
                                                        taxAmount,
                                                        invoice.currency
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="center">
                                                    {cgstRate.toFixed(2)}
                                                </td>

                                                <td className="number">
                                                    {formatMoney(
                                                        cgstAmount,
                                                        invoice.currency
                                                    )}
                                                </td>

                                                <td className="center">
                                                    {sgstRate.toFixed(2)}
                                                </td>

                                                <td className="number">
                                                    {formatMoney(
                                                        sgstAmount,
                                                        invoice.currency
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        <td className="number">
                                            {formatMoney(
                                                amount + taxAmount,
                                                invoice.currency
                                            )}
                                        </td>

                                    </tr>
                                );
                            })}


                            {/* TOTAL ROW */}

                            <tr className="table-total-row">

                                <td
                                    colSpan="3"
                                    className="right"
                                >
                                    TOTAL
                                </td>

                                <td className="center">
                                    {items.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(item.quantity || 0),
                                        0
                                    )}
                                </td>

                                <td></td>

                                <td className="number">
                                    {formatMoney(
                                        invoice.subtotal,
                                        invoice.currency
                                    )}
                                </td>

                                {invoice.tax_type === "IGST" ? (
                                    <>
                                        <td></td>

                                        <td className="number">
                                            {formatMoney(
                                                invoice.igst_amount,
                                                invoice.currency
                                            )}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td></td>

                                        <td className="number">
                                            {formatMoney(
                                                invoice.cgst_amount,
                                                invoice.currency
                                            )}
                                        </td>

                                        <td></td>

                                        <td className="number">
                                            {formatMoney(
                                                invoice.sgst_amount,
                                                invoice.currency
                                            )}
                                        </td>
                                    </>
                                )}

                                <td className="number">
                                    {formatMoney(
                                        invoice.total,
                                        invoice.currency
                                    )}
                                </td>

                            </tr>

                        </tbody>

                    </table>


                    {/* =========================
                        BOTTOM SECTION
                    ========================= */}

                    <div className="invoice-bottom-grid">


                        {/* LEFT */}

                        <div className="invoice-bottom-left">

                            {/* AMOUNT WORDS */}

                            <div className="bottom-box">

                                <div className="bottom-title">
                                    Total in Words
                                </div>

                                <div className="amount-words">
                                    {invoice.amount_in_words ||
                                        "Amount in words not available"}
                                </div>

                            </div>


                            {/* BANK */}

                            <div className="bottom-box">

                                <div className="bottom-title">
                                    Bank Details
                                </div>

                                <div className="bank-details-grid">

                                    <div>
                                        <strong>Name</strong>
                                        <span>
                                            {business?.bank_name || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>Branch</strong>
                                        <span>
                                            {business?.branch || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>Account Holder</strong>
                                        <span>
                                            {business?.account_holder || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>Acc. Number</strong>
                                        <span>
                                            {business?.account_number || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>IFSC</strong>
                                        <span>
                                            {business?.ifsc || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>UPI ID</strong>
                                        <span>
                                            {business?.upi_id || "-"}
                                        </span>
                                    </div>

                                </div>

                            </div>


                            {/* TERMS */}

                            <div className="bottom-box terms-box">

                                <div className="bottom-title">
                                    Terms & Conditions
                                </div>

                                <p>
                                    {invoice.terms ||
                                        business?.default_terms ||
                                        "Goods once sold will not be taken back."}
                                </p>

                            </div>


                            {/* NOTES */}

                            {invoice.notes && (
                                <div className="bottom-box">

                                    <div className="bottom-title">
                                        Notes
                                    </div>

                                    <p>
                                        {invoice.notes}
                                    </p>

                                </div>
                            )}

                        </div>


                        {/* RIGHT */}

                        <div className="invoice-bottom-right">

                            <div className="summary-box">

                                <div className="summary-line">
                                    <span>
                                        Taxable Amount
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            invoice.taxable_amount ??
                                            invoice.subtotal,
                                            invoice.currency
                                        )}
                                    </strong>
                                </div>


                                <div className="summary-line">
                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            invoice.discount,
                                            invoice.currency
                                        )}
                                    </strong>
                                </div>


                                {invoice.tax_type === "GST" && (
                                    <>
                                        <div className="summary-line">
                                            <span>
                                                CGST
                                            </span>

                                            <strong>
                                                {formatMoney(
                                                    invoice.cgst_amount,
                                                    invoice.currency
                                                )}
                                            </strong>
                                        </div>

                                        <div className="summary-line">
                                            <span>
                                                SGST
                                            </span>

                                            <strong>
                                                {formatMoney(
                                                    invoice.sgst_amount,
                                                    invoice.currency
                                                )}
                                            </strong>
                                        </div>
                                    </>
                                )}


                                {invoice.tax_type === "IGST" && (
                                    <div className="summary-line">
                                        <span>
                                            IGST
                                        </span>

                                        <strong>
                                            {formatMoney(
                                                invoice.igst_amount,
                                                invoice.currency
                                            )}
                                        </strong>
                                    </div>
                                )}


                                <div className="summary-line">
                                    <span>
                                        Total Tax
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            invoice.tax,
                                            invoice.currency
                                        )}
                                    </strong>
                                </div>


                                <div className="grand-total">
                                    <span>
                                        TOTAL AMOUNT
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            invoice.total,
                                            invoice.currency
                                        )}
                                    </strong>
                                </div>


                                <div className="amount-after-tax">
                                    Amount After Tax
                                </div>


                                <div className="computer-generated">
                                    This is a computer-generated
                                    invoice.
                                    <br />
                                    No signature is required.
                                </div>


                                <div className="authorised">

                                    <strong>
                                        For{" "}
                                        {business?.business_name ||
                                            "Your Business"}
                                    </strong>

                                    <div className="signature-space"></div>

                                    <span>
                                        Authorised Signatory
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="invoice-footer-new">

                        <span>
                            Thank you for your business.
                        </span>

                        <span>
                            Powered by Billora
                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default InvoiceView;
