import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router"; // Utilizado para navegação programática
import styled from "styled-components/native"; // Estilização dos componentes
import { SafeAreaView } from "react-native-safe-area-context"; // Garante que o conteúdo fique visível em telas com notch

// Container principal da tela
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
`;

// Card visual para destacar o formulário
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

// Título do formulário
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

// Campo de entrada para digitar a descrição da tarefa
const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 20px;
  min-height: 100px; // Altura mínima para parecer uma área de texto
`;

// Botão de envio
const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

// Texto dentro do botão
const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function NewTask() {
  // Estado local para armazenar o conteúdo digitado
  const [title, setTitle] = useState("");

  // URL da API, com fallback local
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  // Função responsável por enviar a nova tarefa para o backend
  const createTask = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title, // Envia apenas o título para a criação
        }),
      });

      // Comentado: poderia ser usado para validar o sucesso do envio
      // if (!response.ok) {
      //   throw new Error("Erro ao buscar a tarefa");
      // }

      const taskData = await response.json();

      // Atualiza o estado local com o que veio da API (opcional aqui)
      setTitle(taskData);

      // Volta para a tela anterior (lista de tarefas)
      router.back();
    } catch (error: any) {
      console.error("Erro ao carregar a tarefa:", error.message);
      Alert.alert("Erro", "Não foi possível criar a tarefa.");
    }
  };

  return (
    <Container edges={["bottom"]}>
      <Card>
        <Title>Nova Tarefa</Title>

        {/* Campo de texto para inserir a descrição da tarefa */}
        <Input
          placeholder="Descrição da tarefa"
          value={title}
          onChangeText={setTitle}
          multiline
          textAlignVertical="top" // Faz o texto começar do topo do input
        />

        {/* Botão para salvar a tarefa */}
        <Button onPress={createTask}>
          <ButtonText>Criar Tarefa</ButtonText>
        </Button>
      </Card>
    </Container>
  );
}
