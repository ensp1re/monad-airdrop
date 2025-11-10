import { useState, useEffect } from "react";
import {
  Users,
  Coins,
  TrendingUp,
  Database,
  ExternalLink,
} from "lucide-react";
import { StatsCard } from "./components/StatsCard";
import { WalletLookup } from "./components/WalletLookup";
import { DistributionChart } from "./components/DistributionChart";
import { AllocationAreaChart } from "./components/AllocationAreaChart";
import { Leaderboard } from "./components/Leaderboard";

interface AirdropData {
  allocations: Map<string, number>;
  sortedAllocations: { address: string; amount: number }[];
  totalAmount: number;
  totalWallets: number;
  avgAllocation: number;
  medianAllocation: number;
  distribution: {
    range: string;
    count: number;
    totalAmount: number;
  }[];
}

export default function App() {
  const [data, setData] = useState<AirdropData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Monad - Airdrop Analytics Dashboard";
    fetchAirdropData();
  }, []);

  const fetchAirdropData = async () => {
    try {
      // Fetch fresh data
      const response = await fetch(
        "https://raw.githubusercontent.com/monad-crypto/airdrop-addresses/refs/heads/main/monad_airdrop_results.csv",
      );
      const csvText = await response.text();

      // Parse CSV
      const lines = csvText.trim().split("\n").slice(1); // Skip header
      const allocations = new Map<string, number>();
      const amounts: number[] = [];

      lines.forEach((line) => {
        const [address, amountStr] = line.split(",");
        if (address && amountStr) {
          const amount = parseInt(amountStr.trim());
          allocations.set(address.toLowerCase().trim(), amount);
          amounts.push(amount);
        }
      });

      // Calculate stats
      const sortedAmounts = [...amounts].sort((a, b) => b - a);
      const totalAmount = amounts.reduce(
        (sum, amount) => sum + amount,
        0,
      );
      const totalWallets = amounts.length;
      const avgAllocation = totalAmount / totalWallets;
      const medianAllocation =
        sortedAmounts[Math.floor(sortedAmounts.length / 2)];

      // Create sorted allocations for top list
      const sortedAllocations = Array.from(
        allocations.entries(),
      )
        .map(([address, amount]) => ({ address, amount }))
        .sort((a, b) => b.amount - a.amount);

      // Calculate distribution
      const ranges = [
        { min: 0, max: 5000, label: "0-5K" },
        { min: 5000, max: 10000, label: "5K-10K" },
        { min: 10000, max: 20000, label: "10K-20K" },
        { min: 20000, max: 50000, label: "20K-50K" },
        { min: 50000, max: 100000, label: "50K-100K" },
        { min: 100000, max: 500000, label: "100K-500K" },
        { min: 500000, max: Infinity, label: "500K+" },
      ];

      const distribution = ranges.map(({ min, max, label }) => {
        const inRange = amounts.filter(
          (amount) => amount >= min && amount < max,
        );
        return {
          range: label,
          count: inRange.length,
          totalAmount: inRange.reduce(
            (sum, amount) => sum + amount,
            0,
          ),
        };
      });

      const airdropData: AirdropData = {
        allocations,
        sortedAllocations,
        totalAmount,
        totalWallets,
        avgAllocation,
        medianAllocation,
        distribution,
      };

      setData(airdropData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching airdrop data:", err);
      setError("Failed to load airdrop data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-400">
            Loading airdrop data...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
        <div className="text-red-400">
          {error || "No data available"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white">
      {/* Header */}
      <header className="border-b border-[#2d2d44] bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#7c3aed] rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl">
                  Monad Airdrop
                </h1>
                <div className="text-xs sm:text-sm text-gray-400">
                  Allocation Analytics
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total MON Allocated"
            value={
              (data.totalAmount / 1000000000).toFixed(2) + "B"
            }
            subtitle={
              data.totalAmount.toLocaleString() + " MON"
            }
            icon={<Coins className="w-5 h-5" />}
          />
          <StatsCard
            title="Eligible Wallets"
            value={data.totalWallets.toLocaleString()}
            subtitle="Unique addresses"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Average Allocation"
            value={Math.round(
              data.avgAllocation,
            ).toLocaleString()}
            subtitle="MON per wallet"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Median Allocation"
            value={data.medianAllocation.toLocaleString()}
            subtitle="Middle value"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Wallet Lookup */}
        <div className="mb-8">
          <WalletLookup allocations={data.allocations} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DistributionChart data={data.distribution} />
          <AllocationAreaChart data={data.distribution} />
        </div>

        {/* Leaderboard */}
        <Leaderboard allocations={data.sortedAllocations} />

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm pb-4">
          <p className="mb-2">
            <a
              href="https://raw.githubusercontent.com/monad-crypto/airdrop-addresses/refs/heads/main/monad_airdrop_results.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors inline-flex items-center gap-1"
            >
              Data Source
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </p>
          <p>
            Built by{" "}
            <a
              href="https://x.com/0xEnsp1re"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors inline-flex items-center gap-1"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @0xEnsp1re
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}