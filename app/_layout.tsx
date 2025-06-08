// Importa o componente Stack do Expo Router, que permite criar navegação no estilo pilha (Stack Navigation)
import { Stack } from "expo-router";

// Função principal que define o layout raiz da aplicação.
// Por convenção, o arquivo se chama `_layout.tsx` e é carregado automaticamente pelo Expo Router.
export default function RootLayout() {
  return (
    // Stack é o contêiner que encapsula as telas da aplicação em um navegador tipo "pilha".
    <Stack>

      {/* 
        A primeira tela registrada é a pasta "(tabs)", que geralmente contém um sistema de navegação por abas (Bottom Tabs).
        O nome "name='(tabs)'" indica que existe uma pasta chamada "(tabs)" dentro do diretório `app/`.
        O `headerShown: false` oculta o cabeçalho padrão do Stack para as telas dentro dessa navegação.
      */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 
        Essa tela especial `+not-found` é usada para lidar com rotas não encontradas (404).
        O Expo Router exibe esta tela quando a pessoa tenta acessar uma rota que não existe.
        O nome com "+" indica que se trata de uma rota especial conforme convenção do expo-router.
      */}
      <Stack.Screen name="+not-found" />

    </Stack>
  );
}
