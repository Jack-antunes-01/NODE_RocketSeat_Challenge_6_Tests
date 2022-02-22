import { v4 as uuidv4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should not be able to get statement if user doesn't exist", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: uuidv4(),
        statement_id: uuidv4(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get statement if statement doesn't exist", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@test.com",
        password: "1234",
        name: "test",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: uuidv4(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to get statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      password: "1234",
      name: "test",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 2000,
      type: OperationType.DEPOSIT,
      description: "Deposit test",
    });

    const returnedStatement = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(returnedStatement).toHaveProperty("id");
    expect(returnedStatement.type).toBe(OperationType.DEPOSIT);
    expect(returnedStatement.amount).toBe(2000);
    expect(returnedStatement.description).toBe("Deposit test");
  });
});
