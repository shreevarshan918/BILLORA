import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import InvoiceView from "./pages/InvoiceView";
import BusinessSettings from "./pages/BusinessSettings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route
                    path="/invoices/new"
                    element={<CreateInvoice />}
                />
                <Route
    path="/invoices/:id"
    element={<InvoiceView />}
/>
<Route
    path="/settings/business"
    element={<BusinessSettings />}
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;