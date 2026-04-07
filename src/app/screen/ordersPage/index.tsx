import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";


/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),  //setPopulraDishes comanda nomi bolib uni setPopularDishes reducer orqali hosil qilib oldik, dispatch ichida esa setPopularDishes reducerimiz.comanda va reducer nomlarini bir xil nomlab oldik
  setProcessOrders: (data:Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data))
});


export default function OrdersPage() {
  const {setPausedOrders, setProcessOrders, setFinishedOrders} = actionDispatch(useDispatch());
  const {authMember,orderBuilder} = useGlobals();
  const [value, setValue] = useState("1");
  const history = useHistory();
  const [orderInquery, setOrderInquery] = useState<OrderInquiry>({ //
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  })
  useEffect(() => { //
    const order = new OrderService();

    order
    .getMyOrders({...orderInquery, orderStatus: OrderStatus.PAUSE})
    .then(data => setPausedOrders(data)) //setPausedOrders backenddan kelgan datani redux storega yukladik
    .catch((err) => {
      console.log(err)
    })

    order
    .getMyOrders({...orderInquery, orderStatus: OrderStatus.PROCESS})
    .then(data => setProcessOrders(data)) //setPausedOrders backenddan kelgan datani redux storega yukladik
    .catch((err) => {
      console.log(err)
    })

    order
    .getMyOrders({...orderInquery, orderStatus: OrderStatus.FINISH})
    .then(data => setFinishedOrders(data)) //setPausedOrders backenddan kelgan datani redux storega yukladik
    .catch((err) => {
      console.log(err)
    })
  },[orderInquery, orderBuilder]) //orderBuilder ichidagi Date yangilanganda barcha orderslarni yangilaymiz.
/** HANDLERS */

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

if(!authMember) history.push("/")

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left"> {/**Chap tomondagi nav qismi,hamda tabga tegishli boxlarni oz ichiga olgan stack */}
          <TabContext value={value} >
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider"}}> {/**Tabsga tegishli */}
                {/* nav qismidagi mui orqali ornatilgan tablar */}
                <Tabs 
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className="table_list"
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROGRESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
              </Box>
              <Stack className={"order-main-content" } > {/** navbga tegishli orderslar haqidagi malumotni korsatuvchi stack */}
          <PausedOrders setValue={setValue}/>
          <ProcessOrders setValue={setValue}/>
          <FinishedOrders />
        </Stack>
      </TabContext>
    </Stack>

    <Stack className={"order-right"} > {/**ong tomondagi user haqidagi alumot va karta haqidagi malumotni oz ichiga olgan stack flex-deriction column */}
      <Box className={"order-info-box"}> {/**user haqidagi malumotni oz ichiga olgan box */}
        <Box className={"member-box"}> {/**Userning ismi va rasmini oz ichiga olgan box */}
          <div className={"order-user-img"}> {/**user rasmiga tegishli div */}
            <img
              src={
                authMember?.memberImage 
                ? `${serverApi}/${authMember.memberImage}` 
                : "/icons/default-user.svg"
              }
              className={"order-user-avatar"} /> {/**user rasmi ichidagi user rasmi */}
              <div className={"order-user-icon-box"} > {/**rasm ichidagi iconga tegishli div */}
                <img 
                src={authMember?.memberType === MemberType.RESTAURANT ? "/icons/restaurant.svg" : "/icons/user-badge.svg"}
                className={"order-user-prof-img"} />{/**iconga tegishli div ichidagi icon */}
                </div>
              </div>
            <span className={"order-user-name"}>{authMember?.memberNick}</span> {/**userga tegishli stack ichidagi user ismi */}
        <span className={"order-user-prof"}>{authMember?.memberType}</span> {/**user maqomi */}
      </Box>
      <Box className={"liner"}></Box> {/**User adresini oz ichiga olgan box */}

      <Box className={"order-user-address"}>
        <div style={{ display: "flex" }}>
          <LocationOnIcon /></div>
        <div className="spec-address-txt">{authMember?.memberAddres ? authMember.memberAddres : "No Addres"}</div>
      
      </Box>
      
      </Box>

      <Box className="order-info-box">
      <input type="text" name="cardNumber" placeholder="Card number : 5243 4090 2002 7495" className="card-input"/> 
      <Stack sx={{display:"flex", flexDirection:"row", justifyContent:"space-between" }}>
      <input type="text" name="cardPeriod" placeholder="07 / 24"    className="card-half-input"/> 
      <input type="text" name="cardCVV" placeholder="CVV : 010"    className="card-half-input"/> 
      </Stack>
      
     <input type="text" name="cardCreator" placeholder="Justin Robertson" className="card-input"/>  
      <Box className="cards-box">
      <img src="/icons/western-card.svg"/> 
      <img src="/icons/master-card.svg"/> 
      <img src="/icons/paypal-card.svg"/> 
      <img src="/icons/visa-card.svg"/>  
      </Box>
     
      </Box>
      </Stack>
      </Container>
      </div>
  )
}

