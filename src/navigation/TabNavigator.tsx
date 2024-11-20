import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CreateOrderScreen } from '../screens/CreateOrderScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'CreateOrder') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'OrderTracking') {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen 
                name="CreateOrder" 
                component={CreateOrderScreen} 
                options={{
                    title: 'Yeni Sipariş',
                    headerShown: false
                }}
            />
            <Tab.Screen 
                name="OrderTracking" 
                component={OrderTrackingScreen} 
                options={{
                    title: 'Siparişlerim',
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};
