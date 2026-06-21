import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f5ef", // Cream background
          borderRadius: "8px",
          color: "#4a3b32", // Dark brown text
          fontSize: "20px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          border: "2px solid #e2dcd0",
        }}
      >
        IB
      </div>
    ),
    { ...size }
  );
}
