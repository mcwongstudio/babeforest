import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
// import navigate from 'utils/navigate';
import request from 'utils/request';
import Toast from 'utils/toast';

import styles from './center.css';

const couponType = {
  FIXED: '满减券',
  RATE: '折扣券',
};

class Center extends Component {
  state = {
    list: [],
    pageNum: 1,
    pageSize: 100,
    contentHeight: 0,
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getCouponList({ pageNum, pageSize });
  }

  componentDidMount() {
    this.setContentHeight();
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
    this.setState({ contentHeight: height });
  }

  getCouponList = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/coupons/center?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const list = res.data.result;
        const l1 = [];
        const l2 = [];
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.canReceive) {
            l1.push(item);
          } else {
            l2.push(item);
          }
        }
        this.setState({ list: [...l1, ...l2] });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleReceiveCoupon = (couponId) => {
    const url = `${config.apiUri}/coupons/receive?couponId=${couponId}`;
    const method = 'POST';
    request({ url, method }).then((res) => {
      if (res) {
        if (res.data.code === 200) {
          Toast.show(res.data.message);
          const { pageNum, pageSize } = this.state;
          this.getCouponList({ pageNum, pageSize });
        }
      } else {
        window.location.href = '/#/login';
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleUseCoupon = () => {
    window.location.href = '/#/products';
  }

  getDate = (time) => {
    let date = '';
    if (time) {
      date = time.split(' ')['0'];
    }
    return date;
  }

  render() {
    const {
      list,
      contentHeight,
    } = this.state;

    return (
      <div className={styles['coupon-center-page']}>
        <PageHeader title="领券中心" />
        {
          list.length ?
            <div className={styles['coupon-center-content']} style={{ height: contentHeight }}>
              {
                list.map(item => (
                  <div className={styles['coupon-item']} key={item.id}>
                    <div className={styles['coupon-top']}>
                      <div className={styles['coupon-price-bar']}>{item.breaks}</div>
                      <div className={styles['divide-line']} />
                      <div className={styles['coupon-info-bar']}>
                        <div className={styles['coupon-name']}>{item.name}</div>
                        <div className={styles['coupon-rule']}>{item.name}</div>
                      </div>
                      {
                        item.canReceive ?
                          <div className={styles['get-coupon-btn']} onClick={() => this.handleReceiveCoupon(item.id)}>立即领取</div>
                          :
                          <div className={styles['use-coupon-btn']} onClick={() => this.handleUseCoupon()}>去使用</div>
                      }
                    </div>
                    <div className={styles['coupon-bottom']}>
                      <div className={styles['coupon-type']}>{couponType[item.type] || '全品类券'}</div>
                      <div className={styles['coupon-validity']}>有效期 : {this.getDate(item.createTime)}~{this.getDate(item.expTime)}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            :
            <div className={styles['empty-list']}>暂无优惠券</div>
        }
      </div>
    );
  }
}

export default Center;
