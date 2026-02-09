// composables/useSidebar.ts
export const useSidebar = () => {
  const isOpen = useState<boolean>("sidebar-open", () => true);

  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    toggle: () => (isOpen.value = !isOpen.value),
  };
};
