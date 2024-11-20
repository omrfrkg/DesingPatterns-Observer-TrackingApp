import { OrderStatus } from '../types/OrderStatus';

export interface IOrderItem {
    name: string;
    price: number;
    quantity: number;
}

export class Order {
    id: string;
    items: IOrderItem[];
    totalPrice: number;
    status: OrderStatus;
    customerName: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        customerName: string,
        address: string,
        items: IOrderItem[]
    ) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.items = items;
        this.totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.status = OrderStatus.RECEIVED;
        this.customerName = customerName;
        this.address = address;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateStatus(status: OrderStatus): void {
        this.status = status;
        this.updatedAt = new Date();
    }
}
