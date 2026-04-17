import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { retriveFinishedOrders } from "./selector";
import { Order, OrederItem } from "../../../lib/types/order";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const BLUE = "#2979FF";
const BORDER = "rgba(41,121,255,0.15)";

const finishedOrdersRetriever = createSelector(
  retriveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value="3" sx={{ p: 3 }}>
      <Stack spacing={2}>

        {finishedOrders?.map((order: Order) => (
          <Box key={(order._id as unknown) as string} className="order-main-box" sx={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid rgba(34,197,94,0.2)`,
            borderRadius: "12px",
            overflow: "hidden",
          }}>
            {/* Finished badge */}
            <Stack direction="row" alignItems="center" gap={1} sx={{
              px: 2, py: 1.2,
              background: "rgba(34,197,94,0.08)",
              borderBottom: `1px solid rgba(34,197,94,0.15)`,
            }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e" }} />
              <Box sx={{ fontSize: 12, fontWeight: 600, color: "#22c55e", letterSpacing: 0.5 }}>
                DELIVERED
              </Box>
            </Stack>

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

            {/* Total */}
            <Box className="total-price-box" sx={{
              px: 2, py: 2,
              background: "rgba(34,197,94,0.04)",
              borderTop: `1px solid rgba(34,197,94,0.15)`,
            }}>
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
            </Box>
          </Box>
        ))}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Stack alignItems="center" justifyContent="center" py={6}>
            <img src="/icons/noimage-list.svg" style={{ width: 120, height: 120, opacity: 0.3 }} />
            <Box sx={{ mt: 2, fontSize: 14, color: "rgba(255,255,255,0.25)" }}>
              No finished orders
            </Box>
          </Stack>
        )}
      </Stack>
    </TabPanel>
  );
}