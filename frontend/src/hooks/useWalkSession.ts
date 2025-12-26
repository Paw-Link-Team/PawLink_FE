import { useEffect, useState } from "react";
import { getWalkSessionApi } from "../api/walk";

export function useWalkSession() {
  const [loading, setLoading] = useState(true);
  const [walking, setWalking] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  useEffect(() => {
    getWalkSessionApi()
      .then(res => {
        const data = res.data.data;
        setWalking(data.walking);
        setStartedAt(data.startedAt);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, walking, startedAt };
}