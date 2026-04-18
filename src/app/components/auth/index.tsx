import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
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
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
}));

const ModalImg = styled.img`
  width: 62%;
  height: 100%;
  border-radius: 10px;
  background: #000;
  margin-top: 9px;
  margin-left: 10px;
`;

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();

const [memberNick, setMemberNick] = useState<string>('');
const [memberPhone, setMemberPhone] = useState<string>('');
const [memberPassword, setMemberPassword] = useState<string>('');

const {setAuthMember} = useGlobals() //useG;obals customize hookini chaqirib olamiz

  /** HANDLERS **/

  const handleUserName = (e: T) => { //user signup oynasida ismini kiritganda uning ismini ushlab olyapmiz
    console.log(e.target.value);
    setMemberNick(e.target.value)
  }

  const handlePhone = (e: T) => { //user signup oynasida ismini kiritganda uning ismini ushlab olyapmiz
    console.log(e.target.value);
    setMemberPhone(e.target.value)
  }

  const handlePassword = (e: T) => { //user signup oynasida ismini kiritganda uning ismini ushlab olyapmiz
    console.log(e.target.value);
    setMemberPassword(e.target.value)
  };

  //user malumotlarni kiritgach enterni bosganda signup button kabi ishga tushuruvchi handler
  //login yoki signup orqali response orqali kelgan datani local storagega yuklash va acces tokenni token ichiga joylash bilan birgalikda hooklar hosil qilib global storage contextiga save qilish mexanizmini hosil qilib  authentifikatsiya jarayonini toliq amalga oshirish kerak boladi
  
  const handlePasswordKeyDown = (e:T) => {
    if(e.key === "Enter" && signupOpen) { //user enterni bosganda modal holati signupOpen yani signup oynasi browserda ochilgan bolishi kerk
      handleSignupRequest().then(); //yuqoridagi shart bajarilganda handleSignupRequest handleri ishga tushsin
    } else if(e.key === "Enter" && loginOpen){ //agar login oynasida enter bosilsa ham yuqoridagi mantiqni takrorlaymiz
      //Login request
      handleLoginRequest().then();
    }
}

/** FOR SIGNUP LOGIC**/

  //user malumotlarni kiritgach input malumotlarini backendga yuboruvchi handler
  const handleSignupRequest = async () => { //async boladi sababi MemberServise orqali backendga malumot yuboramiz
    try{
      const isFullfill = memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      console.log("chala")      //ushbu malumotlar bosh bolmasligi kerak frontendga aloqador validation mantigi
      if(!isFullfill) throw new Error(Messages.error3) //Messages orqali ozimiz hosil qilgan customiz error messageni chaqirdik
      const signupInput: MemberInput = {     //signUp inputini hosil qilamiz
        memberNick: memberNick, //user kiritgan Nickni memberNickga tengladik
        memberPhone: memberPhone,
        memberPassword: memberPassword
      }

      const member = new MemberService();
      const result = await member.signup(signupInput);

// User login bolgan bolsa boshqa pagelarda ha uni oson aniqlab olish mantigini yozamiz
      setAuthMember(result); //setAuthMember orqali useGlobals hooki ichidagi authmember qiymatini yangiladik
      handleSignupClose(); //browserdagi signup oynasi yopiladi
      }catch(err) {
        console.log(err);
        handleSignupClose(); //browserdagi signup oynasi yopiladi
        sweetErrorHandling(err).then();
      }
  }

  /** FOR LOGIN LOGIC**/

const handleLoginRequest = async () => { //async boladi sababi MemberServise orqali backendga malumot yuboramiz
    try{
  
      const isFullfill = memberNick  !== "" && memberPassword !== "";      //ushbu malumotlar bosh bolmasligi kerak frontendga aloqador validation mantigi
      if(!isFullfill) throw new Error(Messages.error3) //Messages orqali ozimiz hosil qilgan customiz error messageni chaqirdik
      const loginInput: LoginInput = {     //signUp inputini hosil qilamiz
        memberNick: memberNick,
        memberPassword: memberPassword
      }

      const member = new MemberService();
      const result = await member.login(loginInput);

// User login bolgan bolsa boshqa pagelarda ha uni oson aniqlab olish mantigini yozamiz


      setAuthMember(result); //setAuthMember orqali useGlobals hooki ichidagi authmember qiymatini yangiladik
      handleLoginClose(); //browserdagi signup oynasi yopiladi
      }catch(err) {
        console.log(err);
        handleLoginClose(); //browserdagi signup oynasi yopiladi
        sweetErrorHandling(err).then();
      }
  }
  
  return (
    <div>
      {/**signUp uchun moljallangan modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={signupOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "800px" }}
          >
            <ModalImg src={"/img/auth.webp"} alt="camera" />
            <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
              <h2>Signup Form</h2>
              <TextField
                sx={{ marginTop: "7px" }}
                id="outlined-basic"
                label="username"
                variant="outlined"
                onChange={handleUserName} //onChange inputda sodir boladigan har qanday ozgarish uchun amalga oshadi
              />
              <TextField
                sx={{ my: "17px" }}
                id="outlined-basic"
                label="phone number"
                variant="outlined"
                onChange={handlePhone}
              />
              <TextField
                id="outlined-basic"
                label="password"
                variant="outlined"
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "30px", width: "120px" }}
                variant="extended"
                color="primary"
                onClick={handleSignupRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Signup
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>

{/**login uchun moljallangan modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginOpen}>
          <Stack
            className={classes.paper}
            direction={"row"}
            sx={{ width: "700px" }}
          >
            <ModalImg src={"/img/auth.webp"} alt="camera" />
            <Stack
              sx={{
                marginLeft: "65px",
                marginTop: "25px",
                alignItems: "center",
              }}
            >
              <h2>Login Form</h2>
              <TextField
                id="outlined-basic"
                label="username"
                variant="outlined"
                sx={{ my: "10px" }}
                onChange={handleUserName}
              />
              <TextField
                id={"outlined-basic"}
                label={"password"}
                variant={"outlined"}
                type={"password"}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
              />
              <Fab
                sx={{ marginTop: "27px", width: "120px" }}
                variant={"extended"}
                color={"primary"}
                onClick={handleLoginRequest}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Fab>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </div>
  );
}
