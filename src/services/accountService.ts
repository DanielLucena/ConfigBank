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
}