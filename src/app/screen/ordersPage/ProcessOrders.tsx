import { Box, Stack, Button } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { retriveProcessOrders } from "./selector"; // selector'dan to'g'ri ma'lumotni olamiz
import { Order, OrederItem } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import moment from "moment";

/** SELECTOR */
const processOrdersRetriever = createSelector(
  retriveProcessOrders,
  (processOrders) => ({ processOrders })
);

export default function ProcessOrders(props: any) {
  const { setValue } = props;
  const { setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);

  const finishOrderHandler = async (orderId: string) => {
    try {
      if (!window.confirm("Buyurtmani qabul qilib oldingizmi?")) return;

      const order = new OrderService();
      await order.updateOrder({ 
        orderId: orderId, 
        orderStatus: OrderStatus.FINISH 
      });
      
      setValue("3"); // Finished tabiga o'tkazish
      setOrderBuilder(new Date());
    } catch (err) {
      console.log("Error on finishOrderHandler:", err);
    }
  };

  return (
    <TabPanel value="2" sx={{ p: 0 }}>
      <Stack spacing={4}>
        {processOrders?.map((order: Order) => (
          <div key={order._id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-surface-variant/20 shadow-sm">
            {/* Order Header */}
            <div className="p-6 border-b border-surface-variant/10 flex justify-between items-center bg-primary/5">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-secondary uppercase tracking-widest">Order Date</span>
                <span className="text-sm font-bold">{moment(order.createdAt).format("DD.MM.YYYY HH:mm")}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-xs text-secondary uppercase tracking-widest block">Total Amount</span>
                <span className="font-headline font-extrabold text-xl text-primary">${order.orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="divide-y divide-surface-variant/10 px-6">
              {order.orderItems.map((item: OrederItem) => {
                const product = order.productData.find(p => p._id === item.productId);
                return (
                  <div key={item._id} className="py-6 flex gap-6 items-center">
                    <img 
                      src={`${serverApi}/${product?.productImages[0]}`} 
                      className="w-20 h-20 rounded-xl object-cover border border-surface-variant/30 p-1 bg-white" 
                      alt={product?.productName}
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{product?.productName}</h3>
                      <p className="text-secondary text-sm">Unit Price: ${item.itemPrice} | Qty: {item.itemQuantity}</p>
                    </div>
                    <div className="font-bold text-lg text-on-surface">${(item.itemQuantity * item.itemPrice).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            {/* Order Footer Actions */}
            <div className="p-6 bg-surface-container-low flex justify-between items-center">
              <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span className="text-xs font-bold uppercase tracking-tighter">In Delivery Process</span>
              </div>
              <Button 
                onClick={() => finishOrderHandler(order._id)}
                variant="contained"
                className="kinetic-gradient rounded-xl px-10 py-2 font-extrabold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Verify Receipt
              </Button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(!processOrders || processOrders.length === 0) && (
          <div className="text-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4 text-secondary">moped</span>
            <p className="font-bold uppercase tracking-widest text-secondary">No orders in process</p>
          </div>
        )}
      </Stack>
    </TabPanel>
  );
}