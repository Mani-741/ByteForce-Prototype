# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Gemini API Configuration

This project includes a simple AI chat assistant powered by Google's Gemini model. To make it work you need to set a valid API key and avoid embedding it in the client code.

1. Create a file named .env in the project root (it is ignored by git).
2. Add a line:
   VITE_GEMINI_API_KEY=your_actual_key_here
3. Restart the development server (`npm run dev`).
4. Install the additional server packages and start the proxy service:

   ```bash
   npm install express cors dotenv
   npm run server
   ```

The frontend will POST prompts to `/api/chat` on the same origin, which the
server will forward to Google using the key from `.env`.

> **Note:** For production you should **not** ship the key in the browser. The example in src/App.jsx reads from an environment variable but still runs in the client. A more secure setup is to have a small backend endpoint that holds the key and proxies requests to Google's API.

Also keep an eye on the Gemini SDK; this template currently uses @google/generative-ai which is deprecated. You can upgrade to @google/genai by updating package.json and following the migration guide linked in the original SDK README.
