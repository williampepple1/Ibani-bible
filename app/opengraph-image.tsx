import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ibani Bible";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f5ef", // Cream background
          border: "20px solid #4a3b32", // Dark border
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            height: "200px",
            borderRadius: "40px",
            backgroundColor: "#4a3b32",
            color: "#f7f5ef",
            fontSize: "120px",
            fontWeight: 800,
            fontFamily: "sans-serif",
            marginBottom: "40px",
          }}
        >
          IB
        </div>
        <h1
          style={{
            fontSize: "80px",
            fontWeight: 800,
            color: "#4a3b32",
            margin: 0,
            fontFamily: "sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          Ibani Bible
        </h1>
        <p
          style={{
            fontSize: "40px",
            color: "#6c5b52",
            marginTop: "20px",
            fontFamily: "sans-serif",
          }}
        >
          Read and listen in English & Ibani
        </p>
      </div>
    ),
    { ...size }
  );
}
