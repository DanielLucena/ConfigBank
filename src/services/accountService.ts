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
}