import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const foundTask = tasks.find((t: Task) => t.id === id);
        setTask(foundTask || null);
      }
    } catch (error) {
      console.error("Error loading task:", error);
    }
  };

  const deleteTask = async () => {
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
              const storedTasks = await AsyncStorage.getItem("tasks");
              if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                const updatedTasks = tasks.filter((t: Task) => t.id !== id);
                await AsyncStorage.setItem(
                  "tasks",
                  JSON.stringify(updatedTasks)
                );
                router.back();
              }
            } catch (error) {
              console.error("Error deleting task:", error);
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
    <Container>
      <Card>
        <Title>Detalhes da Tarefa</Title>
        <Description>{task.description}</Description>
        <DateText>
          Criada em: {new Date(task.createdAt).toLocaleString("pt-BR")}
        </DateText>
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
          <Button variant="danger" onPress={deleteTask}>
            <Ionicons name="trash" size={20} color="white" />
            <ButtonText>Excluir</ButtonText>
          </Button>
        </ButtonsContainer>
      </Card>
    </Container>
  );
}
