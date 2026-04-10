import React from "react";
import { Box, Container, Stack, Typography, Divider, IconButton, Link as MuiLink } from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocationOnOutlined,
  PhoneOutlined,
  EmailOutlined,
  BoltOutlined,
} from "@mui/icons-material";
import { useGlobals } from "../../hooks/useGlobals"; // authMember ni olish uchun

const BLUE = "#2979FF";
const BG = "#080814";
const BORDER = "rgba(41,121,255,0.15)";

export default function Footer() {
  const { authMember } = useGlobals();

  return (
    <Box
      component="footer"
      sx={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
        color: "rgba(255,255,255,0.6)",
        pt: 10,
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={{ xs: 6, md: 2 }}
        >
          {/* 1. LOGO & DESC */}
          <Stack sx={{ maxWidth: 360 }}>
            <NavLink to="/" style={{ textDecoration: "none", marginBottom: "24px", display: "inline-block" }}>
              <Stack direction="row" alignItems="center" gap={0.8}>
                <BoltOutlined sx={{ color: BLUE, fontSize: 28 }} />
                <Stack direction="row" alignItems="baseline" gap={0}>
                  <Box sx={{
                    fontFamily: "'Orbitron', monospace",
                    fontWeight: 900,
                    fontSize: 22,
                    background: "linear-gradient(135deg, #fff 40%, #2979FF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: 1,
                  }}>
                    TECH
                  </Box>
                  <Box sx={{
                    fontFamily: "'Orbitron', monospace",
                    fontWeight: 900,
                    fontSize: 22,
                    color: BLUE,
                    letterSpacing: 1,
                  }}>
                    STORE
                  </Box>
                </Stack>
              </Stack>
            </NavLink>
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
              Your leading destination for high-performance electronics. 
              We provide the latest tech with a focus on reliability, 
              customer service, and innovation.
            </Typography>
            <Stack direction="row" gap={1.5}>
              {[
                { Icon: Facebook, color: "#1877f2" },
                { Icon: Twitter, color: "#1da1f2" },
                { Icon: Instagram, color: "#e1306c" },
                { Icon: YouTube, color: "#ff0000" },
              ].map((item, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    border: `1px solid ${BORDER}`,
                    "&:hover": { color: item.color, borderColor: item.color, background: "transparent" },
                    transition: "all 0.3s",
                  }}
                >
                  <item.Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Stack>

          {/* 2. QUICK LINKS */}
          <Stack spacing={2.5} sx={{ minWidth: 160 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, fontFamily: "'Orbitron', monospace", fontSize: 14 }}>
              QUICK LINKS
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                ...(authMember ? [{ label: "Orders", to: "/orders" }] : []),
                { label: "Help Center", to: "/help" },
              ].map((link) => (
                <MuiLink
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    fontSize: 14,
                    "&:hover": { color: BLUE, pl: 0.5 },
                    transition: "all 0.2s",
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Stack>

          {/* 3. CONTACT INFO */}
          <Stack spacing={2.5} sx={{ minWidth: 240 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, fontFamily: "'Orbitron', monospace", fontSize: 14 }}>
              FIND US
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" gap={2} alignItems="flex-start">
                <LocationOnOutlined sx={{ color: BLUE, fontSize: 20 }} />
                <Typography variant="body2">123 Main Street, Anytown USA</Typography>
              </Stack>
              <Stack direction="row" gap={2} alignItems="center">
                <PhoneOutlined sx={{ color: BLUE, fontSize: 20 }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Stack>
              <Stack direction="row" gap={2} alignItems="center">
                <EmailOutlined sx={{ color: BLUE, fontSize: 20 }} />
                <Typography variant="body2">support@techstore.com</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: BORDER, mt: 8, mb: 4 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} TechStore Global. All rights reserved.
          </Typography>
          <Stack direction="row" gap={3}>
            <Typography sx={{ fontSize: 12, cursor: "pointer", "&:hover": { color: "#fff" } }}>Privacy Policy</Typography>
            <Typography sx={{ fontSize: 12, cursor: "pointer", "&:hover": { color: "#fff" } }}>Terms of Service</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}