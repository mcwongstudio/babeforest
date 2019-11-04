import React, { Component } from 'react';
import { Modal } from 'antd-mobile';
import { PageHeader } from 'components';
import request from 'utils/request';
import config from 'config';
import TOAST from 'utils/toast';

import trash from 'assets/images/trash.png';
import styles from './newAddress.css';
import InputBar from './components/InputBar';
import AreaBar from './components/AreaBar';

const Malert = Modal.alert;

class NewAddress extends Component {
  state = {
    checked: false,
    addressId: '',
    isChange: false,
    display: 'none',
    province: '',
    city: '',
    area: '',
    name: '',
    telephone: '',
    pageClass: styles['add-address-page'],
  }

  componentWillMount() {
    this.initAddressInfo();
  }

  checkSubmit = () => {
    const consignee = this.Consignee.state.value;
    const mobile = this.Mobile.state.value;
    const area = this.Area.state.value;
    console.log(area);
    const address = this.Address.state.value;
    if (consignee && mobile && area && address) {
      this.setState({
        checked: true,
      });
    } else {
      this.setState({
        checked: false,
      });
    }
  }

  handleSubmit = () => {
    const { isChange } = this.state;

    let method = 'POST';
    const url = `${config.apiUri}/address`;
    const Area = this.Area.state.value;
    const name = this.Consignee.state.value || '';
    const province = Area[0] || '';
    const city = Area[1] || '';
    const area = Area[2] || '';
    const address = this.Address.state.value || '';
    const telephone = this.Mobile.state.value || '';
    const isDeleted = false;
    const description = 'none';
    const type = 'OTHER';

    const data = {
      name,
      province,
      city,
      area,
      address,
      telephone,
      isDeleted,
      description,
      type,
    };

    if (isChange) {
      method = 'PUT';
      const { addressId } = this.state;
      data.id = addressId;
    }

    request({ url, method, data }, 'JSON').then((res) => {
      if (res.data.code === 200) {
        if (method === 'PUT') {
          TOAST.show('修改地址成功');
        } else {
          TOAST.show('新增地址成功');
        }
        sessionStorage.removeItem('address');
        setTimeout(() => {
          this.Header.handleBack();
        }, 1000);
      } else {
        TOAST.show(res.data.message);
      }
    }).catch((err) => {
      console.log(err);
    });
  }


  showMessage = () => {
    if (this.state.isChange) {
      this.changeAddress();
    } else {
      TOAST.show('请完善信息');
    }
  }

  initAddressInfo = () => {
    const addressText = sessionStorage.address;
    if (addressText) {
      const addressInfo = JSON.parse(addressText);
      const {
        province,
        city,
        area,
        address,
        id,
        name,
        telephone,
      } = addressInfo;
      this.setState({
        checked: true,
        isChange: true,
        display: 'inline',
        province: province || '',
        city: city || '',
        area: area || '',
        address: address || '',
        addressId: id,
        name: name || '',
        telephone: telephone || '',
      });
    }
  }

  trash = () => {
    const { addressId } = this.state;
    const url = `${config.apiUri}/address/${addressId}`;
    const method = 'DELETE';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        TOAST.show('已删除该地址');
        setTimeout(() => {
          this.Header.handleBack();
        }, 1000);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  showAlert = () => {
    Malert('要删除地址吗?', '', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '删除', onPress: () => this.trash() },
    ]);
  };

  handleShowAreaBar = (flag) => {
    if (flag) {
      this.setState({
        pageClass: `${styles['add-address-page']} ${styles['stop-scroll']}`,
      });
    } else {
      this.setState({
        pageClass: styles['add-address-page'],
      });
    }
  }

  render() {
    const {
      checked,
      display,
      pageClass,
      province,
      city,
      area,
      address,
      name,
      telephone,
    } = this.state;
    const addrssValue = [province, city, area];

    // 键盘收回页面恢复
    const inputItems = document.querySelectorAll('input');
    inputItems.forEach((ele) => {
      ele.addEventListener('blur', () => {
        window.scrollTo(0, 0);
      });
    });

    return (
      <div className={pageClass} style={{ height: '100%' }}>
        <img style={{ display }} className={styles.trash} src={trash} alt="trash" onClick={this.showAlert} />
        <PageHeader
          title="地址管理"
          ref={(header) => {
            this.Header = header;
          }}
        />
        <div className={styles['add-address-content']}>
          <InputBar
            ref={(consignee) => { this.Consignee = consignee; }}
            label="收货人"
            initialValue={name}
            onBlur={this.checkSubmit}
          />
          <InputBar
            ref={(mobile) => { this.Mobile = mobile; }}
            label="手机号码"
            initialValue={telephone}
            type="number"
            onBlur={this.checkSubmit}
          />
          <AreaBar
            ref={(e) => { this.Area = e; }}
            label="所在地区"
            initialValue={addrssValue}
            onBlur={this.checkSubmit}
            onClick={this.handleShowAreaBar}
          />
          <InputBar
            ref={(e) => { this.Address = e; }}
            label="详细地址"
            initialValue={address}
            onBlur={this.checkSubmit}
          />
        </div>
        {
          checked ?
            <div className={styles['submit-btn-actived']} onClick={this.handleSubmit}>保存</div>
            :
            <div className={styles['submit-btn']} onClick={this.showMessage}>保存</div>
        }
      </div>
    );
  }
}

export default NewAddress;
