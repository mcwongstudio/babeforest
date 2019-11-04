import React, { Component } from 'react';
import { connect } from 'react-redux';

import request from 'utils/request';
import config from 'config';
import TOAST from 'utils/toast';

import closeIcon from 'assets/images/remove.png';
import loginLogo from 'assets/images/login-logo.png';
import wechatLogo from 'assets/images/wechat-login.png';

import navigate from 'utils/navigate';
import styles from './login.css';
import LoginPanel from './components/LoginPanel';
import ResetPasswordPanel from './components/ResetPasswordPanel';
import RegistryPanel from './components/RegistryPanel';


class Login extends Component {
  state = {
    isLogin: true,
    isRegistry: false,
    isReset: false,
  }

  goHome = () => { navigate('/#/'); }

  handleRegistry = () => {
    this.setState({ isLogin: false, isRegistry: true, isReset: false });
  }

  handleLogin = () => {
    this.setState({ isLogin: true, isRegistry: false, isReset: false });
  }

  handleSubmit = () => {
    const { isLogin, isRegistry, isReset } = this.state;
    let url = '';
    let method = 'POST';
    let data = {};
    if (isLogin) {
      const { phone, password } = this.Login.state;
      if (!phone) {
        TOAST.show('请输入手机号');
      } else if (!password) {
        TOAST.show('请输入密码');
      } else {
        url = `${config.apiUri}/user-service/users/login`;
        data = { username: phone, password };
        const { history } = this.props;
        request({ url, method, data }).then((res) => {
          if (res.data.code === 200) {
            sessionStorage.clear();
            sessionStorage.setItem('token', res.headers['x-auth-token']);
            history.push('/');
          } else {
            TOAST.show(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    } else if (isRegistry) {
      const { phone, password, securityCode } = this.Registry.state;
      if (!phone) {
        TOAST.show('请输入手机号');
      } else if (!securityCode) {
        TOAST.show('请输入验证码');
      } else if (!password) {
        TOAST.show('请输入密码');
      } else {
        url = `${config.apiUri}/user-service/users/register`;
        data = { mobile: phone, code: securityCode, password };
        request({ url, method, data }).then((res) => {
          if (res.data.code === 200) {
            TOAST.show(res.data.message);
            sessionStorage.setItem('token', res.headers['x-auth-token']);
            this.Registry.setState({ phone: '', password: '', securityCode: '' });
            this.setState({ isRegistry: false, isLogin: true });
          }
        }).catch((err) => {
          console.error(err);
        });
      }
    } else if (isReset) {
      const { phone, password, securityCode } = this.Reset.state;
      if (!phone) {
        TOAST.show('请输入手机号');
      } else if (!securityCode) {
        TOAST.show('请输入验证码');
      } else if (!password) {
        TOAST.show('请输入密码');
      } else {
        method = 'PUT';
        url = `${config.apiUri}/user-service/users/password/reset`;
        data = { mobile: phone, code: securityCode, password };
        request({ url, method, data }).then((res) => {
          if (res.data.code === 200) {
            TOAST.show(res.data.message);
            sessionStorage.setItem('token', res.headers['x-auth-token']);
            this.Reset.setState({ phone: '', password: '', securityCode: '' });
            this.setState({ isRegistry: false, isLogin: true, isReset: false });
          }
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  }

  handleGetWechatCode = () => {
    const url = `${config.apiUri}/wx-service/wx-mini/mobile/getCode`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        window.location.href = res.data.result;
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  windowToTop = () => {
    window.scrollTo(0, 0);
  }

  render() {
    const { isLogin, isRegistry, isReset } = this.state;
    return (
      <div className={styles['login-content']}>
        <div className={styles['login-header']}>
          <div className={styles['close-btn']} onClick={this.goHome}><img src={closeIcon} alt="close" /></div>
          {
            isRegistry && !isLogin ?
              <div className={styles['login-btn']} onClick={this.handleLogin}>登录</div>
              :
              <div className={styles['registry-btn']} onClick={this.handleRegistry}>注册</div>
          }
        </div>
        <div className={styles['login-logo']}><img src={loginLogo} alt="logo" /></div>
        {
          isRegistry ?
            <RegistryPanel
              ref={(registry) => { this.Registry = registry; }}
              KeyboardDrop={this.windowToTop}
            />
            :
            null
        }
        {
          isLogin ?
            <LoginPanel
              ref={(login) => { this.Login = login; }}
              onResetPassowrd={() => {
                this.setState({
                  isLogin: false,
                  isRegistry: false,
                  isReset: true,
                });
              }}
              KeyboardDrop={this.windowToTop}
            />
            :
            null
        }
        {
          isReset ?
            <ResetPasswordPanel ref={(reset) => { this.Reset = reset; }} />
            :
            null
        }
        {
          isLogin ?
            <div className={styles['submit-btn']} onClick={this.handleSubmit}>登录</div>
            : null
        }
        {
          isRegistry ?
            <div className={styles['submit-btn']} onClick={this.handleSubmit}>注册</div>
            : null
        }
        {
          isReset ?
            <div className={styles['submit-btn']} onClick={this.handleSubmit}>重置密码</div>
            : null
        }
        <div className={styles['rapid-enrollment-bar']}>
          <div className={styles['rapid-enrollment-tips']}>微信快速登录</div>
          <div className={styles['rapid-enrollment-logo']} onClick={this.handleGetWechatCode}><img src={wechatLogo} alt="wechat" /></div>
        </div>
      </div>
    );
  }
}

export default connect()(Login);
