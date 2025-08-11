
'use client';

import { PrivateRoute } from '@/components/private-route';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChartHorizontalBig, Calculator, HandHeart, Landmark, PiggyBank, PieChart, ShieldAlert, UserCheck } from 'lucide-react';
import React from 'react';

const guideSections = [
    {
        icon: PieChart,
        title: "Introduction",
        description: "What investing is and why you should start, the power of compounding, and more.",
    },
    {
        icon: UserCheck,
        title: "Investor Profile",
        description: "Determine your investor profile and its influence on your choices.",
    },
    {
        icon: Landmark,
        title: "Types of Investments",
        description: "Learn about fixed income, stocks, funds, and more.",
    },
    {
        icon: HandHeart,
        title: "Where to Invest",
        description: "Different institutions to invest with, and how to select one.",
    },
    {
        icon: PiggyBank,
        title: "How to Analyze an Investment",
        description: "Understanding profitability, liquidity, risk, and more.",
    },
    {
        icon: ShieldAlert,
        title: "Basic Strategies",
        description: "Essential strategies for building your portfolio.",
    },
    {
        icon: Calculator,
        title: "Tools and Simulators",
        description: "Useful calculators and investment simulation tools.",
    },
    {
        icon: BarChartHorizontalBig,
        title: "Next Steps",
        description: "How to build your first portfolio and keep evolving.",
    }
];

const GuideItem = ({ icon: Icon, title, description }: typeof guideSections[0]) => (
    <div className="border-b last:border-b-0">
        <div className="flex items-center p-4">
             <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
        </div>
    </div>
);


function InvestmentTypesPageContent() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="text-left">
        <h1 className="text-4xl font-bold font-headline">Complete Guide for a Beginner Investor</h1>
      </div>

       <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {guideSections.map((section, index) => (
                        <GuideItem key={index} {...section} />
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}

export default function InvestmentTypesPage() {
    return (
        <PrivateRoute>
            <InvestmentTypesPageContent />
        </PrivateRoute>
    );
}
