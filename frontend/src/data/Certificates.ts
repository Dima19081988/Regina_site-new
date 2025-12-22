export interface Certificate {
    id: string;
    title: string;
    image: string;
    pdfUrl: string;
    year: string;
    issuer: string;
};
export interface CertificateCategory{
    category: string;
    certificates: Certificate[];
};

export const CERTIFICATES_CATEGORIES: CertificateCategory[] = [
    {
        category: 'Ботулотоксины',
        certificates: [
            {
                id: 'botox-cert',
                title: 'Ботокс',
                image: '',
                pdfUrl: '',
                year: '',
                issuer: ''
            },
        ]
    },

    {
        category: 'Контурная пластика',
        certificates: [
            {
                id: 'fillers-cert',
                title: 'Juvederm',
                image: '',
                pdfUrl: '',
                year: '',
                issuer: ''
            }
        ]
    },

    {
        category: 'Биоревитализация',
        certificates: [
            {
                id: 'biorevital-cert',
                title: 'Restylane Vital',
                image: '',
                pdfUrl: '',
                year: '',
                issuer: ''
            }
        ]
    }
];