import React, { Component } from 'react';
import styles from './components.css';

class LoginPanel extends Component {
  state = {
    phone: '',
    password: '',
  }

  handleChangePhone = (e) => {
    const phone = e.target.value;
    this.setState({ phone });
  }

  handleChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ password });
  }

  handleResetPassowrd = () => {
    this.props.onResetPassowrd();
  }

  handleFocusMobile = () => {
    this.Mobile.focus();
  }

  handleFocusPassword = () => {
    this.Password.focus();
  }

  render() {
    const inputItems = document.querySelectorAll('input');
    inputItems.forEach((ele) => {
      ele.addEventListener('blur', () => {
        this.props.KeyboardDrop();
      });
    });
    return (
      <div className={styles['login-panel']}>
        <div className={styles['panel-title']}>会员登录</div>
        <div className={styles['phone-input-bar']} onClick={this.handleFocusMobile}>
          <input
            type="text"
            ref={(e) => {
              this.Mobile = e;
            }}
            placeholder="请输入手机号"
            onChange={this.handleChangePhone}
            value={this.state.phone}
          />
        </div>
        <div className={styles['password-input-bar']} onClick={this.handleFocusPassword}>
          <input
            type="password"
            ref={(e) => {
              this.Password = e;
            }}
            placeholder="请输入密码"
            onChange={this.handleChangePassword}
            value={this.state.password}
          />
        </div>
        <div className={styles['forget-password-bar']}>
          <span onClick={this.handleResetPassowrd}>忘记密码</span>
        </div>
      </div>
    );
  }
}

export default LoginPanel;
