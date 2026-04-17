import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Fab, Stack, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    outline: "none",
    padding: 0,
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");

  const { setAuthMember } = useGlobals();

  /** HANDLERS **/
  const handleUserName = (e: T) => {
    setMemberNick(e.target.value);
  };

  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };

  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  /** SIGNUP **/
  const handleSignupRequest = async () => {
    try {
      const isFullfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  /** LOGIN **/
  const handleLoginRequest = async () => {
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  /* ── shared input sx ── */
  const inputSx = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      background: "rgba(255,255,255,0.04)",
      borderRadius: "10px",
      color: "#fff",
      "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset": { borderColor: "rgba(41,121,255,0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#2979ff" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2979ff" },
    "& .MuiInputAdornment-root svg": { color: "rgba(255,255,255,0.3)" },
  };

  /* ── modal card wrapper ── */
  const cardStyle: React.CSSProperties = {
    width: 420,
    background: "rgba(10,12,28,0.97)",
    border: "1px solid rgba(41,121,255,0.18)",
    borderRadius: 20,
    padding: "40px 36px 36px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(41,121,255,0.08)",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  };

  /* ── glow accent ── */
  const glowStyle: React.CSSProperties = {
    position: "absolute",
    top: -60,
    left: "50%",
    transform: "translateX(-50%)",
    width: 300,
    height: 160,
    background:
      "radial-gradient(ellipse, rgba(41,121,255,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  };

  /* ── fab sx ── */
  const fabSx = {
    mt: "28px",
    width: "100%",
    height: 50,
    borderRadius: "10px",
    background: "#2979ff",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    textTransform: "none",
    boxShadow: "0 8px 32px rgba(41,121,255,0.4)",
    "&:hover": { background: "#1565c0" },
  };

  /* ── logo/title block ── */
  const TitleBlock = ({ title }: { title: string }) => (
    <Stack alignItems="center" mb={3}>
      <Stack direction="row" alignItems="center" gap={0.6} mb={1.5}>
        <span style={{ color: "#2979ff", fontSize: 22, lineHeight: 1 }}>⚡</span>
        <span
          style={{
            fontFamily: "'Orbitron', monospace",
            fontWeight: 900,
            fontSize: 18,
            background: "linear-gradient(135deg, #fff 40%, #2979ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 1,
          }}
        >
          TECHSTORE
        </span>
      </Stack>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'Orbitron', monospace",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 6,
          width: 40,
          height: 3,
          background: "#2979ff",
          borderRadius: 2,
        }}
      />
    </Stack>
  );

  return (
    <div>
      {/* ── SIGNUP MODAL ── */}
      <Modal
        aria-labelledby="signup-modal"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={signupOpen}>
          <div style={cardStyle}>
            <div style={glowStyle} />
            <TitleBlock title="Create Account" />

            <Stack gap="16px">
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                onChange={handleUserName}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <PersonOutlineIcon
                      sx={{ mr: 1, fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Phone number"
                variant="outlined"
                onChange={handlePhone}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <PhoneOutlinedIcon
                      sx={{ mr: 1, fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <LockOutlinedIcon
                      sx={{ mr: 1, fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                  ),
                }}
              />
            </Stack>

            <Fab
              variant="extended"
              sx={fabSx}
              onClick={handleSignupRequest}
            >
              <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
              Sign Up
            </Fab>

            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Already have an account?{" "}
              <span
                onClick={handleSignupClose}
                style={{ color: "#2979ff", cursor: "pointer", fontWeight: 600 }}
              >
                Login
              </span>
            </div>
          </div>
        </Fade>
      </Modal>

      {/* ── LOGIN MODAL ── */}
      <Modal
        aria-labelledby="login-modal"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={loginOpen}>
          <div style={cardStyle}>
            <div style={glowStyle} />
            <TitleBlock title="Welcome Back" />

            <Stack gap="16px">
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                onChange={handleUserName}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <PersonOutlineIcon
                      sx={{ mr: 1, fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <LockOutlinedIcon
                      sx={{ mr: 1, fontSize: 20, color: "rgba(255,255,255,0.3)" }}
                    />
                  ),
                }}
              />
            </Stack>

            <Fab
              variant="extended"
              sx={fabSx}
              onClick={handleLoginRequest}
            >
              <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
              Login
            </Fab>

            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Don't have an account?{" "}
              <span
                onClick={handleLoginClose}
                style={{ color: "#2979ff", cursor: "pointer", fontWeight: 600 }}
              >
                Sign Up
              </span>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
