import React, { PureComponent } from 'react';
import config from 'config';
import request from 'utils/request';
import navigate from 'utils/navigate';

import icon from 'assets/images/go-right2.png';
import colorBarIcon from 'assets/images/color-bar.jpg';
import styles from './components.css';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasAddress: false,
      name: '',
      mobile: '',
      addressText: '',
    };
  }

  componentWillMount() {
    this.getAddressInfo();
  }

  getAddressInfo = () => {
    const url = `${config.apiUri}/address`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { list } = res.data.result;
        if (list.length) {
          const { addressId } = sessionStorage;
          const hasAddress = true;
          let address = {};
          if (addressId !== 'undefined') {
            const loop = (i) => {
              const item = list[i];
              if (item) {
                if (item.id.toString() === addressId) {
                  address = item;
                } else {
                  loop(i + 1);
                }
              }
            };
            loop(0);
          } else {
            address = list[0] || {};
          }

          let addressText = '';
          if (address.province) {
            addressText += `${address.province} `;
          }
          if (address.city) {
            addressText += `${address.city} `;
          }
          if (address.area) {
            addressText += `${address.area} `;
          }
          if (address.address) {
            addressText += `${address.address} `;
          }

          sessionStorage.setItem('addressId', address.id);

          this.setState({
            name: address.name,
            mobile: address.telephone,
            addressText,
            hasAddress,
          });
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleChangeAddress = () => {
    sessionStorage.setItem('changeAddress', 1);
    navigate('/#/address');
  }

  render() {
    const {
      name,
      mobile,
      addressText,
      hasAddress,
    } = this.state;

    return (
      <div className={styles['address-bar']} onClick={this.handleChangeAddress}>
        <div className={styles['address-top']}>
          {
            hasAddress ?
              <div className={styles['address-info']}>
                <div className={styles['user-info']}>
                  <div className={styles['user-name']}>{name}</div>
                  <div className={styles['user-mobile']}>{mobile}</div>
                </div>
                <div className={styles['user-address']}>{addressText}</div>
              </div>
              :
              <div className={styles['select-address']}>添加收货地址</div>
          }
          <div className={styles['arrow-icon']}>
            <img src={icon} alt="icon" />
          </div>
        </div>
        <div className={styles['color-bar']}>
          <img src={colorBarIcon} alt="color-bar" />
        </div>
      </div>
    );
  }
}
