import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { Messages, serverApi } from "../../../lib/config";
import { retrivePausedOrders } from "./selector";
import { Order, OrderUpdateInput, OrederItem } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";


/** REDUX SLICE & SELECTOR */

//Storega slice orqali yuklangan datani chaqirib olamiz
const pausedOrdersRetriever = createSelector(
  retrivePausedOrders, 
  (pausedOrders) => ({pausedOrders}))

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const {setValue} = props;
    const {authMember, setOrderBuilder} = useGlobals();
    const {pausedOrders} = useSelector(pausedOrdersRetriever) 

    // HANDLERS 

  const deleteOrderHandler = async (e:T) => {
    try{
      if(!authMember) throw new Error(Messages.error2)//user login bolganini tekshiramiz,
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId, 
        orderStatus: OrderStatus.DELETE}
      const confirmation = window.confirm("Do you want to delete order?")//aniq ochirmoqchimisz deb sorash mantigi
      if(confirmation){
        const order = new OrderService();
        await order.updateOrder(input);

        //ORDER REBUILD order rebuild qilinishi kerak
        setOrderBuilder(new Date());
      }
    }catch(err) {
      console.log(err)
      sweetErrorHandling(err).then();
    }
  }

const processOrderHandler = async (e:T) => {
    try{
      if(!authMember) throw new Error(Messages.error2)//user login bolganini tekshiramiz,
      //PaymentProcess
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId, 
        orderStatus: OrderStatus.PROCESS}
      const confirmation = window.confirm("Do you want to proceed payment?")//aniq ochirmoqchimisz deb sorash mantigi
      if(confirmation){
        const order = new OrderService();
        await order.updateOrder(input);

        // => process order
        setValue("2");
        setOrderBuilder(new Date());
      }
    }catch(err) {
      console.log(err)
      sweetErrorHandling(err).then();
    }
  }

  return (
    <TabPanel value="1">
      <Stack>
        
        {pausedOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}> {/**Stack ichidagi orderga tegishli malumotni korsatuvchi box */}
                  <Box className={"order-box-scroll"}>
                      {order?.orderItems?.map((item: OrederItem) => { {/**order bu array shu array ichida orderItems mavjud boladi */}
                          console.log("imagerrrr:", pausedOrders)
                          const product: Product = order.productData.filter((ele:Product) => item.productId === ele._id)[0];
                          const imagePath = `${serverApi}/${product?.productImages?.[0]}`
                          return (
                              <Box key={item._id} className={"orders-name-price"}>

                                  <img
                                      src={imagePath} alt=""
                                      className={"order-dish-img"}
                                       />
                                  <p className={"title-dish"}>{product?.productName}</p>
                                  <Box className={"price-box"}>
                                      <p>{item.itemPrice}</p>
                                      <img src={"/icons/close.svg"} />
                                      <p>{item.itemQuantity}</p>
                                      <img src={"/icons/pause.svg"} />
                                      <p style={{ marginLeft: "15px" }}>{item.itemQuantity*item.itemPrice}</p>
                                  </Box>
                              </Box>
                          );
                      })}
                  </Box>

              <Box className={"total-price-box"}>
                      <Box className={"box-total"}>
                          <p>Product price</p>
                          <p>${order.orderTotal - order.orderDelivery}</p>
                          <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
                          <p>Delivery cost</p>
                          <p>${order.orderDelivery}</p>
                          <img
                              src={"/icons/pause.svg"}
                              style={{ marginLeft: "20px" }} 
                              />
                          <p>Total</p>
                          <p>${order.orderTotal}</p>
                      </Box>
                      <Button 
                      value={order._id} //qaysi orderga tegishli cancel bosilganligini order ichidagi id orqali deleteOrderHandler ga path qilamiz
                      variant="contained" 
                      color="secondary"
                      className={"cancel-button"}
                      onClick={deleteOrderHandler}
                      >
                          Cancel
                      </Button>
                      <Button 
                      variant="contained" 
                      className="pay-button" 
                      value={order._id} 
                      onClick={processOrderHandler}>
                      Payment
                      </Button>
                  </Box>
      </Box>
    );
  })}

  {!pausedOrders || (pausedOrders.length === 0) && (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
      <img
        src={"/icons/noimage-list.svg"}
        style={{ width: 300, height: 300 }}
      />
      </Box>
  )}
  </Stack>
  </TabPanel>
  );
}