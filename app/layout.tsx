import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Open Payroll — On-chain Payroll Streaming",
  description:
    "Stream salaries to your team in real time on OPN Chain. Employees claim whenever they want.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0a0e1a",
            }}
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}