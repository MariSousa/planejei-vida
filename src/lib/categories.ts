
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

export const getIconForCategory = (category: string) => {
    return () => null;
};
