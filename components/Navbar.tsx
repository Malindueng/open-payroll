"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/employer", label: "Employer" },
    { href: "/employee", label: "Employee" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(10, 14, 26, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e2d3d",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.25rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>💸</span>
          <span
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
            }}
          >
            Open Payroll
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 500,
              color: "#06b6d4",
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              borderRadius: "4px",
              padding: "1px 5px",
              letterSpacing: "0.05em",
            }}
          >
            OPN
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ display: "flex", gap: "0.25rem" }}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#06b6d4" : "#94a3b8",
                  backgroundColor: active
                    ? "rgba(6, 182, 212, 0.08)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  border: active
                    ? "1px solid rgba(6, 182, 212, 0.15)"
                    : "1px solid transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        {/* Right side — wallet anchored to top right */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div id="wallet-anchor" style={{ position: "relative" }}>
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "1px solid #1e2d3d",
              borderRadius: "0.5rem",
              padding: "0.4rem 0.5rem",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: "1rem",
              lineHeight: 1,
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            backgroundColor: "#0d1424",
            borderTop: "1px solid #1e2d3d",
            padding: "0.75rem 1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "0.625rem 0.875rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#06b6d4" : "#94a3b8",
                  backgroundColor: active
                    ? "rgba(6, 182, 212, 0.08)"
                    : "transparent",
                  textDecoration: "none",
                  border: active
                    ? "1px solid rgba(6, 182, 212, 0.15)"
                    : "1px solid transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}