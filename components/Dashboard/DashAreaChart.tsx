"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
    { month: "January", perishable: 186, always_stock: 80, uncountable: 186, favorite: 83 },
    { month: "February", perishable: 305, always_stock: 200, uncountable: 66, favorite: 56 },
    { month: "March", perishable: 237, always_stock: 120, uncountable: 186, favorite: 76 },
    { month: "April", perishable: 73, always_stock: 190, uncountable: 186, favorite: 23 },
    { month: "May", perishable: 209, always_stock: 130, uncountable: 11, favorite: 43 },
    { month: "June", perishable: 214, always_stock: 140, uncountable: 186, favorite: 35 },
    { month: "July", perishable: 67, always_stock: 100, uncountable: 45, favorite: 99 },
    { month: "August", perishable: 99, always_stock: 126, uncountable: 186, favorite: 99 },
    { month: "September", perishable: 59, always_stock: 34, uncountable: 87, favorite: 87 },
    { month: "October", perishable: 5, always_stock: 5, uncountable: 99, favorite: 88 },
    { month: "November", perishable: 34, always_stock: 65, uncountable: 100, favorite: 45 },
    { month: "December", perishable: 0, always_stock: 0, uncountable: 83, favorite: 80 },
]

const chartConfig = {
    perishable: {
    label: "Perishable",
    color: "hsl(var(--chart-1))",
  },
  always_stock: {
    label: "Always Stock",
    color: "hsl(var(--chart-2))",
  },
  uncountable: {
    label: "Uncountable",
    color: "hsl(var(--chart-3))",
  },
  favorite: {
    label: "Favorite",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function DashAreaChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Types</CardTitle>
        <CardDescription>
          Showing item types for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="perishable"
              type="natural"
              fill="var(--color-perishable)"
              fillOpacity={0.4}
              stroke="var(--color-perishable)"
              stackId="a"
            />
            <Area
              dataKey="always_stock"
              type="natural"
              fill="var(--color-always_stock)"
              fillOpacity={0.4}
              stroke="var(--color-always_stock)"
              stackId="a"
            />
             <Area
              dataKey="uncountable"
              type="natural"
              fill="var(--color-uncountable)"
              fillOpacity={0.4}
              stroke="var(--color-uncountable)"
              stackId="a"
            />
             <Area
              dataKey="favorite"
              type="natural"
              fill="var(--color-favorite)"
              fillOpacity={0.4}
              stroke="var(--color-favorite)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
