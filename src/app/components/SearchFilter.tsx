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
  <div className="mb-4 flex gap-4">
    <input
      type="text"
      placeholder="Search by platform, hashtag, or color"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border p-2 rounded w-1/2"
    />
    <select
      value={filterPlatform}
      onChange={(e) => setFilterPlatform(e.target.value)}
      className="border p-2 rounded w-1/2"
    >
      <option value="">All Platforms</option>
      <option value="Instagram">Instagram</option>
      <option value="TikTok">TikTok</option>
    </select>
  </div>
);

export default SearchFilter;
