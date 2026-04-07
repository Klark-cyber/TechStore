import React, { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { RippleBadge } from "./MaterialTheme/styled";
import { Link, Route, Router, Switch, useLocation } from "react-router-dom";
import HomePage  from "./screen/homePage";
import  ProductsPage  from "./screen/productsPage";
import  OrdersPage  from "./screen/ordersPage";
import  UserPage  from "./screen/userPage";
import  HomeNavbar  from "./components/headers/HomeNavbar";
import  OtherNavbar from "./components/headers/OtherNavbar";
import  Footer  from "./components/footer";
import  HelpPage  from "./screen/helpPage";
import "../css/app.css";
import "../css/navbar.css" //css ichidan navbar.css ni chaqirdik uning ichida home-navbarga tgeishli css lar bor
import "../css/footer.css" ///footerga oid cssni import qildik
import Test from "./screen/test";
import { CartItem } from "../lib/types/search";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { T } from "../lib/types/common";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Message } from "@mui/icons-material";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobals";

function App() {
  const location = useLocation(); //React-router-domning ushbu nomli hookini ishlatyapmiz.Bu hookning natijasi object boladi
  const {setAuthMember} = useGlobals();
  console.log("location:", location) //location: {pathname: '/', search: '', hash: '', state: undefined} yani sahifaga tegishli malumotlarni korsatadi
  const {onAdd, cartItems, onRemove, onDelete, onDeleteAll } = useBasket();
//Authentification modal uchun ishlatiladigan variablellar
const [signupOpen, setSignupOpen] = useState<boolean>(false);
const [loginOpen, setLoginOpen] = useState<boolean>(false);
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null) //member image ustiga bosilganda logout oynasi chiqish mantigi
/** HANDLERS **/
const handleSignupClose = () => setSignupOpen(false); // bu handlerlar authentificatsiyada qollaniladi
const handleLoginClose = () => setLoginOpen(false); // bu handlerlar authentificatsiyada qollaniladi

const handleLogOutClick = (e: React.MouseEvent<HTMLElement>) => {setAnchorEl(e.currentTarget)} //member image ustiga bosilganda logout oynasi chiqish mantigi.currentTarget handler yozilgan joy uchun ishlatiladi
const handleCloseLogout = () => setAnchorEl(null)
const handleLogoutRequest =  async () => {
  try{
  const member = new MemberService();
  await member.logout();
  await sweetTopSuccessAlert("success", 700); 
  setAuthMember(null) //user logout bolgach authMember qiymatini null qildik
  }catch(err){
    console.log(err);
    sweetErrorHandling(Messages.error1)
  }
}
// const cartJson: string | null = localStorage.getItem("cartData") //Pasgi qatorda existni tekshirib mavjud bolsa ozgartirib aks holda oz holicha localStoragega yuklagan edik.Endi storedagi arrayni cartItemsga dastlabki qiymat sifatida berish mumkin
// const currentCart = cartJson ? JSON.parse(cartJson) : [] //Agar local Storageda cartJson mavjud bolsa uni uni string holatdan parse methodi orqali objectga ozgartirib cartItems uchun dastlabki qiymat sifatida belgiladik.Agar storedan cartData mavjud bolmasa cartItemsning dastlabki qiymati []
//   //Buscet bilan ishlash biznes mantigi
// const [cartItems, setCartItems] = useState<CartItem[]>(currentCart) //cartItemsning type CartItem dan iborat arrayni tashkil qiladi, boshlangich qiymati bosh array 

/** HANDLERS */
// const onAdd = (input: CartItem) => { //Buscetga product qoshish uchun onAdd handlerdan foydalanamiz. Parametr sifatida type CartItem bolgan objectni qabul qiladi dan 
//   const exist: CartItem | undefined = cartItems.find((item) => item._id === input._id) //useState ichida cartItems array edi shu sababli unga find() methodini qollab input ichidagi _id si bir xil bolgan objectni topyapmiz.find object qaytaradi
//   console.log("obyect topildi:", exist)
//   if(exist) {
//     console.log("tugma bosildi")
//     //Agar cartItems ichida exist mavjud bolsa existga teng bolgan itemni olib uni quantitysini 1 ga oshirib qaytadan map orqali yangi array xosil qilib beradi
//     const cartUpdate = cartItems.map((item: CartItem) =>  item._id === input._id 
//     ? {...exist, quantity: exist.quantity + 1} 
//     : item //exist ichidagi quentityni 1 ga oshirib existni yangi reference orqali saqlab berish. exist._id va input._id bir xil
//     );
//     setCartItems(cartUpdate)
//      localStorage.setItem("cartData", JSON.stringify(cartUpdate)) //browser localStorageda setItem default methodi orqali cartData nomi ostida storega belgilangan malumotni joylab beradi. Unga json korinishda malumotni joylashni buyurdik
//   } else {
//     const cartUpdate = [...cartItems, {...input}]; //Agar cart ichida inputdan kelgan object mavjud bolmasa cartItemsga inputni qoshib uni yangi referenceda saqlab olamiz
//     setCartItems(cartUpdate); //useState ichidagi setCartItems orqali cartItemsni input orqali boyitib uni yangi reference orqali saqlab olyapmiz
//     localStorage.setItem("cartData", JSON.stringify(cartUpdate)) //browser localStorageda setItem default methodi orqali cartData nomi ostida storega belgilangan malumotni joylab beradi. Unga json korinishda malumotni joylashni buyurdik
//   }
// }
  return (
      <>
      {/**cartItemsning oxirgi qiymatini homenav yoki othernavbarda joylashgan buscetga olib borib develop qilamiz */}
        {location.pathname === "/" 
        ? <HomeNavbar cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} setSignUpOpen={setSignupOpen} setLoginOpen={setLoginOpen} anchorEl={anchorEl} handleLogOutClick={handleLogOutClick} handleCloseLogout={handleCloseLogout} handleLogoutRequest={handleLogoutRequest}/> 
        : <OtherNavbar cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} setSignUpOpen={setSignupOpen} setLoginOpen={setLoginOpen}anchorEl={anchorEl} handleLogOutClick={handleLogOutClick} handleCloseLogout={handleCloseLogout} handleLogoutRequest={handleLogoutRequest}/>}  {/* req yuborilgan sahifaga tegishli pathname "/" bolsa HomeNavbarni aks holda Othernavbar Componenti ishlasin */}
        {/* A */}
        <Switch> {/* Switch kirib kelgan pathni tekshiradi.Endpoint qanoatlantirilgan pathni tekshirib osha linkga yuboryapti */}
          <Route path="/products">
            <ProductsPage onAdd={onAdd} /> {/**onAdd funksiyani screen componentga onAdd nomi ostida export qilamiz */}
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UserPage />
          </Route>
           <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/"> {/* Route "/" ozak endpointi doim royxat oxirida boladi */}
            <HomePage />
          </Route>
        </Switch>
        <Footer/>
        <AuthenticationModal 
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}/>
      </>
  );
}






export default App;


