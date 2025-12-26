import { useEffect, useState } from "react";
import "./BoardForm.css";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
  }) => void;
};

export default function BoardForm({
  mode,
  initialData,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /** 🔑 initialData 들어오면 상태 동기화 */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const submit = () => {
    onSubmit({ title, description });
  };

  return (
    <>
      <h1>{mode === "edit" ? "게시글 수정" : "게시글 작성"}</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={submit}>
        {mode === "edit" ? "수정 완료" : "등록"}
      </button>
    </>
  );
}
