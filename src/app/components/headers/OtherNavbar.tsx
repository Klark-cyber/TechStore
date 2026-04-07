import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface OtherNavbarProps {
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

export default function OtherNavbar(props: OtherNavbarProps) { //HomePage uchun Homenavbar mantigi
    const {cartItems, onAdd,onDelete,onDeleteAll,onRemove, setLoginOpen, setSignUpOpen, handleLogOutClick, anchorEl, handleCloseLogout, handleLogoutRequest} = props;
    const {authMember} = useGlobals();
    
    return <div className="other-navbar"> 
        <Container className="navbar-container" >
            <Stack className="menu">  {/*Navbar linklarigaga tegishli stack.Menu qism uchun*/}
                <Box> {/*Burak logosiga tegishli box */}
                    <NavLink to="/"> {/*imgga Navlink mUI orqali link biriktiramiz */}
                        <img className="brand-logo" src="/icons/burak.svg" /> {/*Burak Logo.img html elementiligi sababli material UI elementlarini qollay olmaymiz va sx emas style deb yozdik */}
                    </NavLink>
                </Box>

            <Stack className="links"> {/*menu elementlari uchun stack */}
                <Box className={"hover-line"}>
                    <NavLink to="/" >Home</NavLink>
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
                />
                {!authMember ? (
                    <Box>
                            <Button variant="contained" className="login-button" onClick={() => setLoginOpen(true)} >Login</Button> {/* style orniga sx yozish ham mumkin */}
                    </Box>
                ) : (
                <img className="user-avatar" src={authMember?.memberImage ? `${serverApi}/${authMember?.memberImage}` : "/icons/default-user.svg"} aria-haspopup={"true"} onClick={handleLogOutClick}/> // useGlobals ichidagi authMemberdan memberImageni qabul qilib oldik
                )} {/**Agar member login bolmagan bolsa unga login menuni ham korsatish */}
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

        </Container>
        </div>; 
}