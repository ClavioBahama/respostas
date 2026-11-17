# Feedback — Ecokraft Design

Página de respostas/feedback com HTML, CSS e JavaScript.

**Stack:** HTML · CSS · JavaScript

**Documentação:**
- [Issue de organização](https://github.com/ClavioBahama/respostas/issues/1) — revisão e sugestões

---

## 0. Pré-requisitos

Navegador moderno (Chrome, Edge ou Firefox).
Opcional: Node.js (`npx serve`) ou Python para servir a pasta localmente.

## 1. Instalação e Execução

```powershell
npx serve .   # servir a pasta em `http://localhost:3000`
python -m http.server 8000   # alternativa sem Node.js — abrir `http://localhost:8000`
```

## 2. Estrutura do Projeto

```text
respostas/
├── index.html          # página de feedback
├── styles.css          # estilos
├── script.js           # comportamento
└── logo-ecokraft.png   # logotipo
```

## 3. Funcionalidades

- Formulário/página de respostas com identidade Ecokraft.
- Estilos separados em `styles.css`.
- Comportamento implementado em `script.js`.

## 4. Arquivos e pontos de entrada

- `index.html` — página principal.
- `script.js` — lógica de interação.

## 5. Segurança

Projeto estático: nenhuma credencial identificada no repositório.

## 6. Problemas Comuns

Abrir os arquivos com `file://` pode bloquear CSS/JS em alguns navegadores — use um servidor local.
Nomes de arquivos com acentos ou espaços precisam de codificação de URL.

## 7. Observações (organização)

> Revisão realizada em 17/11/2026 durante a padronização dos repositórios, inspirada no README do FreelaMZ.
- Projeto estático sem build.
- Sugestão: adicionar README com a finalidade da página e instruções de abertura.

## 8. Licença

Projeto pessoal/acadêmico. Verifique a licença de templates ou bibliotecas de terceiros antes de uso comercial.

