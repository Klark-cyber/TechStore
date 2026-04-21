import React from "react";
import { Box, Container, Stack, Typography, Divider, IconButton, Link as MuiLink } from "@mui/material";
import { NavLink } from "react-router-dom";
import {
  Facebook, Twitter, Instagram, YouTube,
  LocationOnOutlined, PhoneOutlined, EmailOutlined, BoltOutlined,
} from "@mui/icons-material";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/footer.css";

export default function Footer() {
  const { authMember } = useGlobals();

  return (
    <Box component="footer" className="footer-container" sx={{ pt: 10, pb: 4 }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={{ xs: 6, md: 2 }}>
          
          {/* 1. LOGO & DESC */}
          <Stack sx={{ maxWidth: 360 }}>
            <NavLink to="/" className="footer-logo-link">
              <Stack direction="row" alignItems="center" gap={0.8}>
                <BoltOutlined sx={{ color: "#2979FF", fontSize: 28 }} />
                <Stack direction="row" alignItems="baseline">
                  <Box className="logo-tech">TECH</Box>
                  <Box className="logo-store">STORE</Box>
                </Stack>
              </Stack>
            </NavLink>
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
              Your leading destination for high-performance electronics. 
              We provide the latest tech with a focus on reliability.
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
                  className="social-icon-btn"
                  sx={{ "&:hover": { color: item.color, borderColor: item.color } }}
                >
                  <item.Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Stack>

          {/* 2. QUICK LINKS */}
          <Stack spacing={2.5} sx={{ minWidth: 160 }}>
            <Typography variant="subtitle1" className="section-title">QUICK LINKS</Typography>
            <Stack spacing={1.5}>
              {[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                ...(authMember ? [{ label: "Orders", to: "/orders" }] : []),
                { label: "Help Center", to: "/help" },
              ].map((link) => (
                <MuiLink key={link.to} component={NavLink} to={link.to} className="footer-nav-link">
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Stack>

          {/* 3. CONTACT INFO */}
          <Stack spacing={2.5} sx={{ minWidth: 240 }}>
            <Typography variant="subtitle1" className="section-title">FIND US</Typography>
            <Stack spacing={2}>
              <Stack direction="row" gap={2} alignItems="flex-start">
                <LocationOnOutlined sx={{ color: "#2979FF", fontSize: 20 }} />
                <Typography variant="body2">123 Main Street, Anytown USA</Typography>
              </Stack>
              <Stack direction="row" gap={2} alignItems="center">
                <PhoneOutlined sx={{ color: "#2979FF", fontSize: 20 }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Stack>
              <Stack direction="row" gap={2} alignItems="center">
                <EmailOutlined sx={{ color: "#2979FF", fontSize: 20 }} />
                <Typography variant="body2">support@techstore.com</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ mt: 8, mb: 4, borderColor: "rgba(41,121,255,0.15)" }} />

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography className="copyright-text">
            © {new Date().getFullYear()} TechStore Global. All rights reserved.
          </Typography>
          <Stack direction="row" gap={3}>
            <Typography className="footer-bottom-link">Privacy Policy</Typography>
            <Typography className="footer-bottom-link">Terms of Service</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}