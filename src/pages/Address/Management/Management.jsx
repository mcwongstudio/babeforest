import React, { Component } from 'react';
import { PageHeader } from 'components';
import request from 'utils/request';
import navigate from 'utils/navigate';
import config from 'config';
import edit from 'assets/images/edit.png';
import styles from './management.css';

// const timeInterval = 1500;

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      contentHeight: 0,
    };
  }

  componentWillMount() {
    this.getAddressList({ pageNum: 1, pageSize: 10 });
  }

  componentDidMount() {
    this.setContentHeight();
  }

  getAddressList = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/address?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    const { token } = sessionStorage;
    const data = { token };
    request({ url, method, data }).then((res) => {
      const { list } = res.data.result;
      this.setState({ list });
    }).catch((err) => {
      console.error(err);
    });
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    let height = 0;
    if (!isPage) {
      height = 'calc(100% - (292 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (260 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  handleSelectAddress = (addressId) => {
    const routes = JSON.parse(sessionStorage.routes);
    const backRoute = routes[routes.length - 1];
    routes.splice(routes.length - 1, 1);
    sessionStorage.setItem('routes', JSON.stringify(routes));
    sessionStorage.setItem('changeAddress', 0);
    sessionStorage.setItem('addressId', addressId);
    window.location.href = backRoute;
  }

  handleEditAddress = (address) => {
    sessionStorage.setItem('address', JSON.stringify(address));
    navigate('/#/newaddress');
  }

  buildAddress = () => {
    sessionStorage.removeItem('address');
    navigate('/#/newaddress');
  }

  render() {
    const { list, contentHeight } = this.state;
    const changeAddress = JSON.parse(sessionStorage.changeAddress || '0');
    console.log(changeAddress);
    return (
      <div className={styles['management-page']}>
        <PageHeader title="地址管理" />
        <section className={styles['address-management-content']} style={{ height: contentHeight }}>
          {
            list.length ?
              list.map(item => (
                <div
                  // onTouchStart={this.touchStart}
                  // onTouchEnd={this.touchEnd}
                  key={item.id}
                  className={styles['link-box']}
                  onClick={
                    changeAddress ?
                      () => this.handleSelectAddress(item.id)
                      :
                      () => this.handleEditAddress(item)
                  }
                >
                  <div className={styles['info-bar']}>
                    <div className={styles['user-info']}>
                      <div className={styles['user-name']}>{item.name}</div>
                      <div className={styles['user-mobile']}>{item.telephone}</div>
                    </div>
                    <div className={styles['address-info']}>{`${item.province} ${item.city} ${item.area} ${item.address}`}</div>
                  </div>
                  {
                    changeAddress ?
                      null
                      :
                      <span className={styles['edit-icon']}>
                        <img src={edit} alt="edit" />
                      </span>
                  }
                </div>
              ))
              :
              <div className={styles['empty-list']}>请添加收货地址</div>
          }
        </section>
        <div className={styles['address-management-footer']} onClick={this.buildAddress}>
          <div className={styles['add-address-btn']}>新建收货地址</div>
        </div>
      </div>
    );
  }
}

export default Address;
