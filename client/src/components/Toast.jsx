const Toast = ({ type = "success", message }) => {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-red-500/20 text-red-300"
      : "bg-green-500/20 text-green-300";

  return (
    <div className={`mb-4 rounded-xl px-4 py-2 text-sm ${styles}`}>
      {message}
    </div>
  );
};

export default Toast;
