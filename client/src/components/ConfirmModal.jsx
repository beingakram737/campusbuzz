const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  variant = "default", // 👈 NEW
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl bg-glass p-6
                   backdrop-blur-glass border border-white/10 shadow-soft"
      >
        <h2
          id="confirm-title"
          className="mb-2 text-lg font-semibold text-white"
        >
          {title}
        </h2>

        <p className="mb-6 text-sm text-gray-400">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          {/* CANCEL */}
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm text-gray-300
                       hover:text-white
                       focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-neon
                       focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            {cancelText}
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white
              transition
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-offset-2 focus-visible:ring-offset-dark
              ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-[0_0_16px_rgba(255,0,80,0.6)] focus-visible:ring-red-400"
                  : "bg-gradient-to-r from-neon to-neonBlue hover:shadow-neon hover:scale-105 focus-visible:ring-neon"
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
