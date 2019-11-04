import React, { Component } from 'react';
import request from 'utils/request';
import config from 'config';
import TOAST from 'utils/toast';
import creatHistory from 'history/createHashHistory';
import { Footer, PageHeader } from 'components';
import navigate from 'utils/navigate';
import styles from './information.css';
import InputBar from './components/InputBar';
import SelectBar from './components/SelectBar';

const history = creatHistory();
class Information extends Component {
  state = {
    userInfo: {
      telephone: '123',
      nick: '',
      sex: 0,
      email: '',
    },
    isLoaded: false,
    contentHeight: 0,
  }

  componentWillMount() {
    this.getUserInfo();
    this.setContentHeight();
  }

  handleBack = () => {
    const routes = JSON.parse(sessionStorage.routes || '[]');
    const url = routes[routes.length - 1];
    if (url) {
      routes.slice(0, routes.length - 1);
      sessionStorage.setItem('routes', JSON.stringify(routes));
      setTimeout(() => {
        window.location.href = url;
      }, 2000);
    }
  }

  goBack = (time) => {
    setTimeout(() => {
      history.goBack();
    }, time);
  }

  handleSubmit = () => {
    this.setUserInfo();
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    const isIOS = JSON.parse(sessionStorage.isIOS);
    let height = 0;
    if (!isPage && isIOS) {
      height = 'calc(100% - (132 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (100 / 32 * 1rem))';
    }
    console.log(height);
    this.setState({ contentHeight: height });
  }

  setUserInfo = () => {
    console.log(typeof (this.Gender.state.value));
    const url = `${config.apiUri}/wx-service/user/completion`;
    const method = 'POST';
    const { token } = sessionStorage;
    const data = {
      token,
      email: this.Mail.state.value,
      nick: this.Name.state.value,
      telephone: this.Mobile.state.value,
      sex: this.Gender.state.value === '1' || this.Gender.state.value === 1 ? 'MALE' : 'FEMALE',
    };
    request({ url, method, data }, 'JSON').then((res) => {
      if (res.data.code === 200) {
        TOAST.show('保存成功');
        this.goBack(1000);
      } else {
        TOAST.show(res);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  getUserInfo = () => {
    const url = `${config.apiUri}/wx-service/user`;
    const method = 'GET';
    const { token } = sessionStorage;
    const data = { token };
    request({ url, method, data }, 'JSON').then((res) => {
      if (res.data.code === 200) {
        const {
          telephone, nick, sex, email,
        } = res.data.result;
        this.setState({
          userInfo: {
            telephone,
            nick,
            sex: sex === 'MALE' ? 1 : 2,
            email,
          },
          isLoaded: true,
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  windowToTop = () => {
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    if (!sessionStorage.token) {
      TOAST.show('请重新登陆');
      navigate('/#/login');
    }
  }

  render() {
    const { userInfo, contentHeight } = this.state;
    const required = true;
    console.log(userInfo);

    if (!this.state.isLoaded) {
      return <div>Loading</div>;
    }
    return (
      <div className={styles['person-info-page']}>
        <PageHeader title="个人信息" />
        <div className={styles['person-info-content']} style={{ height: contentHeight }}>
          <InputBar
            ref={(mobile) => { this.Mobile = mobile; }}
            label="手机号"
            required={required}
            initialValue={userInfo.telephone}
            type="number"
            KeyboardDrop={this.windowToTop}
          />
          <InputBar
            ref={(name) => { this.Name = name; }}
            label="用户名"
            required={required}
            initialValue={userInfo.nick}
            type="text"
            KeyboardDrop={this.windowToTop}
          />
          <SelectBar
            ref={(gender) => { this.Gender = gender; }}
            label="性别"
            initialValue={userInfo.sex}
          />
          <InputBar
            ref={(mail) => { this.Mail = mail; }}
            label="邮箱"
            type="email"
            initialValue={userInfo.email}
            KeyboardDrop={this.windowToTop}
          />
          <div className={styles['submit-btn']} onClick={this.handleSubmit}>保存</div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Information;
