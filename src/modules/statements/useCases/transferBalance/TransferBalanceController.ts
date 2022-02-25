import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferBalanceUseCase } from "./TransferBalanceUseCase";

class TransferBalanceController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;
    const { id: sender_id } = req.user;
    const { amount, description } = req.body;

    const transferBalanceUseCase = container.resolve(TransferBalanceUseCase);

    const transference = await transferBalanceUseCase.execute({
      amount,
      description,
      sender_id,
      user_id: String(user_id),
    });

    return res.status(201).json(transference);
  }
}

export { TransferBalanceController };
