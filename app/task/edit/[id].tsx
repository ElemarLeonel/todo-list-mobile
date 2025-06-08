// Hooks do React e uso de parâmetros da URL com expo-router
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

// Estilização com styled-components
import styled from "styled-components/native";

// Tipo Task reutilizado da tela de tarefas
import { Task } from "../../(tabs)";

// === COMPONENTES ESTILIZADOS ===

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

// === COMPONENTE PRINCIPAL ===

export default function EditTask() {
  const { id } = useLocalSearchParams(); // Captura o ID da URL dinâmica

  const [title, setTitle] = useState(""); // Armazena o novo título da tarefa
  const [tasks, setTasks] = useState<Task[]>([]); // Lista de tarefas (não está sendo usada corretamente)
  const [task, setTask] = useState<Task | null>(null); // Armazena a tarefa a ser editada

  const API_URL = process.env.API_URL || "http://192.168.1.7:3000";

  // Carrega a tarefa ao montar o componente
  useEffect(() => {
    loadTask();
  }, [id]);

  // Função para buscar os dados da tarefa
  const loadTask = async () => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar a tarefa");
      }

      const taskData = await response.json();
      setTask(taskData);         // Armazena no estado
      setTitle(taskData.title);  // Preenche o campo de edição
    } catch (error) {
      console.error("Erro ao carregar a tarefa:", error);
    }
  };

  // Função para enviar as alterações para a API
  const updateTask = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,                 // Usa o novo título
          completed: task?.completed || false, // Mantém o status atual
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar a tarefa");

      // Se quiser, pode redirecionar para outra tela
      // router.back();
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  };

  // Se os dados ainda não carregaram, não renderiza a tela
  if (!task) {
    return null;
  }

  return (
    <>
      <Container>
        <Card>
          <Title>Editar Tarefa</Title>

          {/* Campo de edição do título */}
          <Input
            placeholder="Descrição da tarefa"
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Botão para salvar a alteração */}
          <Button onPress={updateTask}>
            <ButtonText>Salvar Alterações</ButtonText>
          </Button>
        </Card>
      </Container>
    </>
  );
}
