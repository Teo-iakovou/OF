"use client";
import React, { useState } from "react";
import HistoryCard from "./HistoryCard";
import ConfirmModal from "@/app/components/common/ConfirmModal";

type HistoryItem = {
  _id: string;
  platform: string;
  hashtags: string[];
  createdAt: string;
};

const HistoryList = ({
  history,
  selectedItems,
  setSelectedItems,
  onDeleteClick, // ✅ NEW
}: {
  history: HistoryItem[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteClick: (id: string) => void;
}) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openConfirmModal = (id: string) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
  if (!pendingDeleteId) return;
 onDeleteClick(pendingDeleteId); // ✅ correct function
  setModalOpen(false);
  setPendingDeleteId(null);
};

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => (
          <HistoryCard
            key={item._id}
            item={item}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onDeleteClick={openConfirmModal}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Analysis"
        message="Are you sure you want to delete this analysis? This action cannot be undone."
        onCancel={() => setModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default HistoryList;
