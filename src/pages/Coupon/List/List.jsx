import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
import request from 'utils/request';

import styles from './list.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pageNum: 1,
      pageSize: 10,
      usedNumber: 0,
      unusedNumber: 0,
      type: 'unused',
    };
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getCouponList({ pageNum, pageSize });
  }

  getCouponList = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/coupons?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const { list } = res.data.result;
        let usedNumber = 0;
        let unusedNumber = 0;
        const loop = (i) => {
          const item = list[i];
          if (item) {
            if (item.state === 'ENABLE') {
              unusedNumber += 1;
            } else {
              usedNumber += 1;
            }
            loop(i + 1);
          }
        };
        loop(0);
        this.setState({ list, usedNumber, unusedNumber });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  selectCouponTab = (type) => {
    this.setState({ type });
  }

  render() {
    const {
      list,
      usedNumber,
      unusedNumber,
      type,
    } = this.state;
    return (
      <div className={styles['coupons-page']}>
        <PageHeader title="我的优惠券" />
        <div className={styles['coupon-tab-bar']}>
          <div
            className={type === 'unused' ? styles['coupon-tab-item-actived'] : styles['coupon-tab-item']}
            onClick={() => this.selectCouponTab('unused')}
          >
            未使用({unusedNumber})
          </div>
          <div
            className={type === 'used' ? styles['coupon-tab-item-actived'] : styles['coupon-tab-item']}
            onClick={() => this.selectCouponTab('used')}
          >
            已使用({usedNumber})
          </div>
        </div>
        {
          type === 'unused'
        }
        <div className={styles['coupon-list']}>
          {
            list.map(item => (
              <div key={item.id}>{item.name}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default List;
