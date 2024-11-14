"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", premium: 186, free: 80 },
  { month: "February", premium: 305, free: 200 },
  { month: "March", premium: 237, free: 120 },
  { month: "April", premium: 73, free: 190 },
  { month: "May", premium: 209, free: 130 },
  { month: "June", premium: 214, free: 140 },
  { month: "July", premium: 67, free: 100 },
  { month: "August", premium: 99, free: 126 },
  { month: "September", premium: 59, free: 34 },
  { month: "October", premium: 5, free: 5 },
  { month: "November", premium: 34, free: 65 },
  { month: "December", premium: 0, free: 0 },
]

const chartConfig = {
  premium: {
    label: "Premium Users",
    color: "hsl(var(--chart-1))",
  },
  free: {
    label: "Free Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DashBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Subscriptions</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="premium" fill="var(--color-premium)" radius={4} />
            <Bar dataKey="free" fill="var(--color-free)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
