import { OrderStatus } from '../types/OrderStatus';

// Observer (Gözlemci) arayüzü
export interface IOrderObserver {
    update(orderId: string, status: OrderStatus): void;
}

// Subject (Gözlenen) arayüzü
export interface IOrderSubject {
    attach(observer: IOrderObserver): void;
    detach(observer: IOrderObserver): void;
    notify(orderId: string, status: OrderStatus): void;
}
