import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings";
import "../../../css/userPage.css";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import React from "react";

const BLUE = "#2979FF";
const BORDER = "rgba(41,121,255,0.15)";
const BG = "#060b13";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  if (!authMember) history.push("/");

  return (
    <div className={"user-page"}>
      <Box sx={{ background: BG, minHeight: "100vh", py: { xs: 4, md: 8 } }}>
        <Container maxWidth="md">

          {/* Header */}
          <Stack alignItems="center" spacing={1.5} mb={5}>
            <Box sx={{
              fontSize: { xs: 22, md: 30 },
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Orbitron', monospace",
              textAlign: "center",
            }}>
              My Page
            </Box>
            <Box sx={{ width: 48, height: 3, background: BLUE, borderRadius: "2px" }} />
          </Stack>

          <Stack
            className={"my-page-frame"}
            direction={{ xs: "column", md: "row" }}
            gap={3}
            alignItems="flex-start"
            sx={{ width: "100%" }}
          >

            {/* ── LEFT: Settings form ── */}
            <Box
              className={"my-page-left"}
              sx={{
                flex: 2,
                minWidth: 0,
                background: "rgba(13,16,32,0.8)",
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                p: { xs: 2.5, md: 3.5 },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <Box
                className={"menu-name"}
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Orbitron', monospace",
                  mb: 3,
                  pb: 2,
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                Modify Member Details
              </Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>

            {/* ── RIGHT: Profile card ── */}
            <Box
              className={"my-page-right"}
              sx={{
                flex: 1,
                minWidth: 0,
                width: { xs: "100%", md: "auto" },
                background: "rgba(13,16,32,0.8)",
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                p: 3,
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              <Box className={"order-info-box"}>
                <Stack alignItems="center" spacing={1.5}>

                  {/* Avatar */}
                  <Box className={"order-user-img"} sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={
                        authMember?.memberImage
                          ? `${serverApi}/${authMember.memberImage}`
                          : "/icons/default-user.svg"
                      }
                      className={"order-user-avatar"}
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        border: `3px solid ${BLUE}`,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Box
                      className={"order-user-icon-box"}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#0d1020",
                        border: `2px solid ${BLUE}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          authMember?.memberType === MemberType.ADMIN
                            ? "/icons/restaurant.svg"
                            : "/icons/user-badge.svg"
                        }
                        style={{ width: 16, height: 16 }}
                      />
                    </Box>
                  </Box>

                  {/* Name */}
                  <Box
                    component="span"
                    className={"order-user-name"}
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "'Orbitron', monospace",
                    }}
                  >
                    {authMember?.memberNick}
                  </Box>

                  {/* Type */}
                  <Box
                    component="span"
                    className={"order-user-prof"}
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: BLUE,
                      background: "rgba(41,121,255,0.1)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "20px",
                      px: 1.5,
                      py: 0.4,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {authMember?.memberType}
                  </Box>

                  {/* Address */}
                  <Box
                    component="span"
                    className={"order-user-prof"}
                    sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}
                  >
                    {authMember?.memberAddres ?? "No Address"}
                  </Box>

                  {/* Divider */}
                  <Box sx={{ width: "100%", height: 1, background: BORDER }} />

                  {/* Social icons */}
                  <Stack
                    direction="row"
                    gap={1}
                    className={"user-media-box"}
                  >
                    {[
                      { Icon: FacebookIcon, color: "#1877f2" },
                      { Icon: InstagramIcon, color: "#e1306c" },
                      { Icon: TelegramIcon, color: "#0088cc" },
                      { Icon: YouTubeIcon, color: "#ff0000" },
                    ].map(({ Icon, color }, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid rgba(255,255,255,0.08)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            border: `1px solid ${color}`,
                            background: `${color}18`,
                            "& svg": { color },
                          },
                        }}
                      >
                        <Icon sx={{ fontSize: 18, color: "rgba(255,255,255,0.4)", transition: "color 0.2s" }} />
                      </Box>
                    ))}
                  </Stack>

                  {/* Description */}
                  <Box
                    component="p"
                    className={"user-desc"}
                    sx={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                      textAlign: "center",
                      lineHeight: 1.7,
                      m: 0,
                    }}
                  >
                    {authMember?.memberDesc ?? "No Description"}
                  </Box>

                </Stack>
              </Box>
            </Box>

          </Stack>
        </Container>
      </Box>
    </div>
  );
}