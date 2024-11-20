import { IOrderObserver, IOrderSubject } from '../interfaces/OrderObserver';
import { Order, IOrderItem } from '../models/Order';
import { OrderStatus } from '../types/OrderStatus';

export class OrderManager implements IOrderSubject {
    private static instance: OrderManager;
    private observers: IOrderObserver[] = []; // Gözlemci listesi
    private orders: Map<string, Order> = new Map(); // Siparişler listesi

    private constructor() {}

    public static getInstance(): OrderManager {
        if (!OrderManager.instance) {
            OrderManager.instance = new OrderManager();
        }
        return OrderManager.instance;
    }

    // Observer Pattern metodları
    
    /**
     * Yeni bir gözlemci (observer) ekler
     * 
     * Bu metod, yeni bir müşteri bildirimi almak istediğinde çağrılır.
     * Örneğin: Bir müşteri sipariş oluşturduğunda, siparişini takip etmek için
     * CustomerNotifier'ı observers listesine ekleriz.
     * 
     * @param observer Eklenecek gözlemci (örn: CustomerNotifier)
     */
    attach(observer: IOrderObserver): void {
        // Aynı observer'ı tekrar eklememek için kontrol
        const isExist = this.observers.includes(observer);
        if (!isExist) {
            this.observers.push(observer);
            console.log('Yeni gözlemci eklendi:', observer);
        }
    }

    /**
     * Bir gözlemciyi (observer) listeden çıkarır
     * 
     * Bu metod, bir müşteri artık bildirim almak istemediğinde çağrılır.
     * Örneğin: Sipariş tamamlandığında veya müşteri uygulamadan çıktığında
     * CustomerNotifier'ı observers listesinden çıkarırız.
     * 
     * @param observer Çıkarılacak gözlemci (örn: CustomerNotifier)
     */
    detach(observer: IOrderObserver): void {
        // Observer'ı listeden bul ve çıkar
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
            this.observers.splice(observerIndex, 1);
            console.log('Gözlemci çıkarıldı:', observer);
        }
    }

    /**
     * Tüm gözlemcilere bildirim gönderir
     * 
     * Bu metod, bir siparişin durumu değiştiğinde çağrılır.
     * Örneğin: Sipariş durumu "Hazırlanıyor"dan "Yolda"ya değiştiğinde,
     * tüm ilgili gözlemcilere (CustomerNotifier'lara) haber verilir.
     * 
     * @param orderId Durumu değişen siparişin ID'si
     * @param status Siparişin yeni durumu
     */
    notify(orderId: string, status: OrderStatus): void {
        // Her bir observer'ın update metodunu çağır
        for (const observer of this.observers) {
            observer.update(orderId, status);
            console.log(`Bildirim gönderildi - Sipariş: ${orderId}, Durum: ${status}`);
        }
    }

    // Sipariş yönetim metodları
    createOrder(customerName: string, address: string, items: IOrderItem[]): Order {
        const order = new Order(customerName, address, items);
        this.orders.set(order.id, order);
        this.notify(order.id, order.status);
        return order;
    }

    updateOrderStatus(orderId: string, status: OrderStatus): void {
        const order = this.orders.get(orderId);
        if (order) {
            order.updateStatus(status);
            this.notify(orderId, status);
        }
    }

    getOrder(orderId: string): Order | undefined {
        return this.orders.get(orderId);
    }

    getAllOrders(): Order[] {
        return Array.from(this.orders.values());
    }

    // Sipariş simülasyonu
    simulateOrderProcess(orderId: string): void {
        const statusSequence = [
            OrderStatus.RECEIVED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED
        ];

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < statusSequence.length) {
                this.updateOrderStatus(orderId, statusSequence[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 3000); // Her 3 saniyede bir durum güncellemesi
    }
}
