import React, { Component } from 'react';
import styles from './components.css';

class TextBar extends Component {
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
    setTimeout(() => {
      onBlur();
    }, 50);
  }

  handleFocusInput = () => {
    this.Input.focus();
  }

  textOnBlur = () => {
    this.props.KeyboardDrop();
  }

  render() {
    const { value } = this.state;
    const placeholder = this.props.placeholder || '';

    // 键盘退出 样式
    const inputItems = document.querySelectorAll('input');
    inputItems.forEach((ele) => {
      ele.addEventListener('blur', () => {
        this.props.KeyboardDrop();
      });
    });

    return (
      <div>
        <div className={styles['text-content']} onClick={this.handleFocusInput}>
          <textarea
            ref={(e) => {
              this.Input = e;
            }}
            name="TextBar"
            id=""
            cols="30"
            rows="10"
            value={value}
            placeholder={placeholder}
            onChange={this.handleChange}
            onBlur={this.textOnBlur}
          />
        </div>
      </div>
    );
  }
}
export default TextBar;
