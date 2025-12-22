import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

type Tab = "login" | "signup";
type SignStep = 1 | 2 | 3;

export default function Auth() {
  const nav = useNavigate();

  // 로그인/회원가입 탭
  const [tab, setTab] = useState<Tab>("login");

  // 로그인 인트로(왼쪽 사진) → 로그인 폼(오른쪽 사진)
  const [loginIntro, setLoginIntro] = useState(true);

  // 회원가입 3단계
  const [signStep, setSignStep] = useState<SignStep>(1);

  // 로그인 폼
  const [loginId, setLoginId] = useState("contact@dscodetech.com");
  const [loginPw, setLoginPw] = useState("1234567890");
  const [showPw, setShowPw] = useState(false);

  // 회원가입 약관 체크
  const [agreeAll, setAgreeAll] = useState(false);
  const [agree14, setAgree14] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const requiredOk = agree14 && agreeService && agreeLocation;

  const syncAgreeAll = (next: boolean) => {
    setAgreeAll(next);
    setAgree14(next);
    setAgreeService(next);
    setAgreeLocation(next);
    setAgreeMarketing(next);
  };

  // 회원가입 입력 폼
  const [nick, setNick] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const pwMatch = pw.length > 0 && pw === pw2;

  const canSubmitSignup = useMemo(() => {
    return nick && id && pw && pw2 && pwMatch && email && phone;
  }, [nick, id, pw, pw2, pwMatch, email, phone]);

  const doFakeOAuth = (provider: "kakao" | "naver") => {
    // TODO: 실제 로그인은 SDK/Redirect 붙이면 됨
    alert(`${provider === "kakao" ? "카카오" : "네이버"} 로그인(데모)`);
    nav("/home");
  };

  const doFakeLogin = () => {
    // TODO: 실제 로그인 API 붙이면 됨
    nav("/home");
  };

  return (
    <div className="auth-root">
      <div className="auth-phone">
        <div className="auth-status" />

        {/* ====== 로그인 탭 & 회원가입 탭 헤더 (로그인 폼/회원가입 화면에만 보임) ====== */}
        {!loginIntro && (
          <header className="auth-top-tabs">
            <button
              type="button"
              className={`auth-tab ${tab === "login" ? "on" : ""}`}
              onClick={() => {
                setTab("login");
                setSignStep(1);
              }}
            >
              Log in
            </button>

            <button
              type="button"
              className={`auth-tab ${tab === "signup" ? "on" : ""}`}
              onClick={() => {
                setTab("signup");
                setLoginIntro(false);
                setSignStep(1);
              }}
            >
              Sign up
            </button>
          </header>
        )}

        {/* ====== 1) 로그인 인트로(왼쪽 사진) ====== */}
        {loginIntro && (
          <div className="auth-intro">
            <div className="auth-intro-center">
              <div className="auth-logoMark" aria-hidden />
              <div className="auth-brand">PawLink</div>
              <div className="auth-slogan">산책을 기록하고,</div>
              <div className="auth-slogan">약속을 나누다</div>
            </div>

            <div className="auth-intro-bottom">
              <button
                type="button"
                className="auth-primary"
                onClick={() => {
                  setLoginIntro(false);
                  setTab("login");
                }}
              >
                로그인하기
              </button>

              <div className="auth-bottom-text">
                아직 계정이 없으신가요?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => {
                    setLoginIntro(false);
                    setTab("signup");
                    setSignStep(1);
                  }}
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====== 2) 로그인 폼(오른쪽 사진) ====== */}
        {!loginIntro && tab === "login" && (
          <div className="auth-body">
            <div className="auth-form">
              <label className="auth-label">아이디</label>
              <div className="auth-input">
                <input value={loginId} onChange={(e) => setLoginId(e.target.value)} />
              </div>

              <label className="auth-label">비밀번호</label>
              <div className="auth-input auth-input-withicon">
                <input
                  type={showPw ? "text" : "password"}
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="toggle password"
                />
              </div>

              <div className="auth-find">
                아이디/비밀번호 찾기
              </div>

              <button type="button" className="auth-primary" onClick={doFakeLogin}>
                로그인
              </button>

              <div className="auth-or">
                <span />
                <div>Or</div>
                <span />
              </div>

              <button type="button" className="auth-sns kakao" onClick={() => doFakeOAuth("kakao")}>
                <span className="auth-sns-ico kakao" aria-hidden />
                Login with Kakao
              </button>

              <button type="button" className="auth-sns naver" onClick={() => doFakeOAuth("naver")}>
                <span className="auth-sns-ico naver" aria-hidden />
                Login with Naver
              </button>

              <div className="auth-bottom-text auth-bottom-text2">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => {
                    setTab("signup");
                    setSignStep(1);
                  }}
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====== 3) 회원가입 (사진 3장: 약관 → 정보입력 → 완료) ====== */}
        {!loginIntro && tab === "signup" && (
          <div className="auth-body">
            {/* Step 1: 약관 */}
            {signStep === 1 && (
              <div className="auth-sign">
                <div className="auth-sign-desc">
                  회원가입을 위해 필수 약관 및 위치 기반<br />
                  서비스 이용약관에 동의해주세요.
                </div>

                <div className="auth-checklist">
                  <CheckRow
                    label="모두 동의"
                    sub="서비스 이용을 위한 약관에 모두 동의합니다."
                    checked={agreeAll}
                    onChange={(v) => syncAgreeAll(v)}
                    strong
                  />

                  <div className="auth-divider" />

                  <CheckRow
                    label="(필수) 만 14세 이상입니다."
                    checked={agree14}
                    onChange={(v) => {
                      setAgree14(v);
                      setAgreeAll(v && agreeService && agreeLocation && agreeMarketing);
                    }}
                  />
                  <CheckRow
                    label="(필수) 서비스 이용약관 동의"
                    checked={agreeService}
                    onChange={(v) => {
                      setAgreeService(v);
                      setAgreeAll(agree14 && v && agreeLocation && agreeMarketing);
                    }}
                  />
                  <CheckRow
                    label="(필수) 개인정보 처리방침 동의"
                    checked={agreeLocation}
                    onChange={(v) => {
                      setAgreeLocation(v);
                      setAgreeAll(agree14 && agreeService && v && agreeMarketing);
                    }}
                  />
                  <CheckRow
                    label="(선택) 마케팅 수신 동의"
                    checked={agreeMarketing}
                    onChange={(v) => {
                      setAgreeMarketing(v);
                      setAgreeAll(agree14 && agreeService && agreeLocation && v);
                    }}
                  />
                </div>

                <button
                  type="button"
                  className={`auth-primary ${requiredOk ? "" : "disabled"}`}
                  disabled={!requiredOk}
                  onClick={() => setSignStep(2)}
                >
                  다음
                </button>
              </div>
            )}

            {/* Step 2: 정보입력 */}
            {signStep === 2 && (
              <div className="auth-form auth-form-sign">
                <div className="auth-row">
                  <div className="auth-col">
                    <label className="auth-label">닉네임</label>
                    <div className="auth-input">
                      <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="닉네임" />
                    </div>
                  </div>
                  <button type="button" className="auth-dup">
                    중복 확인
                  </button>
                </div>

                <label className="auth-label">아이디</label>
                <div className="auth-input">
                  <input value={id} onChange={(e) => setId(e.target.value)} placeholder="아이디" />
                </div>

                <label className="auth-label">비밀번호</label>
                <div className="auth-input auth-input-withicon">
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="비밀번호"
                  />
                  <span className="auth-eye muted" aria-hidden />
                </div>

                <label className="auth-label">비밀번호 확인</label>
                <div className="auth-input auth-input-withicon">
                  <input
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="비밀번호 확인"
                  />
                  <span className="auth-eye muted" aria-hidden />
                </div>

                <label className="auth-label">이메일</label>
                <div className="auth-input">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
                </div>

                <label className="auth-label">전화번호</label>
                <div className="auth-input">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="전화번호" />
                </div>

                <button
                  type="button"
                  className={`auth-primary ${canSubmitSignup ? "" : "disabled"}`}
                  disabled={!canSubmitSignup}
                  onClick={() => setSignStep(3)}
                >
                  회원가입
                </button>
              </div>
            )}

            {/* Step 3: 완료 */}
            {signStep === 3 && (
              <div className="auth-done">
                <div className="auth-done-msg">
                  PawLink에 가입해주셔서 감사합니다<br />
                  지금부터 서비스를 즐겨주세요!
                </div>

                <button
                  type="button"
                  className="auth-primary"
                  onClick={() => {
                    setTab("login");
                    setSignStep(1);
                  }}
                >
                  완료
                </button>
              </div>
            )}
          </div>
        )}

        <div className="auth-home-indicator" />
      </div>
    </div>
  );
}

function CheckRow({
  label,
  sub,
  checked,
  onChange,
  strong,
}: {
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  strong?: boolean;
}) {
  return (
    <button
      type="button"
      className={`auth-checkrow ${strong ? "strong" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={`auth-check ${checked ? "on" : ""}`} aria-hidden />
      <span className="auth-checktext">
        <span className="auth-checklabel">{label}</span>
        {sub && <span className="auth-checksub">{sub}</span>}
      </span>
    </button>
  );
}
