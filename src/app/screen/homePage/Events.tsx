import { Box, Container, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import React from "react";

const techEvents = [
  {
    id: 1,
    category: "ESPORTS PLAYGROUND",
    title: "GAMING EXPO",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "VISION PRO WORKSHOP",
    title: "VISION PRO WORKSHOP",
    desc: "Immersive spatial computing",
    date: "NOV 10 | TECH HALL",
    img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "HARDWARE LAUNCH",
    title: "M4 CHIP UNVEILED",
    desc: "Next generation silicon power",
    date: "DEC 1 | KEYNOTE",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    category: "SMART HOME",
    title: "HOME REVOLUTION",
    desc: "The future of living spaces",
    date: "DEC 15 | EXPO CENTER",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    category: "NETWORK SECURITY",
    title: "CYBER CONFERENCE",
    desc: "Defending tomorrow's infrastructure",
    date: "JAN 5 | ONLINE",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
  // Loop uchun kamida slidesPerView * 2 ta slide kerak — 3 ta qo'shamiz
  {
    id: 6,
    category: "AI SUMMIT",
    title: "FUTURE OF AI",
    desc: "Shaping intelligent systems",
    date: "FEB 20 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    category: "ROBOTICS EXPO",
    title: "ROBOTICS & AUTOMATION",
    desc: "Machines that think and act",
    date: "MAR 8 | EXPO HALL",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    category: "CLOUD COMPUTING",
    title: "CLOUD SUMMIT 2026",
    desc: "Scalable infrastructure for all",
    date: "APR 12 | VIRTUAL",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Events() {
  return (
    <Box
      sx={{
        py: 10,
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#060b13",
      }}
    >
      {/* Background glows */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(41,121,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 50%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Title */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "white",
            fontWeight: 900,
            mb: 8,
            letterSpacing: "2px",
            fontFamily: "'Orbitron', monospace",
            fontSize: { xs: 22, md: 34 },
            textShadow: "0 0 40px rgba(41,121,255,0.3)",
          }}
        >
          Exclusive Showcase
        </Typography>

        {/* Swiper
            - modules prop ichida beriladi (SwiperCore.use() yo'q)
            - loop={true} faqat slidesPerView dan kamida 2x ko'p slide bo'lsa ishlaydi
            - loopedSlides ni avtomatik hisoblaydi
            - initialSlide={0} — refresh da ham barqaror
        */}
        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          initialSlide={0}
          loop={true}
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 160,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ el: ".custom-pagination", clickable: true }}
          // breakpoints — slidesPerView ni asta oshiramiz
          // slide soni (8) har bir breakpoint * 2 dan katta => loop xavfsiz
          breakpoints={{
            0:    { slidesPerView: 1 },
            480:  { slidesPerView: 1.4 },
            640:  { slidesPerView: 2 },
            900:  { slidesPerView: 2.5 },
            1100: { slidesPerView: 3 },
            1440: { slidesPerView: 3.5 },
          }}
          style={{ paddingBottom: "8px" }}
        >
          {techEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "3 / 4",
                  cursor: "grab",
                  "&:active": { cursor: "grabbing" },
                  // Hover effekti
                  "&:hover .card-overlay-inner": {
                    background:
                      "linear-gradient(to top, rgba(6,11,19,0.98) 0%, rgba(6,11,19,0.6) 55%, rgba(6,11,19,0.1) 100%)",
                  },
                  "&:hover .card-img": {
                    transform: "scale(1.06)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  className="card-img"
                  component="img"
                  src={event.img}
                  alt={event.title}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />

                {/* Overlay */}
                <Box
                  className="card-overlay-inner"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(6,11,19,0.95) 0%, rgba(6,11,19,0.4) 50%, rgba(6,11,19,0.05) 100%)",
                    transition: "background 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    p: 2.5,
                  }}
                >
                  {/* Category badge */}
                  <Box
                    sx={{
                      display: "inline-block",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#60a5fa",
                      background: "rgba(41,121,255,0.15)",
                      border: "1px solid rgba(41,121,255,0.25)",
                      borderRadius: "5px",
                      px: 1, py: 0.3,
                      mb: 1,
                      width: "fit-content",
                    }}
                  >
                    {event.category}
                  </Box>

                  <Box
                    sx={{
                      fontSize: { xs: 14, md: 16 },
                      fontWeight: 800,
                      color: "#fff",
                      fontFamily: "'Orbitron', monospace",
                      lineHeight: 1.3,
                      mb: 0.8,
                      letterSpacing: -0.3,
                    }}
                  >
                    {event.title}
                  </Box>

                  <Box
                    sx={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      mb: 1,
                      lineHeight: 1.5,
                    }}
                  >
                    {event.desc}
                  </Box>

                  {/* Date */}
                  <Box
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#2979FF",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {event.date}
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination dots */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
          <Box
            className="custom-pagination"
            sx={{
              "& .swiper-pagination-bullet": {
                background: "rgba(255,255,255,0.2)",
                opacity: 1,
                width: 8, height: 8,
                mx: "3px",
                transition: "all 0.3s",
              },
              "& .swiper-pagination-bullet-active": {
                background: "#2979FF",
                width: 24,
                borderRadius: "4px",
                boxShadow: "0 0 8px rgba(41,121,255,0.6)",
              },
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
