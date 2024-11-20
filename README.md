# 🍕 Sipariş Takip Uygulaması (Observer Pattern)

Bu proje, Observer Pattern kullanılarak geliştirilmiş bir React Native sipariş takip uygulamasıdır. Müşteriler sipariş oluşturabilir ve siparişlerinin durumunu gerçek zamanlı olarak takip edebilirler.

## 🚀 Özellikler

- 📱 React Native & Expo ile geliştirilmiş modern UI
- 🔄 Observer Pattern ile gerçek zamanlı sipariş takibi
- 💫 Otomatik durum güncellemeleri
- 📋 Dinamik ürün seçimi ve sipariş oluşturma
- 🔔 Müşteri bildirim sistemi

## 🏗️ Proje Yapısı

```
src/
├── interfaces/
│   └── OrderObserver.ts     # Observer Pattern arayüzleri
├── models/
│   └── Order.ts            # Sipariş veri modeli
├── services/
│   ├── OrderManager.ts     # Merkezi sipariş yönetimi (Subject)
│   └── CustomerNotifier.ts # Müşteri bildirimleri (Observer)
├── screens/
│   ├── CreateOrderScreen.tsx    # Sipariş oluşturma ekranı
│   └── OrderTrackingScreen.tsx  # Sipariş takip ekranı
└── navigation/
    └── TabNavigator.tsx    # Alt tab navigasyonu
```

## 🎯 Observer Pattern Implementasyonu

### OrderManager (Subject)
- Singleton pattern ile tek instance
- Observer'ları yönetir (attach/detach)
- Sipariş durumu değiştiğinde observer'ları bilgilendirir (notify)

```typescript
// Örnek Kullanım
const orderManager = OrderManager.getInstance();
orderManager.attach(new CustomerNotifier("Müşteri Adı"));
orderManager.notify(orderId, OrderStatus.PREPARING);
```

### CustomerNotifier (Observer)
- Sipariş durumu değişikliklerini takip eder
- Müşteriye özel bildirimler oluşturur
- update() metodu ile güncellemeleri alır

## 📱 Ekranlar

### Sipariş Oluşturma Ekranı
- Ürün seçimi
- Miktar belirleme
- Müşteri bilgileri girişi
- Toplam fiyat hesaplama
- Sipariş onaylama

### Sipariş Takip Ekranı
- Tüm siparişlerin listesi
- Gerçek zamanlı durum güncellemeleri
- Renkli durum göstergeleri
- Detaylı sipariş bilgileri
- Pull-to-refresh özelliği

## 📦 Bağımlılıklar

- React Native
- Expo
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-safe-area-context
- @expo/vector-icons

## 🎨 Tasarım Kalıpları

1. **Observer Pattern**
   - Gerçek zamanlı sipariş takibi
   - Müşteri bildirimleri
   - Durum güncellemeleri

2. **Singleton Pattern**
   - OrderManager için tek instance
   - Merkezi sipariş yönetimi


## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 İletişim

Ömer Faruk Gündoğdu - [GitHub](https://github.com/omrfrkg)

