import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { ITransferBalanceDTO } from "../useCases/transferBalance/ITransferBalanceDTO";

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>;
  findStatementOperation: (
    data: IGetStatementOperationDTO
  ) => Promise<Statement | undefined>;
  getUserBalance: (
    data: IGetBalanceDTO
  ) => Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  >;
  transferBalance(data: ITransferBalanceDTO): Promise<Statement>;
}
