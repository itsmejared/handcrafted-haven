import nextConfig from "eslint-config-next";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = [
  // 1. Carpetas globales ignoradas
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  // 2. Configuraciones por defecto de Next.js (compatibles nativamente con v9)
  ...nextConfig,

  // 3. Tus plugins y reglas personalizadas
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Desactivamos validaciones por defecto de variables para delegarlas
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Reporta imports no usados como error en la consola
      "unused-imports/no-unused-imports": "error",

      // Reporta variables no usadas como advertencia (ignora si empiezan con _)
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
    settings: {
      react: {
        version: "detect", // En v9 el script de auto-detección funciona perfecto
      },
    },
  },
];

export default eslintConfig;
