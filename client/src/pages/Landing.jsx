import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="landing">

            <nav className="navbar">
                <div className="logo">Billora</div>

                <div className="nav-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register" className="nav-button">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="hero">

                <div className="hero-badge">
                    Simple invoicing for modern businesses
                </div>

                <h1>
                    Create professional invoices
                    <span> in seconds.</span>
                </h1>

                <p>
                    Billora helps freelancers and small businesses
                    create, manage and track invoices without the
                    complexity of traditional accounting software.
                </p>

                <div className="hero-buttons">
                    <Link to="/register" className="primary-button">
                        Create Your First Invoice
                    </Link>

                    <Link to="/login" className="secondary-button">
                        Sign In
                    </Link>
                </div>

                <div className="hero-stats">
                    <div>
                        <strong>Fast</strong>
                        <small>Create invoices quickly</small>
                    </div>

                    <div>
                        <strong>Simple</strong>
                        <small>No accounting complexity</small>
                    </div>

                    <div>
                        <strong>Professional</strong>
                        <small>Clean invoice PDFs</small>
                    </div>
                </div>

            </main>

        </div>
    );
}

export default Landing;