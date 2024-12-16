export type ContentType = "video" | "quiz" | "chapter" | "live-class";

export interface ContentFormProps {
  onChange: (data: any) => void;
  value: any;
}