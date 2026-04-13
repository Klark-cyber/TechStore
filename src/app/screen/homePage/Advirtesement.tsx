import React from "react";

export default function Advertisement() {
  const bgColor = "#060b13";

  return (
    <div
      className="ads-restaurant-frame"
      style={{
        width: "100%",
        background: bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        position: "relative",
        padding: "50px 0",
      }}
    >
      <div
        style={{
          width: "75%",
          maxWidth: "1100px",
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Aspect Ratio 16:9 */}
        <div style={{ paddingTop: "56.25%" }} />

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
          onCanPlay={(e) => {
            const v = e.currentTarget;
            v.play().catch(() => {});
          }}
        >
          <source src="/video/advertisement.mp4" type="video/mp4" />
        </video>

        {/* Chap - LEFT fade only */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "18%",
          height: "100%",
          background: `linear-gradient(to right, ${bgColor} 0%, rgba(6,11,19,0.6) 50%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }} />

        {/* O'ng - RIGHT fade only */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "18%",
          height: "100%",
          background: `linear-gradient(to left, ${bgColor} 0%, rgba(6,11,19,0.6) 50%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 2,
        }} />
      </div>
    </div>
  );
}
