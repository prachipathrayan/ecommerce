export interface IDatabase{
    connect(): Promise<boolean | Error>;
    executeUpdateQuery(query: string): Promise<boolean | Error>;
    executeDeleteQuery(query: string): Promise<boolean | Error>;
}