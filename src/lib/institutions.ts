
import { Landmark, Building } from 'lucide-react';

export const institutionGroups = [
    {
        label: 'Bancos Tradicionais',
        icon: Landmark,
        options: [
            'Banco do Brasil',
            'Caixa Econômica Federal',
            'Itaú Unibanco',
            'Bradesco',
            'Santander',
            'Banco do Nordeste',
            'Banco Safra'
        ]
    },
    {
        label: 'Corretoras e Fintechs',
        icon: Building,
        options: [
            'XP Investimentos',
            'Modalmais',
            'Clear Corretora',
            'Rico',
            'Guide Investimentos',
            'Inter Invest',
            'Nu Invest',
            'BTG Pactual digital',
            'Órama',
            'Toro Investimentos',
            'Vérios',
            'Magnetis'
        ]
    }
];

export const getIconForInstitution = (institutionName: string) => {
    const group = institutionGroups.find(g => g.options.includes(institutionName));
    return group ? group.icon : Landmark;
};
