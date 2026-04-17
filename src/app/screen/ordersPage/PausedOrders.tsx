import React from "react";
import { Box, Stack, Chip } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { retrivePausedOrders } from "./selector";
import { Order, OrderUpdateInput, OrederItem } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PaymentIcon from "@mui/icons-material/Payment";

const BLUE = "#2979FF";
const BORDER = "rgba(41,121,255,0.15)";

const pausedOrdersRetriever = createSelector(
  retrivePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  const deleteOrderHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.currentTarget.dataset.id;
      const input: OrderUpdateInput = { orderId, orderStatus: OrderStatus.DELETE };
      const confirmation = window.confirm("Do you want to delete order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.currentTarget.dataset.id;
      const input: OrderUpdateInput = { orderId, orderStatus: OrderStatus.PROCESS };
      const confirmation = window.confirm("Do you want to proceed payment?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="1" sx={{ p: 3 }}>
      <Stack spacing={2}>

        {pausedOrders?.map((order: Order) => (
          <Box key={(order._id as unknown) as string} className="order-main-box" sx={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            overflow: "hidden",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: `rgba(41,121,255,0.4)` },
          }}>
            {/* Cart Items */}
            <Box className="order-box-scroll" sx={{ p: 2 }}>
              {order?.orderItems?.map((item: OrederItem) => {
                const product: Product = order.productData.filter(
                  (ele: Product) => item.productId === ele._id
                )[0];
                const imagePath = `${serverApi}/${product?.productImages?.[0]}`;
                return (
                  <Stack key={(item._id as unknown) as string} className="orders-name-price"
                    direction="row" alignItems="center" gap={2}
                    sx={{ py: 1.5, borderBottom: `1px solid rgba(255,255,255,0.05)`,
                      "&:last-child": { borderBottom: "none" } }}>
                    <Box
                      component="img"
                      src={imagePath}
                      className="order-dish-img"
                      sx={{ width: 64, height: 64, borderRadius: "10px", objectFit: "cover",
                        background: "#111827", flexShrink: 0 }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Box className="title-dish" sx={{
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5,
                      }}>
                        {product?.productName}
                      </Box>
                      <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                        <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                          ${item.itemPrice}
                        </Box>
                        <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>×</Box>
                        <Box sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                          {item.itemQuantity}
                        </Box>
                        <Box sx={{ fontSize: 13, fontWeight: 700, color: BLUE, ml: "auto" }}>
                          ${item.itemQuantity * item.itemPrice}
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                );
              })}
            </Box>

            {/* Total + Buttons */}
            <Box className="total-price-box" sx={{
              px: 2, py: 2,
              background: "rgba(41,121,255,0.04)",
              borderTop: `1px solid ${BORDER}`,
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" gap={3}>
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Subtotal</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                      ${order.orderTotal - order.orderDelivery}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Shipping</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 600, color: order.orderDelivery === 0 ? "#22c55e" : "#fff" }}>
                      {order.orderDelivery === 0 ? "FREE" : `$${order.orderDelivery}`}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Total</Box>
                    <Box sx={{ fontSize: 16, fontWeight: 800, color: BLUE }}>
                      ${order.orderTotal}
                    </Box>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction="row" gap={1.5} justifyContent="flex-end">
                <Button
                  data-id={(order._id as unknown) as string}
                  variant="outlined"
                  className="cancel-button"
                  onClick={deleteOrderHandler}
                  startIcon={<DeleteOutlineIcon />}
                  sx={{
                    borderColor: "rgba(239,68,68,0.4)",
                    color: "#ef4444", textTransform: "none",
                    borderRadius: "8px", fontSize: 13, fontWeight: 600,
                    "&:hover": { borderColor: "#ef4444", background: "rgba(239,68,68,0.08)" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  data-id={(order._id as unknown) as string}
                  variant="contained"
                  className="pay-button"
                  onClick={processOrderHandler}
                  startIcon={<PaymentIcon />}
                  sx={{
                    background: BLUE, color: "#fff",
                    textTransform: "none", borderRadius: "8px",
                    fontSize: 13, fontWeight: 600,
                    "&:hover": { background: "#1565c0" },
                  }}
                >
                  Proceed to Shipping
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}

        {(!pausedOrders || pausedOrders.length === 0) && (
          <Stack alignItems="center" justifyContent="center" py={6}>
            <img src="/icons/noimage-list.svg" style={{ width: 120, height: 120, opacity: 0.3 }} />
            <Box sx={{ mt: 2, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>
              No paused orders
            </Box>
          </Stack>
        )}
      </Stack>
    </TabPanel>
  );
}