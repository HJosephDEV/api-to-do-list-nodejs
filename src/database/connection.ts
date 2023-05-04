import mysql, { Query, Connection } from "mysql2";
import dotenv from "dotenv";

import { IResponseJson } from "../components/base/interfaces/response-json.interface";

dotenv.config();

var db: Connection;
var isConnected = false;

export const connect: Function = (): Promise<IResponseJson> => new Promise((resolve, reject) => {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    let status = false;

    db.connect((error) => {
        try {
            if(error) throw error;
            status = true;
            isConnected = true;
            resolve({status: status, data: null});
        } catch(error: any) {
            reject(error);
        }
        
    });
})

export const executeQuery: Function = async(query: Query): Promise<IResponseJson> => new Promise((resolve, reject) => {
    let status = false;

    db.query(query, (error, results) => {
        try {
            if (error) throw error;
            status = true;
            resolve({status: status, data: results});
        } catch(error: any) {
            reject(error);
        }
    });
})

export const disconnect: Function = async (): Promise<void> =>  new Promise((resolve, reject) => { 
    db.end((error) => {
        if(error) reject(error);
        resolve();
    });
});

