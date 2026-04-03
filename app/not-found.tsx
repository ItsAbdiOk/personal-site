import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="page-container" style={{ padding: "80px 24px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>404</h1>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9375rem" }}>
          This page doesn&apos;t exist.{" "}
          <a
            href="/"
            style={{
              color: "var(--text-primary)",
              textDecoration: "underline",
              textDecorationColor: "var(--border)",
              textUnderlineOffset: "3px",
            }}
          >
            Go home
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
