import React, { useState, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

function Balance() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(
    () => "https://solana-mainnet.g.alchemy.com/v2/dgt12cONmcf78f4Uowf-3",
    []
  );
  const connection = useMemo(
    () => new Connection(endpoint, "confirmed"),
    [endpoint]
  );

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 10 ** 9); // Convert lamports to SOL
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        Wallet Balance
      </h3>
      {!publicKey ? (
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to see balance.
        </p>
      ) : loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading balance...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : typeof balance === "number" ? (
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {balance.toFixed(4)} SOL
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No balance found.</p>
      )}
    </div>
  );
}

export default Balance;
