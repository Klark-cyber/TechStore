import React from "react";

export default function Advertisement() {
  const bgColor = "#060b13"; // Fon rangi

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
        padding: "50px 0", // Video atrofida bo'shliq bo'lsa silliqlash yaxshi ko'rinadi
      }}
    >
      <div
        style={{
          width: "75%",
          maxWidth: "1100px",
          position: "relative",
          overflow: "hidden",
          background: "#000",
          boxShadow: `0 0 100px 50px ${bgColor}`, // Tashqi tomondan ham silliqlash qo'shamiz
        }}
      >
        {/* Aspect Ratio 16:9 */}
        <div style={{ paddingTop: "56.25%" }} />

       <video
  autoPlay
  muted
  loop
  playsInline
  preload="auto" // Videoni sahifa yuklanishi bilan xotiraga olishni boshlaydi
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
>
  <source src="/video/advertisement.mp4" type="video/mp4" />
</video>

        {/* --- SILLIQLANGAN GRADIENTLAR --- */}
        
        {/* Yuqori (Top) - Bir nechta stop bilan */}
        <div style={{
          position: "absolute", top: -1, left: 0, width: "100%", height: "25%",
          background: `linear-gradient(to bottom, ${bgColor} 0%, ${bgColor} 10%, rgba(6, 11, 19, 0.8) 30%, transparent 100%)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Pastki (Bottom) */}
        <div style={{
          position: "absolute", bottom: -1, left: 0, width: "100%", height: "25%",
          background: `linear-gradient(to top, ${bgColor} 0%, ${bgColor} 10%, rgba(6, 11, 19, 0.8) 30%, transparent 100%)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Chap (Left) */}
        <div style={{
          position: "absolute", top: 0, left: -1, width: "20%", height: "100%",
          background: `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 15%, rgba(6, 11, 19, 0.7) 40%, transparent 100%)`,
          pointerEvents: "none", zIndex: 3,
        }} />

        {/* O'ng (Right) */}
        <div style={{
          position: "absolute", top: 0, right: -1, width: "20%", height: "100%",
          background: `linear-gradient(to left, ${bgColor} 0%, ${bgColor} 15%, rgba(6, 11, 19, 0.7) 40%, transparent 100%)`,
          pointerEvents: "none", zIndex: 3,
        }} />

      </div>
    </div>
  );
}