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
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";

/** REDUX SELECTOR */
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

  // HANDLERS
  const finishOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      
      const input: OrderUpdateInput = {
        orderId: orderId, 
        orderStatus: OrderStatus.FINISH
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);

        // => finished orders tabiga o'tkazish
        setValue("3");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"2"}>
      <Stack>
        {processOrders?.map((order: Order) => {
          return (
            <Box key={`${order._id}`} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {order?.orderItems?.map((item: OrederItem) => {
                  const product: Product | undefined = order.productData.find(
                    (ele: Product) => item.productId === ele._id
                  );
                  const imagePath = `${serverApi}/${product?.productImages?.[0]}`;
                  return (
                    <Box key={`${item._id}`} className={"orders-name-price"}>
                      <img src={imagePath} className={"order-dish-img"} alt="dish" />
                      <p className={"title-dish"}>{product?.productName || "Product"}</p>
                      <Box className={"price-box"}>
                        <p>{item.itemPrice}</p>
                        <img src={"/icons/close.svg"} alt="close" />
                        <p>{item.itemQuantity}</p>
                        <img src={"/icons/pause.svg"} alt="pause" />
                        <p style={{ marginLeft: "15px" }}>
                          {(item.itemQuantity * item.itemPrice).toFixed(2)}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p>${(order.orderTotal - order.orderDelivery).toFixed(2)}</p>
                  <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="plus" />
                  <p>Delivery cost</p>
                  <p>${order.orderDelivery}</p>
                  <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} alt="total" />
                  <p>Total</p>
                  <p>${order.orderTotal.toFixed(2)}</p>
                </Box>
                <p className={"data-compl"}>
                  {moment(order.updatedAt).format("YY-MM-DD HH:mm")}
                </p>
                <Button
                  variant="contained"
                  className={"verify-button"}
                  // Argument sifatida ID ni yuboramiz
                  onClick={() => finishOrderHandler(String(order._id))}
                >
                  Verify to Fulfil
                </Button>
              </Box>
            </Box>
          );
        })}

        {(!processOrders || processOrders.length === 0) && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img src={"/icons/noimage-list.svg"} style={{ width: 300, height: 300 }} alt="no-data" />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}