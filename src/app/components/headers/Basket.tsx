import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import "../../../css/basket.css";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onDelete, onDeleteAll, onRemove } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();

  const itemsPrice: number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(2);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);
      const order = new OrderService();
      await order.createOrder(cartItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src={"/icons/shopping-cart.svg"} alt="cart" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            background: "transparent",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "#0d1020",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className={"basket-frame"}>

          {/* ── Header ── */}
          <Box className={"all-check-box"}>
            {cartItems.length === 0 ? (
              <span>Cart is empty</span>
            ) : (
              <Stack direction="row" alignItems="center" gap={0.5}>
                <span>Cart ({cartItems.length})</span>
                <DeleteForeverIcon
                  sx={{ ml: "4px", fontSize: 20, cursor: "pointer", color: "rgba(239,68,68,0.7)",
                    "&:hover": { color: "#ef4444" } }}
                  onClick={() => onDeleteAll()}
                />
              </Stack>
            )}
          </Box>

          {/* ── Items ── */}
          <Box className={"orders-main-wrapper"}>
            {cartItems.length === 0 ? (
              <Box className="basket-empty">
                <ShoppingCartIcon sx={{ fontSize: 40, opacity: 0.2 }} />
                <span>No items in cart</span>
              </Box>
            ) : (
              <Box className={"orders-wrapper"}>
                {cartItems.map((item: CartItem) => {
                  const imagePath = `${serverApi}/${item.image}`;
                  return (
                    <Box className={"basket-info-box"} key={item._id}>
                      {/* Delete item */}
                      <div className={"cancel-btn"}>
                        <CancelIcon
                          sx={{ fontSize: 18 }}
                          onClick={() => onDelete(item)}
                        />
                      </div>

                      {/* Image */}
                      <img
                        src={imagePath}
                        className={"product-img"}
                        alt={item.name}
                      />

                      {/* Info */}
                      <Box flex={1} minWidth={0}>
                        <span className={"product-name"}>{item.name}</span>
                        <p className={"product-price"}>
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </Box>

                      {/* Quantity controls */}
                      <div className="col-2">
                        <button className="remove" onClick={() => onRemove(item)}>
                          −
                        </button>
                        <button className="add" onClick={() => onAdd(item)}>
                          +
                        </button>
                      </div>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* ── Footer: total + order ── */}
          {cartItems.length > 0 && (
            <Box className={"basket-order"}>
              <Stack gap={0.2}>
                <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  {shippingCost === 0 ? "🚚 Free shipping" : `+ $${shippingCost} shipping`}
                </Box>
                <span className={"price"}>Total: ${totalPrice}</span>
              </Stack>
              <Button
                onClick={proceedOrderHandler}
                startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                variant={"contained"}
                sx={{
                  background: "#2979ff",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  px: 2,
                  "&:hover": { background: "#1565c0" },
                }}
              >
                Order
              </Button>
            </Box>
          )}
        </Stack>
      </Menu>
    </Box>
  );
}