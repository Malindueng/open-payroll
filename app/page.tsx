import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0e1a",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              borderRadius: "9999px",
              padding: "0.375rem 1rem",
              fontSize: "0.75rem",
              color: "#06b6d4",
              fontWeight: 500,
              marginBottom: "1.5rem",
              letterSpacing: "0.05em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#06b6d4",
                animation: "pulse 2s infinite",
              }}
            />
            LIVE ON OPN CHAIN · SEASON 1
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Payroll that runs{" "}
            <span style={{ color: "#06b6d4" }}>on-chain</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              color: "#94a3b8",
              maxWidth: "520px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            Stream salaries to your team in real time. Employees claim whenever
            they want. Employers stay in full control.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/employer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#06b6d4",
                color: "#0a0e1a",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.625rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(6, 182, 212, 0.25)",
                transition: "all 0.15s",
              }}
            >
              I&apos;m an Employer →
            </Link>
            <Link
              href="/employee"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                color: "#22d3ee",
                fontWeight: 500,
                fontSize: "0.9rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.625rem",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              I&apos;m an Employee →
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            width: "100%",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Real-time streams",
              desc: "Salary accrues every second. No waiting for end of month.",
              color: "#f59e0b",
            },
            {
              icon: "🔒",
              title: "Clawback protection",
              desc: "Employers can pause or terminate streams at any time.",
              color: "#06b6d4",
            },
            {
              icon: "🔗",
              title: "Fully on-chain",
              desc: "No intermediaries. Verified on OPN Chain by anyone.",
              color: "#10b981",
            },
            {
              icon: "💳",
              title: "Claim anytime",
              desc: "Employees withdraw vested salary with one click.",
              color: "#a78bfa",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1e2d3d",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                transition: "border-color 0.15s",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{f.icon}</span>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#f1f5f9",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#334155",
          }}
        >
          Built for OPN Builders Season 1 · DeFi & Open Finance ·{" "}
          <a
            href="https://testnet.iopn.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#475569", textDecoration: "none" }}
          >
            OPN Testnet
          </a>
        </div>
      </main>
    </div>
  );
}