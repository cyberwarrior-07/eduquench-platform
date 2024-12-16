import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
      <div className="flex items-center gap-4">
        {value && (
          <img
            src={value}
            alt="Course thumbnail"
            className="h-32 w-32 object-cover rounded-lg"
          />
        )}
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Thumbnail
        </Button>
      </div>
    </div>
  );
}