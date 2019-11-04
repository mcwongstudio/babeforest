import React, { Component } from 'react';
import styles from './components.css';

class InputBar extends Component {
  state = {
    value: '',
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  handleFocusInput = () => {
    this.Input.focus();
  }

  render() {
    const category = this.props.category || 'input';
    const placeholder = this.props.placeholder || '';
    const required = this.props.required || false;
    const type = this.props.type || 'text';
    return (
      <div className={styles['input-bar']} onClick={this.handleFocusInput}>
        {
          category === 'input' ?
            <input
              ref={(e) => {
                this.Input = e;
              }}
              type={type}
              placeholder={placeholder}
              value={this.state.value}
              onChange={this.handleChange}
              required={required}
            />
            :
            <textarea
              ref={(e) => {
                this.Input = e;
              }}
              rows={3}
              placeholder={placeholder}
              value={this.state.value}
              onChange={this.handleChange}
            />
        }
      </div>
    );
  }
}

export default InputBar;
