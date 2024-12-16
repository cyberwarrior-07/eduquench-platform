import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentFormProps } from "./types";

export function LiveClassForm({ value, onChange }: ContentFormProps) {
  const [meetLink, setMeetLink] = useState(value?.meetLink || "");
  const [scheduledTime, setScheduledTime] = useState(value?.scheduledTime || "");
  const [duration, setDuration] = useState(value?.duration || "60");

  const handleChange = (field: string, newValue: string) => {
    const updatedValue = {
      ...value,
      [field]: newValue,
    };
    onChange(updatedValue);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Meeting Link</Label>
        <Input
          type="url"
          value={meetLink}
          onChange={(e) => {
            setMeetLink(e.target.value);
            handleChange("meetLink", e.target.value);
          }}
          placeholder="Google Meet link"
        />
      </div>
      
      <div>
        <Label>Scheduled Time</Label>
        <Input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => {
            setScheduledTime(e.target.value);
            handleChange("scheduledTime", e.target.value);
          }}
        />
      </div>

      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          min="15"
          max="180"
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            handleChange("duration", e.target.value);
          }}
        />
      </div>
    </div>
  );
}