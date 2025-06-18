"use client";
import "../app/globals.css";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useMemo, useState, useEffect } from "react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Balance from "./Balance";

export default function Connect() {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      // Add more wallet adapters here
    ],
    []
  );

  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const WalletConnect: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
    const { select, publicKey, disconnect, connected } = useWallet();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (connected) {
        closeModal();
      }
    }, [connected, closeModal]);

    const displayedWallets = wallets;

    return (
      <div className="z-50">
        <div className="mt-4">
          {publicKey ? (
            <>
              <button
                onClick={disconnect}
                className="w-48 z-50 bg-black text-white hover:scale-95 flex items-center p-4 text-lg font-medium dark:text-black dark:bg-gradient-to-tl dark:from-[#F7F7F7] dark:to-[#EDEDED] py-2 rounded-lg border"
              >
                <div className="truncate"> {publicKey.toBase58()}</div>
                <LogOut className="w-28" />
              </button>
              <Balance />
            </>
          ) : (
            <>
              <button
                onClick={openModal}
                className="px-6 py-2 text-white bg-black dark:text-black dark:bg-gradient-to-tl dark:from-[#F7F7F7] dark:to-[#EDEDED] hover:scale-95 transition-all rounded-lg"
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>

        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Connect Wallet
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-3 max-h-56 overflow-y-auto mx-auto ">
                {displayedWallets.map((wallet) => (
                  <motion.button
                    key={wallet.name}
                    onClick={() => select(wallet.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                      wallet.readyState !== "Installed"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={wallet.readyState !== "Installed"}
                    onHoverStart={() => setHoveredWallet(wallet.name)}
                    onHoverEnd={() => setHoveredWallet(null)}
                  >
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-10 h-10 mb-2"
                    />
                    <AnimatePresence mode="wait">
                      {hoveredWallet === wallet.name ? (
                        <motion.span
                          key="connect"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-black"
                        >
                          Connect
                        </motion.span>
                      ) : (
                        <motion.span
                          key="wallet-name"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm dark:text-black"
                        >
                          {wallet.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletConnect />
      </WalletProvider>
    </ConnectionProvider>
  );
}
