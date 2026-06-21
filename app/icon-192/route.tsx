import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  const size = 192;
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
    { width: size, height: size }
  );
}
