import { useState } from 'react';
import { Search } from 'lucide-react';

interface WalletLookupProps {
  allocations: Map<string, number>;
}

export function WalletLookup({ allocations }: WalletLookupProps) {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<{ found: boolean; amount?: number } | null>(null);

  const handleSearch = () => {
    const normalizedAddress = address.toLowerCase().trim();
    const amount = allocations.get(normalizedAddress);
    
    if (amount !== undefined) {
      setResult({ found: true, amount });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl text-white mb-4">Check Your Allocation</h2>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter wallet address (0x...)"
            className="w-full bg-[#0f0f1e] border border-[#2d2d44] rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none transition-colors text-sm sm:text-base"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-lg border ${result.found ? 'bg-[#7c3aed]/10 border-[#7c3aed]' : 'bg-red-500/10 border-red-500'}`}>
          {result.found ? (
            <div>
              <div className="text-[#a78bfa] mb-1">✓ Allocation Found</div>
              <div className="text-white text-xl sm:text-2xl">{result.amount?.toLocaleString()} MON</div>
            </div>
          ) : (
            <div>
              <div className="text-red-400 mb-1">✗ Not Eligible</div>
              <div className="text-gray-400 text-sm">This address is not in the airdrop list</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
