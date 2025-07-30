// src/components/BreadcrumbNav.jsx
import { Link } from "react-router-dom";

export default function BreadcrumbNav({ items }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: 16,
        margin: "24px 0",
        fontWeight: 500,
        color: "#666",
        letterSpacing: "0.03em",
      }}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <span key={idx} style={{ display: "flex", alignItems: "center" }}>
          {idx !== 0 && (
            <svg
              style={{ margin: "0 8px", verticalAlign: "-2px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#ccc"
              viewBox="0 0 24 24"
            >
              <path d="M9.29 6.71a1 1 0 011.42 0L15 11l-4.29 4.29a1 1 0 01-1.42-1.42L12.17 12l-2.88-2.88a1 1 0 010-1.41z" />
            </svg>
          )}
          {item.to ? (
            <Link
              to={item.to}
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: idx === items.length - 1 ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: "#222",
                fontWeight: 700,
              }}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
