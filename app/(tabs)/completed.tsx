import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Task } from "./index"; // Importa o tipo Task da tela principal de tarefas (index.tsx)

// Container principal da tela
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

// Estilo do item de tarefa (cartão clicável)
const TaskItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: white;
  margin: 8px 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

// Texto da tarefa (riscado para indicar conclusão)
const TaskText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: #888;
  text-decoration-line: line-through;
`;

// Componente exibido quando não há tarefas concluídas
const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// Texto do estado vazio
const EmptyStateText = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

export default function CompletedTasks() {
  // Define a URL base da API (com fallback local)
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  // Estado para controlar o "puxar para atualizar"
  const [refreshing, setRefreshing] = useState(false);

  // Estado para armazenar as tarefas concluídas
  const [tasks, setTasks] = useState<Task[]>([]);

  // Função que carrega as tarefas concluídas da API
  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/todos/completed`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar as tarefas completas:", error);
    }
  }, []);

  // Função chamada ao fazer pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Garante um delay mínimo de 1s para UX
  };

  // Carrega as tarefas assim que a tela é montada
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem onPress={() => router.push(`/task/${item.id}`)}>
      {/* Ícone indicando tarefa concluída */}
      <Ionicons
        name="checkmark-circle"
        size={24}
        color="#4CAF50"
        style={{ marginRight: 8 }}
      />
      {/* Título da tarefa riscado */}
      <TaskText>{item.title}</TaskText>
      {/* Ícone de seta indicando que pode navegar */}
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TaskItem>
  );

  return (
    <Container>
      <FlatList
        // Componente de atualização por arraste
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={tasks} // Dados da lista (tarefas concluídas)
        renderItem={renderItem} // Como renderizar cada item
        keyExtractor={(item) => item.id} // Chave única por item
        // Componente exibido se a lista estiver vazia
        ListEmptyComponent={() => (
          <EmptyState>
            <Ionicons name="checkmark-circle" size={48} color="#666" />
            <EmptyStateText>Nenhuma tarefa concluída</EmptyStateText>
          </EmptyState>
        )}
      />
    </Container>
  );
}
