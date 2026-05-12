# Sistema de Componentes Reutilizáveis - Projeto Fiocruz

Este documento explica como usar o sistema de componentes reutilizáveis para navbar e sidebar no projeto.

## 📁 Estrutura dos Arquivos

```
components/
├── navigation.html          # Componentes HTML da navbar e sidebar
js/
├── component-loader.js      # Script para carregar componentes
css/
├── style.css               # Estilos dos componentes
```

## 🚀 Como Usar

### 1. Estrutura Básica da Página

Para usar os componentes em qualquer página, siga esta estrutura:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <!-- Links CSS -->
    <link rel="stylesheet" href="../css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../assets/font/rawline-400.ttf">
</head>

<body>
    <!-- BANNER COM NAVBAR -->
    <div class="banner position-relative">
        <!-- CONTAINER OBRIGATÓRIO: será preenchido automaticamente -->
        <div id="navbar-container"></div>

        <!-- Seu banner/imagem -->
        <picture>
            <source srcset="../assets/images/bg_mobile.png" media="(max-width: 768px)">
            <img src="../assets/images/bg_home.png" class="img-fluid w-100" alt="Banner">
        </picture>
    </div>

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="container-fluid p-0">
        <!-- CONTAINER OBRIGATÓRIO: overlay da sidebar mobile -->
        <div id="sidebar-overlay-container"></div>

        <div class="row g-0 row-full">
            <!-- CONTAINER OBRIGATÓRIO: sidebar será inserida aqui -->
            <div id="sidebar-container"></div>

            <!-- SEU CONTEÚDO PRINCIPAL -->
            <main class="col-md-9 col-lg-10 main-content">
                <!-- Conteúdo específico da página -->
            </main>
        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="../js/menu.js"></script>
    <script src="../js/bootstrap.bundle.min.js"></script>
    <!-- COMPONENT LOADER: OBRIGATÓRIO para carregar os componentes -->
    <script src="../js/component-loader.js"></script>
</body>
</html>
```

### 2. Containers Obrigatórios

Você **DEVE** incluir estes três containers na página:

- `#navbar-container` - Para a barra de navegação superior
- `#sidebar-container` - Para o painel lateral
- `#sidebar-overlay-container` - Para o overlay mobile

### 3. Funcionalidades Incluídas

#### Navbar
- Logo da Fiocruz
- Menu superior (Bibliografia, Crédito)
- Botão hamburger para mobile (aparece automaticamente)

#### Sidebar
- Navegação em cascata com submenus
- Design responsivo (desktop: lateral, mobile: overlay)
- Animações suaves de abertura/fechamento
- Estados ativos e hover

#### Mobile
- Sidebar oculta por padrão em telas pequenas
- Botão hamburger no canto superior esquerdo
- Overlay escuro ao abrir
- Fecha automaticamente ao clicar fora ou em links

## 📝 Personalização

### Modificar o Menu

Para alterar os itens do menu, edite o arquivo `components/navigation.html`:

```html
<!-- Exemplo: adicionar novo item -->
<div class="sidebar-item">
    <button class="sidebar-toggle" type="button" data-target="submenu-novo">
        <span class="menu-title">Novo Módulo</span>
        <span class="menu-desc">Descrição do módulo</span>
        <span class="menu-arrow">+</span>
    </button>
    <div id="submenu-novo" class="sidebar-submenu">
        <a class="submenu-link" href="#">Link 1</a>
        <a class="submenu-link" href="#">Link 2</a>
    </div>
</div>
```

### Alterar Cores

As cores são definidas no `:root` do `style.css`. Para alterar:

```css
:root {
    --cor-primaria: #4c1d95;    /* Roxo principal */
    --cor-secundaria: #c026d3;  /* Magenta */
    --cor-preto: #000000;       /* Preto */
}
```

## 🔧 Manutenção

### Atualização Global

Qualquer mudança em `components/navigation.html` afetará **todas as páginas** que usam os componentes.

### CSS Personalizado

Para estilos específicos de uma página, adicione no `<style>` da própria página **após** o `style.css`.

### JavaScript Adicional

Para funcionalidades específicas, adicione scripts após o `component-loader.js`.

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Desktop (>768px)**: Sidebar lateral fixa
- **Mobile (≤768px)**: Sidebar em overlay, ativada por hamburger

## 🐛 Troubleshooting

### Componentes não carregam
- Verifique se os caminhos dos arquivos estão corretos
- Confirme que os containers têm os IDs corretos
- Abra o console do navegador para erros

### Sidebar não abre no mobile
- Verifique se o CSS mobile está carregado
- Confirme que o botão hamburger tem `id="sidebarToggle"`

### Estilos quebrados
- Certifique-se que `style.css` está sendo carregado
- Verifique conflitos de CSS específicos da página

## 📋 Exemplo Completo

Veja `exemplo-componentes.html` para uma implementação completa e comentada.