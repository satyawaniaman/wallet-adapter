import Connect from "@/components/WalletAdapter";

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Connect />
    </div>
  );
}
