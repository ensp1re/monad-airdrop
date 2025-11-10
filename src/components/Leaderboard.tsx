import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface LeaderboardProps {
  allocations: { address: string; amount: number }[];
}

export function Leaderboard({ allocations }: LeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRange, setFilterRange] = useState<string>('all');
  const itemsPerPage = 50;

  const filteredAllocations = useMemo(() => {
    let filtered = allocations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply amount range filter
    if (filterRange !== 'all') {
      switch (filterRange) {
        case '0-5k':
          filtered = filtered.filter(item => item.amount < 5000);
          break;
        case '5k-10k':
          filtered = filtered.filter(item => item.amount >= 5000 && item.amount < 10000);
          break;
        case '10k-50k':
          filtered = filtered.filter(item => item.amount >= 10000 && item.amount < 50000);
          break;
        case '50k-100k':
          filtered = filtered.filter(item => item.amount >= 50000 && item.amount < 100000);
          break;
        case '100k+':
          filtered = filtered.filter(item => item.amount >= 100000);
          break;
      }
    }

    return filtered;
  }, [allocations, searchTerm, filterRange]);

  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAllocations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of leaderboard
    document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="leaderboard" className="bg-[#1a1a2e] border border-[#2d2d44] rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl text-white">Leaderboard</h2>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <Filter className="w-4 h-4" />
          <span>{filteredAllocations.length.toLocaleString()} wallets</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by address..."
            className="w-full bg-[#0f0f1e] border border-[#2d2d44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none transition-colors text-sm sm:text-base"
          />
        </div>
        <select
          value={filterRange}
          onChange={(e) => {
            setFilterRange(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-[#0f0f1e] border border-[#2d2d44] rounded-lg px-4 py-2 text-white focus:border-[#7c3aed] focus:outline-none transition-colors cursor-pointer text-sm sm:text-base"
        >
          <option value="all">All Amounts</option>
          <option value="0-5k">0 - 5K MON</option>
          <option value="5k-10k">5K - 10K MON</option>
          <option value="10k-50k">10K - 50K MON</option>
          <option value="50k-100k">50K - 100K MON</option>
          <option value="100k+">100K+ MON</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d2d44]">
                <th className="text-left text-gray-400 pb-3 pr-2 sm:pr-4 pl-4 sm:pl-0 text-xs sm:text-sm">Rank</th>
                <th className="text-left text-gray-400 pb-3 pr-2 sm:pr-4 text-xs sm:text-sm">Address</th>
                <th className="text-right text-gray-400 pb-3 pr-4 sm:pr-0 text-xs sm:text-sm">Amount (MON)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => {
                const globalRank = startIndex + index + 1;
                return (
                  <tr
                    key={item.address}
                    className="border-b border-[#2d2d44]/50 hover:bg-[#2d2d44]/30 transition-colors"
                  >
                    <td className="py-2 sm:py-3 pr-2 sm:pr-4 pl-4 sm:pl-0">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm ${
                          globalRank === 1
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : globalRank === 2
                            ? 'bg-gray-400/20 text-gray-300'
                            : globalRank === 3
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {globalRank}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                      <code className="text-[#a78bfa] text-xs sm:text-sm">
                        <span className="hidden sm:inline">{item.address.slice(0, 10)}...{item.address.slice(-8)}</span>
                        <span className="sm:hidden">{item.address.slice(0, 6)}...{item.address.slice(-4)}</span>
                      </code>
                    </td>
                    <td className="py-2 sm:py-3 text-right text-white pr-4 sm:pr-0 text-xs sm:text-sm">
                      {item.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#2d2d44]">
          <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAllocations.length)} of{' '}
            {filteredAllocations.length.toLocaleString()}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#2d2d44] text-gray-400 hover:border-[#7c3aed] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#2d2d44] disabled:hover:text-gray-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {/* Show first page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-lg border border-[#2d2d44] text-gray-400 hover:border-[#7c3aed] hover:text-white transition-colors"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="text-gray-500 px-2">...</span>
                  )}
                </>
              )}

              {/* Show pages around current */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum < 1 || pageNum > totalPages) return null;
                if (currentPage > 3 && pageNum === 1) return null;
                if (currentPage < totalPages - 2 && pageNum === totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg border transition-colors ${
                      currentPage === pageNum
                        ? 'border-[#7c3aed] bg-[#7c3aed]/20 text-white'
                        : 'border-[#2d2d44] text-gray-400 hover:border-[#7c3aed] hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Show last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="text-gray-500 px-2">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-lg border border-[#2d2d44] text-gray-400 hover:border-[#7c3aed] hover:text-white transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#2d2d44] text-gray-400 hover:border-[#7c3aed] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#2d2d44] disabled:hover:text-gray-400 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
