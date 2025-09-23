import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Colombian Creator Platform</h1>
      <p>Welcome to the simplified version!</p>
      <nav>
        <a href="/about" style={{ marginRight: "10px" }}>About</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  );
}

function About() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>About</h1>
      <p>This is a simple React app.</p>
      <a href="/">← Back to Home</a>
    </div>
  );
}

function Contact() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Contact</h1>
      <p>Contact us here.</p>
      <a href="/">← Back to Home</a>
    </div>
  );
}

function SimpleApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<SimpleApp />);
}