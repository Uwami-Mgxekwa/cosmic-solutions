import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dashboard: resolve(__dirname, "./src/pages/dashboard.user.html"),
        dash: resolve(__dirname, "./src/pages/dashboard.admin.html"),
        manage: resolve(__dirname, "./src/pages/manage.admin.html"),
        report: resolve(__dirname, "./src/pages/report.user.html"),
        status: resolve(__dirname, "./src/pages/status.user.html"),
        tickets: resolve(__dirname, "./src/pages/tickets.user.html"),
      },
    },
  },
});
