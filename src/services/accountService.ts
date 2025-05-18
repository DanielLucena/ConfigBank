import { AccountRepository } from "../repositories/accountRepository";
import { accountSchema, Account } from "../schemas/accountSchema";

export class AccountService {
  constructor(private repo = new AccountRepository()) { }

  async createAccount(number: number): Promise<Account> {
    const existing = await this.repo.findByNumber(number);
    if (existing) throw new Error("Account already exists");

    const account: Account = accountSchema.parse({ number, balance: 0 });

    const all = await this.repo.getAll();
    all.push(account);

    await this.repo.save(all);
    return account;
  }

  async debitFromAccount(number: number, amount: number): Promise<Account> {
    const account = await this.repo.findByNumber(number);
    if (account === null) throw new Error("There is no account with number " + number)

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
async transferBetweenAccounts(
    senderNumber: number,
    receiverNumber: number,
    amount: number
  ): Promise<{ from: Account; to: Account }> {
    const senderAccount = await this.repo.findByNumber(senderNumber);
    if (senderAccount === null) throw new Error("There is no account with number " + senderNumber)

    const toAccount = await this.repo.findByNumber(receiverNumber);
    if (toAccount === null) throw new Error("There is no account with number " + receiverNumber)

    const all = await this.repo.getAll();
    const updated = all.map(acc => {
      if (acc.number === senderNumber) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.number === receiverNumber) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    });

    await this.repo.save(updated);

    const updatedsenderAccount = updated.find(acc => acc.number === senderNumber);
    const updatedReceiverAccount = updated.find(acc => acc.number === receiverNumber);

    if (!updatedsenderAccount || !updatedReceiverAccount) throw new Error("Something went wrong updating the accounts");
    return { from: updatedsenderAccount, to: updatedReceiverAccount };
  }
}