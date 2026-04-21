import React from "react";
import { Box, Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GavelOutlined, QuestionAnswerOutlined, MailOutlineOutlined, SendOutlined } from "@mui/icons-material";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";
import "../../../css/help.css";

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
    <div className="help-page">
      <Box className="help-page-wrapper" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          
          <Stack alignItems="center" spacing={1.5} mb={6}>
            <Typography variant="h4" className="help-title" sx={{ fontSize: { xs: 26, md: 36 } }}>
              Help Center
            </Typography>
            <Box className="title-line" />
            <Typography className="copyright-text" sx={{ color: "rgba(255,255,255,0.4)" }}>
              Find answers, read our terms, or send us a message
            </Typography>
          </Stack>

          <TabContext value={value}>
            <Box className="help-menu" sx={{ mb: 3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": { background: "#2979FF", height: 3 },
                  "& .MuiTabs-flexContainer": { borderBottom: "1px solid rgba(41,121,255,0.15)" }
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    className="tab-root"
                  />
                ))}
              </Tabs>
            </Box>

            <Stack className="help-main-content">
              <TabPanel value="1" sx={{ p: 0 }}>
                <Box className="content-card" sx={{ p: { xs: 3, md: 4 } }}>
                  {terms.map((item, i) => (
                    <Box key={i} component="p" className="rule-text">
                      {item}
                    </Box>
                  ))}
                </Box>
              </TabPanel>

              <TabPanel value="2" sx={{ p: 0 }}>
                <Stack spacing={1.5}>
                  {faq.map((item, i) => (
                    <Accordion key={i} className="faq-accordion">
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#2979FF" }} />}>
                        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                          {item.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ borderTop: "1px solid rgba(41,121,255,0.15)", pt: 2 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8 }}>
                          {item.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </TabPanel>

              <TabPanel value="3" sx={{ p: 0 }}>
                <Box className="content-card" sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography className="section-title" sx={{ fontSize: 20, mb: 0.5 }}>Contact us!</Typography>
                      <Typography className="copyright-text">Fill out below form to send a message!</Typography>
                    </Box>

                    <form action="#" method="POST">
                      <Stack spacing={2.5}>
                        <Box>
                          <label className="input-label">Your name</label>
                          <input type="text" name="memberNick" placeholder="Type your name here" className="admin-input" />
                        </Box>
                        <Box>
                          <label className="input-label">Your email</label>
                          <input type="text" name="memberEmail" placeholder="Type your email here" className="admin-input" />
                        </Box>
                        <Box>
                          <label className="input-label">Message</label>
                          <textarea name="memberMsg" placeholder="Your message" rows={5} className="admin-input" style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            type="submit"
                            variant="contained"
                            endIcon={<SendOutlined />}
                            sx={{
                              background: "#2979FF",
                              borderRadius: "10px",
                              textTransform: "none",
                              px: 4,
                              "&:hover": { background: "#1565c0" }
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