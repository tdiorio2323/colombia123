import { createRoot } from "react-dom/client";

function MinimalApp() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Minimal React App</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert("Button clicked!")}>
        Test Button
      </button>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<MinimalApp />);
}