import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import {
  DevicesOtherOutlined,
  VerifiedUserOutlined,
  PublicOutlined,
  BoltOutlined,
} from "@mui/icons-material";

export default function Statistics() {
  const stats = [
    {
      num: "15k+",
      text: "Tech Products",
      icon: <DevicesOtherOutlined sx={{ fontSize: 32, color: "#3b82f6" }} />,
      desc: "Latest Gadgets",
    },
    {
      num: "100%",
      text: "Authentic",
      icon: <VerifiedUserOutlined sx={{ fontSize: 32, color: "#10b981" }} />,
      desc: "Brand Warranty",
    },
    {
      num: "24h",
      text: "Fast Delivery",
      icon: <BoltOutlined sx={{ fontSize: 32, color: "#f59e0b" }} />,
      desc: "Express Shipping",
    },
    {
      num: "50k+",
      text: "Happy Users",
      icon: <PublicOutlined sx={{ fontSize: 32, color: "#8b5cf6" }} />,
      desc: "Worldwide",
    },
  ];

  return (
    <Box
      className="static-frame"
      sx={{
        py: { xs: 6, md: 10 },
        background: "linear-gradient(180deg, #060b13 0%, #0f172a 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        width: "100%",
      }}
    >
      {/* Navbar bilan bir xil Container maxWidth="xl" */}
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 2 }}
          justifyContent="space-around"
          alignItems="center"
        >
          {stats.map((item, index) => (
            <React.Fragment key={index}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={3}
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  "&:hover": {
                    background: "rgba(255,255,255,0.03)",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                {/* Icon Box */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Text */}
                <Stack>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      fontWeight: 900,
                      fontFamily: "'Orbitron', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {item.num}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 700,
                      fontSize: "14px",
                      mt: 0.5,
                    }}
                  >
                    {item.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Stack>
              </Stack>

              {/* Divider — faqat desktop */}
              {index < stats.length - 1 && (
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    width: "1px",
                    height: "50px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

