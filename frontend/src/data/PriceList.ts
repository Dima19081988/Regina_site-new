export type Service = {
    id: number;
    name: string;
    volume: string;
    price: number;
};

export type Category = {
    id: number;
    title: string;
    services: Service[];
};

export const priceListData: Category[] = [
    {
        id: 1,
        title: 'Мезотерапия',
        services: [
            { id: 1, name: 'NCTF 135 HA', volume: '3 ml', price: 5000 },
            { id: 2, name: 'NCTF 135 HA+', volume: '3 ml', price: 5600 },
            { id: 3, name: 'Mesosculpt C7', volume: '1 ml', price: 10500 },
            { id: 4, name: 'Mesoeye C71', volume: '1 ml', price: 10500 },
            { id: 5, name: 'Mesoline Acne', volume: '5 ml', price: 3500 },
            { id: 6, name: 'Mesoline slim', volume: '5 ml', price: 3500 },
            { id: 7, name: 'DMAE', volume: '5 ml', price: 2500 },
            { id: 8, name: 'Dermaheal HL', volume: '5 ml', price: 3000 },
            { id: 9, name: 'Dermaheal HSR', volume: '5 ml', price: 3000 },
        ]
    },
    {
        id: 2,
        title: 'Биоревитализация',
        services: [
            { id: 1, name: 'IAL-system 1.1', volume: '1.1 ml', price: 7800 },
            { id: 2, name: 'IAL-system ACP', volume: '1.1 ml', price: 9200 },
            { id: 3, name: 'Juvederm Hydrate', volume: '1 ml', price: 10000 },
            { id: 4, name: 'Juvederm Volite', volume: '1 ml', price: 14000 },
            { id: 5, name: 'Viscoderm 1.6%', volume: '1.5 ml', price: 8600 },
            { id: 6, name: 'Meso-Wharton P199', volume: '1.5 ml', price: 11000 },
            { id: 7, name: 'Meso-Xanthin F199', volume: '1.5 ml', price: 11000 },
            { id: 8, name: 'Restyane Vital', volume: '1 ml', price: 11200 },
            { id: 9, name: 'Aquashine BR', volume: '2 ml', price: 10600 },
            { id: 10, name: 'Aquashine HA', volume: '2 ml', price: 10600 },
        ]    
    },
    {
        id: 3,
        title: 'Контурная пластика',
        services: [
            { id: 1, name: 'Restylane', volume: '1 ml', price: 12800 },
            { id: 2, name: 'Restylane Perlane', volume: '1 ml', price: 13500 },
            { id: 3, name: 'Juvederm Ultra 3', volume: '1 ml', price: 12000 },
            { id: 4, name: 'Juvederm Ultra 4', volume: '1 ml', price: 13000 },
            { id: 5, name: 'Surgiderm 24XP', volume: '0.8 ml', price: 11600 },
            { id: 6, name: 'Teosyal Redensity 2', volume: '1 ml', price: 13000 },
            { id: 7, name: 'Filorga X-HA 3', volume: '1 ml', price: 11500 },
            { id: 8, name: 'Filorga X-HA Volume', volume: '1 ml', price: 12000 },
            { id: 9, name: 'Revanesse Ultra', volume: '1 ml', price: 12200 },
            { id: 10, name: 'Redexis', volume: '1 ml', price: 13200 },
            { id: 11, name: 'Radiesse', volume: '1.5 ml', price: 19500 },
        ]
    },
    {
        id: 4,
        title: 'Ботулинотерапия',
        services: [
            { id: 1, name: 'Диспорт', volume: '1 ЕД', price: 120 },
            { id: 2, name: 'Ботокс', volume: '1 ЕД', price: 320 },
            { id: 3, name: 'Ксеомин', volume: '1 ЕД', price: 300 },
        ]
    },
    {
        id: 5,
        title: 'Плацентотерапия',
        services: [
            { id: 1, name: 'Laennec', volume: '2 ml', price: 2700 },
            { id: 2, name: 'Curacen', volume: '2 ml', price: 4500 },
            { id: 3, name: 'Melsmon', volume: '2 ml', price: 3500 },
        ]
    },
    {
        id: 6,
        title: 'Химические пилинги',
        services: [
            { id: 1, name: 'Retises ST', volume: '', price: 4500 },
            { id: 2, name: 'Mandelac L', volume: '', price: 2800 },
            { id: 3, name: 'PRX-T 33', volume: '', price: 5000 },
            { id: 4, name: 'Rose de mer', volume: '', price: 3000 },
        ]
    },
]