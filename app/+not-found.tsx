// Importa componentes básicos do React Native para estrutura e estilos da tela
import { View, StyleSheet } from "react-native";

// Importa o componente Stack (para definir configurações do cabeçalho da tela)
// e o Link (para navegação entre rotas) do Expo Router
import { Link, Stack } from "expo-router";

// Função que define a tela de "Not Found", exibida quando uma rota inválida é acessada
export default function NotFoundScreen() {
  return (
    <>
      {/* Define as configurações da tela atual no Stack Navigator */}
      <Stack.Screen options={{ title: "Oops! Not Found" }} />

      {/* Container principal da tela */}
      <View style={styles.container}>
        {/* Componente Link do expo-router que funciona como um botão de navegação.
            Neste caso, leva o usuário de volta à rota raiz ("/"), ou seja, a Home */}
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a altura da tela
    backgroundColor: "#25292e", // Cor de fundo escura
    justifyContent: "center", // Centraliza verticalmente o conteúdo
    alignItems: "center", // Centraliza horizontalmente o conteúdo
  },

  button: {
    fontSize: 20, // Tamanho da fonte do texto
    textDecorationLine: "underline", // Sublinha o texto como um link tradicional
    color: "#fff", // Cor branca para o texto
  },
});
