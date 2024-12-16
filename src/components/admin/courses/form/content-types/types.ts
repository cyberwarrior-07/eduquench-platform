export type ContentType = "video" | "quiz" | "chapter" | "lesson";

export interface ContentFormProps {
  onChange: (data: any) => void;
  value: any;
}