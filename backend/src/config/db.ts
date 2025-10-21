import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "regina_cosmetologist",
    user: process.env.DB_USER  || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),

    connect: () => pool.connect()
};
