
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

export function SummaryCard({ title, value, icon, className }: SummaryCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
