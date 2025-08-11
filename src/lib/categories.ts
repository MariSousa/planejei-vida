
import { 
    Home, Car, Utensils, HeartPulse, GraduationCap, Film, Shirt, Landmark,
    ShoppingBasket, ShoppingCart, Drama, PawPrint, MoreHorizontal, Plane,
    Book, Coffee, Beer, Soup, Dumbbell, Wallet, Briefcase, Gift, Building2,
    Lightbulb, Tv, Wrench, Wind, Waves, Droplets, Flame, Wifi, Phone,
    Truck, Bus, ParkingCircle, HandCoins, User, PiggyBank, Scale,
    Receipt, Tag, BookOpen
} from 'lucide-react';

export const expenseCategoryGroups = [
    {
        label: 'Moradia',
        icon: Home,
        options: ['Aluguel', 'Financiamento', 'Condomínio', 'IPTU', 'Luz', 'Água', 'Gás', 'Internet', 'Telefone', 'Streaming TV', 'Seguro Residencial', 'Manutenção', 'Limpeza']
    },
    {
        label: 'Alimentação',
        icon: Utensils,
        options: ['Supermercado', 'Padaria', 'Açougue/Peixaria', 'Restaurante', 'Lanchonete', 'Delivery', 'Café', 'Bebidas']
    },
    {
        label: 'Transporte',
        icon: Car,
        options: ['Combustível', 'Transporte Público', 'App de Transporte', 'Estacionamento', 'Pedágio', 'Manutenção Veículo', 'Seguro Veículo', 'IPVA/Licenciamento', 'Lavagem Veículo']
    },
    {
        label: 'Saúde',
        icon: HeartPulse,
        options: ['Plano de Saúde', 'Farmácia', 'Consultas', 'Exames', 'Dentista', 'Óculos/Lentes', 'Academia', 'Terapias']
    },
    {
        label: 'Educação',
        icon: GraduationCap,
        options: ['Mensalidade', 'Material Escolar', 'Transporte Escolar', 'Cursos', 'Livros']
    },
    {
        label: 'Lazer & Cultura',
        icon: Film,
        options: ['Cinema/Teatro', 'Shows/Eventos', 'Viagens', 'Streaming', 'Assinaturas', 'Hobbies']
    },
    {
        label: 'Roupas & Cuidados Pessoais',
        icon: Shirt,
        options: ['Roupas/Calçados', 'Lavanderia', 'Salão/Barbearia', 'Cosméticos', 'Higiene Pessoal']
    },
    {
        label: 'Obrigações Financeiras',
        icon: Landmark,
        options: ['Impostos', 'Empréstimos', 'Fatura Cartão', 'Previdência Privada', 'Pensão']
    },
    {
        label: 'Despesas Domésticas',
        icon: ShoppingBasket,
        options: ['Utensílios', 'Eletrodomésticos', 'Móveis/Decoração', 'Produtos de Limpeza']
    },
    {
        label: 'Animais de Estimação',
        icon: PawPrint,
        options: ['Ração', 'Higiene Pet', 'Veterinário', 'Pet Shop']
    },
    {
        label: 'Diversos',
        icon: MoreHorizontal,
        options: ['Presentes', 'Doações', 'Taxas Bancárias', 'Multas', 'Eventos Especiais', 'Outros']
    }
];


export const getIconForCategory = (categoryLabel: string) => {
    const category = expenseCategoryGroups.find(c => c.label === categoryLabel || c.options.includes(categoryLabel));
    if (category) {
        // Find a specific icon for subcategory if needed, otherwise return main category icon
        switch (categoryLabel) {
            case 'Aluguel': return Home;
            case 'Financiamento': return Building2;
            case 'Condomínio': return Building2;
            case 'Luz': return Lightbulb;
            case 'Água': return Droplets;
            case 'Gás': return Flame;
            case 'Internet': return Wifi;
            case 'Telefone': return Phone;
            case 'Streaming TV': return Tv;
            case 'Manutenção': return Wrench;
            case 'Supermercado': return ShoppingCart;
            case 'Restaurante': return Utensils;
            case 'Café': return Coffee;
            case 'Bebidas': return Beer;
            case 'Combustível': return Car;
            case 'Transporte Público': return Bus;
            case 'App de Transporte': return Car;
            case 'Viagens': return Plane;
            case 'Academia': return Dumbbell;
            case 'Impostos': return Scale;
            case 'Fatura Cartão': return Receipt;
            case 'Salário': return Wallet;
            case 'Investimentos': return PiggyBank;
            case 'Freelance': return Briefcase;
            case 'Presentes': return Gift;
            case 'Tipos de Investimento': return BookOpen;
            default: return category.icon;
        }
    }
    return MoreHorizontal; // Default icon
};
