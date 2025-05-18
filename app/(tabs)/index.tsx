import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const Container = styled(SafeAreaView)`
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

const TaskText = styled.Text<{ completed: boolean }>`
  flex: 1;
  font-size: 16px;
  color: ${(props) => (props.completed ? "#888" : "#000")};
  text-decoration-line: ${(props) =>
    props.completed ? "line-through" : "none"};
`;

const AddButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #007aff;
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
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

export default function TaskList() {
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar as tarefas:", error);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar a tarefa");

      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem onPress={() => router.push(`/task/${item.id}`)}>
      <TouchableOpacity
        onPress={() => toggleTask(item.id)}
        style={{ padding: 8 }}
      >
        <MaterialIcons
          name={item.completed ? "check-circle" : "radio-button-unchecked"}
          size={24}
          color={item.completed ? "#4CAF50" : "#666"}
        />
      </TouchableOpacity>
      <TaskText completed={item.completed}>{item.title}</TaskText>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TaskItem>
  );

  return (
    <Container edges={["bottom"]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <EmptyState>
            <MaterialIcons name="list-alt" size={48} color="#666" />
            <EmptyStateText>
              Nenhuma tarefa encontrada{"\n"}Adicione uma nova tarefa!
            </EmptyStateText>
          </EmptyState>
        )}
      />
      <AddButton onPress={() => router.push("/task/new")}>
        <MaterialIcons name="add" size={30} color="white" />
      </AddButton>
    </Container>
  );
}
