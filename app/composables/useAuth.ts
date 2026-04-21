export const useAuth = () => {
  const token = useCookie<string | null>("token", {
    secure: true,
    sameSite: "strict",
  });

  const payload = computed(() => {
    if (token.value) {
      try {
        return JSON.parse(atob(token.value.split(".")[1] ?? ""));
      } catch {
        return null;
      }
    } else {
      return null;
    }
  });

  const config = useRuntimeConfig();

  async function login(email: string, password: string) {
    const response = await $fetch<{ accessToken: string }>(
      `${config.public.apiBaseUrl}/auth/login`,
      {
        method: "POST",
        body: { email, password },
      },
    );

    token.value = response.accessToken;
  }

  function logout() {
    token.value = null;
    navigateTo("/login");
  }

  function isTokenExpired(): boolean {
    if (!payload.value?.exp) return true;
    return payload.value.exp * 1000 < Date.now();
  }

  return {
    token,
    payload,
    login,
    logout,
    isTokenExpired,
  };
};
