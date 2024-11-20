import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { OrderManager } from '../services/OrderManager';
import { CustomerNotifier } from '../services/CustomerNotifier';
import { IOrderItem } from '../models/Order';
import { StatusBar } from 'expo-status-bar';

// Örnek ürün listesi - Uygulama için sabit ürün verileri
const SAMPLE_PRODUCTS = [
    { id: '1', name: 'Pizza Margherita', price: 100 },
    { id: '2', name: 'Cheeseburger', price: 80 },
    { id: '3', name: 'Sezar Salata', price: 60 },
    { id: '4', name: 'Cola', price: 15 },
    { id: '5', name: 'Fanta', price: 20 },
];

export const CreateOrderScreen: React.FC = () => {
    // State tanımlamaları
    const [customerName, setCustomerName] = useState(''); // Müşteri adı
    const [address, setAddress] = useState(''); // Teslimat adresi
    const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map()); // Seçili ürünler ve miktarları

    // Singleton pattern ile OrderManager instance'ı
    const orderManager = OrderManager.getInstance();

    // Ürün miktarını artırma fonksiyonu
    const addToOrder = (productId: string) => {
        const currentQuantity = selectedItems.get(productId) || 0;
        setSelectedItems(new Map(selectedItems.set(productId, currentQuantity + 1)));
    };

    // Ürün miktarını azaltma fonksiyonu
    const removeFromOrder = (productId: string) => {
        const currentQuantity = selectedItems.get(productId) || 0;
        if (currentQuantity > 0) {
            setSelectedItems(new Map(selectedItems.set(productId, currentQuantity - 1)));
        }
    };

    // Belirli bir ürünün miktarını getirme fonksiyonu
    const getQuantity = (productId: string): number => {
        return selectedItems.get(productId) || 0;
    };

    // Toplam sipariş tutarını hesaplama fonksiyonu
    const calculateTotal = (): number => {
        let total = 0;
        selectedItems.forEach((quantity, productId) => {
            const product = SAMPLE_PRODUCTS.find(p => p.id === productId);
            if (product) {
                total += product.price * quantity;
            }
        });
        return total;
    };

    // Sipariş oluşturma fonksiyonu
    const createOrder = () => {
        // Form validasyonu
        if (!customerName.trim() || !address.trim()) {
            Alert.alert('Hata', 'Lütfen müşteri adı ve adres bilgilerini doldurun.');
            return;
        }

        if (selectedItems.size === 0 || Array.from(selectedItems.values()).every(q => q === 0)) {
            Alert.alert('Hata', 'Lütfen en az bir ürün seçin.');
            return;
        }

        // Seçili ürünleri sipariş formatına dönüştürme
        const orderItems: IOrderItem[] = [];
        selectedItems.forEach((quantity, productId) => {
            if (quantity > 0) {
                const product = SAMPLE_PRODUCTS.find(p => p.id === productId);
                if (product) {
                    orderItems.push({
                        name: product.name,
                        price: product.price,
                        quantity: quantity
                    });
                }
            }
        });

        // Observer Pattern: Müşteri için bildirim servisi oluşturma
        const customerNotifier = new CustomerNotifier(customerName);
        orderManager.attach(customerNotifier);

        // Siparişi oluşturma ve simülasyonu başlatma
        const order = orderManager.createOrder(customerName, address, orderItems);
        orderManager.simulateOrderProcess(order.id);

        // Başarılı sipariş bildirimi ve form temizleme
        Alert.alert(
            'Başarılı',
            `Siparişiniz oluşturuldu! Sipariş ID: ${order.id}`,
            [
                {
                    text: 'Tamam',
                    onPress: () => {
                        setCustomerName('');
                        setAddress('');
                        setSelectedItems(new Map());
                    }
                }
            ]
        );
    };

    return (
        <>
            <StatusBar style='dark' />
            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Yeni Sipariş</Text>

                    {/* Müşteri bilgileri formu */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Müşteri Adı:</Text>
                        <TextInput
                            style={styles.input}
                            value={customerName}
                            onChangeText={setCustomerName}
                            placeholder="Müşteri adını girin" />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Adres:</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Teslimat adresini girin"
                            multiline />
                    </View>

                    {/* Ürün listesi */}
                    <Text style={styles.sectionTitle}>Ürünler</Text>
                    {SAMPLE_PRODUCTS.map(product => (
                        <View key={product.id} style={styles.productItem}>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>{product.price}₺</Text>
                            </View>
                            {/* Ürün miktar kontrolleri */}
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => removeFromOrder(product.id)}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{getQuantity(product.id)}</Text>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => addToOrder(product.id)}
                                >
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Toplam tutar ve sipariş butonu */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Toplam:</Text>
                        <Text style={styles.totalAmount}>{calculateTotal()}₺</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={createOrder}
                    >
                        <Text style={styles.createButtonText}>Sipariş Oluştur</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

// Stil tanımlamaları
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: 50, // StatusBar için üst boşluk
    },
    formContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 12,
        color: '#333',
    },
    productItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#007AFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantity: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: '500',
        minWidth: 20,
        textAlign: 'center',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    createButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    createButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
