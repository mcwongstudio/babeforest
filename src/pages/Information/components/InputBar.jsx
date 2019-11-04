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
  }

  handleFocusInput = () => {
    this.Input.focus();
  }

  render() {
    const {
      label,
      required,
      type,
    } = this.props;
    const { value } = this.state;

    // 键盘退出 样式
    const inputItems = document.querySelectorAll('input');
    inputItems.forEach((ele) => {
      ele.addEventListener('blur', () => {
        this.props.KeyboardDrop();
      });
    });

    return (
      <div className={styles['input-bar']}>
        <div className={styles['input-label']}>
          <span>{ label }</span>
          {
            required ?
              <span className={styles['input-require']}>*</span>
              :
              null
          }
        </div>
        <div className={styles['input-content']} onClick={this.handleFocusInput}>
          <input
            type={type}
            value={value}
            onChange={this.handleChange}
            ref={(e) => {
              this.Input = e;
            }}
          />
        </div>
      </div>
    );
  }
}

export default InputBar;
