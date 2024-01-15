interface DBConnector {
    connect(): Promise<void>;
    readOne(query: string, args: any[]): Promise<any>;
    readMany(query: string, args: any[]): Promise<any[]>;
    write(query: string, args: any[]): Promise<void>;
    disconnect(): Promise<void>;
}

export default DBConnector;
