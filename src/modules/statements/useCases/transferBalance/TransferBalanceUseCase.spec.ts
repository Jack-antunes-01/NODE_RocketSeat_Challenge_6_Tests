import { TransferBalanceUseCase } from "./TransferBalanceUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";

let transferBalanceUseCase: TransferBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

const user_mock = {
  email: "lidaob@tattauk.wf",
  name: "Robert Vargas",
  password: "ZIZZRD15a8bsOX",
};

const user_to_transfer_mock = {
  email: "otiucu@lavakjo.gi",
  name: "Nina Hunter",
  password: "QkpwCiO",
};

describe("TransferBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    transferBalanceUseCase = new TransferBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should not be able to transfer money if user does't exists", async () => {
    await expect(
      transferBalanceUseCase.execute({
        sender_id: "1234",
        amount: 120,
        user_id: "142",
        description: "Test user",
      })
    ).rejects.toEqual(new AppError("User not found", 404));
  });

  it("should not be able to transfer money if user to transfer doesn't exist", async () => {
    const user = await inMemoryUsersRepository.create(user_mock);

    await expect(
      transferBalanceUseCase.execute({
        sender_id: user.id as string,
        amount: 120,
        user_id: "OtoWWpY",
        description: "Test another user",
      })
    ).rejects.toEqual(new AppError("User to transfer not found", 404));
  });

  it("should not be able to transfer money if balance isn't enough", async () => {
    const user = await inMemoryUsersRepository.create(user_mock);

    const user_to_transfer = await inMemoryUsersRepository.create(
      user_to_transfer_mock
    );

    await expect(
      transferBalanceUseCase.execute({
        sender_id: user.id as string,
        amount: 120,
        user_id: user_to_transfer.id as string,
        description: "Test balance",
      })
    ).rejects.toEqual(new AppError("Insufficient funds"));
  });

  it("should be able to transfer money", async () => {
    const user = await inMemoryUsersRepository.create(user_mock);

    const user_to_transfer = await inMemoryUsersRepository.create(
      user_to_transfer_mock
    );

    await inMemoryStatementsRepository.create({
      amount: 120,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    await transferBalanceUseCase.execute({
      sender_id: user.id as string,
      amount: 120,
      user_id: user_to_transfer.id as string,
      description: "Test balance",
    });

    const { balance: sender_balance } =
      await inMemoryStatementsRepository.getUserBalance({
        user_id: user.id as string,
      });

    const { balance: receiver_balance } =
      await inMemoryStatementsRepository.getUserBalance({
        user_id: user_to_transfer.id as string,
      });

    expect(sender_balance).toBe(0);
    expect(receiver_balance).toBe(120);
  });
});
