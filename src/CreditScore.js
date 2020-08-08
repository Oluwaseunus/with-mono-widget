import { fetchRequest } from "./utils";

class CreditScore {
  constructor() {
    this.balance = 0;
    this.months = [];
  }

  fetchAccountBalance = async (id) => {
    const { balance = 0 } = await fetchRequest(
      {
        url: `/accounts/${id}`
      },
      (err) => {
        console.err(`Couldn't fetch balance`, { err });
      }
    );

    this.balance = Number(balance);
  };

  fetchAccountData = async (id) => {
    const totalSalary = await this.fetchData(
      id,
      "&narration=salary&type=credit"
    );
    const totalDebits = await this.fetchData(id, "&type=debit");

    return {
      totalSalary,
      totalDebits,
      balance: this.balance
    };
  };

  fetchData = async (id, query) => {
    let sum = 0,
      page = 0,
      next = true;

    while (next) {
      try {
        const response = await fetchRequest({
          url: `/accounts/${id}/transactions?start=01-02-2020&end=01-07-2020${
            query || ""
          }&page=${++page}`
        });

        response.data.forEach((entry) => {
          sum += entry.amount;
        });
        next = response.paging.next;
      } catch (err) {
        console.error(err);
      }
    }

    return sum;
  };

  runner = async (id) => {
    await this.fetchAccountBalance(id);
    return await this.fetchAccountData(id);
  };
}

export default new CreditScore();
