import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import PlanScreen from "./src/screens/PlanScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import StoreScreen from "./src/screens/StoreScreen";
import ChatScreen from "./src/screens/ChatScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen name="Plan" component={PlanScreen} />
          <Tab.Screen name="Progreso" component={ProgressScreen} />
          <Tab.Screen name="Calendario" component={CalendarScreen} />
          <Tab.Screen name="Tienda" component={StoreScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}