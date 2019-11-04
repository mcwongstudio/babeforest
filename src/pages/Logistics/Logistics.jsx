import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import { express } from 'utils/expressList';
import { PageHeader } from 'components';

import PointIcon from 'assets/images/point.png';
import PointActivedIcon from 'assets/images/point-actived.png';

import styles from './logistics.css';


class Logistics extends Component {
  state = {
    list: [{
      message: '[岳阳市]岳阳市【岳阳市一部003】，已签收，如有问题请您拨打15347303261 已签收',
      time: '2019.02.14  13:18',
    }, {
      message: '[岳阳市]岳阳市【岳阳市一部003】，【陈兵】正在派件',
      time: '2019.02.14  13:18',
    }],
    expressName: 'shentong',
    expressNo: '1234567',
  }

  componentWillMount() {
    this.getLogisticsList();
  }

  getLogisticsList = () => {
    const { orderId } = sessionStorage;
    const url = `${config.apiUri}/deliveries/order/${orderId}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const list = res.data.result.data;
        const expressName = res.data.result.com;
        const expressNo = res.data.result.nu;
        this.setState({ list, expressName, expressNo });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { list, expressName, expressNo } = this.state;
    return (
      <div className={styles['logistics-content']} style={{ height: window.innerHeight }}>
        <PageHeader title="物流详情" />
        <div className={styles['logistics-info']}>
          <span className={styles['logistics-name']}>{express[expressName]}</span>
          |
          <span className={styles['logistics-number']}>{expressNo}</span>
        </div>
        <div className={styles['logistics-list']}>
          {
            list.map((item, index) => (
              !index ?
                <div className={styles['logistics-item-actived']}>
                  <span className={styles['point-actived']}><img src={PointActivedIcon} alt="point actived" /></span>
                  <div className={styles['logistics-message']}>{ item.context }</div>
                  <div className={styles['logistics-update-time']}>{ item.time }</div>
                </div>
                :
                <div className={styles['logistics-item']}>
                  <span className={styles.point}><img src={PointIcon} alt="point" /></span>
                  <div className={styles['logistics-message']}>{ item.context }</div>
                  <div className={styles['logistics-update-time']}>{ item.time }</div>
                </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Logistics;
