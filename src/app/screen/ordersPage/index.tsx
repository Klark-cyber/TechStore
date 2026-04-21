import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import React from "react";

const BLUE = "#2979FF";
const BORDER = "rgba(41,121,255,0.15)";
const BG = "#060b13";
const CARD = "rgba(13,16,32,0.9)";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { authMember, orderBuilder } = useGlobals();
  const [value, setValue] = useState("1");
  const history = useHistory();

  const [orderInquery] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));
    order
      .getMyOrders({ ...orderInquery, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquery, orderBuilder]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) history.push("/");

  return (
    <div className="order-page">
      <Box sx={{ background: BG, minHeight: "100vh", py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">

          {/* Header */}
          <Stack alignItems="center" spacing={1.5} mb={5}>
            <Box sx={{
              fontSize: { xs: 22, md: 30 }, fontWeight: 900, color: "#fff",
              fontFamily: "'Orbitron', monospace", textAlign: "center",
            }}>
              Review Order
            </Box>
            <Box sx={{ width: 48, height: 3, background: BLUE, borderRadius: "2px" }} />
          </Stack>

          {/* Breadcrumb */}
          <Stack direction="row" alignItems="center" gap={1} mb={4}
            sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            <Box sx={{ cursor: "pointer", "&:hover": { color: BLUE } }}
              onClick={() => history.push("/")}>Store</Box>
            <Box>›</Box>
            <Box sx={{ color: BLUE, fontWeight: 600 }}>Checkout</Box>
          </Stack>

          <Stack
            className="order-container"
            direction={{ xs: "column", lg: "row" }}
            gap={3}
            alignItems="flex-start"
          >
            {/* ── LEFT ── */}
            <Box
              className="order-left"
              sx={{
                flex: 2, minWidth: 0, background: CARD,
                border: `1px solid ${BORDER}`, borderRadius: "16px",
                overflow: "hidden", width: { xs: "100%", lg: "auto" },
              }}
            >
              <TabContext value={value}>
                {/* Step indicator */}
                <Stack direction="row" sx={{ borderBottom: `1px solid ${BORDER}`, px: 3, pt: 3, pb: 0 }}>
                  {[
                    { num: "1", label: "CART", val: "1" },
                    { num: "2", label: "SHIPPING", val: "2" },
                    { num: "3", label: "PAYMENT", val: "3" },
                  ].map((step, i) => (
                    <Stack key={step.val} direction="row" alignItems="center" flex={i < 2 ? 1 : 0}>
                      <Stack alignItems="center" gap={0.5}>
                        <Box sx={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: value === step.val ? BLUE : "rgba(255,255,255,0.08)",
                          border: `2px solid ${value === step.val ? BLUE : "rgba(255,255,255,0.15)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 700,
                          color: value === step.val ? "#fff" : "rgba(255,255,255,0.3)",
                          transition: "all 0.3s",
                        }}>
                          {step.num}
                        </Box>
                        <Box sx={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 1,
                          color: value === step.val ? BLUE : "rgba(255,255,255,0.3)", pb: 1,
                        }}>
                          {step.label}
                        </Box>
                      </Stack>
                      {i < 2 && (
                        <Box sx={{
                          flex: 1, height: 2, mx: 1, mb: 3,
                          background: parseInt(value) > i + 1 ? BLUE : "rgba(255,255,255,0.08)",
                          transition: "background 0.3s",
                        }} />
                      )}
                    </Stack>
                  ))}
                </Stack>

                {/* Tabs */}
                <Box className="order-nav-frame" sx={{ px: 3, pt: 2 }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    className="table_list"
                    sx={{
                      "& .MuiTabs-indicator": { background: BLUE, height: 2 },
                      "& .MuiTab-root": {
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 600, fontSize: 12, letterSpacing: 0.5,
                        "&.Mui-selected": { color: BLUE },
                      },
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    <Tab label="Paused" value={"1"} />
                    <Tab label="Processing" value={"2"} />
                    <Tab label="Finished" value={"3"} />
                  </Tabs>
                </Box>

                <Stack className="order-main-content">
                  <PausedOrders setValue={setValue} />
                  <ProcessOrders setValue={setValue} />
                  <FinishedOrders />
                </Stack>
              </TabContext>
            </Box>

            {/* ── RIGHT ── */}
            <Stack
              className="order-right"
              gap={3}
              sx={{
                flex: 1, minWidth: 0,
                width: { xs: "100%", lg: "auto" },
                position: { lg: "sticky" },
                top: { lg: 100 },
              }}
            >
              {/* User info */}
              <Box className="order-info-box" sx={{
                background: CARD, border: `1px solid ${BORDER}`,
                borderRadius: "16px", p: 3,
              }}>
                <Stack alignItems="center" spacing={1.5}>
                  <Box className="member-box">
                    <Stack alignItems="center" spacing={1}>
                      <Box className="order-user-img" sx={{ position: "relative" }}>
                        <Box
                          component="img"
                          src={authMember?.memberImage
                            ? `${serverApi}/${authMember.memberImage}`
                            : "/icons/default-user.svg"}
                          alt={authMember?.memberNick ?? "user avatar"}
                          className="order-user-avatar"
                          sx={{
                            width: 72, height: 72, borderRadius: "50%",
                            border: `2px solid ${BLUE}`, objectFit: "cover",
                          }}
                        />
                        <Box className="order-user-icon-box" sx={{
                          position: "absolute", bottom: 0, right: 0,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "#0d1020", border: `2px solid ${BLUE}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {/* ✅ alt qo'shildi */}
                          <img
                            src={authMember?.memberType === MemberType.ADMIN
                              ? "/icons/restaurant.svg"
                              : "/icons/user-badge.svg"}
                            alt="member type"
                            className="order-user-prof-img"
                            style={{ width: 13, height: 13 }}
                          />
                        </Box>
                      </Box>
                      <Box component="span" className="order-user-name"
                        sx={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
                        {authMember?.memberNick}
                      </Box>
                      <Box component="span" className="order-user-prof"
                        sx={{
                          fontSize: 10, fontWeight: 600, color: BLUE,
                          background: "rgba(41,121,255,0.1)",
                          border: `1px solid ${BORDER}`,
                          borderRadius: "20px", px: 1.5, py: 0.4,
                          letterSpacing: 1, textTransform: "uppercase",
                        }}>
                        {authMember?.memberType}
                      </Box>
                    </Stack>
                  </Box>

                  <Box className="liner" sx={{ width: "100%", height: 1, background: BORDER }} />

                  <Stack direction="row" alignItems="center" gap={1} className="order-user-address">
                    <LocationOnIcon sx={{ fontSize: 16, color: BLUE }} />
                    <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      {authMember?.memberAddress ?? "No Address"}
                    </Box>
                  </Stack>
                </Stack>
              </Box>

              {/* Payment card */}
              <Box className="order-info-box" sx={{
                background: CARD, border: `1px solid ${BORDER}`,
                borderRadius: "16px", p: 3,
              }}>
                <Box sx={{ fontSize: 15, fontWeight: 700, color: "#fff", mb: 2.5,
                  fontFamily: "'Orbitron', monospace" }}>
                  Order Summary
                </Box>

                <Stack spacing={2}>
                  {[
                    { name: "cardNumber", placeholder: "Card number: 5243 4090 2002 7495", full: true },
                    { name: "cardCreator", placeholder: "Justin Robertson", full: true },
                  ].map((f) => (
                    <Box key={f.name}
                      component="input" type="text"
                      name={f.name} placeholder={f.placeholder}
                      className="card-input"
                      sx={{
                        width: "100%", background: "rgba(255,255,255,0.04)",
                        border: `1px solid rgba(255,255,255,0.1)`,
                        borderRadius: "10px", px: 2, py: 1.5,
                        fontSize: 14, color: "#fff", outline: "none",
                        boxSizing: "border-box",
                        "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                        "&:focus": { borderColor: BLUE },
                        transition: "border-color 0.2s",
                      }}
                    />
                  ))}
                  <Stack direction="row" gap={1.5}>
                    {[
                      { name: "cardPeriod", placeholder: "07 / 24" },
                      { name: "cardCVV",    placeholder: "CVV: 010" },
                    ].map((f) => (
                      <Box key={f.name}
                        component="input" type="text"
                        name={f.name} placeholder={f.placeholder}
                        className="card-half-input"
                        sx={{
                          flex: 1, background: "rgba(255,255,255,0.04)",
                          border: `1px solid rgba(255,255,255,0.1)`,
                          borderRadius: "10px", px: 2, py: 1.5,
                          fontSize: 14, color: "#fff", outline: "none",
                          "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                          "&:focus": { borderColor: BLUE },
                          transition: "border-color 0.2s",
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                {/* Card icons — ✅ alt qo'shildi */}
                <Stack direction="row" gap={1.5} className="cards-box" mt={2.5}
                  alignItems="center" justifyContent="center">
                  {[
                    { src: "/icons/western-card.svg", alt: "Western Union" },
                    { src: "/icons/master-card.svg",  alt: "Mastercard" },
                    { src: "/icons/paypal-card.svg",  alt: "PayPal" },
                    { src: "/icons/visa-card.svg",    alt: "Visa" },
                  ].map((card, i) => (
                    <Box key={i} sx={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid rgba(255,255,255,0.1)`,
                      borderRadius: "8px", p: 1,
                      display: "flex", alignItems: "center",
                      "&:hover": { borderColor: BLUE },
                      transition: "border-color 0.2s",
                    }}>
                      <img src={card.src} alt={card.alt} style={{ height: 20, display: "block" }} />
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)",
                  mt: 2, letterSpacing: 1, textTransform: "uppercase" }}>
                  Secure Checkout • SSL Encrypted
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}