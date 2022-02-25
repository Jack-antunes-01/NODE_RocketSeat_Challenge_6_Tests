import { v4 as uuidv4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should not be be able to create statement if user doesn't exist", async () => {
    expect(async () => {
      const statement = {
        user_id: uuidv4(),
        amount: 2000,
        type: OperationType.DEPOSIT,
        description: "Test",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to withdraw if balance isn't enough", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "teste@teste.com",
        name: "teste",
        password: "1234",
      });

      const statement = {
        user_id: user.id as string,
        amount: 2000,
        type: OperationType.WITHDRAW,
        description: "Test withdraw",
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create statement", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "teste@teste.com",
      name: "teste",
      password: "1234",
    });

    const deposit = {
      user_id: user.id as string,
      amount: 2000,
      type: OperationType.DEPOSIT,
      description: "Test deposit",
    };

    const depositStatement = await createStatementUseCase.execute(deposit);

    const withdraw = {
      user_id: user.id as string,
      amount: 2000,
      type: OperationType.WITHDRAW,
      description: "Test withdraw",
    };

    const withdrawStatement = await createStatementUseCase.execute(withdraw);

    expect(depositStatement).toHaveProperty("id");
    expect(withdrawStatement).toHaveProperty("id");
  });
});
