import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f5ef",
          color: "#4a3b32",
          fontSize: "100px",
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        IB
      </div>
    ),
    { ...size }
  );
}
