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
import "../../../css/auth.css";

const useStyles = makeStyles(() => ({
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
        memberNick,
        memberPhone,
        memberPassword,
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
        memberNick,
        memberPassword,
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

  /* ── MUI input dark style ── */
  const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "10px",
    "& fieldset": { borderColor: "rgba(41,121,255,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(41,121,255,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#2979ff" },
    background: "rgba(255,255,255,0.04)",
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2979ff" },
  "& .MuiInputAdornment-root svg": { color: "rgba(255,255,255,0.3)" },

  // ✅ Autofill override — MUI TextField uchun
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px rgba(10,12,28,0.97) inset !important",
    WebkitTextFillColor: "#fff !important",
    caretColor: "#fff",
  },
};

  /* ── submit button ── */
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

  /* ── Logo + Title ── */
  const TitleBlock = ({ title }: { title: string }) => (
    <Stack alignItems="center" mb={3}>
      <Stack direction="row" alignItems="center" gap={0.6} mb={1.5}>
        <span className="auth-title-logo">⚡</span>
        <span className="auth-title-brand">TECHSTORE</span>
      </Stack>
      <div className="auth-title-text">{title}</div>
      <div className="auth-title-divider" />
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
          <div className="auth-modal-card">
            <div className="auth-modal-glow" />
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

            <Fab variant="extended" sx={fabSx} onClick={handleSignupRequest}>
              <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
              Sign Up
            </Fab>

            <div className="auth-footer-text">
              Already have an account?{" "}
              <span className="auth-footer-link" onClick={handleSignupClose}>
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
          <div className="auth-modal-card">
            <div className="auth-modal-glow" />
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

            <Fab variant="extended" sx={fabSx} onClick={handleLoginRequest}>
              <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
              Login
            </Fab>

            <div className="auth-footer-text">
              Don't have an account?{" "}
              <span className="auth-footer-link" onClick={handleLoginClose}>
                Sign Up
              </span>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}