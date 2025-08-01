"use client";
type ProjectNavDropdownButtonProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

export default function ProjectNavDropdownButton({
  open,
  setOpen,
}: ProjectNavDropdownButtonProps) {
  return (
    <button
      type="button"
      className="
        flex items-center
        px-8 py-1
        rounded-lg
        bg-[#181F28]
        text-white
        text-sm
        font-medium
        shadow
        border border-[#232B36]
        focus:outline-none
        transition-all
        min-h-[36px]
        min-w-[200px]
      "
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
    >
      Project navigation
      <span className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}>
        {open ? "▲" : "▼"}
      </span>
    </button>
  );
}
