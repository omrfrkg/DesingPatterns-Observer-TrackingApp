import { IOrderObserver } from '../interfaces/OrderObserver';
import { OrderStatus, OrderStatusMessages } from '../types/OrderStatus';

export class CustomerNotifier implements IOrderObserver {
    private customerId: string;
    private notifications: { orderId: string; message: string; timestamp: Date }[] = [];

    constructor(customerId: string) {
        this.customerId = customerId;
    }

    update(orderId: string, status: OrderStatus): void {
        const message = OrderStatusMessages[status];
        const notification = {
            orderId,
            message,
            timestamp: new Date()
        };
        
        this.notifications.push(notification);
        this.showNotification(notification);
    }

    private showNotification(notification: { orderId: string; message: string; timestamp: Date }): void {
        // Gerçek uygulamada push notification veya alert gösterilecek
        console.log(`[Müşteri ${this.customerId}] - Sipariş #${notification.orderId}: ${notification.message}`);
    }

    getNotifications(): { orderId: string; message: string; timestamp: Date }[] {
        return [...this.notifications];
    }
}
