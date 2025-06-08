import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router } from "expo-router"; // Navegação com Expo Router
import { MaterialIcons } from "@expo/vector-icons"; // Ícones do Material Design
import styled from "styled-components/native"; // Estilização usando styled-components
import { SafeAreaView } from "react-native-safe-area-context"; // Garante que o conteúdo fique dentro da área segura

// Interface que define a estrutura de uma tarefa
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// Container principal da tela
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
`;

// Estilo do item da lista de tarefas
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

// Estilo do texto da tarefa, com linha quando estiver concluída
const TaskText = styled.Text<{ completed: boolean }>`
  flex: 1;
  font-size: 16px;
  color: ${(props) => (props.completed ? "#888" : "#000")};
  text-decoration-line: ${(props) =>
    props.completed ? "line-through" : "none"};
`;

// Botão flutuante de adicionar nova tarefa
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

// Componente exibido quando a lista está vazia
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
  // Define a URL da API (com fallback local)
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  // Estado das tarefas carregadas
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado de controle do refresh pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar todas as tarefas
  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTasks(data); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error("Erro ao carregar as tarefas:", error);
    }
  }, []);

  // Carrega as tarefas ao iniciar a tela
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Alterna o status de concluído da tarefa
  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed, // Inverte o status atual
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar a tarefa");

      const updatedTask = await response.json();
      // Atualiza a tarefa no estado
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Erro ao finalizar a tarefa:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
    }
  };

  // Puxa para atualizar a lista
  const handleRefresh = () => {
    setRefreshing(true);
    loadTasks();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Delay para melhor experiência visual
  };

  // Renderiza cada item da lista de tarefas
  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem onPress={() => router.push(`/task/${item.id}`)}>
      {/* Botão de check para marcar como concluído */}
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
      {/* Título da tarefa com estilo condicional */}
      <TaskText completed={item.completed}>{item.title}</TaskText>
      {/* Ícone indicando que o item é navegável */}
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TaskItem>
  );

  return (
    <Container edges={["bottom"]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={tasks} // Lista de dados
        renderItem={renderItem} // Função de renderização dos itens
        keyExtractor={(item) => item.id.toString()} // Chave única
        ListEmptyComponent={() => (
          <EmptyState>
            <MaterialIcons name="list-alt" size={48} color="#666" />
            <EmptyStateText>
              Nenhuma tarefa encontrada{"\n"}Adicione uma nova tarefa!
            </EmptyStateText>
          </EmptyState>
        )}
      />
      {/* Botão flutuante para adicionar uma nova tarefa */}
      <AddButton onPress={() => router.push("/task/new")}>
        <MaterialIcons name="add" size={30} color="white" />
      </AddButton>
    </Container>
  );
}
