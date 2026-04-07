import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItemInput { //Postman orqali kirib kelgan req.body
    itemQuantity: number;
    itemPrice: number;
    productId: string;
    orderId?: string;   //frontenddan kelmaydi ozimiz hosil qilamiz.Shu saabli optional qilib belgiladik
}

export interface Order { //schemadan kelgan return Prommise
    _id: string;
    orderTotal: number;
    orderDelivery: number;
    orderStatus: OrderStatus;  //enum
    memberId: string;
    createdAt: Date;
    updatedAt: Date;
    // from aggregations
    orderItems: OrederItem[];
    productData: Product[];
}

export interface OrederItem { 
    _id: string;
    itemQuantity: number;
    itemPrice: number;
    orderId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderInquiry {
    page: number;
    limit: number;
    orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
    orderId: string;
    orderStatus: OrderStatus;
}