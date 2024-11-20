export enum OrderStatus {
    RECEIVED = 'RECEIVED',           // Sipariş alındı
    PREPARING = 'PREPARING',         // Hazırlanıyor
    READY = 'READY',                // Hazır
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', // Yolda
    DELIVERED = 'DELIVERED',         // Teslim edildi
    CANCELLED = 'CANCELLED'          // İptal edildi
}

export const OrderStatusMessages = {
    [OrderStatus.RECEIVED]: 'Siparişiniz alındı',
    [OrderStatus.PREPARING]: 'Siparişiniz hazırlanıyor',
    [OrderStatus.READY]: 'Siparişiniz hazır',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Siparişiniz yolda',
    [OrderStatus.DELIVERED]: 'Siparişiniz teslim edildi',
    [OrderStatus.CANCELLED]: 'Siparişiniz iptal edildi'
};
