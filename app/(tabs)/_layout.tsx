import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#007AFF",
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Concluídas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
