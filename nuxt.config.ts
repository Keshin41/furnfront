// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [],
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:3001/",
    },
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      vueCompilerOptions: {
        strictTemplates: true,
      },
    },
  },
});
