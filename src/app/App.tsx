import React, { useState } from "react";
import { useLocation, Switch, Route } from "react-router-dom";
import HomePage from "./screen/homePage";
import ProductsPage from "./screen/productsPage";
import OrdersPage from "./screen/ordersPage";
import UserPage from "./screen/userPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import HelpPage from "./screen/helpPage";
import "../css/events.css";
import "../css/statistics.css";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import { CartItem } from "../lib/types/search";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobals";

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();
  const { onAdd, cartItems, onRemove, onDelete, onDeleteAll } = useBasket();

  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);
  const handleLogOutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseLogout = () => setAnchorEl(null);
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  // Navbar uchun umumiy props
  const navbarProps = {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignUpOpen: setSignupOpen,
    setLoginOpen,
    anchorEl,
    handleLogOutClick,
    handleCloseLogout,
    handleLogoutRequest,
  };

  return (
    <>
      {location.pathname === "/"
        ? <HomeNavbar {...navbarProps} />
        : <OtherNavbar {...navbarProps} />}

      <Switch>
        <Route path="/products">
          <ProductsPage onAdd={onAdd} />
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
        <Route path="/">
          {/* ← onAdd HomePage ga uzatildi */}
          <HomePage onAdd={onAdd} />
        </Route>
      </Switch>

      <Footer />
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </>
  );
}

export default App;
