import React from 'react';

class Form extends React.Component {
  state = {
    email: 'oluwaseunus@gmail.com',
    amount: 120000,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.connect(this.state.amount);
  };

  render() {
    const { email, amount } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor='email'>Email: </label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={this.handleChange}
        />

        <label htmlFor='amount'>Amount: </label>
        <input
          type='number'
          name='amount'
          value={amount}
          onChange={this.handleChange}
        />

        <button>Authenticate</button>
      </form>
    );
  }
}

export default Form;
