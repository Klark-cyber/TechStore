import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { retriveFinishedOrders } from "./selector";
import { Order, OrederItem } from "../../../lib/types/order";

/** REDUX SELECTOR */
const finishedOrdersRetriever = createSelector(
  retriveFinishedOrders, 
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value={"3"}>
      <Stack>
        {finishedOrders?.map((order: Order) => (
          <Box key={`${order._id}`} className={"order-main-box"}>
            <Box className={"order-box-scroll"}>
              {order?.orderItems?.map((item: OrederItem) => {
                // Mahsulotni topish mantig'ini xavfsizroq qilish
                const product: Product | undefined = order.productData?.find(
                  (ele: Product) => item.productId === ele._id
                );
                
                const imagePath = product?.productImages?.[0] 
                  ? `${serverApi}/${product.productImages[0]}` 
                  : "/icons/default-product.svg"; // Default rasm

                return (
                  <Box key={`${order._id}`} className={"orders-name-price"}>
                    <img
                      src={imagePath}
                      alt={product?.productName || "Product"}
                      className={"order-dish-img"}
                    />
                    <p className={"title-dish"}>{product?.productName || "Unknown Product"}</p>
                    <Box className={"price-box"}>
                      <p>${item.itemPrice}</p>
                      <img src={"/icons/close.svg"} alt="close" />
                      <p>{item.itemQuantity}</p>
                      <img src={"/icons/pause.svg"} alt="pause" />
                      <p style={{ marginLeft: "15px" }}>
                        ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                      </p>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box className={"total-price-box"}>
              <Box className={"box-total"}>
                <p>Product price</p>
                <p>${(order.orderTotal - (order.orderDelivery || 0)).toFixed(2)}</p>
                <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="plus" />
                <p>Delivery cost</p>
                <p>${order.orderDelivery}</p>
                <img
                  src={"/icons/pause.svg"}
                  style={{ marginLeft: "20px" }} 
                  alt="total"
                />
                <p>Total</p>
                <p>${order.orderTotal}</p>
              </Box>
            </Box>
          </Box>
        ))}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} sx={{ mt: 4 }}>
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
              alt="No orders"
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}