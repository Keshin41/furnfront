export default defineNuxtRouteMiddleware(() => {
  const { token, logout, isTokenExpired } = useAuth();
  if (!token.value || isTokenExpired()) {
    logout();
  }
});
