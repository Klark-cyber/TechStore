import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { useEffect, useState } from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";
import { T } from "../../../lib/types/common";

interface HomeNavbarProps {
      cartItems: CartItem[]; //catItems bu type CartItems bolgan itemlardan iborat array boladi
        onAdd: (item: CartItem) => void;
        onRemove: (item: CartItem) => void;
        onDelete: (item: CartItem) => void;
        onDeleteAll: () => void;
        setSignUpOpen: (isOpen: boolean) => void;
        setLoginOpen: (isOpen: boolean) => void;
        handleLogOutClick: (e: React.MouseEvent<HTMLElement>) => void;
        anchorEl: (HTMLElement | null);
        handleCloseLogout: () => void; //handle bolganda yani rasm ustiga bosilganda logout oynasi ochiladi
        handleLogoutRequest: () => void

    }

export default function HomeNavbar(props: HomeNavbarProps ) { //HomePagedan boshqa pagelar uchun Homenavbar mantigi.//css uchun foydalaniladigan classlarni nomlashda snake casedan foydlalanamiz.ushbu classga frontend uchun yaratib olingan css ichida ishlov beramiz.Ushbu classga tegishli cssni togridan togri app.tsx ichiga chaqirib olamiz
    
    const {cartItems, onAdd,onDelete,onDeleteAll,onRemove, setSignUpOpen, setLoginOpen, handleLogOutClick, anchorEl, handleCloseLogout, handleLogoutRequest} = props;
    
    const [count, setCount] = useState<number>(0); //useState methodida 0 const state qiymati, setState state qiymatini ozgartiruvchi method
    const [value, setValue] = useState<boolean>(true);
    const {authMember} = useGlobals();
    //setCountni handler korinishida hosil qilamiz
    // const buttonHandler = () => {
    //     setCount(count + 1);
    // }

    //useEffect orqali lifecycle metodlarini yani 3 xil fazani hosil qilamiz
    //useEffect componentDidMount yani component dastlabki vaqtdagina ishga tushadi.ikkinchi marta ishga tushishi esa array dependencies (value)componentDidUpdatega boglanadi
    // useEffect(() => { //Bu effectni 2 ta argumenti mavjud 1-callback function 2-Array Dependencies yani unga kiritilgan ozgaruvchi qiymati har ozgarganida useEffect ishga tushadi.Agar arrayga qiymat bermasak useEffect faqat 1 marta ishga tushadi
    //     console.log("componentDidMount", count); //useEffect dastlabki ishga tushganda componentDidMount ishga tushadi.Data Fetch yana dataBasedan malumot olib kelganda ishlatamiz
    //     setCount(count + 1); //callBack function
    
    //  return () => { //componentWillUnmount return orqali hosil qilinadi
    //     console.log("componentWillUnmount"); 
    // }
    // }, [value]) //value ozgarishi componentDidUpdate yani qiymat ozgarganda ishga tushadi


    
    // const buttonHandler = () => { //useEffect orqali button har bosilganda value ozgaradi buni natijasida useEffect ishga tushadi
    //     setValue(!value);
    // }

    return <div className="home-navbar"> 
        <Container className="navbar-container" >
            <Stack className="menu">  {/*Navbar linklarigaga tegishli stack.Menu qism uchun*/}
                <Box> {/*Burak logosiga tegishli box */}
                    <NavLink to="/"> {/*imgga Navlink mUI orqali link biriktiramiz */}
                        <img className="brand-logo" src="/icons/burak.svg" /> {/*Burak Logo.img html elementiligi sababli material UI elementlarini qollay olmaymiz va sx emas style deb yozdik */}
                    </NavLink>
                </Box>

            <Stack className="links"> {/*menu elementlari uchun stack */}
                <Box className={"hover-line"}>
                    <NavLink to="/" activeClassName={"underline"} >Home</NavLink>
                </Box>
                <Box className={"hover-line"}>
                    <NavLink to="/products" activeClassName={"underline"} >Products</NavLink>
                </Box >
                {authMember ? ( //Agar login bolgan user bolsa korsatiladigan linklarni shu shaklda ternary operatori yordamida yozdik
                <Box className={"hover-line"}>
                    <NavLink to="/orders" activeClassName={"underline"} >Orders</NavLink>
                </Box>
                ) : null}
                {authMember ? ( //Agar login bolgan user bolsa korsatiladigan linklarni shu shaklda ternary operatori yordamida yozdik
                <Box className={"hover-line"}>
                    <NavLink to="/member-page" activeClassName={"underline"} >My Page</NavLink>
                </Box>
                ) : null}
                <Box className={"hover-line"}>
                    <NavLink to="/help" activeClassName={"underline"} >Help</NavLink>
                </Box>


                {/*BASKET */}
                <Basket 
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete} 
                onDeleteAll={onDeleteAll}
                /> {/* Basket.tsx dan basket functional komponentini chaqirib oldik */}

                {!authMember ? (
                    <Box>
                        <Button variant="contained" className="login-button"  onClick={() => setLoginOpen(true)}>Login</Button> {/* style orniga sx yozish ham mumkin */}
                    </Box>
                ) : (
                <img className="user-avatar" src={authMember?.memberImage ? `${serverApi}/${authMember?.memberImage}` : "/icons/default-user.svg"} aria-haspopup={"true"} onClick={handleLogOutClick}/> // useGlobals ichidagi authMemberdan memberImageni qabul qilib oldik
                )} {/**Agar member login bolmagan bolsa unga login menuni ham korsatish */}

