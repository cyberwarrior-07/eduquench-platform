import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { ContentFormProps } from "./types";

export function LiveClassForm({ onChange, value }: ContentFormProps) {
  const [date, setDate] = useState<Date>();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onChange({ ...value, scheduledDate: newDate.toISOString() });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Schedule Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          min="15"
          step="15"
          value={value?.duration || "60"}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
        />
      </div>
      <div>
        <Label>Meeting Description</Label>
        <Textarea
          placeholder="Add meeting description"
          value={value?.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
      </div>
    </div>
  );
}