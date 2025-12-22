import "./SignupAgreementPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Brand";

type Agreement = {
    id: string;
    label: string;
    required: boolean;
};

const AGREEMENTS: Agreement[] = [
    { id: "age", label: "(필수) 만 14세 이상입니다.", required: true },
    { id: "terms", label: "(필수) 서비스 이용약관 동의", required: true },
    { id: "privacy", label: "(필수) 개인정보 처리방침 동의", required: true },
    { id: "marketing", label: "(선택) 마케팅 수신 동의", required: false },
];

export default function SignupAgreementPage() {
    const navigate = useNavigate();

    const [checked, setChecked] = useState<Record<string, boolean>>({
        age: false,
        terms: false,
        privacy: false,
        marketing: false,
    });

    const isAllRequiredChecked = AGREEMENTS
        .filter(a => a.required)
        .every(a => checked[a.id]);

    const isAllChecked = AGREEMENTS.every(a => checked[a.id]);

    const handleAllCheck = () => {
        const newValue = !isAllChecked;
        const newState: Record<string, boolean> = {};
        AGREEMENTS.forEach(a => (newState[a.id] = newValue));
        setChecked(newState);
    };

    const toggleCheck = (id: string) => {
        setChecked(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const goNext = () => {
        if (!isAllRequiredChecked) return;
        navigate("/signup/info");
    };

    return (
        <div className="signup-root">
            <Header variant="brand" />
            <div className="signup-card">

                <section className="signup-content">
                    <div className="signup-header-row">
                        <h2 className="signup-title">
                            회원가입을 위해 필수 약관 및 위치 기반<br />
                            서비스 이용약관에 동의해주세요.
                        </h2>

                        <span className="step">1/2</span>
                    </div>

                    {/* 나머지 내용 */}

                    <ul className="agreement-list">
                        <li className="all">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleAllCheck}
                                />
                                모두 동의
                            </label>
                        </li>

                        {AGREEMENTS.map(a => (
                            <li key={a.id} className={a.required ? "required" : "optional"}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checked[a.id]}
                                        onChange={() => toggleCheck(a.id)}
                                    />
                                    {a.label}
                                </label>
                            </li>
                        ))}
                    </ul>
                </section>

                <footer className="signup-footer">
                    <button disabled={!isAllRequiredChecked} onClick={goNext}>
                        다음
                    </button>
                </footer>
            </div>
        </div>
    );
}
