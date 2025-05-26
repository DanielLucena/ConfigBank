import { AccountRepository } from "../repositories/accountRepository";
import { accountSchema, Account } from "../schemas/accountSchema";

export class AccountService {
  constructor(private repo = new AccountRepository()) { }

  async createAccount(number: number, initialBalance?: number): Promise<Account> {
    const existing = await this.repo.findByNumber(number);
    if (existing) throw new Error("Account already exists");

    if( initialBalance === undefined) {
      throw new Error("Accounts require an initial balance");
    }

    const account: Account = accountSchema.parse({ number, balance: initialBalance });

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

  async creditToAccount(number: number, amount: number): Promise<Account> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number)

    const all = await this.repo.getAll();
    const updated = all.map(acc => {
      if (acc.number === number) {
        return { ...acc, balance: acc.balance + amount };
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
    if (account === null) throw new Error("There is no account with number " + number)

    if (account.balance < amount) throw new Error("Insufficient funds");

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
    try {
      const updatedsenderAccount = await this.debitFromAccount(senderNumber, amount);
      const updatedReceiverAccount = await this.creditToAccount(receiverNumber, amount);
      return { from: updatedsenderAccount, to: updatedReceiverAccount };
    }
    catch (err: any) {
      if (err.message.includes("Something went wrong updating the account")) {
        throw new Error("Something went wrong updating the accounts");
      }
      throw err;
    }
  }
}