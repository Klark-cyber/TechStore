import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { retriveProcessOrders } from "./selector";
import { Order, OrderUpdateInput, OrederItem } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobals";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const BLUE = "#2979FF";
const BORDER = "rgba(41,121,255,0.15)";

const processOrdersRetriever = createSelector(
  retriveProcessOrders,
  (processOrders) => ({ processOrders })
);

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);

  const finishOrderHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.currentTarget.dataset.id;
      const input: OrderUpdateInput = { orderId, orderStatus: OrderStatus.FINISH };
      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="2" sx={{ p: 3 }}>
      <Stack spacing={2}>

        {processOrders?.map((order: Order) => (
          <Box key={(order._id as unknown) as string} className="order-main-box" sx={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            overflow: "hidden",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "rgba(41,121,255,0.4)" },
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
                      sx={{ width: 64, height: 64, borderRadius: "10px",
                        objectFit: "cover", background: "#111827", flexShrink: 0 }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Box className="title-dish" sx={{
                        fontSize: 14, fontWeight: 600, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5,
                      }}>
                        {product?.productName}
                      </Box>
                      <Stack direction="row" alignItems="center" gap={1}>
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

            {/* Total + Button */}
            <Box className="total-price-box" sx={{
              px: 2, py: 2,
              background: "rgba(41,121,255,0.04)",
              borderTop: `1px solid ${BORDER}`,
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" gap={3}>
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Subtotal</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                      ${order.orderTotal - order.orderDelivery}
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ fontSize: 11, color: "rgba(255,255,255,0.35)", mb: 0.3 }}>Shipping</Box>
                    <Box sx={{ fontSize: 14, fontWeight: 600,
                      color: order.orderDelivery === 0 ? "#22c55e" : "#fff" }}>
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

                <Stack direction="row" alignItems="center" gap={2}>
                  <Box className="data-compl" sx={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                    {moment().format("YY-MM-DD HH:mm")}
                  </Box>
                  <Button
                    variant="contained"
                    className="verify-button"
                    data-id={(order._id as unknown) as string}
                    onClick={finishOrderHandler}
                    startIcon={<CheckCircleOutlineIcon />}
                    sx={{
                      background: "#22c55e", color: "#fff",
                      textTransform: "none", borderRadius: "8px",
                      fontSize: 13, fontWeight: 600,
                      "&:hover": { background: "#16a34a" },
                    }}
                  >
                    Verify to Fulfil
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        ))}

        {(!processOrders || processOrders.length === 0) && (
          <Stack alignItems="center" justifyContent="center" py={6}>
            <img src="/icons/noimage-list.svg" style={{ width: 120, height: 120, opacity: 0.3 }} />
            <Box sx={{ mt: 2, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>
              No orders in progress
            </Box>
          </Stack>
        )}
      </Stack>
    </TabPanel>
  );
}