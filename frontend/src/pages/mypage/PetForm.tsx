import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "./PetForm.css";

type PetSex = "MALE" | "FEMALE";

export type PetFormValue = {
  petName: string;
  petAge: number;
  petSex: PetSex;
  petType: string;
};

type Props = {
  initialValue: PetFormValue;
  initialImageUrl?: string;
  submitText: string;
  onSubmit: (value: PetFormValue, imageFile: File | null) => Promise<void>;
  children?: ReactNode;
};

const DEFAULT_PREVIEW =
  "https://pawlink-profile-images.s3.ap-northeast-2.amazonaws.com/pet/profile/default.png";

export default function PetForm({
  initialValue,
  initialImageUrl,
  submitText,
  onSubmit,
  children,
}: Props) {
  const [form, setForm] = useState<PetFormValue>(initialValue);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialImageUrl || DEFAULT_PREVIEW
  );
  const [submitting, setSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  /* =====================
   * initialValue 변경 반영
   * ===================== */
  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  /* =====================
   * initialImageUrl 변경 반영
   * ===================== */
  useEffect(() => {
    setImagePreview(initialImageUrl || DEFAULT_PREVIEW);
  }, [initialImageUrl]);

  /* =====================
   * ObjectURL 정리
   * ===================== */
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]: name === "petAge" ? Number(value) : value,
    }));
  };

  const pickImage = () => imageInputRef.current?.click();

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;

    setImageFile(file);
    setImagePreview(url);
  };

  const validate = (): boolean => {
    if (!form.petName.trim()) {
      alert("반려견 이름을 입력해주세요.");
      return false;
    }
    if (!form.petType.trim()) {
      alert("견종을 입력해주세요.");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(form, imageFile);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="petc-body">
        {/* 이미지 */}
        <div className="petc-image-wrap">
          <button
            type="button"
            className="petc-image-box"
            onClick={pickImage}
          >
            <img
              src={imagePreview}
              alt="pet"
              className="petc-image-preview"
            />
          </button>
          <div className="petc-image-text">프로필 사진</div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onChangeImage}
        />

        {/* 이름 */}
        <div className="petc-field">
          <label>이름</label>
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
          />
        </div>

        {/* 나이 */}
        <div className="petc-field">
          <label>나이</label>
          <input
            type="number"
            min={0}
            name="petAge"
            value={form.petAge}
            onChange={handleChange}
          />
        </div>

        {/* 성별 */}
        <div className="petc-field">
          <label>성별</label>
          <div className="petc-sex">
            <button
              type="button"
              className={form.petSex === "MALE" ? "active" : ""}
              onClick={() => setForm((p) => ({ ...p, petSex: "MALE" }))}
            >
              수컷
            </button>
            <button
              type="button"
              className={form.petSex === "FEMALE" ? "active" : ""}
              onClick={() => setForm((p) => ({ ...p, petSex: "FEMALE" }))}
            >
              암컷
            </button>
          </div>
        </div>

        {/* 견종 */}
        <div className="petc-field">
          <label>견종</label>
          <input
            name="petType"
            value={form.petType}
            onChange={handleChange}
          />
        </div>
      </main>

      <footer className="petc-footer">
        <button
          className="petc-submit"
          disabled={submitting}
          onClick={submit}
        >
          {submitting ? "처리 중..." : submitText}
        </button>

        {/* 🔽 수정 완료 아래에 들어올 영역 */}
        {children}
      </footer>
    </>
  );
}
