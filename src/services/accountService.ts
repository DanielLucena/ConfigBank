import { AccountRepository } from "../repositories/accountRepository";
import { accountSchema, Account, bonusAccountSchema, BonusAccount, SavingsAccount } from "../schemas/accountSchema";

export class AccountService {
  constructor(private repo = new AccountRepository()) { }

  async getAccount(number: number): Promise<Account> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number);
    return account;
  }

  async createAccount(number: number, type?: "bonus" | "savings", initialBalance?: number): Promise<Account> {
    const existing = await this.repo.findByNumber(number);
    if (existing) throw new Error("Account already exists");

    if (type === undefined && initialBalance === undefined) {
      throw new Error("Accounts require an initial balance");
    }

    if (type === "savings" && initialBalance === undefined) {
      throw new Error("Savings accounts require an initial balance");
    }

    let account: Account;
    if (type === "bonus") {
      account = {
        number,
        balance: 0,
        type: "bonus",
        points: 10,
      };
    } else if (type === "savings") {
      account = {
        number,
        balance: initialBalance!,
        type: "savings",
      };
    } else {
      account = {
        number,
        balance: initialBalance!,
        type: type || "normal",
      };
    }

    accountSchema.parse(account);
    const all = await this.repo.getAll();
    all.push(account);

    await this.repo.save(all);
    return account;
  }

  async getAccountBalance(number: number): Promise<number> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number)

    return account.balance;
  }

  async creditToAccount(number: number, amount: number, isTransfer = false): Promise<Account> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number)

    if (amount < 0) {
      throw new Error("Transfer amount must not be negative");
    }

    const all = await this.repo.getAll();
    const updated = all.map(acc => {
      if (acc.number === number) {
        let newAccount = { ...acc, balance: acc.balance + amount };

        if (acc.type === "bonus" && !isTransfer) {
          const typedAccount = acc as BonusAccount;
          const points = Math.floor(amount / 100);
          return { ...newAccount, points: (typedAccount.points ?? 0) + points };
        }

        return newAccount;
      }
      return acc;
    });

    await this.repo.save(updated);

    const updatedAccount = updated.find(acc => acc.number === number);
    if (!updatedAccount) throw new Error("Something went wrong updating the account");
    return updatedAccount;
  }

  async debitFromAccount(number: number, amount: number): Promise<Account> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number);

    if (amount < 0) {
      throw new Error("Transfer amount must not be negative");
    }

    if ((account.type === "normal" || account.type === "bonus") && (account.balance - amount) < -1000) {
      throw new Error("This operation would exceed the negative balance limit of R$ -1.000,00");
    } else if (account.type === "savings" && account.balance < amount) {
      throw new Error("Insufficient funds");
    }

    const all = await this.repo.getAll();
    const updated = all.map(acc => {
      if (acc.number === number) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    });

    await this.repo.save(updated);

    const updatedAccount = updated.find(acc => acc.number === number);
    if (!updatedAccount) throw new Error("Something went wrong updating the account");
    return updatedAccount;
  }

  async transferBetweenAccounts(
    senderNumber: number,
    receiverNumber: number,
    amount: number
  ): Promise<{ from: Account; to: Account }> {
    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than zero");
    }

    const senderAccount = await this.repo.findByNumber(senderNumber);
    const receiverAccount = await this.repo.findByNumber(receiverNumber);
    if (senderAccount === null || receiverAccount === null) throw new Error("There is no account with number " + senderNumber);

    try {
      const updatedSender = await this.debitFromAccount(senderNumber, amount);
      const updatedReceiverAccount = await this.creditToAccount(receiverNumber, amount, true);

      if (updatedReceiverAccount.type === "bonus") {
        const all = await this.repo.getAll();
        const updated = all.map(acc => {
          const typedAccount = acc as BonusAccount;

          if (typedAccount.number === receiverNumber && typedAccount.type === "bonus") {
            const bonus = Math.floor(amount / 150);
            return { ...typedAccount, points: typedAccount.points + bonus };
          }
          return typedAccount;
        });

        await this.repo.save(updated);
      }

      const finalReceiver = await this.repo.findByNumber(receiverNumber);

      return { from: updatedSender!, to: finalReceiver! };
    }
    catch (err: any) {
      if (err.message.includes("Something went wrong updating the account")) {
        throw new Error("Something went wrong updating the accounts");
      }
      throw err;
    }
  }

  async earnInterest(interest: number): Promise<Account[]> {
    try {
      const all = await this.repo.getAll();
      const updated = all.map(acc => {
        if (acc.type === "savings") {
          const typedAccount = acc as SavingsAccount;
          return { ...typedAccount, balance: typedAccount.balance + (typedAccount.balance * (interest / 100)) };
        }
        return acc;
      });

      await this.repo.save(updated);

      const updatedAccounts = updated.filter(acc => acc.type === "savings");
      return updatedAccounts;
    } catch (err: any) {
      throw err;
    }
  }
}