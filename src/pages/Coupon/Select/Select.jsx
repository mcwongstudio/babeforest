import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
import request from 'utils/request';
import Toast from 'utils/toast';

import styles from './select.css';

const couponType = {
  FIXED: '满减券',
  RATE: '折扣券',
};

class SelectCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCouponId: 0,
      list: [],
      disabledList: [],
      pageNum: 1,
      pageSize: 10,
      contentHeight: 0,
    };
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
    const isSelectCoupon = JSON.parse(sessionStorage.isSelectCoupon || '0');
    let height = 0;
    if (isSelectCoupon) {
      if (!isPage && isIOS) {
        height = 'calc(100% - (230 / 32 * 1rem))';
      } else {
        height = 'calc(100% - (198 / 32 * 1rem))';
      }
    } else if (!isPage && isIOS) {
      height = 'calc(100% - (132 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (100 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  getCouponList = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/coupons/users/mine?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const couponList = res.data.result.list || [];
        const list = [];
        const { count } = sessionStorage;
        const flag = !count;
        const total = JSON.parse(count || '0');
        const disabledList = [];
        const loop = (i) => {
          const item = couponList[i];
          if (item) {
            if (item.reason) {
              disabledList.push(item);
            } else if (!flag) {
              if (item.coupon.type === 'FIXED' && item.coupon.matchCondition > total) {
                disabledList.push(item);
              } else {
                list.push(item);
              }
            } else {
              list.push(item);
            }
            loop(i + 1);
          }
        };
        loop(0);
        this.setState({ list, disabledList });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleSelectCoupon = (item) => {
    const count = JSON.parse(sessionStorage.count || '0');
    const { matchCondition } = item.coupon;
    const flag = !matchCondition;
    if (!flag && count < matchCondition) {
      Toast.show('该订单不可用这张券');
    } else {
      const couponId = item.id || '';
      const couponName = item.coupon.name || '';
      let { selectCouponId } = this.state;
      if (selectCouponId === couponId) {
        selectCouponId = '';
      } else {
        selectCouponId = couponId;
      }
      this.setState({ selectCouponId });
      sessionStorage.setItem('couponId', selectCouponId);
      sessionStorage.setItem('couponName', couponName);
      sessionStorage.removeItem('isSelectCoupon');
      sessionStorage.removeItem('count');
      this.Header.handleBack();
    }
  }

  render() {
    const {
      list,
      disabledList,
      contentHeight,
      selectCouponId,
    } = this.state;
    const isSelectCoupon = JSON.parse(sessionStorage.isSelectCoupon || '0');

    return (
      <div className={styles['coupon-page']}>
        <PageHeader title="我的优惠券" ref={(header) => { this.Header = header; }} />
        <div className={styles['coupon-content']} style={{ height: contentHeight }}>
          {
            !list.length && !disabledList.length ?
              <div className={styles['empty-list']}>暂无优惠券</div>
              : null
          }
          {
            list.length ?
              <div className={styles['coupon-list']}>
                {
                  list.map(item => (
                    <div
                      key={item.id}
                      className={selectCouponId === item.id ? styles['coupon-item-actived'] : styles['coupon-item']}
                      onClick={isSelectCoupon ? () => this.handleSelectCoupon(item) : () => console.log('test')}
                    >
                      <div className={styles['coupon-info-bar']}>
                        <div className={styles['coupon-type']}>{couponType[item.coupon.type] || '全品类券'}</div>
                        <div className={styles['coupon-title']}>{item.coupon.name}</div>
                      </div>
                      <div className={styles['divide-bar']} />
                      {
                        item.coupon.type === 'RATE' ?
                          <div className={styles['coupon-price-bar-discount']}>{item.coupon.breaks}</div>
                          :
                          <div className={styles['coupon-price-bar']}>{item.coupon.breaks}</div>
                      }
                    </div>
                  ))
                }
              </div>
              :
              null
          }
          {
            disabledList.length ?
              <div className={styles['disabled-coupon-bar']}>
                <div className={styles['disabled-coupon-title']}>不可用卡券</div>
                <div className={styles['disabled-coupon-list']}>
                  {
                    disabledList.map(item => (
                      <div className={styles['disabled-coupon-item']} key={item.id}>
                        <div className={styles['coupon-info-bar']}>
                          <div className={styles['coupon-type']}>{couponType[item.coupon.type] || '全品类券'}</div>
                          <div className={styles['coupon-title']}>{item.coupon.name}</div>
                        </div>
                        <div className={styles['divide-bar']} />
                        {
                          item.coupon.type === 'RATE' ?
                            <div className={styles['disabled-coupon-price-bar-discount']}>{item.coupon.breaks}</div>
                            :
                            <div className={styles['disabled-coupon-price-bar']}>{item.coupon.breaks}</div>
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
              : null
          }
        </div>
        {
          isSelectCoupon ?
            <div
              className={styles['nonuse-coupon-btn']}
              onClick={() => this.handleSelectCoupon({ id: '', coupon: { name: '不使用优惠' } })}
            >
              不使用优惠
            </div>
            : null
        }
      </div>
    );
  }
}

export default SelectCoupon;
