import React from 'react';
import { fetchRequest } from '../utils';

class CreditScore extends React.Component {
  state = {
    months: [],
    balance: 0,
    salaries: [],
    burnRates: [],
    totalCredit: 0,
    totalDebit: 0,
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id && this.props.id) {
      this.runner();
    }
  }

  calculateData = () => {
    const { months } = this.state;
    const burnRates = [],
      salaries = [];

    let totalDebit = 0,
      totalCredit = 0;

    months.forEach((month) => {
      let debit = 0,
        credit = 0;

      month.forEach((entry) => {
        if (entry.type === 'debit') {
          debit += entry.amount;
          totalDebit += entry.amount;
        } else {
          credit += entry.amount;
          totalCredit += entry.amount;

          if (entry.narration.match(/salary/i)) {
            salaries.push(entry.amount);
          }
        }
      });

      const burnRate = (debit / credit) * 100;
      burnRates.push(burnRate);

      console.log({
        debit,
        credit,
        burnRate,
      });
    });

    const sum = (accumulator, current) => accumulator + current;

    console.log({
      salaries,
      totalDebit,
      totalCredit,
      averageSalary: salaries.reduce(sum) / 6,
      averageBurnRate: burnRates.reduce(sum) / 6,
    });
  };

  fetchAccountBalance = async () => {
    const { balance = 0 } = await fetchRequest(
      {
        url: `/accounts/${this.props.id}/balance`,
      },
      (err) => {
        console.err(`Couldn't fetch balance`, { err });
      }
    );

    this.setState({ balance: Number(balance) });
  };

  fetchAccountData = async () => {
    const { id } = this.props;
    const months = [[], [], [], [], [], []];
    let next = true,
      page = 0;

    while (next) {
      try {
        const response = await fetchRequest({
          url: `/accounts/${id}/transactions?start=01-02-2020&end=01-07-2020&page=${++page}`,
        });
        response.data.forEach((entry) => {
          months[new Date(entry.date).getUTCMonth() - 1].push(entry);
        });
        next = response.paging.next;
      } catch (err) {
        console.error(err);
      }
    }

    this.setState({ months });
  };

  runner = async () => {
    await this.fetchAccountData();
    await this.fetchAccountBalance();
    this.calculateData();
    this.props.calculateEligibility();
  };

  render() {
    return <div></div>;
  }
}

export default CreditScore;
