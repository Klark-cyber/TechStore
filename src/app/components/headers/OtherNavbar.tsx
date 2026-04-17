import {
  Box, Button, Container, ListItemIcon, Menu, MenuItem,
  Stack, Badge, Drawer, IconButton, Divider,
} from "@mui/material";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages, serverApi } from "../../../lib/config";
import {
  Logout, ShoppingCartOutlined, MenuOutlined,
  CloseOutlined, AddOutlined, RemoveOutlined, DeleteOutlineOutlined,
  BoltOutlined,
} from "@mui/icons-material";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";
import React from "react";

interface OtherNavbarProps {
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
const BG2 = "#0d1020";
const BG3 = "#111827";
const BORDER = "rgba(41,121,255,0.15)";

export default function OtherNavbar(props: OtherNavbarProps) {
  const {
    cartItems, onAdd, onRemove, onDelete, onDeleteAll,
    setSignUpOpen, setLoginOpen, handleLogOutClick,
    anchorEl, handleCloseLogout, handleLogoutRequest,
  } = props;

  const { authMember, setOrderBuilder } = useGlobals();
  const location = useLocation();
  const history = useHistory();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
  const shippingCost = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (to: string) => {
    const [toPath, toQuery] = to.split("?");
    if (toQuery) {
      return location.pathname === toPath && location.search === `?${toQuery}`;
    }
    return location.pathname === toPath;
  };

  const proceedOrderHandler = async () => {
    try {
      setCartOpen(false);
      if (!authMember) throw new Error(Messages.error2);
      const order = new OrderService();
      await order.createOrder(cartItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    ...(authMember ? [{ label: "Orders", to: "/orders" }] : []),
    ...(authMember ? [{ label: "My Page", to: "/member-page" }] : []),
    { label: "Help", to: "/help" },
  ];

  return (
    <>
      {/* ── NAVBAR ── */}
      <Box
        component="nav"
        sx={{
          position: "sticky", top: 0, zIndex: 1200,
          background: "rgba(6,6,18,0.98)",
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: "0 4px 40px rgba(0,0,0,0.6)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: 60, gap: 2 }}
          >
            {/* ── Logo (chap) ── */}
            <Box
              onClick={() => history.push("/")}
              sx={{ flexShrink: 0, cursor: "pointer" }}
            >
              <Stack direction="row" alignItems="center" gap={0.7}>
                <BoltOutlined sx={{ color: BLUE, fontSize: 20, filter: `drop-shadow(0 0 5px ${BLUE}88)` }} />
                <Stack direction="row" alignItems="baseline">
                  <Box sx={{
                    fontFamily: "'Orbitron', monospace", fontWeight: 900,
                    fontSize: { xs: 14, md: 17 },
                    background: "linear-gradient(135deg, #fff 40%, #2979FF)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1,
                  }}>TECH</Box>
                  <Box sx={{
                    fontFamily: "'Orbitron', monospace", fontWeight: 900,
                    fontSize: { xs: 14, md: 17 }, color: BLUE, letterSpacing: 1,
                  }}>STORE</Box>
                </Stack>
              </Stack>
            </Box>

            {/* ── O'ng tomon: links + cart + login/avatar ── */}
            <Stack direction="row" alignItems="center" gap={0.5}>

              {/* Nav links */}
              {navLinks.map((link) => (
                <Box
                  key={link.to}
                  onClick={() => history.push(link.to)}
                  sx={{
                    px: 1.6, py: 0.7, fontSize: 13, fontWeight: 500,
                    cursor: "pointer",
                    color: isActive(link.to) ? BLUE : "rgba(255,255,255,0.6)",
                    borderBottom: isActive(link.to) ? `2px solid ${BLUE}` : "2px solid transparent",
                    borderRadius: isActive(link.to) ? "6px 6px 0 0" : "6px",
                    background: isActive(link.to) ? "rgba(41,121,255,0.08)" : "transparent",
                    transition: "all 0.2s", whiteSpace: "nowrap",
                    display: { xs: "none", md: "flex" },
                    "&:hover": { color: BLUE, background: "rgba(41,121,255,0.08)" },
                  }}
                >
                  {link.label}
                </Box>
              ))}

              {/* Divider */}
              <Box sx={{ width: 1, height: 26, background: BORDER, mx: 0.5, display: { xs: "none", md: "block" } }} />

              {/* Cart */}
              <Stack
                direction="row" alignItems="center" gap={1.2}
                onClick={() => setCartOpen(true)}
                sx={{
                  cursor: "pointer", px: 1.6, py: 0.8, borderRadius: "10px",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  background: "rgba(255,255,255,0.03)",
                  "&:hover": { border: `1px solid ${BLUE}`, background: "rgba(41,121,255,0.08)" },
                  transition: "all 0.2s",
                }}
              >
                <Badge badgeContent={totalItems} sx={{
                  "& .MuiBadge-badge": { background: BLUE, color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 17, height: 17 },
                }}>
                  <ShoppingCartOutlined sx={{ fontSize: 20, color: "rgba(255,255,255,0.75)" }} />
                </Badge>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Box sx={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.2 }}>Cart</Box>
                  <Box sx={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                    ${totalPrice.toLocaleString()}
                  </Box>
                </Box>
              </Stack>

              {/* Divider */}
              <Box sx={{ width: 1, height: 26, background: BORDER, display: { xs: "none", sm: "block" } }} />

              {/* Login / Avatar */}
              {!authMember ? (
                <Stack direction="row" gap={0.8} sx={{ display: { xs: "none", sm: "flex" } }}>
                  <Button
                    onClick={() => setLoginOpen(true)}
                    size="small"
                    sx={{
                      color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500,
                      textTransform: "none", px: 1.5, py: 0.6,
                      border: `1px solid rgba(255,255,255,0.12)`, borderRadius: "8px",
                      "&:hover": { background: "rgba(255,255,255,0.05)", color: "#fff" },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setSignUpOpen(true)}
                    size="small"
                    variant="contained"
                    sx={{
                      background: BLUE, color: "#fff", fontSize: 12, fontWeight: 600,
                      textTransform: "none", px: 1.5, py: 0.6, borderRadius: "8px",
                      "&:hover": { background: BLUE_DARK },
                    }}
                  >
                    Sign Up
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" gap={1}>
                  <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.2 }}>Welcome</Box>
                    <Box sx={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
                      {authMember?.memberNick ?? "User"}
                    </Box>
                  </Box>
                  <Box
                    component="img"
                    src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                    onClick={handleLogOutClick}
                    sx={{
                      width: 34, height: 34, borderRadius: "50%",
                      border: `2px solid ${BLUE}`, cursor: "pointer", objectFit: "cover",
                      "&:hover": { boxShadow: `0 0 0 3px ${BLUE}33` }, transition: "all 0.2s",
                    }}
                  />
                </Stack>
              )}

              {/* Mobile menu */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "flex", md: "none" }, color: "rgba(255,255,255,0.7)", p: 0.8 }}
              >
                <MenuOutlined />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── CART DRAWER ── */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { width: { xs: "100vw", sm: 400 }, background: BG2, borderLeft: `1px solid ${BORDER}` } }}
      >
        <Stack sx={{ height: "100%", p: 3 }} direction="column">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Box sx={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
              Cart ({totalItems})
            </Box>
            <IconButton onClick={() => setCartOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider sx={{ borderColor: BORDER, mb: 2 }} />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
                <ShoppingCartOutlined sx={{ fontSize: 44, color: "rgba(255,255,255,0.1)", mb: 2 }} />
                <Box sx={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Cart is empty</Box>
              </Stack>
            ) : (
              cartItems.map((item) => (
                <Stack key={item._id} direction="row" gap={2} sx={{
                  mb: 2, p: 1.5, borderRadius: "12px",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  background: "rgba(255,255,255,0.03)",
                  "&:hover": { border: `1px solid ${BLUE}44` }, transition: "border-color 0.2s",
                }}>
                  <Box
                    component="img"
                    src={item.image ? `${serverApi}/${item.image}` : "/icons/default-product.svg"}
                    sx={{ width: 60, height: 60, borderRadius: "8px", objectFit: "cover", background: BG3, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 13, fontWeight: 600, color: "#fff", mb: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </Box>
                    <Box sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </Box>
                    <Stack direction="row" alignItems="center" gap={1} mt={0.8}>
                      <IconButton size="small" onClick={() => onRemove(item)}
                        sx={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "6px", p: 0.3, color: "rgba(255,255,255,0.5)", "&:hover": { borderColor: BLUE, color: BLUE } }}>
                        <RemoveOutlined sx={{ fontSize: 13 }} />
                      </IconButton>
                      <Box sx={{ fontSize: 13, fontWeight: 600, color: "#fff", minWidth: 18, textAlign: "center" }}>{item.quantity}</Box>
                      <IconButton size="small" onClick={() => onAdd(item)}
                        sx={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "6px", p: 0.3, color: "rgba(255,255,255,0.5)", "&:hover": { borderColor: BLUE, color: BLUE } }}>
                        <AddOutlined sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  <IconButton size="small" onClick={() => onDelete(item)}
                    sx={{ color: "rgba(255,255,255,0.2)", alignSelf: "flex-start", "&:hover": { color: "#ef4444" } }}>
                    <DeleteOutlineOutlined sx={{ fontSize: 17 }} />
                  </IconButton>
                </Stack>
              ))
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box>
              <Divider sx={{ borderColor: BORDER, mb: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  Items: ${itemsPrice.toFixed(1)} + Shipping: ${shippingCost}
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Total</Box>
                <Box sx={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>${totalPrice}</Box>
              </Stack>
              <Stack gap={1.5}>
                <Button
                  fullWidth variant="contained"
                  onClick={proceedOrderHandler}
                  sx={{
                    background: BLUE, color: "#fff", fontWeight: 700, py: 1.3,
                    borderRadius: "10px", textTransform: "none", fontSize: 14,
                    "&:hover": { background: BLUE_DARK },
                  }}
                >
                  Order
                </Button>
                <Button fullWidth onClick={onDeleteAll}
                  sx={{
                    color: "rgba(255,255,255,0.35)", border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: "10px", textTransform: "none", py: 0.9, fontSize: 12,
                    "&:hover": { borderColor: "#ef4444", color: "#ef4444" },
                  }}
                >
                  Clear All
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Drawer>

      {/* ── MOBILE DRAWER ── */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { width: 280, background: BG2, borderRight: `1px solid ${BORDER}`, p: 0 } }}
      >
        <Stack sx={{ height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${BORDER}` }}>
            <Stack direction="row" alignItems="center" gap={0.7}>
              <BoltOutlined sx={{ color: BLUE, fontSize: 18 }} />
              <Box sx={{
                fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 15,
                background: "linear-gradient(135deg, #fff 40%, #2979FF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                TECHSTORE
              </Box>
            </Stack>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}>
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {navLinks.map((link) => (
              <Box
                key={link.to}
                onClick={() => { history.push(link.to); setMobileOpen(false); }}
                sx={{
                  px: 2.5, py: 1.3, fontSize: 14, cursor: "pointer",
                  fontWeight: isActive(link.to) ? 700 : 500,
                  color: isActive(link.to) ? BLUE : "rgba(255,255,255,0.65)",
                  background: isActive(link.to) ? "rgba(41,121,255,0.1)" : "transparent",
                  borderLeft: isActive(link.to) ? `3px solid ${BLUE}` : "3px solid transparent",
                  borderBottom: `1px solid rgba(255,255,255,0.05)`,
                  transition: "all 0.15s",
                  "&:hover": { background: "rgba(41,121,255,0.08)", color: BLUE },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2.5, borderTop: `1px solid ${BORDER}` }}>
            {!authMember ? (
              <Stack gap={1.2}>
                <Button fullWidth variant="contained"
                  onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                  sx={{ background: BLUE, textTransform: "none", fontWeight: 600, borderRadius: "10px", py: 1.1, "&:hover": { background: BLUE_DARK } }}>
                  Login
                </Button>
                <Button fullWidth
                  onClick={() => { setSignUpOpen(true); setMobileOpen(false); }}
                  sx={{
                    color: "rgba(255,255,255,0.7)", border: `1.5px solid rgba(255,255,255,0.15)`,
                    textTransform: "none", fontWeight: 600, borderRadius: "10px", py: 1.1,
                    "&:hover": { borderColor: BLUE, color: BLUE },
                  }}>
                  Sign Up
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" gap={1.5}
                sx={{ p: 1.5, background: "rgba(41,121,255,0.08)", borderRadius: "10px", border: `1px solid ${BORDER}` }}>
                <Box component="img"
                  src={authMember?.memberImage ? `${serverApi}/${authMember.memberImage}` : "/icons/default-user.svg"}
                  sx={{ width: 34, height: 34, borderRadius: "50%", border: `2px solid ${BLUE}`, objectFit: "cover" }}
                />
                <Box>
                  <Box sx={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{authMember?.memberNick ?? "User"}</Box>
                  <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Member</Box>
                </Box>
              </Stack>
            )}
          </Box>
        </Stack>
      </Drawer>

      {/* ── LOGOUT MENU ── */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleCloseLogout}
        onClick={handleCloseLogout}
        PaperProps={{
          elevation: 0,
          sx: {
            background: BG2, border: `1px solid ${BORDER}`, borderRadius: "12px",
            overflow: "visible", mt: 1.5, minWidth: 140, zIndex: 1600,
            "&:before": {
              content: '""', display: "block", position: "absolute",
              top: 0, right: 14, width: 10, height: 10, bgcolor: BG2,
              transform: "translateY(-50%) rotate(45deg)", zIndex: 0,
              borderLeft: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}`,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleLogoutRequest}
          sx={{
            fontSize: 14, color: "rgba(255,255,255,0.75)", px: 2.5, py: 1.2,
            "&:hover": { background: "rgba(239,68,68,0.08)", color: "#ef4444" },
          }}
        >
          <ListItemIcon><Logout fontSize="small" sx={{ color: "inherit" }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}