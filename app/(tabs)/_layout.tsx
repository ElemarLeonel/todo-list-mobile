// Importa o componente Tabs do expo-router para criar uma navegação com abas
import { Tabs } from "expo-router";

// Importa os ícones do Material Icons, parte da biblioteca de ícones do Expo
import { MaterialIcons } from "@expo/vector-icons";

// Função principal que define o layout da navegação por abas
export default function TabLayout() {
  return (
    // Componente Tabs fornece a estrutura para navegação por abas
    <Tabs
      screenOptions={{
        headerShown: true, // Exibe o cabeçalho padrão em cada tela
        tabBarActiveTintColor: "#007AFF", // Cor do ícone/label da aba ativa
        tabBarStyle: {
          elevation: 0,           // Remove sombra no Android
          shadowOpacity: 0,       // Remove sombra no iOS
          borderTopWidth: 1,      // Adiciona borda superior para separar a barra de abas
          borderTopColor: "#e5e5e5", // Cor da borda superior
        },
      }}
    >
      {/* Primeira aba: index.tsx (rota raiz dentro da pasta (tabs)) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Tarefas", // Título exibido no cabeçalho e na aba
          tabBarIcon: ({ color, size }) => (
            // Ícone da aba (ícone de lista)
            <MaterialIcons name="list" size={size} color={color} />
          ),
        }}
      />

      {/* Segunda aba: completed.tsx (rota para tarefas concluídas) */}
      <Tabs.Screen
        name="completed"
        options={{
          title: "Concluídas", // Título exibido no cabeçalho e na aba
          tabBarIcon: ({ color, size }) => (
            // Ícone da aba (ícone de check)
            <MaterialIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
