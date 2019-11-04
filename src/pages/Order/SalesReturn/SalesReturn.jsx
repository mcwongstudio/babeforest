import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import Toast from 'utils/toast';
import { express, expressList } from 'utils/expressList';
import { Modal, List } from 'antd-mobile';
import { PageHeader } from 'components';
import styles from './salesReturn.css';

class SalesReturn extends Component {
  state = {
    consignee: '贝比森林',
    phone: '0592-5865702',
    address: '福建省厦门市思明区湖滨南路819号宝福大厦3101',
    visible: false,
    expressType: '',
    expressNo: '',
  }

  componentWillMount() {
    const url = `${config.apiUri}/refundapply/user`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  handleShowModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCloseModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleSelectExpressType = (expressType) => {
    this.setState({ expressType });
    this.handleCloseModal();
  }

  handleChangeExpressNumber = (e) => {
    let { value } = e.target;
    console.log(value);
    if (value && !/^\d{1,}$/.test(value)) {
      console.log(value.includes('.'));
      if (value.includes('.')) {
        value = value.substring(0, value.indexOf('.'));
      } else {
        const reg = /[a-zA-Z]+/;
        value = value.replace(reg, '');
      }
    }
    this.setState({
      expressNo: value,
    });
  }

  handleCancelSubmit = () => {
    this.Header.handleBack();
  }

  handleSubmit = () => {
    console.log('submit');
    const { expressType, expressNo } = this.state;
    if (!expressType) {
      Toast.show('请选择配送方式');
    } else if (!expressNo) {
      Toast.show('请输入快递单号');
    } else {
      const { orderId } = sessionStorage;
      const url = `${config.apiUri}/refundapply/express`;
      const method = 'PUT';
      const data = {
        orderId,
        expressno: expressNo,
        com: expressType,
      };
      request({ url, method, data }, 'JSON').then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          Toast.show('退货单提交成功');
          window.setTimeout(() => this.Header.handleBack(), 1500);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  render() {
    const {
      consignee,
      phone,
      address,
      visible,
      expressType,
      expressNo,
    } = this.state;

    const orderId = sessionStorage.orderId || '';

    return (
      <div styles={styles['sales-return-page']}>
        <PageHeader
          title="退款退货"
          ref={(header) => {
            this.Header = header;
          }}
        />

        <div className={styles['business-address-bar']}>
          <div className={styles['address-title']}>商家地址</div>
          <div className={styles['address-info']}>
            <div className={styles['address-consignee']}>
              <div className={styles['address-label']}>收货人：</div>
              <div>{consignee}</div>
            </div>
            <div className={styles['address-phone']}>
              <div className={styles['address-label']}>联系电话：</div>
              <div>{phone}</div>
            </div>
          </div>
          <div className={styles['address-bar']}>
            <div className={styles['address-label']}>寄送至：</div>
            <div>{address}</div>
          </div>
        </div>

        <div className={styles['refund-bar']}>
          <div className={styles['refund-order-number']}>
            <div className={styles['refund-label']}>退货单号：</div>
            <div>{orderId}</div>
          </div>
          <div className={styles['delivery-address']}>
            <div className={styles['express-label']}>配送方式<span className={styles['label-required']}>*</span></div>
            <div className={styles['type-value']} onClick={this.handleShowModal}>{expressType || '请选择配送方式'}</div>
          </div>
          <div className={styles['exporess-number']}>
            <div className={styles['express-label']}>快递单号<span className={styles['label-required']}>*</span></div>
            <div className={styles['number-value']}>
              <input
                type="text"
                value={expressNo}
                placeholder="请输入快递单号"
                onChange={this.handleChangeExpressNumber}
              />
            </div>
          </div>
          <div className={styles['express-tips']}>
            友情提示：
            <span className={styles['message-warning']}>以上信息需要反复确认后提交，信息错误导致单号查询不到，本店概不负责！！！</span>
          </div>
        </div>

        <div className={styles['sales-return-footer']}>
          <div className={styles['cancel-btn']} onClick={this.handleCancelSubmit}>取消</div>
          <div className={styles['submit-btn']} onClick={this.handleSubmit}>确认提交</div>
        </div>

        <Modal
          popup
          visible={visible}
          onClose={this.handleCloseModal}
          animationType="slide-up"
        >
          <List renderHeader={() => <div>请选择配送方式</div>}>
            {
              expressList.map(expressName => (
                <List.Item
                  key={expressName}
                  onClick={() => this.handleSelectExpressType(express[expressName])}
                >
                  {express[expressName]}
                </List.Item>
              ))
            }
          </List>
        </Modal>
      </div>
    );
  }
}

export default SalesReturn;
