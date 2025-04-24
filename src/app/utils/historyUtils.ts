export const filterHistory = (
  history: any[],
  searchTerm: string,
  filterPlatform: string
) => {
  return history.filter(
    (item) =>
      (filterPlatform ? item.platform === filterPlatform : true) &&
      (searchTerm
        ? item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.hashtags.some((hashtag: string) =>
            hashtag.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          item.dominantColor.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );
};

export const bulkDelete = async (
  selectedItems: string[],
  deleteHandler: (id: string) => Promise<void>
) => {
  for (const id of selectedItems) {
    await deleteHandler(id);
  }
};
