import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { retrivePausedOrders } from "./selector";
import { Order, OrderUpdateInput, OrederItem } from "../../../lib/types/order";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

/** REDUX SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrivePausedOrders, 
  (pausedOrders) => ({pausedOrders})
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  // HANDLERS 
  
  // Endi argument sifatida string orderId qabul qiladi
  const deleteOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      
      const input: OrderUpdateInput = {
        orderId: orderId, 
        orderStatus: OrderStatus.DELETE
      };

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

  const processOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      
      const input: OrderUpdateInput = {
        orderId: orderId, 
        orderStatus: OrderStatus.PROCESS
      };

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
    <TabPanel value="1">
      <Stack>
        {pausedOrders?.map((order: Order) => (
          <Box key={`${order._id}`} className={"order-main-box"}>
            <Box className={"order-box-scroll"}>
              {order?.orderItems?.map((item: OrederItem) => {
                const product: Product | undefined = order.productData.find(
                  (ele: Product) => item.productId === ele._id
                );
                const imagePath = `${serverApi}/${product?.productImages?.[0]}`;
                return (
                  <Box key={`${item._id}`} className={"orders-name-price"}>
                    <img src={imagePath} alt="" className={"order-dish-img"} />
                    <p className={"title-dish"}>{product?.productName}</p>
                    <Box className={"price-box"}>
                      <p>{item.itemPrice}</p>
                      <img src={"/icons/close.svg"} alt="close" />
                      <p>{item.itemQuantity}</p>
                      <img src={"/icons/pause.svg"} alt="pause" />
                      <p style={{ marginLeft: "15px" }}>{item.itemQuantity * item.itemPrice}</p>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box className={"total-price-box"}>
              <Box className={"box-total"}>
                <p>Product price</p>
                <p>${order.orderTotal - order.orderDelivery}</p>
                <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="plus" />
                <p>Delivery cost</p>
                <p>${order.orderDelivery}</p>
                <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} alt="pause" />
                <p>Total</p>
                <p>${order.orderTotal}</p>
              </Box>
              
              {/* Buttonlardan value olib tashlandi, onClick o'zgartirildi */}
              <Button 
                variant="contained" 
                color="secondary"
                className={"cancel-button"}
                onClick={() => deleteOrderHandler(String(order._id))}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                className="pay-button" 
                onClick={() => processOrderHandler(String(order._id))}
              >
                Payment
              </Button>
            </Box>
          </Box>
        ))}

        {(!pausedOrders || pausedOrders.length === 0) && (
          <Box display={"flex"} justifyContent={"center"}>
            <img src={"/icons/noimage-list.svg"} style={{ width: 300, height: 300 }} alt="no-data" />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}