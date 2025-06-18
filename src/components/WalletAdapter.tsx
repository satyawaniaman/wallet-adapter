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
import { LogOut, X } from "lucide-react";
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
    const [showAllWallets, setShowAllWallets] = useState(false);
    const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
    const [phantomAnimating, setPhantomAnimating] = useState(false);
    const { select, publicKey, disconnect, connected } = useWallet();

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
      setIsOpen(false);
      setShowAllWallets(false);
      setPhantomAnimating(false);
    };

    useEffect(() => {
      if (connected) {
        closeModal();
      }
    }, [connected]);

    // Get Phantom wallet and other wallets
    const phantomWallet = wallets.find(wallet => wallet.name === "Phantom");
    const otherWallets = wallets.filter(wallet => wallet.name !== "Phantom");

    const handlePhantomSelect = () => {
      if (phantomWallet) {
        setPhantomAnimating(true);
        // Delay the actual connection to allow animation to play
        setTimeout(() => {
          select(phantomWallet.name);
          closeModal();
        }, 800); // Animation duration
      }
    };

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
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
              <div className="flex flex-col items-center mb-6">
                <h2 className="text-xl font-semibold text-black text-center">
                  Connect Wallet
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {!showAllWallets ? (
                <div className="flex flex-col items-center">
                  {phantomWallet && (
                    <motion.div
                      className="flex flex-col items-center justify-center"
                      initial={false}
                    >
                      <motion.button
                        key={phantomWallet.name}
                        onClick={handlePhantomSelect}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg mb-4 ${phantomWallet.readyState !== "Installed" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={phantomWallet.readyState !== "Installed" || phantomAnimating}
                        onHoverStart={() => !phantomAnimating && setHoveredWallet(phantomWallet.name)}
                        onHoverEnd={() => !phantomAnimating && setHoveredWallet(null)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{
                            scale: phantomAnimating ? [1, 1.5, 30] : 1,
                            opacity: phantomAnimating ? [1, 1, 0] : 1,
                          }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.3, 1],
                            ease: "easeInOut",
                          }}
                        >
                          <img
                            src={phantomWallet.icon}
                            alt={phantomWallet.name}
                            className="w-16 h-16 mb-2"
                          />
                        </motion.div>
                        <AnimatePresence mode="wait">
                          {!phantomAnimating && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {hoveredWallet === phantomWallet.name ? (
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
                                  {phantomWallet.name}
                                </motion.span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  )}
                  
                  <button
                    onClick={() => setShowAllWallets(true)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800"
                    disabled={phantomAnimating}
                  >
                    Show other wallets
                  </button>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {otherWallets.map((wallet) => (
                      <motion.button
                        key={wallet.name}
                        onClick={() => select(wallet.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${wallet.readyState !== "Installed" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={wallet.readyState !== "Installed"}
                        onHoverStart={() => setHoveredWallet(wallet.name)}
                        onHoverEnd={() => setHoveredWallet(null)}
                        whileTap={{ scale: 0.95 }}
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
                  
                  <button
                    onClick={() => setShowAllWallets(false)}
                    className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    Back to Phantom
                  </button>
                </div>
              )}
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
