import { Box, Container, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, EffectCoverflow } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

SwiperCore.use([Autoplay, Pagination, EffectCoverflow]);

const techEvents = [
  {
    id: 1,
    category: "ESPORTS PLAYGROUND",
    title: "GAMING EXPO",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
  },
  {
    id: 2,
    category: "VISION PRO WORKSHOP",
    title: "VISION PRO WORKSHOP",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070",
  },
  {
    id: 3,
    category: "NEXT-GEN HARDWARE LAUNCH",
    title: "UNVEILING THE M4 CHIP POWER",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070",
  },
  {
    id: 4,
    category: "NEXT-GEN HARDWARE LAUNCH",
    title: "SMART HOME REVOLUTION",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070",
  },
  {
    id: 5,
    category: "NETWORK SECURITY",
    title: "CYBER SECURITY CONFERENCE",
    desc: "Experience Unprecedented performance",
    date: "OCT 25 | MAIN STAGE",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
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
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(41,121,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background:
            "linear-gradient(to top, rgba(41,121,255,0.04) 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      {/* maxWidth kengaytirildi: 1800px -> 1920px */}
      <Container maxWidth={false} sx={{ maxWidth: "20000px", px: { xs: 1, md: 4 }, position: "relative", zIndex: 1 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "white",
            fontWeight: 900,
            mb: 8,
            letterSpacing: "2px",
            fontFamily: "'Orbitron', monospace",
            fontSize: { xs: 24, md: 36 },
            textShadow: "0 0 40px rgba(41,121,255,0.3)",
          }}
        >
          Exclusive Showcase
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: 60,
            right: { xs: 20, md: 80 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            opacity: 0.15,
          }}
        >
          <Box sx={{ width: 28, height: 28, border: "2px solid #2979FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ width: 14, height: 14, background: "#2979FF", borderRadius: "2px" }} />
          </Box>
          <Box sx={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: 2 }}>
            TECHSTORE
          </Box>
        </Box>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          loop={true} // Cheksiz aylanish
          speed={800} // Aylanish silliqligi
          autoplay={{ 
            delay: 3000, 
            disableOnInteraction: false, // Foydalanuvchi tekkandan keyin ham to'xtamaydi
            pauseOnMouseEnter: false // Sichqoncha ustiga kelganda ham to'xtamaydi
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 2.8,
            slideShadows: false,
          }}
          pagination={{ el: ".custom-pagination", clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 5 }, // Keng ekranda 5 ta ko'rinadi
          }}
          className="events-swiper"
        >
          {techEvents.map((event, index) => (
            <SwiperSlide key={index}>
              <Box className="event-card">
                <img src={event.img} alt={event.title} />
                <Box className="card-overlay">
                  <Typography className="card-category">{event.category}</Typography>
                  <Typography className="card-title">{event.title}</Typography>
                  <Typography className="card-desc">{event.desc}</Typography>
                  <Typography className="card-date">{event.date}</Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        <Stack direction="row" justifyContent="center" sx={{ mt: 6 }}>
          <Box className="custom-pagination" />
        </Stack>
      </Container>

    </Box>
  );
}