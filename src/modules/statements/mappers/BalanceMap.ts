import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        amount,
        description,
        type,
        created_at,
        updated_at,
        sender_id,
      }) => {
        const bal = {
          id,
        };

        if (sender_id) {
          Object.assign(bal, { sender_id });
        }

        // Só pra ficar igual o do desafio mesmo, tem utilidade nenhuma
        Object.assign(bal, {
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at,
        });

        return bal;
      }
    );

    return {
      balance: Number(balance),
      statement: parsedStatement,
    };
  }
}
