import { useEffect, useState } from "react";
import {
  startWalkApi,
  endWalkApi,
  getWalkSessionApi,
} from "../api/walk";
import type { EndWalkPayload } from "../api/walk";

type WalkState =
  | { status: "IDLE" }
  | {
    status: "WALKING";
    walkSessionId: number;
    startedAt: string;
  };

export function useWalkSession() {
  const [state, setState] = useState<WalkState>({ status: "IDLE" });
  const [loading, setLoading] = useState(true);

  /* =====================
   * 초기 복구
   * ===================== */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getWalkSessionApi();
        if (
          mounted &&
          res.data?.walkSessionId &&
          res.data?.startedAt
        ) {
          setState({
            status: "WALKING",
            walkSessionId: res.data.walkSessionId,
            startedAt: res.data.startedAt,
          });
        } else if (mounted) {
          setState({ status: "IDLE" });
        }
      } catch {
        if (mounted) setState({ status: "IDLE" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================
   * 산책 시작
   * ===================== */
  const start = async () => {
    if (state.status === "WALKING") return;

    const res = await startWalkApi();

    const data = res.data.data; // ⭐ 핵심

    setState({
      status: "WALKING",
      walkSessionId: data.sessionId, // ⭐
      startedAt: data.startedAt,     // ⭐
    });
  };

  /* =====================
   * 산책 종료
   * ===================== */
  const end = async (
    payload: EndWalkPayload
  ): Promise<{ id: number }> => {
    if (state.status !== "WALKING") {
      throw new Error("산책 중이 아닙니다.");
    }

    try {
      const res = await endWalkApi(
        state.walkSessionId,
        payload
      );

      setState({ status: "IDLE" });
      return res.data.data;
    } catch (e) {
      // 상태 유지
      throw e;
    }
  };


  return {
    loading,
    state,
    start,
    end,
  };
}
