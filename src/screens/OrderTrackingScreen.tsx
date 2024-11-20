import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { OrderManager } from '../services/OrderManager';
import { OrderStatus, OrderStatusMessages } from '../types/OrderStatus';
import { Order } from '../models/Order';

/**
 * Sipariş Takip Ekranı
 * 
 * Bu ekran, kullanıcının tüm siparişlerini listeler ve her siparişin durumunu gösterir.
 * 
 * @returns Sipariş Takip Ekranı bileşeni
 */
export const OrderTrackingScreen: React.FC = () => {
    // State tanımlamaları
    const [orders, setOrders] = useState<Order[]>([]); // Tüm siparişlerin listesi
    const [refreshing, setRefreshing] = useState(false); // Yenileme durumu

    // Singleton pattern ile OrderManager instance'ı
    const orderManager = OrderManager.getInstance();

    /**
     * Siparişleri yükleme fonksiyonu
     * 
     * Bu fonksiyon, OrderManager'dan tüm siparişleri yükler ve state'e günceller.
     */
    const loadOrders = () => {
        const allOrders = orderManager.getAllOrders();
        setOrders(allOrders);
    };

    /**
     * Aşağı çekerek yenileme fonksiyonu
     * 
     * Bu fonksiyon, yenileme durumunu true yapar, siparişleri yükler ve yenileme durumunu false yapar.
     */
    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
        setRefreshing(false);
    };

    // Component mount olduğunda ve belirli aralıklarla siparişleri güncelle
    useEffect(() => {
        loadOrders();
        // Her 5 saniyede bir siparişleri güncelle
        const interval = setInterval(loadOrders, 5000);
        // Component unmount olduğunda interval'i temizle
        return () => clearInterval(interval);
    }, []);

    /**
     * Sipariş durumuna göre renk belirleme fonksiyonu
     * 
     * Bu fonksiyon, sipariş durumuna göre bir renk döndürür.
     * 
     * @param status Sipariş durumu
     * @returns Sipariş durumuna göre renk
     */
    const getStatusColor = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.RECEIVED:
                return '#007AFF'; // Mavi - Sipariş Alındı
            case OrderStatus.PREPARING:
                return '#FF9500'; // Turuncu - Hazırlanıyor
            case OrderStatus.READY:
                return '#32C759'; // Yeşil - Hazır
            case OrderStatus.OUT_FOR_DELIVERY:
                return '#5856D6'; // Mor - Yolda
            case OrderStatus.DELIVERED:
                return '#34C759'; // Yeşil - Teslim Edildi
            default:
                return '#8E8E93'; // Gri - Diğer durumlar
        }
    };

    /**
     * Tarih formatlama fonksiyonu
     * 
     * Bu fonksiyon, bir tarih nesnesini formatlar ve string olarak döndürür.
     * 
     * @param date Tarih nesnesi
     * @returns Formatlanmış tarih stringi
     */
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.title}>Siparişlerim</Text>
            
            {/* Sipariş yoksa boş durum mesajı */}
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Henüz sipariş bulunmuyor.</Text>
                </View>
            ) : (
                // Siparişleri listele
                orders.map(order => (
                    <View key={order.id} style={styles.orderCard}>
                        {/* Sipariş başlığı */}
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderId}>Sipariş #{order.id}</Text>
                            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                        </View>

                        {/* Müşteri bilgileri */}
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{order.customerName}</Text>
                            <Text style={styles.address}>{order.address}</Text>
                        </View>

                        {/* Sipariş öğeleri listesi */}
                        <View style={styles.itemsContainer}>
                            {order.items.map((item, index) => (
                                <View key={index} style={styles.orderItem}>
                                    <Text style={styles.itemName}>
                                        {item.name} x{item.quantity}
                                    </Text>
                                    <Text style={styles.itemPrice}>
                                        {item.price * item.quantity}₺
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Toplam tutar */}
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Toplam:</Text>
                            <Text style={styles.totalAmount}>{order.totalPrice}₺</Text>
                        </View>

                        {/* Sipariş durumu ve son güncelleme */}
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(order.status) }
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {OrderStatusMessages[order.status]}
                                </Text>
                            </View>
                            <Text style={styles.lastUpdate}>
                                Son güncelleme: {formatDate(order.updatedAt)}
                            </Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

// Stil tanımlamaları
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
        marginTop: 50 // StatusBar için üst boşluk
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
    },
    customerInfo: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    itemsContainer: {
        marginBottom: 12,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemName: {
        fontSize: 15,
        color: '#333',
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statusContainer: {
        marginTop: 12,
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    lastUpdate: {
        fontSize: 12,
        color: '#666',
    },
});
