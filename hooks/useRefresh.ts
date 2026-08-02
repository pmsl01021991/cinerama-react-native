import { useCallback, useState } from "react";

export function useRefresh(
  accion: () => Promise<void>
) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await accion();
    } catch (error) {
      console.error("Error actualizando:", error);
    } finally {
      setRefreshing(false);
    }
  }, [accion, refreshing]);

  return {
    refreshing,
    onRefresh,
  };
}