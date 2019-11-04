import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
import request from 'utils/request';
import TOAST from 'utils/toast';
import TextBar from './components/TextBar';
import Start from './components/Start';
import styles from './evaluate.css';

class Evaluate extends Component {
  state = {
    checked: false,
  }

  handleSubmit = () => {
    console.log('提交');
    const url = `${config.apiUri}/comment`;
    const method = 'POST';
    const { orderId, skuId } = sessionStorage;
    const content = this.Text.state.value;
    const { score } = this.StartBar.state;
    const data = [{
      score,
      content,
      orderId,
      skuId,
    }];
    request({ url, method, data }, 'JSON').then((res) => {
      if (res.data.code === 200) {
        this.removeOrderData();
        TOAST.show(res.data.message);
        setTimeout(this.handleBack, 1500);
      }
    }).catch(() => {
      TOAST.show('网络出错,请稍后再试');
    });
  }

  removeOrderData = () => {
    try {
      sessionStorage.removeItem('score');
      sessionStorage.removeItem('orderId');
    } catch (e) {
      console.log(e);
    }
  }

  handleBack = () => {
    const routes = JSON.parse(sessionStorage.routes || '[]');
    const url = routes[routes.length - 1];
    if (url) {
      routes.splice(routes.length - 1, 1);
      console.log(routes);
      sessionStorage.setItem('routes', JSON.stringify(routes));
      window.location.href = url;
    }
  }

  checkSubmit = () => {
    const { score } = this.StartBar.state;
    const { value } = this.Text.state;
    console.log(value);
    if (score && value) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    }
  }

  windowToTop = () => {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      checked,
    } = this.state;
    return (
      <div className={styles['evaluate-page']}>
        <PageHeader title="评价订单" />
        <div className={styles['evaluate-content']}>
          <div className={styles['start-label']}>
            <span>*</span><span>商品评分</span>
          </div>
          <Start
            ref={(e) => {
              this.StartBar = e;
            }}
            onBlur={this.checkSubmit}
          />
          <div className={styles['text-label']}>
            <span>*</span><span>评价晒单</span>
          </div>
          <TextBar
            ref={(text) => { this.Text = text; }}
            placeholder="分享体验心得,给千万想买的人一个参考~"
            onBlur={this.checkSubmit}
            KeyboardDrop={this.windowToTop}
          />
        </div>
        {
          checked ?
            <div className={styles['submit-btn-actived']} onClick={this.handleSubmit}>提交</div>
            :
            <div className={styles['submit-btn']} onClick={this.showMessage}>提交</div>
        }

      </div>
    );
  }
}

export default Evaluate;
