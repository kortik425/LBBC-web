import { useState } from "react";
import useScrollAndSwipeDetection from "../../hooks/useScrollAndSwipeDetection";
import logo from "../../assets/logo-lbbc.png";
import "../../assets/styles/header.css";

type NavLink = {
  id: string;
  href: string;
  label: string;
  subPages?: NavLink[];
};

const navLinks: NavLink[] = [
  {
    id: "about",
    href: "/about-us",
    label: "About",
    subPages: [
      {
        id: "whatWeBelieve",
        href: "/what-we-believe",
        label: "What we Believe",
      },
      { id: "whoWeAre", href: "/about-us", label: "Who we are" },
      { id: "howToReachUs", href: "/how-to-reach", label: "How to reach us" },
    ],
  },
  { id: "bibleWayToHeaven", href: "/salvation", label: "Bible way to Heaven" },
  { id: "materials", href: "/materials", label: "Materials" },
  { id: "prayerRequests", href: "/prayer-requests", label: "Prayer Requests" },
  { id: "give", href: "/give", label: "Give" },
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
          <img
            src={logo.src}
            alt="Smyrna BBC Stockholm Logo"
            width={100}
            height={100}
          />
        </a>
      </div>

      <button
        className={`menu-toggle ${collapsed ? "" : "is-open"}`}
        aria-label="Toggle menu"
        aria-expanded={!collapsed}
        aria-controls="primary-nav"
        onClick={() => setCollapsed((c) => !c)}
      >
        <MenuIcon />
      </button>

      <nav id="primary-nav" className="main-nav" data-collapsed={collapsed}>
        <ul>
          {navLinks.map((link) => (
            <HeaderElement key={link.id} link={link} />
          ))}
        </ul>
      </nav>
    </header>
  );
};

const MenuIcon = () => (
  <svg viewBox="0 0 100 80" width="40" height="40">
    <rect width="100" height="10" rx="5" ry="5"></rect>
    <rect y="30" width="100" height="10" rx="5" ry="5"></rect>
    <rect y="60" width="100" height="10" rx="5" ry="5"></rect>
  </svg>
);

const HeaderElement = ({ link }: { link: NavLink }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const isExpanded = openDropdown === link.id;

  if (link.subPages) {
    return (
      <li
        key={link.id}
        className={"has-submenu"}
        onMouseEnter={() => toggleDropdown(link.id)}
        onMouseLeave={() => toggleDropdown(link.id)}
        aria-expanded={isExpanded}
        aria-controls={`submenu-${link.id}`}
      >
        <button
          className="nav-parent"
          data-isExpanded={isExpanded}
          onClick={() => toggleDropdown(link.id)}
        >
          {link.label}
        </button>
        {isExpanded && (
          <ul
            className="submenu"
            id={`submenu-${link.label.replace(/\s+/g, "")}`}
          >
            {link.subPages.map((sub) => (
              <li key={sub.id}>
                <a href={sub.href}>{sub.label}</a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    return (
      <li>
        <a href={link.href}>{link.label}</a>
      </li>
    );
  }
};

export default Header;
