import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import Card from '@mui/joy/Card';
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from '@mui/joy/Typography';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useHistory } from "react-router-dom";

const BLUE = "#2979FF";

const brands = [
  {
    name: "Apple",
    query: "APPLE",
    // MacBook Pro M3/M4 Series
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000",
    desc: "MacBook Pro Performance",
  },
  {
    name: "Samsung",
    query: "SAMSUNG",
    // S24/S25/S26 Ultra Concept Look
    image: "https://www.att.com/scmsassets/global/devices/other/samsung/samsung-galaxy-s26-ultra/defaultimage/black-hero-zoom.png", 
    desc: "Galaxy S-Series Ultra",
  },
  {
    name: "Xiaomi",
    query: "XIAOMI",
    // Xiaomi 14 Ultra / Flagship look
    image: "https://mychooz.com/wp-content/uploads/2025/06/xiaomi-buds-5-pro.webp",
    desc: "Xiaomi 14 Ultra",
  },
  {
    name: "Sony",
    query: "SONY",
    // Sony WH-1000XM5
    image: "https://www.sony.com/en/SonyInfo/products/topassets/img/product-img04.png",
    desc: "WH-1000XM5 ANC",
  },
  {
    name: "LG",
    query: "LG",
    // LG UltraGear / OLED Monitor
    image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=2000",
    desc: "UltraGear Gaming Monitor",
  },
];

export default function TopBrands() {
  const history = useHistory();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <Box 
      sx={{ 
        background: "#060b13", 
        pt: { xs: 8, md: 10 }, 
        pb: { xs: 6, md: 8 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Container maxWidth="xl">
        {/* Header - Minimalist Style */}
        <Stack alignItems="center" mb={6}>
          <Box
            sx={{
              fontSize: { xs: 22, md: 32 },
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Orbitron', monospace",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textAlign: "center"
            }}
          >
            Shop by Brand
          </Box>
        </Stack>

        {/* Brand Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 3,
          }}
        >
          {brands.map((brand, idx) => (
            <CssVarsProvider key={brand.name}>
              <Card
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => history.push(`/products?productBrand=${brand.query}`)}
                sx={{
                  minHeight: "280px",
                  cursor: "pointer",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: "16px",
                  transition: "all 0.4s ease",
                  background: "#0d1020",
                  "&:hover": {
                    borderColor: BLUE,
                    transform: "translateY(-10px)",
                    boxShadow: `0 20px 50px rgba(41,121,255,0.25)`,
                  }
                }}
              >
                <CardCover>
                  <img
                    src={brand.image}
                    alt={brand.name}
                    loading="lazy"
                    style={{
                      filter: hoveredIdx === idx ? "brightness(0.8)" : "brightness(0.4)",
                      transition: "0.5s filter ease",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </CardCover>
                
                {/* Visual Overlay */}
                <CardCover
                  sx={{
                    background: "linear-gradient(to top, rgba(6,11,19,1) 0%, rgba(6,11,19,0) 50%, rgba(6,11,19,0.3) 100%)",
                  }}
                />

                <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {/* Brand Name - Top Left */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "#fff",
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        borderLeft: `4px solid ${BLUE}`,
                        pl: 1.5,
                        lineHeight: 1
                      }}
                    >
                      {brand.name}
                    </Typography>
                  </Box>

                  {/* Bottom Content */}
                  <Box>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "11px",
                        mb: 1.5,
                        opacity: hoveredIdx === idx ? 1 : 0,
                        transform: hoveredIdx === idx ? "translateY(0)" : "translateY(10px)",
                        transition: "0.3s all"
                      }}
                    >
                      {brand.desc}
                    </Typography>
                    
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={0.5}
                      sx={{ 
                        color: BLUE,
                        fontWeight: 900,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                      }}
                    >
                      <Box sx={{ borderBottom: `2px solid ${BLUE}` }}>Explore</Box>
                      <ArrowForwardIcon sx={{ fontSize: "16px" }} />
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </CssVarsProvider>
          ))}
        </Box>
      </Container>
    </Box>
  );
}