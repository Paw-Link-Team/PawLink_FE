import { useRef, useState } from "react";
import NavBar from "../components/NavBar";
import "./Myprofilepage.css";

type DogProfile = {
  name: string;
  age: string;    // "3살"
  gender: string; // "남자"
  breed: string;  // "푸들"
};

export default function MyProfilePage() {
  const [isEdit, setIsEdit] = useState(false);

  // 내 프로필
  const [myName, setMyName] = useState("강형욱");

  // 반려견 프로필
  const [dog, setDog] = useState<DogProfile>({
    name: "코코",
    age: "3살",
    gender: "남자",
    breed: "푸들",
  });

  // 이미지(임시 프리뷰)
  const [myImg, setMyImg] = useState<string | null>(null);
  const [dogImg, setDogImg] = useState<string | null>(null);

  const myFileRef = useRef<HTMLInputElement | null>(null);
  const dogFileRef = useRef<HTMLInputElement | null>(null);

  const openEdit = () => setIsEdit(true);
  const saveEdit = () => setIsEdit(false);

  const pickMyImage = () => myFileRef.current?.click();
  const pickDogImage = () => dogFileRef.current?.click();

  const onChangeMyImage = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMyImg(url);
  };

  const onChangeDogImage = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDogImg(url);
  };

  return (
    <div className="myp-wrapper">
      <div className="myp-screen">
        <div className="myp-status" />

        <header className="myp-top">
          <div className="myp-title">마이프로필</div>
        </header>

        <main className="myp-body">
          {/* ===== 나의 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-section-title">나의 프로필</div>

            <div className="myp-profile-row">
              <div className="myp-left">
                {/* 프로필 이미지 + 변경 버튼 */}
                <div className="myp-avatar-wrap">
                  <div
                    className="myp-avatar"
                    style={
                      myImg
                        ? {
                            backgroundImage: `url(${myImg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: "transparent",
                          }
                        : undefined
                    }
                  >
                    {!myImg ? "👤" : "."}
                  </div>

                  {isEdit && (
                    <button className="myp-photo-btn" onClick={pickMyImage}>
                      사진 변경
                    </button>
                  )}

                  <input
                    ref={myFileRef}
                    type="file"
                    accept="image/*"
                    className="myp-hidden-file"
                    onChange={(e) => onChangeMyImage(e.target.files?.[0])}
                  />
                </div>

                {/* 이름 */}
                {!isEdit ? (
                  <div className="myp-name">{myName}</div>
                ) : (
                  <input
                    className="myp-name-input"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                  />
                )}
              </div>

              {!isEdit ? (
                <button className="myp-icon-btn" onClick={openEdit} aria-label="edit">
                  ✎
                </button>
              ) : (
                <button className="myp-icon-btn" onClick={saveEdit} aria-label="save">
                  ✓
                </button>
              )}
            </div>

            {/* 편집 모드일 때만 사진 옵션(앨범/카메라 느낌 UI) */}
            {isEdit && (
              <div className="myp-photo-actions">
                <button className="myp-action" onClick={pickMyImage}>
                  <span className="myp-action-ico">🖼</span>
                  <span className="myp-action-txt">앨범</span>
                </button>
                <button className="myp-action" onClick={pickMyImage}>
                  <span className="myp-action-ico">📷</span>
                  <span className="myp-action-txt">카메라</span>
                </button>
              </div>
            )}
          </section>

          {/* ===== 반려견 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-section-title">반려견 프로필</div>

            <div className="myp-dog-card">
              {/* 강아지 이미지 + 변경 버튼 */}
              <div className="myp-dog-ava">
                <div
                  className="myp-dog-ava-img"
                  style={
                    dogImg
                      ? {
                          backgroundImage: `url(${dogImg})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {!dogImg && <span className="myp-dog-face">🐶</span>}
                </div>

                {isEdit && (
                  <button className="myp-dog-photo-btn" onClick={pickDogImage}>
                    사진 변경
                  </button>
                )}

                <input
                  ref={dogFileRef}
                  type="file"
                  accept="image/*"
                  className="myp-hidden-file"
                  onChange={(e) => onChangeDogImage(e.target.files?.[0])}
                />
              </div>

              {/* 정보 */}
              <div className="myp-dog-info">
                {/* 이름 */}
                <div className="myp-dog-line">
                  <span className="myp-dog-k">이름 :</span>
                  {!isEdit ? (
                    <span className="myp-dog-v">{dog.name}</span>
                  ) : (
                    <input
                      className="myp-dog-input"
                      value={dog.name}
                      onChange={(e) => setDog((d) => ({ ...d, name: e.target.value }))}
                    />
                  )}
                </div>

                {/* 나이 */}
                <div className="myp-dog-line">
                  <span className="myp-dog-k">나이 :</span>
                  {!isEdit ? (
                    <span className="myp-dog-v">{dog.age}</span>
                  ) : (
                    <input
                      className="myp-dog-input"
                      value={dog.age}
                      onChange={(e) => setDog((d) => ({ ...d, age: e.target.value }))}
                    />
                  )}
                </div>

                {/* 성별 */}
                <div className="myp-dog-line">
                  <span className="myp-dog-k">성별 :</span>
                  {!isEdit ? (
                    <span className="myp-dog-v">{dog.gender}</span>
                  ) : (
                    <input
                      className="myp-dog-input"
                      value={dog.gender}
                      onChange={(e) => setDog((d) => ({ ...d, gender: e.target.value }))}
                    />
                  )}
                </div>

                {/* 견종 */}
                <div className="myp-dog-line">
                  <span className="myp-dog-k">견종 :</span>
                  {!isEdit ? (
                    <span className="myp-dog-v">{dog.breed}</span>
                  ) : (
                    <input
                      className="myp-dog-input"
                      value={dog.breed}
                      onChange={(e) => setDog((d) => ({ ...d, breed: e.target.value }))}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 반려견 사진 옵션 UI */}
            {isEdit && (
              <div className="myp-photo-actions dog">
                <button className="myp-action" onClick={pickDogImage}>
                  <span className="myp-action-ico">🖼</span>
                  <span className="myp-action-txt">앨범</span>
                </button>
                <button className="myp-action" onClick={pickDogImage}>
                  <span className="myp-action-ico">📷</span>
                  <span className="myp-action-txt">카메라</span>
                </button>
              </div>
            )}
          </section>
        </main>

        <NavBar active="mypage" />
        <div className="myp-safe" />
      </div>
    </div>
  );
}
