import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import navigate from 'utils/navigate';

import arrowIcon from 'assets/images/arrow-green.png';
import styles from './components.css';

class EvaluateBar extends Component {
  state = {
    evaluateNumber: 0,
  }

  componentWillMount() {
    this.getEvaluateNumber();
  }

  getEvaluateNumber = () => {
    const { productId } = sessionStorage;
    const url = `${config.apiUri}/comment/count/${productId}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const evaluateNumber = res.data.result;
        this.setState({ evaluateNumber });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const { evaluateNumber } = this.state;
    return (
      <div className={styles['evaluate-bar']} onClick={() => navigate('/#/comment')}>
        <div>宝贝评价({evaluateNumber})</div>
        <div className={styles['check-all']}>查看全部</div>
        <div className={styles['arrow-icon']}>
          <img src={arrowIcon} alt="arrow-icon" />
        </div>
      </div>
    );
  }
}

export default EvaluateBar;
