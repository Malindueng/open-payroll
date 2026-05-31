# 💸 Open Payroll — DApp

> Next.js frontend for Open Payroll — OPN Builders Season 1 Submission

This repo contains the full-stack DApp for Open Payroll — an on-chain payroll
streaming protocol built on OPN Chain. Employers stream salaries in real time.
Employees watch their balance tick up every second and claim whenever they want.

---

## 🔗 Links

| | |
|---|---|
| **Live DApp** | https://open-payroll-iopn.vercel.app |
| **Smart Contract Repo** | https://github.com/Malindueng/open-payroll-contracts |
| **Contract Address** | `0xYourContractAddressHere` |
| **OPN Explorer** | https://testnet.iopn.tech/address/0xYourContractAddressHere |

---

## 📱 Pages

| Route | Description |
|---|---|
| `/` | Landing page — intro and navigation |
| `/employer` | Employer dashboard — deposit, add employees, manage streams |
| `/employee` | Employee view — live salary counter, claim button |

---

## ✨ Key features

- **Live ticking counter** — claimable salary updates every second in the browser
- **Employer dashboard** — fund contract, add employees, pause/terminate streams
- **One-click claim** — employees withdraw all vested salary in one transaction
- **RainbowKit wallet connection** — MetaMask and WalletConnect supported
- **OPN Testnet configured** — chain ID 984 pre-configured, no manual setup needed

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Web3 | wagmi v2, viem, RainbowKit |
| Chain | OPN Testnet (Chain ID: 984) |
| Hosting | Vercel |

---

## 🚀 Run locally

```bash
# Clone
git clone https://github.com/Malindueng/open-payroll-app.git
cd open-payroll-app

# Install
npm install

# Copy env
cp .env.example .env.local
# Fill in your values

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment variables

Create `.env.local`:

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

Get a free WalletConnect project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

---

## 📁 Project structure

open-payroll-app/
├── app/
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Landing page
│   ├── employer/
│   │   └── page.tsx        # Employer dashboard
│   └── employee/
│       └── page.tsx        # Employee claim view
├── components/
│   ├── Navbar.tsx          # Navigation + ConnectButton
│   ├── EmployeeCard.tsx    # Per-employee stream card
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── StatusBadge.tsx
├── hooks/
│   └── useLiveCounter.ts   # Real-time salary counter
└── lib/
    ├── wagmi.ts            # OPN Chain config
    ├── abi.ts              # Contract ABI
    └── utils.ts            # formatOPN, dailyToPerSec, etc.

---

## 🗺 Roadmap

### ✅ Season 1 — Core (shipped)
- [x] Employer dashboard with deposit and employee management
- [x] Live claimable salary counter
- [x] Employee claim view
- [x] Deployed on Vercel

### 🔜 Season 2 — Identity & Reputation
- [ ] Employer reputation display from on-chain scores
- [ ] Employee credential viewer — work history badges
- [ ] Verified employer UI indicators

### 🔜 Season 3 — Real World Assets
- [ ] Multi-token payroll UI — switch between OPN and ERC-20s
- [ ] Treasury-backed payroll health indicator

### 🔮 Future
- [ ] Mobile PWA — employees track earnings on the go
- [ ] Payroll analytics dashboard
- [ ] DAO payroll — vote-gated salary proposals
- [ ] Mainnet support

---

## 👤 Builder

Built for OPN Builders Season 1 — DeFi & Open Finance track.