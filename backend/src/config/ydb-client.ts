// // src/config/ydb-client.ts
// import { config } from 'dotenv';
// config();

// // Обходим TypeScript и ESM через require
// // @ts-ignore
// const ydb = require('@yandex-cloud/nodejs-sdk');

// let driver: any = null;

// export const initYdbDriver = () => {
//   if (driver) return driver;

//   driver = new ydb.Driver({
//     endpoint: process.env.YDB_ENDPOINT!,
//     database: process.env.YDB_DATABASE!,
//     authService: ydb.getCredentialsFromEnv(),
//   });

//   return driver;
// };

// export const getYdbSession = async () => {
//   const drv = initYdbDriver();
//   await drv.ready(10000);
//   return drv.tableClient.createSession();
// };

// export const closeYdbDriver = async () => {
//   if (driver) {
//     await driver.destroy();
//     driver = null;
//   }
// };
