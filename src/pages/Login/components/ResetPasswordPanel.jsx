import React, { Component } from 'react';
import request from 'utils/request';
import config from 'config';
import TOAST from 'utils/toast';
import styles from './components.css';

class ResetPasswordPanel extends Component {
  state = {
    phone: '',
    password: '',
    securityCode: '',
    showTime: false,
    leftTime: 60,
  }

  handleChangePhone = (e) => {
    const phone = e.target.value;
    this.setState({ phone });
  }

  handleChangePassword = (e) => {
    const password = e.target.value;
    this.setState({ password });
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
        if (res.data.code === 200) {
          TOAST.show(res.data.message);
          this.setState({
            showTime: true,
          });
          let startTime = 60;
          const timer = setInterval(() => {
            startTime -= 1;
            this.setState({
              leftTime: startTime,
            });
            if (startTime <= 0) {
              clearInterval(timer);
              this.setState({
                showTime: false,
              });
            }
          }, 1000);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  render() {
    const { showTime, leftTime } = this.state;
    return (
      <div className={styles['reset-password-panel']}>
        <div className={styles['panel-title']}>重置密码</div>
        <div className={styles['phone-input-bar']}>
          <input type="text" placeholder="请输入手机号" onChange={this.handleChangePhone} value={this.state.phone} />
        </div>
        <div className={styles['code-input-bar']}>
          <input type="text" placeholder="请输入验证码" onChange={this.handleSecurityCode} value={this.state.securityCode} />
          {
            showTime ?
              <span className={styles['count-down']}>{leftTime}秒后，重新获取验证码</span>
              :
              <span className={styles['query-code-btn']} onClick={this.getPhoneCode}>获取验证码</span>
          }
        </div>
        <div className={styles['password-input-bar']}>
          <input type="password" placeholder="请输入新密码" onChange={this.handleChangePassword} value={this.state.password} />
        </div>
      </div>
    );
  }
}

export default ResetPasswordPanel;
