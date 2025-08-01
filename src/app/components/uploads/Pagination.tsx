const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <div className="flex justify-center mt-4 space-x-2">
    <button
      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded ${
        currentPage === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-4 py-2 rounded ${
          currentPage === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() =>
        currentPage < totalPages && setCurrentPage(currentPage + 1)
      }
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded ${
        currentPage === totalPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      Next
    </button>
  </div>
);

export default Pagination;
