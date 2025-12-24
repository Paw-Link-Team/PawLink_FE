import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyInfo,
    getWalkHistory,
    getWalletBalance,
} from "../api/mypage";

export type UserResponse = {
    email: string;
    nickname: string;
    profileImageUrl: string;
};

export type WalkHistoryItem = {
    id: number;
    date: string;
    distanceKm: number;
    poop: boolean;
};

export const useMyPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserResponse | null>(null);
    const [walkHistories, setWalkHistories] = useState<WalkHistoryItem[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login", { replace: true });
    };

    const fetchBalance = async () => {
        try {
            const res = await getWalletBalance();
            setBalance(res.data.data.balance);
        } catch (e) {
            console.error("잔액 조회 실패", e);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            logout();
            return;
        }

        const init = async () => {
            try {
                const results = await Promise.allSettled([
                    getMyInfo(),
                    getWalkHistory(),
                    getWalletBalance(),
                ]);

                const [userRes, walkRes, walletRes] = results;
                if (userRes.status === "fulfilled") {
                    setUser(userRes.value.data.data);
                } else if (userRes.reason?.response?.status === 401) {
                    logout();
                }

                if (walkRes.status === "fulfilled") {
                    setWalkHistories(walkRes.value.data.data);
                }

                if (walletRes.status === "fulfilled") {
                    setBalance(walletRes.value.data.data.balance);
                }
            } catch (e) {
                console.error("마이페이지 초기화 실패", e);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return {
        user,
        walkHistories,
        balance,
        loading,
        refreshBalance: fetchBalance,
    };
};
