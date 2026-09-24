/**
 * js/data.js — Fonte de dados estática (simula resposta de API).
 */
export const AppData = {
  doacoes: [
    {
      badges: [
        { label: "Urgente", variant: "warning" },
        { label: "Alimentação", variant: "info" },
      ],
      title: "Arrecadação de Alimentos",
      titleTag: "h2",
      description:
        "Doações destinadas à montagem de cestas básicas para famílias em situação de extrema vulnerabilidade.",
      listType: "ul",
      items: [
        "Arroz, feijão e óleo vegetal",
        "Leite em pó e suplementos infantis",
        "Chave PIX: doacoes@acaosolidaria.org",
      ],
      ctaLabel: "Doar Agora",
      ctaClass: "btn btn-secondary",
      ctaHref: "#/cadastro",
    },
    {
      badges: [
        { label: "Recorrente", variant: "success" },
        { label: "Financeiro", variant: "info" },
      ],
      title: "Fundo de Apoio Continuado",
      titleTag: "h2",
      description:
        "Manutenção das sedes operacionais e compra de suprimentos de higiene e saúde.",
      listType: "ul",
      items: [
        "Contribuição mensal flexível",
        "Prestação de contas mensal pública",
      ],
      ctaLabel: "Apoiar Mensalmente",
      ctaClass: "btn btn-primary",
      ctaHref: "#/cadastro",
    },
  ],

  voluntariado: [
    {
      badges: [{ label: "Vagas Abertas", variant: "success" }],
      title: "Educador Comunitário",
      titleTag: "h3",
      description:
        "Atuação em oficinas de reforço escolar para crianças e jovens da rede pública de ensino.",
      listType: "ol",
      items: [
        "Preenchimento do formulário de cadastro",
        "Participação na entrevista de alinhamento",
        "Treinamento institucional introdutório",
      ],
      ctaLabel: "Inscrever-se para Voluntariado",
      ctaClass: "btn btn-primary",
      ctaHref: "#/cadastro",
    },
  ],
};
