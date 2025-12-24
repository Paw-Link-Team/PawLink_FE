import { useRef, useState } from "react";
import "./PetCreatePage.css";

type PetSex = "MALE" | "FEMALE";

export type PetFormValue = {
  petName: string;
  petAge: number;
  petSex: PetSex;
  petType: string;
  petProfileImageUrl?: string | null;
};

type Props = {
  initialValue: PetFormValue;
  submitText: string;
  onSubmit: (value: PetFormValue, imageFile: File | null) => Promise<void>;
};

export default function PetForm({
  initialValue,
  submitText,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PetFormValue>(initialValue);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValue.petProfileImageUrl ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!form.petName.trim()) {
      alert("반려견 이름을 입력해주세요.");
      return;
    }
    if (!form.petType.trim()) {
      alert("견종을 입력해주세요.");
      return;
    }

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
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="pet"
                className="petc-image-preview"
              />
            ) : (
              <span className="petc-image-icon">🐶</span>
            )}
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
      </footer>
    </>
  );
}
