import {Box,Button,Container, ListItemIcon,Menu,MenuItem,Stack,Badge,Drawer,IconButton,Divider,InputBase,} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import {Logout,ShoppingCartOutlined,PersonOutlined,MenuOutlined,CloseOutlined,AddOutlined,RemoveOutlined,DeleteOutlineOutlined,SearchOutlined,LocationOnOutlined,PhoneOutlined,Facebook, Twitter,  Instagram, BoltOutlined,
} from "@mui/icons-material";
import React from "react";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignUpOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogOutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

const BLUE = "#2979FF";
const BLUE_DARK = "#1565c0";
const BG = "#080814";
const BG2 = "#0d1020";
const BG3 = "#111827";
const BORDER = "rgba(41,121,255,0.15)";

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems, onAdd, onRemove, onDelete, onDeleteAll,
    setSignUpOpen, setLoginOpen, handleLogOutClick,
    anchorEl, handleCloseLogout, handleLogoutRequest,
  } = props;

  const { authMember } = useGlobals();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isActive = (to: string) => location.pathname === to;

  const categoryLinks = [
    { label: "All Categories", to: "/products" },
    { label: "Laptops", to: "/products?productCollection=LAPTOPS" },
    { label: "PC", to: "/products?productCollection=PC" },
    { label: "Mobile", to: "/products?productCollection=TELEPHONE" },
    { label: "MacBooks", to: "/products?productCollection=MACBOOKS" },
    { label: "Accessories", to: "/products?productCollection=ACCESSORIES" },
    { label: "Smartwatches", to: "/products?productCollection=SMARTWATCHES" },
    { label: "Others", to: "/products?productCollection=OTHERS" },
    { label: "LIMITED SALE", to: "/products?sale=true", highlight: true },
    { label: "Best Seller", to: "/products?sort=best", highlight: true },
    { label: "New Arrival", to: "/products?sort=new", highlight: true },
  ];

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    ...(authMember ? [{ label: "Orders", to: "/orders" }] : []),
    ...(authMember ? [{ label: "My Page", to: "/member-page" }] : []),
    { label: "Help", to: "/help" },
  ];

  return (
    <>
      {/* ── TOP INFO BAR ── */}
      <Box sx={{ background: "#04040d", borderBottom: `1px solid ${BORDER}` }}>
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 36 }}>
            <Stack direction="row" alignItems="center" gap={3}>
              <Stack direction="row" alignItems="center" gap={0.7}>
                <LocationOnOutlined sx={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  123 Main Street, Anytown USA
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.7} sx={{ display: { xs: "none", sm: "flex" } }}>
                <PhoneOutlined sx={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }} />
                <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  +82 (010) 5122-3111
                </Box>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              {[
                { Icon: Facebook, href: "https://facebook.com", hoverColor: "#1877f2" },
                { Icon: Twitter, href: "https://twitter.com", hoverColor: "#1da1f2" },
                { Icon: Instagram, href: "https://instagram.com", hoverColor: "#e1306c" },
              ].map(({ Icon, href, hoverColor }) => (
                <IconButton key={href} size="small" component="a" href={href} target="_blank"
                  sx={{ color: "rgba(255,255,255,0.3)", p: 0.5, "&:hover": { color: hoverColor }, transition: "color 0.2s" }}>
                  <Icon sx={{ fontSize: 15 }} />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── MAIN NAVBAR ── */}
      <Box
        component="nav"
        sx={{
          position: "sticky", top: 0, zIndex: 1200,
          background: "rgba(8,8,20,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: 64, gap: 2 }}>

            {/* ── Logo (chap) ── */}
            <NavLink to="/" exact style={{ textDecoration: "none", flexShrink: 0 }}>
              <Stack direction="row" alignItems="center" gap={0.8}>
                <BoltOutlined sx={{ color: BLUE, fontSize: 24, filter: `drop-shadow(0 0 6px ${BLUE}88)` }} />
                <Stack direction="row" alignItems="baseline">
                  <Box sx={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: { xs: 16, md: 19 }, background: "linear-gradient(135deg, #fff 40%, #2979FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1 }}>TECH</Box>
                  <Box sx={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: { xs: 16, md: 19 }, color: BLUE, letterSpacing: 1 }}>STORE</Box>
                </Stack>
              </Stack>
            </NavLink>

            {/* ── O'ng tomon: links + cart + account ── */}
            <Stack direction="row" alignItems="center" gap={0.5}>

              {/* Nav links */}
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} exact={link.to === "/"} style={{ textDecoration: "none" }}>
                  <Box sx={{
                    px: 1.8, py: 0.8, fontSize: 14, fontWeight: 500,
                    cursor: "pointer",
                    color: isActive(link.to) ? BLUE : "rgba(255,255,255,0.65)",
                    borderBottom: isActive(link.to) ? `2px solid ${BLUE}` : "2px solid transparent",
                    borderRadius: isActive(link.to) ? "6px 6px 0 0" : "6px",
                    background: isActive(link.to) ? "rgba(41,121,255,0.08)" : "transparent",
                    transition: "all 0.25s ease", whiteSpace: "nowrap",
                    "&:hover": { color: BLUE, background: "rgba(41,121,255,0.08)" },
                  }}>{link.label}</Box>
                </NavLink>
              ))}

              {/* Divider */}
              <Box sx={{ width: 1, height: 32, background: BORDER, mx: 0.5 }} />

              {/* Cart */}
              <Stack direction="row" alignItems="center" gap={1.5} onClick={() => setCartOpen(true)}
                sx={{ cursor: "pointer", px: 2, py: 1, borderRadius: "10px", border: `1px solid rgba(255,255,255,0.08)`, background: "rgba(255,255,255,0.03)", "&:hover": { border: `1px solid ${BLUE}`, background: "rgba(41,121,255,0.08)" }, transition: "all 0.2s" }}>
                <Badge badgeContent={totalItems} sx={{ "& .MuiBadge-badge": { background: BLUE, color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 18, height: 18 } }}>
                  <ShoppingCartOutlined sx={{ fontSize: 22, color: "rgba(255,255,255,0.75)" }} />
                </Badge>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.2 }}>Cart</Box>
                  <Box sx={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>${totalPrice.toLocaleString()}</Box>
                </Box>
              </Stack>

              {/* Divider */}
              <Box sx={{ width: 1, height: 32, background: BORDER }} />

              {/* Account / Avatar */}
              {!authMember ? (
                <Stack direction="row" alignItems="center" gap={1} onClick={() => setLoginOpen(true)}
                  sx={{ cursor: "pointer", px: 1.5, py: 1, borderRadius: "10px", "&:hover": { background: "rgba(255,255,255,0.05)" }, transition: "background 0.2s" }}>
                  <PersonOutlined sx={{ fontSize: 22, color: "rgba(255,255,255,0.7)" }} />
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.2 }}>User</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>Account</Box>
                  </Box>
                </Stack>
              ) : (
                <Box component="img"
                  src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                  onClick={handleLogOutClick}
                  sx={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${BLUE}`, cursor: "pointer", objectFit: "cover", "&:hover": { boxShadow: `0 0 0 3px ${BLUE}33` }, transition: "all 0.2s" }}
                />
              )}

              {/* Mobile menu button */}
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: "flex", lg: "none" }, color: "rgba(255,255,255,0.7)" }}>
                <MenuOutlined />
              </IconButton>

            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── HERO SECTION ── */}
      <Box
        sx={{
          position: "relative",
          // Fixed height — ekran kichrayganda cho'zilmaydi
          height: { xs: 380, sm: 440, md: 520, lg: 580 },
          overflow: "hidden",
          background: BG,
          // maxWidth orqali cheksiz kengayishni to'xtatamiz
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {/* Hero image — position absolute, container ni to'liq egallaydi */}
        <Box
          component="img"
          src="/img/image.png"
          alt="Hero background"
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            // Kenglik 100% — lekin container dan oshmaydi
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: 0.55,
            // maxWidth bilan rasm haddan tashqari katta bo'lmaydi
            maxWidth: "1920px",
          }}
        />

        {/* Gradient overlay */}
        <Box sx={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(8,8,20,0.97) 0%, rgba(8,8,20,0.85) 40%, rgba(8,8,20,0.4) 70%, rgba(8,8,20,0.1) 100%)",
        }} />

        {/* Grid pattern */}
        <Box sx={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(41,121,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(41,121,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, height: "100%" }}>
          <Stack justifyContent="center" sx={{ height: "100%", maxWidth: 580, py: 6 }}>
            {/* Badge */}
            <Box sx={{
              display: "inline-block", px: 2, py: 0.5, mb: 2.5,
              borderRadius: "20px", background: "rgba(41,121,255,0.1)",
              border: `1px solid rgba(41,121,255,0.3)`,
              fontSize: 12, fontWeight: 600, color: "#60a5fa",
              letterSpacing: 1, textTransform: "uppercase", width: "fit-content",
              animation: "fadeUp 0.5s 0.1s ease both",
              "@keyframes fadeUp": {
                from: { opacity: 0, transform: "translateY(16px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}>
              New Arrivals 2026
            </Box>

            {/* Heading */}
            <Box sx={{
              fontSize: { xs: 28, sm: 38, md: 48, lg: 56 },
              fontWeight: 900, color: "#fff", lineHeight: 1.1, mb: 2.5,
              fontFamily: "'Orbitron', monospace",
              animation: "fadeUp 0.5s 0.2s ease both", letterSpacing: -1,
            }}>
              Your One-Stop{" "}
              <Box component="span" sx={{ color: BLUE, display: "block" }}>
                Electronic Market
              </Box>
            </Box>

            {/* Subtitle */}
            <Box sx={{
              fontSize: { xs: 13, md: 15 }, color: "rgba(255,255,255,0.5)",
              mb: 4, lineHeight: 1.7, maxWidth: 420,
              animation: "fadeUp 0.5s 0.3s ease both",
            }}>
              Welcome to TechStore — premium electronics at your fingertips.
              Fast delivery, 2-year warranty, 24/7 expert support.
            </Box>

            {/* CTA */}
            <Stack direction="row" gap={2} sx={{ animation: "fadeUp 0.5s 0.4s ease both" }}>
              <NavLink to="/products" style={{ textDecoration: "none" }}>
                <Button variant="contained" sx={{
                  background: BLUE, color: "#fff", fontWeight: 700,
                  fontSize: { xs: 13, md: 15 }, px: { xs: 3, md: 4 }, py: 1.4,
                  borderRadius: "10px", textTransform: "none",
                  boxShadow: `0 8px 32px ${BLUE}44`,
                  "&:hover": { background: BLUE_DARK, transform: "translateY(-2px)" },
                  transition: "all 0.2s",
                }}>
                  Shop Now
                </Button>
              </NavLink>
              {!authMember && (
                <Button onClick={() => setSignUpOpen(true)} sx={{
                  color: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(255,255,255,0.15)",
                  fontWeight: 600, fontSize: { xs: 13, md: 15 }, px: { xs: 3, md: 4 }, py: 1.4,
                  borderRadius: "10px", textTransform: "none",
                  "&:hover": { borderColor: BLUE, color: BLUE, background: "rgba(41,121,255,0.06)" },
                  transition: "all 0.2s",
                }}>
                  Sign Up
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>


      {/* ── CART DRAWER ── */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)} sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { width: { xs: "100vw", sm: 400 }, background: BG2, borderLeft: `1px solid ${BORDER}` } }}>
        <Stack sx={{ height: "100%", p: 3 }} direction="column">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Box sx={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Orbitron', monospace" }}>Cart ({totalItems})</Box>
            <IconButton onClick={() => setCartOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}><CloseOutlined /></IconButton>
          </Stack>
          <Divider sx={{ borderColor: BORDER, mb: 2 }} />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
                <ShoppingCartOutlined sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 2 }} />
                <Box sx={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>Cart is empty</Box>
              </Stack>
            ) : (
              cartItems.map((item) => (
                <Stack key={item._id} direction="row" gap={2} sx={{ mb: 2, p: 1.5, borderRadius: "12px", border: `1px solid rgba(255,255,255,0.06)`, background: "rgba(255,255,255,0.03)", "&:hover": { border: `1px solid ${BLUE}44` }, transition: "border-color 0.2s" }}>
                  <Box component="img" src={item.image ? `${serverApi}/${item.image}` : "/icons/default-product.svg"}
                    sx={{ width: 64, height: 64, borderRadius: "8px", objectFit: "cover", background: BG3, flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff", mb: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>${(item.price * item.quantity).toLocaleString()}</Box>
                    <Stack direction="row" alignItems="center" gap={1} mt={0.8}>
                      <IconButton size="small" onClick={() => onRemove(item)} sx={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "6px", p: 0.3, color: "rgba(255,255,255,0.5)", "&:hover": { borderColor: BLUE, color: BLUE } }}>
                        <RemoveOutlined sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff", minWidth: 20, textAlign: "center" }}>{item.quantity}</Box>
                      <IconButton size="small" onClick={() => onAdd(item)} sx={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "6px", p: 0.3, color: "rgba(255,255,255,0.5)", "&:hover": { borderColor: BLUE, color: BLUE } }}>
                        <AddOutlined sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  <IconButton size="small" onClick={() => onDelete(item)} sx={{ color: "rgba(255,255,255,0.2)", alignSelf: "flex-start", "&:hover": { color: "#ef4444" } }}>
                    <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              ))
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box>
              <Divider sx={{ borderColor: BORDER, mb: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box sx={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>Total</Box>
                <Box sx={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>${totalPrice.toLocaleString()}</Box>
              </Stack>
              <Stack gap={1.5}>
                <NavLink to="/orders" style={{ textDecoration: "none" }} onClick={() => setCartOpen(false)}>
                  <Button fullWidth variant="contained" sx={{ background: BLUE, color: "#fff", fontWeight: 700, py: 1.4, borderRadius: "10px", textTransform: "none", fontSize: 15, boxShadow: `0 8px 24px ${BLUE}33`, "&:hover": { background: BLUE_DARK } }}>
                    Checkout
                  </Button>
                </NavLink>
                <Button fullWidth onClick={onDeleteAll} sx={{ color: "rgba(255,255,255,0.35)", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: "10px", textTransform: "none", py: 1, fontSize: 13, "&:hover": { borderColor: "#ef4444", color: "#ef4444" } }}>
                  Clear All
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Drawer>

      {/* ── MOBILE DRAWER ── */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { width: 300, background: BG2, borderRight: `1px solid ${BORDER}`, p: 0 } }}>
        <Stack sx={{ height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${BORDER}` }}>
            <Stack direction="row" alignItems="center" gap={0.7}>
              <BoltOutlined sx={{ color: BLUE, fontSize: 20 }} />
              <Box sx={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 16, background: "linear-gradient(135deg, #fff 40%, #2979FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TECHSTORE</Box>
            </Stack>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}><CloseOutlined /></IconButton>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ mx: 2, my: 1.5, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: "8px", overflow: "hidden" }}>
            <InputBase placeholder="Search..." sx={{ flex: 1, px: 2, py: 0.8, fontSize: 14, color: "#fff", "& input::placeholder": { color: "rgba(255,255,255,0.3)" } }} />
            <Box sx={{ px: 1.5, display: "flex", color: "rgba(255,255,255,0.3)" }}>
              <SearchOutlined sx={{ fontSize: 20 }} />
            </Box>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                <Box sx={{ px: 2.5, py: 1.4, fontSize: 15, fontWeight: isActive(link.to) ? 700 : 500, color: isActive(link.to) ? BLUE : "rgba(255,255,255,0.65)", background: isActive(link.to) ? "rgba(41,121,255,0.1)" : "transparent", borderLeft: isActive(link.to) ? `3px solid ${BLUE}` : "3px solid transparent", borderBottom: `1px solid rgba(255,255,255,0.05)`, transition: "all 0.15s", "&:hover": { background: "rgba(41,121,255,0.08)", color: BLUE } }}>
                  {link.label}
                </Box>
              </NavLink>
            ))}
            <Divider sx={{ borderColor: BORDER, my: 1 }} />
            {categoryLinks.map((cat, i) => (
              <NavLink key={i} to={cat.to} style={{ textDecoration: "none" }} onClick={() => setMobileOpen(false)}>
                <Box sx={{ px: 2.5, py: 1.1, fontSize: 13, fontWeight: cat.highlight ? 700 : 400, color: cat.highlight ? BLUE : "rgba(255,255,255,0.45)", borderBottom: `1px solid rgba(255,255,255,0.04)`, "&:hover": { background: "rgba(255,255,255,0.03)", color: "#fff" } }}>
                  {cat.label}
                </Box>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ p: 2.5, borderTop: `1px solid ${BORDER}` }}>
            {!authMember ? (
              <Stack gap={1.2}>
                <Button fullWidth variant="contained" onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                  sx={{ background: BLUE, textTransform: "none", fontWeight: 600, borderRadius: "10px", py: 1.2, "&:hover": { background: BLUE_DARK } }}>Login</Button>
                <Button fullWidth onClick={() => { setSignUpOpen(true); setMobileOpen(false); }}
                  sx={{ color: "rgba(255,255,255,0.7)", border: `1.5px solid rgba(255,255,255,0.15)`, textTransform: "none", fontWeight: 600, borderRadius: "10px", py: 1.2, "&:hover": { borderColor: BLUE, color: BLUE } }}>Sign Up</Button>
              </Stack>
            ) : (
              <Button fullWidth onClick={() => setMobileOpen(false)}
                sx={{ border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600, borderRadius: "10px" }}>My Profile</Button>
            )}
          </Box>
        </Stack>
      </Drawer>

      {/* ── LOGOUT MENU ── */}
      <Menu anchorEl={anchorEl} id="account-menu" open={Boolean(anchorEl)} onClose={handleCloseLogout} onClick={handleCloseLogout}
        PaperProps={{ elevation: 0, sx: { background: BG2, border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "visible", mt: 1.5, minWidth: 140, zIndex: 1600, "&:before": { content: '""', display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10, bgcolor: BG2, transform: "translateY(-50%) rotate(45deg)", zIndex: 0, borderLeft: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}` } } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem onClick={handleLogoutRequest} sx={{ fontSize: 14, color: "rgba(255,255,255,0.75)", px: 2.5, py: 1.2, "&:hover": { background: "rgba(239,68,68,0.08)", color: "#ef4444" } }}>
          <ListItemIcon><Logout fontSize="small" sx={{ color: "inherit" }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}