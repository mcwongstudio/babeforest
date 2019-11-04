import React, { Component } from 'react';
import styles from './components.css';

class InputBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
    const { onBlur } = this.props;
    if (onBlur) {
      setTimeout(() => {
        onBlur();
      }, 50);
    }
  }

  handleFocusInput = () => {
    this.Input.focus();
  }

  render() {
    const { value } = this.state;
    const type = this.props.type || 'text';
    const placeholder = this.props.placeholder || '';
    const label = this.props.label || '输入框';
    return (
      <div className={styles['input-bar']}>
        <div className={styles['input-label']}>{ label }</div>
        <div className={styles['input-content']} onClick={this.handleFocusInput}>
          <input
            ref={(e) => {
              this.Input = e;
            }}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default InputBar;
