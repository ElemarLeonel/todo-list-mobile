import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../(tabs)";
import { SafeAreaView } from "react-native-safe-area-context";

const Container = styled(SafeAreaView)`
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
  min-height: 100px;
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

export default function NewTask() {
  const [description, setDescription] = useState("");

  const createTask = async () => {
    if (!description.trim()) {
      Alert.alert("Erro", "Por favor, insira uma descrição para a tarefa.");
      return;
    }

    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      const newTask: Task = {
        id: Date.now().toString(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      router.back();
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Erro", "Não foi possível criar a tarefa.");
    }
  };

  return (
    <Container edges={["bottom"]}>
      <Card>
        <Title>Nova Tarefa</Title>
        <Input
          placeholder="Descrição da tarefa"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
        <Button onPress={createTask}>
          <ButtonText>Criar Tarefa</ButtonText>
        </Button>
      </Card>
    </Container>
  );
}
