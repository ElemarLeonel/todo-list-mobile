import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { Task } from "../../(tabs)";

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

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
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
      setTitle(taskData.title);
    } catch (error) {
      console.error("Erro ao carregar a tarefa:", error);
    }
  };

  const updateTask = async () => {
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
    }
  };

  if (!task) {
    return null;
  }

  return (
    <>
      <Container>
        <Card>
          <Title>Editar Tarefa</Title>
          <Input
            placeholder="Descrição da tarefa"
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Button onPress={updateTask}>
            <ButtonText>Salvar Alterações</ButtonText>
          </Button>
        </Card>
      </Container>
    </>
  );
}
