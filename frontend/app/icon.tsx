import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #383fd9 0%, #535bf2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {/* Vector path / polyline icon */}
          <circle cx="4" cy="16" r="2.5" fill="white" />
          <circle cx="10" cy="4" r="2.5" fill="white" />
          <circle cx="16" cy="13" r="2.5" fill="white" />
          <polyline
            points="4,16 10,4 16,13"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
