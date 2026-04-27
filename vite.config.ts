import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

const config = defineConfig({
    plugins: [
        devtools(),
        tsconfigPaths({ projects: ["./tsconfig.json"] }),
        tailwindcss(),
        tanstackRouter({ target: "react", autoCodeSplitting: true }),
        viteReact(),
    ],
    test: {
        globals: true,
        environment: "jsdom",
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});

export default config;
