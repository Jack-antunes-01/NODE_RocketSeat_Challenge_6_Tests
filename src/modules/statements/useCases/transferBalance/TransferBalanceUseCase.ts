import { injectable, inject } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferBalanceDTO } from "./ITransferBalanceDTO";
import { TransferBalanceError } from "./TransferBalanceError";

@injectable()
class TransferBalanceUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    user_id,
    sender_id,
    amount,
    description,
  }: ITransferBalanceDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(sender_id);

    if (!user) {
      throw new TransferBalanceError.UserNotFound();
    }

    const user_to_transfer = await this.usersRepository.findById(user_id);

    if (!user_to_transfer) {
      throw new TransferBalanceError.UserToTransferNotFound();
    }

    if (amount <= 0) {
      throw new TransferBalanceError.InsufficientTransferAmount();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: user.id as string,
    });

    if (balance < amount) {
      throw new TransferBalanceError.InsufficientFunds();
    }

    const transference = await this.statementsRepository.transferBalance({
      user_id,
      amount,
      description,
      sender_id,
    });

    return transference;
  }
}

export { TransferBalanceUseCase };
