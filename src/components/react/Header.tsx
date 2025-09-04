import { useState } from "react";
import useScrollAndSwipeDetection from "../../hooks/useScrollAndSwipeDetection";
import logo from "../../assets/logo-lbbc.png"; 
import "../../assets/styles/header.css"; // Move styles to Header.css or use CSS-in-JS

const navLinks = [
    { href: "/what-we-believe", label: "What we believe" },
    { href: "/salvation", label: "Bible way to Heaven" },
    { href: "/materials", label: "Materials" },
    { href: "/prayer-requests", label: "Prayer Requests" },
];

const Header = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    
    const onSwipeUp = () => setIsHeaderVisible(!collapsed);
    const onSwipedown = () => setIsHeaderVisible(true);

    useScrollAndSwipeDetection(onSwipeUp, onSwipedown);
    return (
        <header className={`header ${isHeaderVisible ? "" : "header-hidden"}`}>
            <div className="logo">
                <a href="/">
                    <img src={logo.src} alt="Smyrna BBC Stockholm Logo" width={100} height={100} />
                </a>
            </div>
            <button
                className={`menu-toggle ${collapsed ? "" : "is-open"}`}
                aria-label="Toggle menu"
                aria-expanded={!collapsed}
                aria-controls="primary-nav"
                onClick={() => setCollapsed((c) => !c)}
            >
                <svg viewBox="0 0 100 80" width="40" height="40">
                    <rect width="100" height="10" rx="5" ry="5"></rect>
                    <rect y="30" width="100" height="10" rx="5" ry="5"></rect>
                    <rect y="60" width="100" height="10" rx="5" ry="5"></rect>
                </svg>
            </button>
            <nav
                id="primary-nav"
                className="main-nav"
                data-collapsed={collapsed}
            >
                <ul>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;