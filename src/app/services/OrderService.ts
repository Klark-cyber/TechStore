import { serverApi } from "../../lib/config";
import axios from "axios";
import { CartItem } from "../../lib/types/search";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../../lib/types/order";

class OrderService {
    private readonly path: string;

    constructor(){
        this.path = serverApi
    }

public async createOrder(input: CartItem[]): Promise<Order>{ //backenddagi createOrder orqali yangi order hosil qilamiz
    try{
      const orderItems: OrderItemInput[] = input.map((cartItem: CartItem) => {
    return { 
        itemQuantity: cartItem.quantity,
        itemPrice: cartItem.price,
        // productId string bo'lgani uchun, uni kutilayotgan turga (ObjectId) 
        // majburan o'tkazish uchun 'as any' ishlatamiz
        productId: cartItem._id as any, 
    };
});
        const url = this.path + "/order/create";
        const result = await axios.post(url, orderItems, {withCredentials: true} );
        console.log("createOrder:", result)
        return result.data 
    }catch(err){
      console.log("Error, createOrder:", err)
      throw err;
    }
}


public async getMyOrders(input: OrderInquiry): Promise<Order[]>{ //backenddagi createOrder orqali yangi order hosil qilamiz
    try{
       // axios.defaults.withCredentials = true; == withCredentials: true
       const url = `${this.path}/order/all`
       const query = `?page=${input.page}&limit=${input.limit}&orderStatus=${input.orderStatus}`

       const result = await axios.get(url + query, {withCredentials: true})
        console.log("getMyOrders:", result)
        return result.data
    }catch(err){
      console.log("Error, createOrder:", err)
      throw err;
    }
}

public async updateOrder(input: OrderUpdateInput): Promise<Order>{ //backenddagi createOrder orqali yangi order hosil qilamiz
    try{
       // axios.defaults.withCredentials = true; == withCredentials: true
    const url = `${this.path}/order/update`;
    const result = await axios.post(url , input, {withCredentials: true})
    console.log(":", result)
    return result.data;
}catch(err){
      console.log("Error, updateOrder:", err)
      throw err;
    }
}

}

export default OrderService;