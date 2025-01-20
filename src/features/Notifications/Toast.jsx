import { Toaster } from "react-hot-toast";

const Toast = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    toastOptions={{
      duration: 3000,
      success: {
        style: {
          border: "1px solid green",
          padding: "16px",
          color: "#fff",
          background: "#4caf50",
        },
        icon: "✅",
      },
      error: {
        style: {
          border: "1px solid red",
          padding: "16px",
          color: "#fff",
          background: "#f44336",
        },
        icon: "⚠️",
      },
    }}
  />
);

export default Toast;
