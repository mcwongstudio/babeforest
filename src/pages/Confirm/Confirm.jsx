import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
import toDecimal2 from 'utils/toDecimal2';
import request from 'utils/request';
import navigate from 'utils/navigate';
import Toast from 'utils/toast';

import arrowIcon from 'assets/images/arrow.png';

import AddressBar from './components/AddressBar';
import styles from './confirm.css';


class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      total: toDecimal2(0),
      contentHeight: 0,
    };
  }

  componentWillMount() {
    this.generateOrder();
    sessionStorage.removeItem('changeAddress');
  }

  componentDidMount() {
    this.setContentHeight();
  }

  generateOrder = () => {
    const url = `${config.apiUri}/orders/order-confirmation`;
    const method = 'POST';
    const skuOrderInfoList = JSON.parse(sessionStorage.skuOrderInfoList || '{}');
    const couponId = sessionStorage.couponId || '';
    const data = { skuOrderInfoList, couponId };
    request({ url, method, data }, 'JSON').then((res) => {
      if (res.data.code === 200) {
        sessionStorage.setItem('orderId', res.data.result.id);
        const productList = res.data.result.confirmOrderSpuList;
        const total = toDecimal2(res.data.result.discountAmount);
        this.setState({
          productList,
          total,
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    let height = 0;
    if (!isPage) {
      height = 'calc(100% - (232 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (200 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  getSpecification = (specificationObj) => {
    const key = Object.keys(specificationObj)[0];
    return `${key}: ${specificationObj[key]}`;
  }

  handleGenerateOrder = () => {
    const { addressId } = sessionStorage;
    if (!addressId || addressId === 'undefined') {
      Toast.show('请选择收货地址');
    } else {
      const couponId = sessionStorage.couponId || '';
      const url = `${config.apiUri}/orders`;
      const method = 'POST';
      const skuOrderInfoList = JSON.parse(sessionStorage.skuOrderInfoList || '[]');
      const data = { addressId, couponId, skuOrderInfoList };
      request({ url, method, data }, 'JSON').then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          sessionStorage.setItem('orderId', res.data.result.id);
          sessionStorage.removeItem('couponName');
          sessionStorage.removeItem('couponId');
          navigate('/#/checkStand');
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  handleSelectCoupon = () => {
    const { total } = this.state;
    console.log(total);
    sessionStorage.setItem('count', total);
    sessionStorage.setItem('isSelectCoupon', 1);
    navigate('/#/selectCoupon');
  }

  render() {
    const {
      productList,
      total,
      contentHeight,
    } = this.state;

    const couponName = sessionStorage.couponName || '选择优惠券';

    return (
      <div className={styles['confirm-page']}>
        <PageHeader title="确认订单" />
        <section className={styles['confirm-content']} style={{ height: contentHeight }}>
          <AddressBar />
          <div className={styles['product-list']}>
            {
              productList.map((item, index) => (
                <div className={styles['product-item']} key={index}>
                  <div className={styles['product-cover']}>
                    <img src={item.itemSkuDetail.images} alt="product" />
                  </div>
                  <div className={styles['product-info']}>
                    <div className={styles['product-title']}>{item.title}</div>
                    <div className={styles['product-specification']}>
                      {this.getSpecification(item.itemParamJSONObj)}
                    </div>
                    <div className={styles['product-price-bar']}>
                      <div className={styles['product-price']}>
                        {toDecimal2(item.itemSkuDetail.vipPrice)}
                      </div>
                      <div className={styles['product-number']}>
                        {item.itemSkuDetail.purchaseCount}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className={styles['message-content']}>
            <div className={styles['coupon-bar']} onClick={this.handleSelectCoupon}>
              <div>优惠</div>
              <div className={styles['coupon-name']}>
                <div className={styles['coupon-text']}>{couponName}</div>
                <div className={styles['arrow-icon']}><img src={arrowIcon} alt="arrow" /></div>
              </div>
            </div>
            <div className={styles['message-bar']}>
              <div>买家留言</div>
              <input
                type="text"
                placeholder="选填"
                className={styles['message-input']}
              />
            </div>
          </div>
        </section>
        <div className={styles['confirm-footer']}>
          <div className={styles['confirm-total-bar']}>
            合计金额：<div className={styles['total-count']}>{total}</div>
          </div>
          <div className={styles['confirm-submit-btn']} onClick={this.handleGenerateOrder}>提交订单</div>
        </div>
      </div>
    );
  }
}

export default Confirm;