{/**User rasmi ustiga bosganda logout oynasi qilish mantigi */}
<Menu
    anchorEl={anchorEl}
	id="account-menu"
    open={Boolean(anchorEl)}
    onClose={handleCloseLogout} //logoutdan boshqa joy bosilganda ham logout oynasi yopiladi
    onClick={handleCloseLogout} //logout bosilganda oyna yopiladi
	PaperProps={{
		elevation: 0,
		sx: {
			overflow: 'visible',
			filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
			mt: 1.5,
			'& .MuiAvatar-root': {
				width: 32,
				height: 32,
				ml: -0.5,
				mr: 1,
			},
			'&:before': {
				content: '""',
				display: 'block',
				position: 'absolute',
				top: 0,
				right: 14,
				width: 10,
				height: 10,
				bgcolor: 'background.paper',
				transform: 'translateY(-50%) rotate(45deg)',
				zIndex: 0,
			},
		},
	}}
	transformOrigin={{ horizontal: 'right', vertical: 'top' }}
	anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
	<MenuItem onClick={handleLogoutRequest}>
		<ListItemIcon>
			<Logout fontSize="small" style={{ color: 'blue' }} />
		</ListItemIcon>
		Logout
	</MenuItem>
</Menu>


            </Stack> 
            </Stack> 

            <Stack className={"header-frame"}> {/*Navbar ichidagi matnlarga tegishli stack */}
                <Stack className={"detail"}>
                    <Box className={"head-main-txt"}>World's Most Delicious Cousine</Box>
                    <Box className={"wel-txt"}> The Choice,not just a choice</Box>
                    <Box className={"service-txt"}>24 hours service</Box> {/*useState hook orqali hosil qilgan const countni ishlatdik*/}
                    <Box className={"signup"}>
                      {!authMember ? (
                        <Button variant={"contained"} 
                        className={"signup-button"} 
                        onClick={() => setSignUpOpen(true)} //signup button bosilganda setSignUpOpen ishga tushib signUpOpen qiymatini default falsedan truega ozgartiradi Natijada Authentification signup modali isga tushib signup oynasi ochiladi. va browser yangilanadi  
                        >SIGNUP
                        </Button>) : null} </Box> {/* signup buttoni login bolmagan userlar uchun korinishi kerak.Ternary operator */}
                </Stack>
                <Box className={"logo-frame"} >
                    <div className="logo-img"></div>
                </Box>
            </Stack>
        </Container>
        </div>; 
}

// {/** yoki onClick={() => {setCount(count + 1)}} */} 70 qatordagi kodni shu holatda yozish ham mumkin.yoki onClick={() => buttonHandler()} yoki onClick={buttonHandler} korinishida sababi buttonHandler funck argument qabul qilmaydi shu sababli qisqartirib yozish mumkin 