import React, { Component } from 'react';
import request from 'utils/request';
import config from 'config';
import { Header, Footer } from 'components';
import navigate from 'utils/navigate';
import arrowIcon from 'assets/images/arrow.png';
import styles from './userCenter.css';

class UserCenter extends Component {
  logout = () => {
    const url = `${config.apiUri}/user-service/users/logout`;
    const method = 'DELETE';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        navigate('/#/');
        sessionStorage.removeItem('token');
      }
      delete sessionStorage.token;
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div className={styles['user-center-page']}>
        <Header />
        <div className={styles['user-center-content']}>
          <div className={styles['user-center-header']}>用户中心</div>
          <div className={styles['user-center-list']}>
            <div className={styles['user-center-item']} onClick={() => navigate('/#/orders')}>
              <span>我的订单</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
            <div className={styles['user-center-item']} onClick={() => navigate('/#/shoppingCart')}>
              <span>我的购物车</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
            <div className={styles['user-center-item']} onClick={() => navigate('/#/selectCoupon')}>
              <span>我的优惠券</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
            <div className={styles['user-center-item']} onClick={() => navigate('/#/address')}>
              <span>地址管理</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
            <div className={styles['user-center-item']} onClick={() => navigate('/#/information')}>
              <span>个人信息</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
            <div className={styles['user-center-item']} onClick={this.logout}>
              <span>退出登录</span>
              <img src={arrowIcon} alt="arrow" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default UserCenter;
