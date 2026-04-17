import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { Tabs } from "@mui/material";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import {
  GavelOutlined,
  QuestionAnswerOutlined,
  MailOutlineOutlined,
  SendOutlined,
} from "@mui/icons-material";

const BLUE = "#2979FF";
const BLUE_DARK = "#1565c0";
const BG = "#060b13";
const CARD_BG = "rgba(13,16,32,0.8)";
const BORDER = "rgba(41,121,255,0.15)";

export default function HelpPage() {
  const [value, setValue] = React.useState("1");

  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const tabs = [
    { value: "1", label: "Terms", icon: <GavelOutlined sx={{ fontSize: 18 }} /> },
    { value: "2", label: "FAQ", icon: <QuestionAnswerOutlined sx={{ fontSize: 18 }} /> },
    { value: "3", label: "Contact", icon: <MailOutlineOutlined sx={{ fontSize: 18 }} /> },
  ];

  return (
    <div className={"help-page"}>
      <Box sx={{ background: BG, minHeight: "100vh", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">

          {/* ── Header ── */}
          <Stack alignItems="center" spacing={1.5} mb={6}>
            <Box
              sx={{
                fontSize: { xs: 26, md: 36 },
                fontWeight: 900,
                color: "#fff",
                fontFamily: "'Orbitron', monospace",
                letterSpacing: -0.5,
                textAlign: "center",
              }}
            >
              Help Center
            </Box>
            <Box sx={{ width: 48, height: 3, background: BLUE, borderRadius: "2px" }} />
            <Box sx={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Find answers, read our terms, or send us a message
            </Box>
          </Stack>

          {/* ── Tab Context ── */}
          <TabContext value={value}>

            {/* ── Tab buttons ── */}
            <Box
              className={"help-menu"}
              sx={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "14px",
                mb: 3,
                overflow: "hidden",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                className={"table_list"}
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    background: BLUE,
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: 0.5,
                    py: 2,
                    gap: "6px",
                    transition: "color 0.2s",
                    "&.Mui-selected": { color: BLUE },
                    "&:hover": { color: "rgba(255,255,255,0.8)" },
                  },
                  "& .MuiTabs-flexContainer": {
                    borderBottom: `1px solid ${BORDER}`,
                  },
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>

            {/* ── Content ── */}
            <Stack className={"help-main-content"}>

              {/* TERMS */}
              <TabPanel value={"1"} sx={{ p: 0 }}>
                <Box
                  className={"rules-box"}
                  sx={{
                    background: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "14px",
                    p: { xs: 3, md: 4 },
                  }}
                >
                  <Box className={"rules-frame"}>
                    {terms.map((item, i) => (
                      <Box
                        key={i}
                        component="p"
                        sx={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 14,
                          lineHeight: 1.8,
                          mb: 1.5,
                          borderLeft: `3px solid ${BORDER}`,
                          pl: 2,
                          "&:hover": { borderColor: BLUE, color: "rgba(255,255,255,0.85)" },
                          transition: "all 0.2s",
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </TabPanel>

              {/* FAQ */}
              <TabPanel value={"2"} sx={{ p: 0 }}>
                <Stack className={"accordion-menu"} spacing={1.5}>
                  {faq.map((item, i) => (
                    <Accordion
                      key={i}
                      sx={{
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                        borderRadius: "12px !important",
                        boxShadow: "none",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          border: `1px solid ${BLUE}`,
                          boxShadow: `0 4px 20px rgba(41,121,255,0.12)`,
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: BLUE }} />}
                        sx={{
                          "& .MuiAccordionSummary-content": { my: 1.5 },
                          "&:hover": { background: "rgba(41,121,255,0.04)" },
                          borderRadius: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {item.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{ borderTop: `1px solid ${BORDER}`, pt: 2 }}
                      >
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.55)",
                            fontSize: 14,
                            lineHeight: 1.8,
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </TabPanel>

              {/* CONTACT */}
              <TabPanel value={"3"} sx={{ p: 0 }}>
                <Box
                  className={"admin-letter-box"}
                  sx={{
                    background: CARD_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "14px",
                    p: { xs: 3, md: 4 },
                  }}
                >
                  <Stack className={"admin-letter-container"} spacing={3}>
                    {/* Header */}
                    <Box className={"admin-letter-frame"}>
                      <Box
                        sx={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#fff",
                          fontFamily: "'Orbitron', monospace",
                          mb: 0.5,
                        }}
                      >
                        Contact us!
                      </Box>
                      <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                        Fill out below form to send a message!
                      </Box>
                    </Box>

                    {/* Form */}
                    <form
                      action={"#"}
                      method={"POST"}
                      className={"admin-letter-frame"}
                    >
                      <Stack spacing={2.5}>
                        {/* Name */}
                        <Box className={"admin-input-box"}>
                          <Box
                            component="label"
                            sx={{
                              display: "block",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.5)",
                              mb: 0.8,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            Your name
                          </Box>
                          <Box
                            component="input"
                            type={"text"}
                            name={"memberNick"}
                            placeholder={"Type your name here"}
                            sx={{
                              width: "100%",
                              background: "rgba(255,255,255,0.04)",
                              border: `1px solid rgba(255,255,255,0.1)`,
                              borderRadius: "10px",
                              px: 2,
                              py: 1.5,
                              fontSize: 14,
                              color: "#fff",
                              outline: "none",
                              boxSizing: "border-box",
                              transition: "border-color 0.2s",
                              "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                              "&:focus": { borderColor: BLUE },
                            }}
                          />
                        </Box>

                        {/* Email */}
                        <Box className={"admin-input-box"}>
                          <Box
                            component="label"
                            sx={{
                              display: "block",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.5)",
                              mb: 0.8,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            Your email
                          </Box>
                          <Box
                            component="input"
                            type={"text"}
                            name={"memberEmail"}
                            placeholder={"Type your email here"}
                            sx={{
                              width: "100%",
                              background: "rgba(255,255,255,0.04)",
                              border: `1px solid rgba(255,255,255,0.1)`,
                              borderRadius: "10px",
                              px: 2,
                              py: 1.5,
                              fontSize: 14,
                              color: "#fff",
                              outline: "none",
                              boxSizing: "border-box",
                              transition: "border-color 0.2s",
                              "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                              "&:focus": { borderColor: BLUE },
                            }}
                          />
                        </Box>

                        {/* Message */}
                        <Box className={"admin-input-box"}>
                          <Box
                            component="label"
                            sx={{
                              display: "block",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.5)",
                              mb: 0.8,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            Message
                          </Box>
                          <Box
                            component="textarea"
                            name={"memberMsg"}
                            placeholder={"Your message"}
                            rows={5}
                            sx={{
                              width: "100%",
                              background: "rgba(255,255,255,0.04)",
                              border: `1px solid rgba(255,255,255,0.1)`,
                              borderRadius: "10px",
                              px: 2,
                              py: 1.5,
                              fontSize: 14,
                              color: "#fff",
                              outline: "none",
                              resize: "vertical",
                              boxSizing: "border-box",
                              transition: "border-color 0.2s",
                              fontFamily: "inherit",
                              "&::placeholder": { color: "rgba(255,255,255,0.25)" },
                              "&:focus": { borderColor: BLUE },
                            }}
                          />
                        </Box>

                        {/* Submit */}
                        <Box display={"flex"} justifyContent={"flex-end"}>
                          <Button
                            type={"submit"}
                            variant="contained"
                            endIcon={<SendOutlined sx={{ fontSize: 16 }} />}
                            sx={{
                              background: BLUE,
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 14,
                              px: 4,
                              py: 1.3,
                              borderRadius: "10px",
                              textTransform: "none",
                              boxShadow: `0 8px 24px rgba(41,121,255,0.3)`,
                              "&:hover": { background: BLUE_DARK },
                              transition: "all 0.2s",
                            }}
                          >
                            Send
                          </Button>
                        </Box>
                      </Stack>
                    </form>
                  </Stack>
                </Box>
              </TabPanel>

            </Stack>
          </TabContext>
        </Container>
      </Box>
    </div>
  );
}