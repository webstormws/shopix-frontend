import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-shopix-border mt-10 py-6 text-center text-xs text-shopix-muted">
      © {new Date().getFullYear()} Shopix. Barcha huquqlar himoyalangan.
    </footer>
  );
}
