// Snowfall.tsx
import { useEffect } from "react";

type SnowfallProps = {
  intervalMs?: number;         // ถี่แค่ไหน (ยิ่งน้อยยิ่งหนาแน่น)
  symbols?: string[];          // อีโมจิ/ตัวอักษร/รูปแทนเกล็ด
  zIndex?: number;             // ชั้นลอย
  maxFlakes?: number;          // จำกัดจำนวนบนจอ
};

export default function Snowfall({
  intervalMs = 280,
  symbols = ["❄︎", "✦", "✧"],
  zIndex = 1,
  maxFlakes = 120,
}: SnowfallProps) {
  useEffect(() => {
    let count = 0;

    const createFlake = () => {
      if (document.querySelectorAll(".snowflake").length >= maxFlakes) return;

      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.zIndex = String(zIndex);

      const inner = document.createElement("div");
      inner.className = "inner";
      const glyph = document.createElement("span");
      glyph.className = "glyph";
      glyph.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      // สุ่มค่าต่าง ๆ
      const dur = 8 + Math.random() * 24;        // เวลา
      const sway = 10 + Math.random() * 40;     // ระยะเคลื่อนซ้านขวา
      const swayDur = 2 + Math.random() * 3;    // เวลาเคลื่อนซ้านขวา
      const spinDur = 3 + Math.random() * 6;    // เวลาหมุน
      const size = 8 + Math.random() * 22;      // ขนาด
      const leftVw = Math.random() * 100;       // จุดเกิดจากซ้าย
      const startOpacity = 0.7 + Math.random() * 0.3; // จุดเริ่มจาง

      flake.style.left = `${leftVw}vw`;
      flake.style.setProperty("--dur", `${dur}s`);
      flake.style.setProperty("--startOpacity", `${startOpacity}`);
      inner.style.setProperty("--sway", `${sway}px`);
      inner.style.setProperty("--swayDur", `${swayDur}s`);
      glyph.style.fontSize = `${size}px`;
      glyph.style.setProperty("--spinDur", `${spinDur}s`);

      inner.appendChild(glyph);
      flake.appendChild(inner);
      document.body.appendChild(flake);

      // ลบทิ้งเมื่อครบเวลา (กัน DOM พอง)
      const ttl = (dur + 0.5) * 1000;
      setTimeout(() => flake.remove(), ttl);
      count++;
    };

    const id = setInterval(createFlake, intervalMs);

    // ช่วยเรื่อง performance เมื่อแท็บไม่โฟกัส
    const onVisibility = () => {
      if (document.hidden) clearInterval(id);
      else setInterval(createFlake, intervalMs);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      document.querySelectorAll(".snowflake").forEach((n) => n.remove());
    };
  }, [intervalMs, symbols, zIndex, maxFlakes]);

  return null;
}
