import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { retriveTopUsers } from "./selector";

const BLUE = "#2979FF";

const topUsersRetriever = createSelector(
  retriveTopUsers,
  (topUsers) => ({ topUsers })
);

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <Box
      sx={{
        width: "100%",
        background: "#060b13",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={5}>

          {/* Header */}
          <Stack alignItems="center" spacing={1.5}>
            <Box
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 900,
                color: "#fff",
                fontFamily: "'Orbitron', monospace",
                letterSpacing: -0.5,
                textAlign: "center",
              }}
            >
              Top Users
            </Box>
            <Box
              sx={{
                width: 48,
                height: 3,
                background: BLUE,
                borderRadius: "2px",
              }}
            />
          </Stack>

          {/* Cards */}
          {topUsers.length !== 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: "16px", md: "24px" },
              }}
            >
              {topUsers.map((member, idx) => {
                const imagePath = `${serverApi}/${member.memberImage}`;
                return (
                  <Box
                    key={member._id}
                    sx={{
                      width: {
                        xs: "calc(50% - 8px)",
                        sm: "calc(33.333% - 11px)",
                        md: "calc(25% - 18px)",
                        lg: "calc(20% - 20px)",
                      },
                      flexShrink: 0,
                      background: "#0d1020",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "14px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      animation: `fadeUp 0.5s ${idx * 0.07}s ease both`,
                      "@keyframes fadeUp": {
                        from: { opacity: 0, transform: "translateY(24px)" },
                        to:   { opacity: 1, transform: "translateY(0)"    },
                      },
                      "&:hover": {
                        border: `1px solid ${BLUE}`,
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 32px rgba(41,121,255,0.18)",
                        "& img": { transform: "scale(1.06)" },
                      },
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                        background: "#111827",
                      }}
                    >
                      <Box
                        component="img"
                        src={imagePath}
                        alt={member.memberNick}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    </Box>

                    {/* Nickname */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        textAlign: "center",
                        background: "#0d1020",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: { xs: 13, md: 15 },
                          fontWeight: 600,
                          color: "#ffffff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {member.memberNick}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                fontSize: 14,
                color: "rgba(255,255,255,0.2)",
                py: 8,
                textAlign: "center",
              }}
            >
              No Active Users!
            </Box>
          )}

        </Stack>
      </Container>
    </Box>
  );
}
