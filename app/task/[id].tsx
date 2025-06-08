// Hooks e funcionalidades do React/React Native
import { useEffect, useState } from "react";
import { Alert } from "react-native";

// Expo Router para rotas e navegação dinâmica
import { router, useLocalSearchParams, Stack } from "expo-router";

// Ícones da biblioteca Ionicons
import { Ionicons } from "@expo/vector-icons";

// Estilização com styled-components
import styled from "styled-components/native";

// Interface da tarefa reutilizada da tela principal
import { Task } from "../(tabs)";

// === COMPONENTES ESTILIZADOS ===

// Container geral da tela
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
`;

// Cartão onde os detalhes da tarefa são apresentados
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

// Título principal do cartão
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

// Descrição da tarefa (neste caso, o próprio título)
const Description = styled.Text`
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
`;

// Data de criação (pode ser utilizado futuramente)
const DateText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

// Container do status com ícone e texto
const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

// Texto do status da tarefa (concluída ou não)
const StatusText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-left: 10px;
`;

// Agrupamento dos botões de ação (editar e excluir)
const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

// Estilização dos botões (azul e vermelho dependendo do tipo)
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

// Texto dentro dos botões
const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  margin-left: 8px;
`;

// === COMPONENTE PRINCIPAL ===

export default function TaskDetails() {
  // Captura o ID da tarefa diretamente da URL dinâmica [id]
  const { id } = useLocalSearchParams();

  // Estado local para armazenar os dados da tarefa
  const [task, setTask] = useState<Task | null>(null);

  // URL da API com fallback local
  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  // Carrega os dados da tarefa assim que o ID mudar
  useEffect(() => {
    loadTask();
  }, [id]);

  // Função assíncrona para buscar os detalhes da tarefa
  const loadTask = async () => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar a tarefa");
      }

      const taskData = await response.json();
      setTask(taskData); // Atualiza o estado
    } catch (error) {
      console.error("Erro ao carregar a tarefa:", error);
    }
  };

  // Função para excluir a tarefa com confirmação
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
              router.back(); // Volta para a lista após excluir
            } catch (error) {
              console.error("Erro ao excluir a tarefa:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          },
        },
      ]
    );
  };

  // Se ainda não carregou os dados da tarefa, não renderiza nada
  if (!task) {
    return null;
  }

  return (
    <>
      {/* Define o título do cabeçalho dinamicamente com base na tarefa */}
      <Stack.Screen
        options={{ title: `Editando: ${task?.title || "Carregando..."}` }}
      />
      <Container>
        <Card>
          <Title>Detalhes da Tarefa</Title>

          {/* Exibe o conteúdo da tarefa */}
          <Description>{task.title}</Description>

          {/* Exibe o status (com ícone verde se concluída) */}
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

          {/* Botões de ação: Editar e Excluir */}
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
