import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Task } from "../(tabs)";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Card = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.Text`
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
`;

const DateText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const StatusText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-left: 10px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity<{ variant?: "danger" }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.variant === "danger" ? "#FF3B30" : "#007AFF"};
  flex: 0.48;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  margin-left: 8px;
`;

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar a tarefa");
      }

      const taskData = await response.json();
      setTask(taskData);
    } catch (error) {
      console.error("Erro ao carregar a tarefa:", error);
    }
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/todos/${id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                throw new Error("Erro ao excluir a tarefa.");
              }

              Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
              router.back();
            } catch (error) {
              console.error("Erro ao excluir a tarefa:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          },
        },
      ]
    );
  };

  if (!task) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{ title: `Editando: ${task?.title || "Carregando..."}` }}
      />
      <Container>
        <Card>
          <Title>Detalhes da Tarefa</Title>
          <Description>{task.title}</Description>
          <StatusContainer>
            <Ionicons
              name={task.completed ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={task.completed ? "#4CAF50" : "#666"}
            />
            <StatusText>
              {task.completed ? "Tarefa concluída" : "Tarefa pendente"}
            </StatusText>
          </StatusContainer>
          <ButtonsContainer>
            <Button onPress={() => router.push(`/task/edit/${task.id}`)}>
              <Ionicons name="create" size={20} color="white" />
              <ButtonText>Editar</ButtonText>
            </Button>
            <Button variant="danger" onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash" size={20} color="white" />
              <ButtonText>Excluir</ButtonText>
            </Button>
          </ButtonsContainer>
        </Card>
      </Container>
    </>
  );
}
