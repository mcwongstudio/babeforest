import React, { Component } from 'react';
import request from 'utils/request';
import config from 'config';
import TOAST from 'utils/toast';
import styles from './components.css';

class RegistryPanel extends Component {
  state = {
    phone: '',
    password: '',
    securityCode: '',
  }

  handleChangePhone = (e) => {
    const phone = e.target.value;
    this.setState({ phone });
  }

  handleChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ password });
  }

  handleRapidEnrollment = () => {
    console.log('快速登录');
  }

  handleSecurityCode = (e) => {
    const securityCode = e.target.value;
    this.setState({ securityCode });
  }

  getPhoneCode = () => {
    const { phone } = this.state;
    if (!phone) {
      TOAST.show('请输入手机号');
    } else {
      const url = `${config.apiUri}/user-service/users/mobile/code`;
      const method = 'POST';
      const data = { mobile: phone };
      request({ url, method, data }).then((res) => {
        TOAST.show(res.data.message);
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  render() {
    const inputItems = document.querySelectorAll('input');
    inputItems.forEach((ele) => {
      ele.addEventListener('blur', () => {
        this.props.KeyboardDrop();
      });
    });
    return (
      <div className={styles['registry-panel']}>
        <div className={styles['panel-title']}>会员注册</div>
        <div className={styles['phone-input-bar']}>
          <input type="text" placeholder="请输入手机号" onChange={this.handleChangePhone} value={this.state.phone} />
        </div>
        <div className={styles['code-input-bar']}>
          <input type="text" placeholder="请输入验证码" onChange={this.handleSecurityCode} value={this.state.securityCode} />
          <span className={styles['query-code-btn']} onClick={this.getPhoneCode}>获取验证码</span>
        </div>
        <div className={styles['password-input-bar']}>
          <input type="password" placeholder="请输入密码" onChange={this.handleChangePassword} value={this.state.password} />
        </div>
      </div>
    );
  }
}

export default RegistryPanel;
