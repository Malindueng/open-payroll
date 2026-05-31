import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-indigo-500/10 text-indigo-400 text-sm px-4 py-1.5 rounded-full mb-6 border border-indigo-500/20">
          Built on OPN Chain
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Payroll that runs <br />
          <span className="text-indigo-400">on-chain</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Stream salaries to your team in real time. Employees claim whenever they want.
          Employers stay in full control with pause and clawback.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/employer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            I&apos;m an Employer →
          </Link>
          <Link
            href="/employee"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            I&apos;m an Employee →
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-6 text-left">
          {[
            {
              icon: "⚡",
              title: "Real-time streams",
              desc: "Salary accrues every second. No waiting for end of month.",
            },
            {
              icon: "🔒",
              title: "Clawback protection",
              desc: "Employers can pause or terminate streams at any time.",
            },
            {
              icon: "🔗",
              title: "Fully on-chain",
              desc: "No intermediaries. Deployed on OPN Chain, verifiable by anyone.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-medium text-white mb-2">{f.title}</div>
              <div className="text-sm text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}