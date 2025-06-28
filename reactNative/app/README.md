# Projeto de Aplicativo de Comércio Eletrônico com React Native

Este projeto é uma implementação de um aplicativo de comércio eletrônico desenvolvido com React Native e Expo, como parte da atividade proposta em [Desenvolvimento com React Native](https://firelink-library.github.io/mobile/pond0).

## Funcionalidades Implementadas

O aplicativo implementa as seguintes funcionalidades, seguindo o protótipo de baixa fidelidade e os requisitos da atividade:

- **Autenticação de Usuário:**
  - Telas de Login e Cadastro.
  - Controle de estado de autenticação utilizando React Context API.
  - Tela de Perfil com informações do usuário e função de Logout.

- **Listagem e Detalhes de Produtos:**
  - Tela principal (`Home`) que exibe uma lista de 10.000 produtos gerados dinamicamente com a biblioteca `Faker.js`.
  - A lista utiliza `FlatList` para uma performance otimizada na renderização de um grande número de itens.
  - Tela de `Detalhes do Produto` ao selecionar um item da lista.

- **Interação com Hardware e Sistema:**
  - **Câmera:** Acesso à câmera do dispositivo para captura de imagens (`expo-camera` e `expo-image-picker`).
  - **Compartilhamento:** Funcionalidade de compartilhar a imagem de um produto com outros aplicativos (`expo-sharing` e `expo-file-system`).
  - **Notificações:** Sistema de notificações locais (`expo-notifications`).

- **Navegação:**
  - Navegação inicial baseada em Stack (`@react-navigation/stack`) para as telas de autenticação.
  - Após o login, a navegação principal é feita através de abas na parte inferior (`@react-navigation/bottom-tabs`), permitindo acesso rápido às telas de Home, Câmera, Notificações e Perfil.

- **Design System:**
  - A interface do usuário foi construída utilizando componentes da biblioteca `react-native-paper`, que segue os princípios do Material Design.

## Tecnologias Utilizadas

- **Core:**
  - React Native
  - Expo (SDK 53)

- **Navegação:**
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `@react-navigation/bottom-tabs`

- **UI/Componentes:**
  - `react-native-paper`
  - `react-native-vector-icons`

- **Dados e API (Mock):**
  - `@faker-js/faker` para geração de dados de produtos.

- **APIs do Expo:**
  - `expo-camera`
  - `expo-image-picker`
  - `expo-notifications`
  - `expo-sharing`
  - `expo-file-system`

## Como Executar o Projeto

1.  **Clone o repositório e navegue até a pasta do projeto:**
    ```bash
    cd pondMod10\reactNative\app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```

4.  **Execute no seu dispositivo:**
    - Faça o download do aplicativo **Expo Go** na App Store ou Google Play.
    - Escaneie o QR Code exibido no terminal para abrir o aplicativo no seu celular.

## Observações Importantes

- **Notificações no Expo Go:** A funcionalidade de notificações push (remotas) do `expo-notifications` não é totalmente suportada no Expo Go a partir do SDK 53. Para testar essa funcionalidade de forma completa, é recomendado criar um [development build](https://docs.expo.dev/develop/development-builds/introduction/).
