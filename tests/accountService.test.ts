import { AccountService } from '../src/services/accountService';
import { AccountRepository } from '../src/repositories/accountRepository';
import { Account } from '../src/schemas/accountSchema';

import { jest } from '@jest/globals';

jest.mock('../src/repositories/accountRepository');

const MockedRepo = AccountRepository as jest.MockedClass<typeof AccountRepository>;

describe('AccountService', () => {
  let service: AccountService;
  let repo: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    repo = new MockedRepo() as jest.Mocked<AccountRepository>;
    service = new AccountService(repo);
  });

  describe('createAccount', () => {
    it('should create normal account', async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };

      repo.getAll.mockResolvedValue([]);
      repo.save.mockResolvedValue();

      const result = await service.createAccount(account.number, undefined, account.balance);

      expect(result).toEqual(account);
    });

    it('should create bonus account', async () => {
      const account: Account = { number: 1, type: 'bonus', balance: 0, points: 10 };

      repo.getAll.mockResolvedValue([]);
      repo.save.mockResolvedValue();

      const result = await service.createAccount(account.number, 'bonus', account.balance);

      expect(result).toEqual(account);
    });

    it('should create savings account', async () => {
      const account: Account = { number: 1, type: 'savings', balance: 1000 };

      repo.getAll.mockResolvedValue([]);
      repo.save.mockResolvedValue();

      const result = await service.createAccount(account.number, 'savings', account.balance);

      expect(result).toEqual(account);
    });

    it('should throw if account already exists', async () => {
      const account: Account = { number: 1, type: 'savings', balance: 1000 };

      service.createAccount(1, "savings", 100 );
      repo.findByNumber.mockResolvedValue(account);
      repo.getAll.mockResolvedValue([account]);

      await expect(service.createAccount(1, "savings", 100)).rejects.toThrow(
        "Account already exists"
      );
    });

    it('should throw if account does not have a initial balance', async () => {
      await expect(service.createAccount(1, undefined, undefined)).rejects.toThrow(
        "Accounts require an initial balance"
      );
    });

    it('should throw if savings account does not have a initial balance', async () => {
      await expect(service.createAccount(1, 'savings', undefined)).rejects.toThrow(
        "Savings accounts require an initial balance"
      );
    });
  });

  describe('getAccount', () => {
    it('should return normal account', async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should return bonus account', async () => {
      const account: Account = { number: 1, type: 'bonus', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should return savings account', async () => {
      const account: Account = { number: 1, type: 'savings', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should throw if account does not exist', async () => {
      repo.findByNumber.mockResolvedValue(null);
      await expect(service.getAccount(8)).rejects.toThrow(
        "There is no account with number 8"
      );
    });
  });

  describe('getBalance', () => {
    it("should return the balance of a existing account", async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccountBalance(1);

      expect(result).toEqual(account.balance);
    });
    
    it("should throw if account does not exist", async () => {
      repo.findByNumber.mockResolvedValue(null);
      await expect(service.getAccountBalance(999)).rejects.toThrow(
        "There is no account with number 999"
      );
    });
  });

  describe('debitFromAccount', () => {
    it('should debit from account', async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.debitFromAccount(1, amount);

      expect(result).toEqual({ ...account, balance: 800 });
    });

    it('should throw if transfer amount is negative', async () => {
      await expect(service.debitFromAccount(1, -100)).rejects.toThrow(
        "Transfer amount must not be negative"
      );
    });

    it('should throw if the balance would exceed negative limit for normal and bonus accounts', async () => {
      const account: Account = { number: 1, type: 'normal', balance: -900 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      await expect(service.debitFromAccount(1, amount)).rejects.toThrow(
        "This operation would exceed the negative balance limit of R$ -1.000,00"
      );
    });

    it('should throw if the balance would exceed negative limit for savings accounts', async () => {
      const account: Account = { number: 1, type: 'savings', balance: 100 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      await expect(service.debitFromAccount(1, amount)).rejects.toThrow(
        "Insufficient funds"
      );
    });
  });

  describe('creditToAccount', () => {
    it('should credit to account', async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.creditToAccount(1, amount);

      expect(result).toEqual({ ...account, balance: 1200 });
    })

    it('should throw if transfer amount is negative', async () => {
      await expect(service.creditToAccount(1, -100)).rejects.toThrow(
        "Transfer amount must not be negative"
      );
    });
    
    it('should credit bonus points for bonus accounts', async () => {
      const account: Account = { number: 1, type: 'bonus', balance: 1000, points: 10 };
      const amount = 300;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.creditToAccount(1, amount);

      expect(result).toEqual({ ...account, balance: 1300, points: 13 }); // 300 / 100 = 3 pontos
    });

    it('should throw if account does not exist', async () => {
      repo.findByNumber.mockResolvedValue(null);
      await expect(service.creditToAccount(1, 100)).rejects.toThrow(
        "There is no account with number 1"
      );
    });
  });

  describe('transferBetweenAccounts', () => {
    it('should transfer funds between normal accounts', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: 1000 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;

      const debitedSender = { ...sender, balance: 800 };
      const creditedReceiver = { ...receiver, balance: 700 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(debitedSender);
        if (num === 2) return Promise.resolve(creditedReceiver);
        return Promise.resolve(null);
      });

      service.debitFromAccount = jest.fn(async () => debitedSender) as AccountService['debitFromAccount'];
      service.creditToAccount = jest.fn(async () => creditedReceiver) as AccountService['creditToAccount'];

      repo.getAll.mockResolvedValue([debitedSender, creditedReceiver]);
      repo.save.mockResolvedValue();

      const result = await service.transferBetweenAccounts(1, 2, amount);

      expect(service.debitFromAccount).toHaveBeenCalledWith(1, amount);
      expect(service.creditToAccount).toHaveBeenCalledWith(2, amount, true);
      expect(result).toEqual({ from: debitedSender, to: creditedReceiver });
    });

    it('should apply bonus points if receiver is bonus account', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: 1000 };
      const receiver: Account = { number: 2, type: 'bonus', balance: 100, points: 10 };
      const amount = 300;

      const debitedSender = { ...sender, balance: 700 };
      const creditedReceiver = { ...receiver, balance: 400, points: 10 }; // antes do bônus

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(debitedSender);
        if (num === 2) return Promise.resolve(creditedReceiver);
        return Promise.resolve(null);
      });

      service.debitFromAccount = jest.fn(async () => debitedSender) as AccountService['debitFromAccount'];
      service.creditToAccount = jest.fn(async () => creditedReceiver) as AccountService['creditToAccount'];

      repo.getAll.mockResolvedValue([debitedSender, creditedReceiver]);
      repo.save.mockResolvedValue();

      const finalReceiver = { ...creditedReceiver, points: 12 }; // 300 / 150 = 2 bônus
      repo.findByNumber.mockResolvedValue(finalReceiver);

      const result = await service.transferBetweenAccounts(1, 2, amount);

      expect(repo.save).toHaveBeenCalledWith([
        { number: 1, type: 'normal', balance: 700 },
        { number: 2, type: 'bonus', balance: 400, points: 12 },
      ]);

      expect(result).toEqual({ from: debitedSender, to: finalReceiver });
    });

    it('should throw if transfer amount is negative or zero', async () => {
      await expect(service.transferBetweenAccounts(1, 2, -100)).rejects.toThrow(
        "Transfer amount must be greater than zero"
      );
      await expect(service.transferBetweenAccounts(1, 2, 0)).rejects.toThrow(
        "Transfer amount must be greater than zero"
      );
    });

    it('should throw if sender balance would exceed negative limit for normal and bonus accounts', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: -900 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(sender);
        if (num === 2) return Promise.resolve(receiver);
        return Promise.resolve(null);
      });

      await expect(service.transferBetweenAccounts(1, 2, amount)).rejects.toThrow(
        "This operation would exceed the negative balance limit of R$ -1.000,00"
      );
    });

    it('should throw if sender balance is insufficient for savings account', async () => {
      const sender: Account = { number: 1, type: 'savings', balance: 100 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;
      
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(sender);
        if (num === 2) return Promise.resolve(receiver);
        return Promise.resolve(null);
      });
      await expect(service.transferBetweenAccounts(1, 2, amount)).rejects.toThrow(
        "Insufficient funds"
      );
    });

    it('should throw if sender does not exist', async () => {
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(null); // sender não existe
        return Promise.resolve({ number: 2, type: 'normal', balance: 100 });
      });

      await expect(service.transferBetweenAccounts(1, 2, 50)).rejects.toThrow(
        'There is no account with number 1'
      );
    });

    it('should throw if receiver does not exist', async () => {
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve({ number: 1, type: 'normal', balance: 1000 });
        return Promise.resolve(null); // receiver não existe
      });

      await expect(service.transferBetweenAccounts(1, 2, 50)).rejects.toThrow(
        'There is no account with number 1'
      );
    });
  });

  describe('earnInterest', () => {
    it('should apply interest to all savings accounts', async () => {
      const savingsAccounts: Account[] = [
        { number: 1, type: 'savings', balance: 1000 },
        { number: 2, type: 'savings', balance: 500 },
      ];

      const otherAccounts: Account[] = [
        { number: 3, type: 'normal', balance: 200 },
        { number: 4, type: 'bonus', balance: 100, points: 5 },
      ];

      const allAccounts = [...savingsAccounts, ...otherAccounts];

      repo.getAll.mockResolvedValue(allAccounts);
      repo.save.mockResolvedValue(undefined);

      const result = await service.earnInterest(10); // 10% interest

      expect(repo.save).toHaveBeenCalledWith([
        { number: 1, type: 'savings', balance: 1100 },
        { number: 2, type: 'savings', balance: 550 },
        { number: 3, type: 'normal', balance: 200 },
        { number: 4, type: 'bonus', balance: 100, points: 5 },
      ]);

      expect(result).toEqual([
        { number: 1, type: 'savings', balance: 1100 },
        { number: 2, type: 'savings', balance: 550 },
      ]);
    });

    it('should return empty array if no savings accounts exist', async () => {
      const accounts: Account[] = [
        { number: 1, type: 'normal', balance: 100 },
        { number: 2, type: 'bonus', balance: 200, points: 10 },
      ];

      repo.getAll.mockResolvedValue(accounts);
      repo.save.mockResolvedValue(undefined);

      const result = await service.earnInterest(5);

      expect(repo.save).toHaveBeenCalledWith(accounts);
      expect(result).toEqual([]);
    });
  });
});