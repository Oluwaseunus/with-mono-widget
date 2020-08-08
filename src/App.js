import React from 'react';
import './App.css';
import Form from './components/Form';
import CreditScore from './components/CreditScore';

class App extends React.Component {
  state = {
    id: '',
    code: '',
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

  calculateEligibility = (data) => {
    const { loanAmount } = this.state;
    const { balance, averageBurnRate, averageSalary } = data;

    // ideally, something would be done here.
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
    return (
      <div className='App'>
        <Form connect={this.connectWidget} />
        <CreditScore
          id={this.state.id}
          calculateEligibility={this.calculateEligibility}
        />
      </div>
    );
  }
}

export default App;
