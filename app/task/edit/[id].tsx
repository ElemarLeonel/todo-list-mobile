import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [description, setDescription] = useState("");
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
        if (foundTask) {
          setTask(foundTask);
          setDescription(foundTask.description);
        }
      }
    } catch (error) {
      console.error("Error loading task:", error);
    }
  };

  const updateTask = async () => {
    if (!description.trim() || !task) {
      return;
    }

    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t: Task) =>
          t.id === id ? { ...t, description: description.trim() } : t
        );
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        router.back();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <Container>
      <Card>
        <Title>Editar Tarefa</Title>
        <Input
          placeholder="Descrição da tarefa"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Button onPress={updateTask}>
          <ButtonText>Salvar Alterações</ButtonText>
        </Button>
      </Card>
    </Container>
  );
}
