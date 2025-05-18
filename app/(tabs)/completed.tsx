import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Task } from "./index";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

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

const TaskText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: #888;
  text-decoration-line: line-through;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyStateText = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

export default function CompletedTasks() {
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/todos/completed`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar as tarefas completas:", error);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem onPress={() => router.push(`/task/${item.id}`)}>
      <Ionicons
        name="checkmark-circle"
        size={24}
        color="#4CAF50"
        style={{ marginRight: 8 }}
      />
      <TaskText>{item.title}</TaskText>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TaskItem>
  );

  return (
    <Container>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
