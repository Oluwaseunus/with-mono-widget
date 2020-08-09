import React from 'react';
import './App.css';
import Form from './components/Form';
import CreditScore from './CreditScore';

class App extends React.Component {
  state = {
    id: '',
    code: '',
    status: '',
    loanAmount: 0,
  };

  componentDidMount() {
    document.addEventListener('DOMContentLoaded', () => {
      const { Connect } = window;

      this.connect = new Connect(process.env.REACT_APP_PUBLIC_KEY, {
        onSuccess: (response) => {
          this.setState({ code: response.code });
          this.getEnrolledAccount(response.code);
        },
        onClose: () => {
          console.log('Widget closed.');
        },
      });

      this.connect.setup();
    });
  }

  async componentDidUpdate(_, prevState) {
    if (prevState.id !== this.state.id && this.state.id) {
      const data = await CreditScore.runner(this.state.id);
      this.calculateEligibility(data);
    }
  }

  calculateEligibility = (data) => {
    // assuming 6 months is the history period and
    // the number of months required to repay the loan.
    const duration = 6;
    const loanAmount = this.state.loanAmount * 100;
    const { balance, totalSalary, totalDebits } = data;

    const averageSalary = totalSalary / duration;

    // assuming employment status doesn't change
    // and the sum of salaries for the previous and next six months remains the same

    const eligibility =
      loanAmount < averageSalary ||
      balance + loanAmount + averageSalary * duration - totalDebits >
        loanAmount;

    this.setState({
      status: eligibility ? 'eligible' : 'not eligible',
    });
    this.connect.close();
  };

  connectWidget = (loanAmount) => {
    this.setState({ loanAmount });
    this.connect.open();
  };

  getEnrolledAccount = async () => {
    const { code } = this.state;

    try {
      const response = await fetch('https://api.withmono.com/account/auth', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json',
          'mono-sec-key': process.env.REACT_APP_SECRET,
        },
      });

      const { id } = await response.json();
      this.setState({ id });
    } catch (err) {
      console.error('Request failed!', { err });
    }
  };

  render() {
    const { status } = this.state;

    return (
      <div className='App'>
        <Form connect={this.connectWidget} />
        {status ? <div>You are {status} for this loan.</div> : null}
      </div>
    );
  }
}

export default App;
