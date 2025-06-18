# Wallet Adapter

A simple Next.js app for connecting and viewing balances of Solana wallets (Phantom, Solflare, Coinbase) using the Solana Wallet Adapter.

## Features

- Connect to Solana wallets (Phantom, Solflare, Coinbase)
- View your wallet's SOL balance
- Modern UI with React, Tailwind CSS, and Framer Motion

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/components/WalletAdapter.tsx` – Wallet connection modal and logic
- `src/components/Balance.tsx` – Displays connected wallet's SOL balance
- `src/app/page.tsx` – Main page

## Tech Stack

- Next.js
- React
- Solana Wallet Adapter
- Tailwind CSS
- Framer Motion
