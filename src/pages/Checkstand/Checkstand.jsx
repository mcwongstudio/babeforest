import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import toDecimal2 from 'utils/toDecimal2';
import { PageHeader } from 'components';

import WeChatPayIcon from 'assets/images/wechatpay.png';
import AliPayIcon from 'assets/images/alipay.png';
import CheckBoxIcon from 'assets/images/checkbox.png';
import CheckBoxActivedIcon from 'assets/images/checkbox-actived.png';
import styles from './checkstand.css';

class Checkstand extends Component {
  constructor(props) {
    super(props);
    const { orderId } = sessionStorage;
    this.state = {
      orderId,
      paymentId: 'wechat',
      paymentName: '微信支付',
      paymentList: [{
        icon: WeChatPayIcon,
        name: '微信支付',
        id: 'wechat',
      }, {
        icon: AliPayIcon,
        name: '支付宝支付',
        id: 'ali',
      }],
      total: toDecimal2(0),
    };
  }

  componentWillMount() {
    this.getOrderInfo();
  }

  getOrderInfo = () => {
    const { orderId } = this.state;
    const url = `${config.apiUri}/orders/status/${orderId}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const orderInfo = res.data.result;
        console.log(orderInfo);
        const total = toDecimal2(orderInfo.totalAmount);
        this.setState({ total });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  selectPayment = (id, name) => {
    this.setState({ paymentId: id, paymentName: name });
  }

  handlePayment = () => {
    const { orderId, paymentId } = this.state;
    let url = config.apiUri;
    if (paymentId === 'wechat') {
      url += `/pay/confirmation-pay?orderId=${orderId}&payType=WECHAT_H5&returnUrl=http://bb-h5.test.jiniutech.cn/#/orders`;
    } else if (paymentId === 'ali') {
      url += `/pay/confirmation-alipay?orderId=${orderId}&payType=ALI_PAY_H5&returnUrl=http://bb-h5.test.jiniutech.cn/#/orders`;
    }
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        if (paymentId === 'ali') {
          const form = res.data.result;
          const dom = document.createElement('div');
          dom.innerHTML = form;
          document.body.appendChild(dom);
          document.forms[0].submit();
        } else {
          window.location.href = res.data.result.mwebUrl;
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const {
      paymentList,
      paymentId,
      paymentName,
      total,
    } = this.state;
    return (
      <div className={styles['checkstand-content']} style={{ height: window.innerHeight }}>
        <PageHeader title="收银台" />
        <div className={styles['count-bar']}>需支付：<span className={styles['count-price']}>{total}</span></div>
        <div className={styles['payment-list']}>
          {
            paymentList.map(item => (
              <div
                className={styles['payment-item']}
                key={item.id}
                onClick={() => this.selectPayment(item.id, item.name)}
              >
                <div className={styles['payment-info']}>
                  <div className={styles['payment-cover']}><img src={item.icon} alt="icon" /></div>
                  <div className={styles['payment-name']}>{ item.name }</div>
                </div>
                {
                  item.id === paymentId ?
                    <div className={styles['payment-check-box']}><img src={CheckBoxActivedIcon} alt="actived" /></div>
                    :
                    <div className={styles['payment-check-box']}><img src={CheckBoxIcon} alt="checkbox" /></div>
                }
              </div>
            ))
          }
        </div>
        <div className={styles['submit-btn']} onClick={this.handlePayment}>
          <span>{ paymentName }</span>
          <span className={styles['price-bar']}>{total}</span>
        </div>
      </div>
    );
  }
}

export default Checkstand;
