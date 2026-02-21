export const useAuth = () => {
  const token = useState<string | null>("token");

  const config = useRuntimeConfig();

  function init() {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      token.value = savedToken;
    }
  }

  async function login(email: string, password: string) {
    const response = await $fetch<{ accessToken: string }>(
      `${config.public.apiBase}/auth/login`,
      {
        method: "POST",
        body: { email, password },
      },
    );

    token.value = response.accessToken;

    localStorage.setItem("token", response.accessToken);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem("token");
    navigateTo("/login");
  }

  return {
    token,
    init,
    login,
    logout,
  };
};
