const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterPlatform,
  setFilterPlatform,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterPlatform: string;
  setFilterPlatform: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="mb-8 flex flex-wrap gap-4 justify-center items-center">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search by platform, hashtag, or color"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-72 p-3 text-sm text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
    />

    {/* Dropdown Filter */}
    <select
      value={filterPlatform}
      onChange={(e) => setFilterPlatform(e.target.value)}
      className="w-72 p-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
    >
      <option value="">All Platforms</option>
      <option value="Instagram">Instagram</option>
      <option value="TikTok">TikTok</option>
      <option value="YouTube">YouTube</option>
      <option value="Facebook">Facebook</option>
    </select>
  </div>
);

export default SearchFilter;
