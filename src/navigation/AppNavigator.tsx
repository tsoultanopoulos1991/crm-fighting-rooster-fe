import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import MembersScreen from '../screens/MembersScreen';
import AddMemberScreen from '../screens/AddMemberScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack για Members (με AddMember)
const MembersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MembersList"
        component={MembersScreen}
        options={{ title: 'Μέλη' }}
      />
      <Stack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ title: 'Νέο Μέλος' }}
      />
      <Stack.Screen
        name="MemberDetails"
        component={MembersScreen}
        options={{ title: 'Λεπτομέρειες Μέλους' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

            if (route.name === 'Dashboard') {
              iconName = 'view-dashboard';
            } else if (route.name === 'Members') {
              iconName = 'account-group';
            } else if (route.name === 'Subscriptions') {
              iconName = 'calendar-month';
            } else if (route.name === 'Payments') {
              iconName = 'cash-register';
            } else if (route.name === 'Announcements') {
              iconName = 'bullhorn';
            } else if (route.name === 'Notifications') {
              iconName = 'bell';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          },
          tabBarLabelStyle: {
            fontSize: 11
          }
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Αρχική' }}
        />
        <Tab.Screen
          name="Members"
          component={MembersStack}
          options={{ headerShown: false, title: 'Μέλη' }}
        />
        <Tab.Screen
          name="Subscriptions"
          component={SubscriptionsScreen}
          options={{ title: 'Συνδρομές' }}
        />
        <Tab.Screen
          name="Payments"
          component={PaymentsScreen}
          options={{ title: 'Πληρωμές' }}
        />
        <Tab.Screen
          name="Announcements"
          component={AnnouncementsScreen}
          options={{ title: 'Ανακοινώσεις' }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: 'Ειδοποιήσεις' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
