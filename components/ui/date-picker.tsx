"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  onSelect?: (date: Date) => void;
  defaultDate?: Date;
}
export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  onSelect,
  defaultDate
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(defaultDate ? defaultDate : new Date());

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Expiry Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-wrap gap-2 w-[210px]">
                {" "}
                {months.map((month, index) => {
                  // const isFutureMonth = index > getMonth(new Date())
                  // console.log(isFutureMonth)
                  return (
                    <div
                      key={month}
                      className="w-[calc(50%-0.5rem)] flex items-center]">
                      {" "}
                      <SelectItem
                        value={month}
                        className="text-center w-full">
                        {month}
                      </SelectItem>
                    </div>
                  )
                })}
              </div>
            </SelectContent>
          </Select>

          {/* <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(date)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Select
            onValueChange={handleYearChange}
            value={getYear(date).toString()}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
             
              <div className="flex flex-wrap gap-2 w-[260px]">
                {years.map((year) => (
                  <div key={year} className="w-[calc(33%-0.5rem)] flex items-center]">
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  </div>
                ))}
              </div>
            </SelectContent>
            
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          month={date}
          onMonthChange={setDate}
          // onMonthChange={(date) => {
          //   const newMonth = getMonth(date); // Get the new month from the Date object
          //   const currentMonth = getMonth(new Date());
          //   if (newMonth > currentMonth) {
          //     return;  // Don't allow the month to change if it's in the future
          //   }
          //   setDate(date) 
          // }}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1924-01-01")
          // }
          
        />
      </PopoverContent>
    </Popover>
  );
}
