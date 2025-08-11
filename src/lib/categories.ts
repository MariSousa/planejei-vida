
import {
    Home, ShoppingCart, Utensils, HeartPulse, GraduationCap, Film, Shirt,
    Landmark, Dog, Tag, Car, Train, Bus, Fuel, ParkingCircle, Wrench,
    Shield, Phone, Wifi, Tv, Droplets, Flame, Lightbulb, Dumbbell, Book,
    User, Banknote, Receipt, Gift, HandHeart, Ticket, Plane, Briefcase,
    Stethoscope, Pill, Mic, GitMerge, MoreHorizontal, Cat, Bone, PawPrint,
    Speaker, Smile, UtensilsCrossed, Pizza, Beer, Coffee, ShoppingBasket,
    Building2, PersonStanding, Clapperboard, Music, BaggageClaim, CircleDollarSign,
    Brush, Pencil, Percent, Package, Scissors, SprayCan, Trash2, Pickaxe
} from 'lucide-react';

export const expenseCategoryGroups = [
    {
        label: 'Moradia',
        options: ['Aluguel', 'Financiamento', 'Condomínio', 'IPTU', 'Luz', 'Água', 'Gás', 'Internet', 'Telefone', 'Streaming TV', 'Seguro Residencial', 'Manutenção', 'Limpeza']
    },
    {
        label: 'Alimentação',
        options: ['Supermercado', 'Padaria', 'Açougue/Peixaria', 'Restaurante', 'Lanchonete', 'Delivery', 'Café', 'Bebidas']
    },
    {
        label: 'Transporte',
        options: ['Combustível', 'Transporte Público', 'App de Transporte', 'Estacionamento', 'Pedágio', 'Manutenção Veículo', 'Seguro Veículo', 'IPVA/Licenciamento', 'Lavagem Veículo']
    },
    {
        label: 'Saúde',
        options: ['Plano de Saúde', 'Farmácia', 'Consultas', 'Exames', 'Dentista', 'Óculos/Lentes', 'Academia', 'Terapias']
    },
    {
        label: 'Educação',
        options: ['Mensalidade', 'Material Escolar', 'Transporte Escolar', 'Cursos', 'Livros']
    },
    {
        label: 'Lazer & Cultura',
        options: ['Cinema/Teatro', 'Shows/Eventos', 'Viagens', 'Streaming', 'Assinaturas', 'Hobbies']
    },
    {
        label: 'Roupas & Cuidados Pessoais',
        options: ['Roupas/Calçados', 'Lavanderia', 'Salão/Barbearia', 'Cosméticos', 'Higiene Pessoal']
    },
    {
        label: 'Obrigações Financeiras',
        options: ['Impostos', 'Empréstimos', 'Fatura Cartão', 'Previdência Privada', 'Pensão']
    },
    {
        label: 'Despesas Domésticas',
        options: ['Utensílios', 'Eletrodomésticos', 'Móveis/Decoração', 'Produtos de Limpeza']
    },
    {
        label: 'Animais de Estimação',
        options: ['Ração', 'Higiene Pet', 'Veterinário', 'Pet Shop']
    },
    {
        label: 'Diversos',
        options: ['Presentes', 'Doações', 'Taxas Bancárias', 'Multas', 'Eventos Especiais', 'Outros']
    }
];


const categoryIconMap: { [key: string]: React.ElementType } = {
    // Moradia
    'Aluguel': Home,
    'Financiamento': Building2,
    'Condomínio': Building2,
    'IPTU': Landmark,
    'Luz': Lightbulb,
    'Água': Droplets,
    'Gás': Flame,
    'Internet': Wifi,
    'Telefone': Phone,
    'Streaming TV': Tv,
    'Seguro Residencial': Shield,
    'Manutenção': Wrench,
    'Limpeza': SprayCan,

    // Alimentação
    'Supermercado': ShoppingCart,
    'Padaria': ShoppingBasket,
    'Açougue/Peixaria': ShoppingBasket,
    'Restaurante': Utensils,
    'Lanchonete': Pizza,
    'Delivery': Package,
    'Café': Coffee,
    'Bebidas': Beer,

    // Transporte
    'Combustível': Fuel,
    'Transporte Público': Bus,
    'App de Transporte': Car,
    'Estacionamento': ParkingCircle,
    'Pedágio': CircleDollarSign,
    'Manutenção Veículo': Wrench,
    'Seguro Veículo': Shield,
    'IPVA/Licenciamento': Banknote,
    'Lavagem Veículo': Car,

    // Saúde
    'Plano de Saúde': HeartPulse,
    'Farmácia': Pill,
    'Consultas': Stethoscope,
    'Exames': Mic,
    'Dentista': PersonStanding,
    'Óculos/Lentes': PersonStanding,
    'Academia': Dumbbell,
    'Terapias': Speaker,

    // Educação
    'Mensalidade': GraduationCap,
    'Material Escolar': Pencil,
    'Transporte Escolar': Bus,
    'Cursos': Book,
    'Livros': Book,

    // Lazer & Cultura
    'Cinema/Teatro': Clapperboard,
    'Shows/Eventos': Ticket,
    'Viagens': Plane,
    'Streaming': Film,
    'Assinaturas': Receipt,
    'Hobbies': Pickaxe,

    // Roupas & Cuidados Pessoais
    'Roupas/Calçados': Shirt,
    'Lavanderia': Shirt,
    'Salão/Barbearia': Scissors,
    'Cosméticos': Brush,
    'Higiene Pessoal': PersonStanding,

    // Obrigações Financeiras
    'Impostos': Landmark,
    'Empréstimos': Banknote,
    'Fatura Cartão': Receipt,
    'Previdência Privada': Shield,
    'Pensão': HandHeart,

    // Despesas Domésticas
    'Utensílios': Utensils,
    'Eletrodomésticos': Speaker,
    'Móveis/Decoração': Building2,
    'Produtos de Limpeza': SprayCan,

    // Animais de Estimação
    'Ração': Bone,
    'Higiene Pet': PawPrint,
    'Veterinário': Stethoscope,
    'Pet Shop': Dog,

    // Diversos
    'Presentes': Gift,
    'Doações': HandHeart,
    'Taxas Bancárias': Banknote,
    'Multas': CircleDollarSign,
    'Eventos Especiais': Ticket,
    'Outros': Tag
};

export const getIconForCategory = (category: string) => {
    return categoryIconMap[category] || Tag;
};
