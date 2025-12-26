"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export function QRCodeDisplay() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--foreground)" }}>
        Scan to Share
      </h3>
      <div className="inline-block p-4 bg-white rounded-xl shadow-inner">
        <QRCodeSVG
          value={url}
          size={160}
          level="H"
          fgColor="#4a3728"
          bgColor="#ffffff"
        />
      </div>
      <p className="mt-4 text-sm opacity-70">
        Share this page with friends & family
      </p>
    </div>
  );
}
