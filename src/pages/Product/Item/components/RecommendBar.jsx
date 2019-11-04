import React, { Component } from 'react';
import { Swipeable } from 'react-swipeable';
import config from 'config';
import request from 'utils/request';

import styles from './components.css';

class RecommendBar extends Component {
  state = {
    list: [],
    current: 0,
    max: 0,
    transformX: 0,
  }

  componentWillMount() {
    this.getRecommendList();
  }

  getRecommendList = () => {
    const { categoryId } = sessionStorage;
    const url = `${config.apiUri}/item/spu/category/${categoryId}/sku?pageNum=1&pageSize=6`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { list } = res.data.result;
        this.setState({ list, max: Math.round(list.length / 3) });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleMoveSwipeLeft = () => {
    const { max, list } = this.state;
    const flag = Math.round(list.length / 3) >= 1;
    if (flag) {
      let { current } = this.state;
      current += 1;
      if (current > (max - 1)) {
        current = (max - 1);
      }
      const transformX = ((window.innerWidth * current) * -1);
      this.setState({ transformX, current });
    }
  }

  handleMoveSwipeRight = () => {
    const { list } = this.state;
    const flag = Math.round(list.length / 3) >= 1;
    if (flag) {
      let { current } = this.state;
      current -= 1;
      if (current < 0) {
        current = 0;
      }
      const transformX = (window.innerWidth * current) * -1;
      this.setState({ transformX, current });
    }
  }

  renderPagination = () => {
    const { max } = this.state;
    const list = [];
    const loop = (i) => {
      if (i < max) {
        list.push(i);
        loop(i + 1);
      }
    };
    loop(0);
    return list;
  }

  render() {
    const { list, transformX, current } = this.state;
    const swipeConfig = {
      delta: 10,
      preventDefaultTouchmoveEvent: false,
      trackTouch: true,
      trackMouse: false,
      rotationAngle: 0,
      onSwipedLeft: this.handleMoveSwipeLeft,
      onSwipedRight: this.handleMoveSwipeRight,
    };
    const paginationList = this.renderPagination();
    return (
      list.length !== 0 ?
        <div className={styles['recommend-bar']}>
          <span className={styles['recommend-title']}>为您推荐</span>
          <Swipeable className={styles['recommend-wrap']} {...swipeConfig}>
            <div
              className={styles['recommend-list']}
              style={{ width: `calc(${Math.round(list.length / 3) + 1} * 100%)`, transform: `translate3d(${transformX}px, 0px, 0px)` }}
            >
              {
                list.map(item => (
                  <div className={styles['recommend-item']} key={item.id}>
                    <div className={styles['product-cover-bar']}><img src={item.itemSkuDetail.images} alt="Cover" /></div>
                    <div className={styles['product-name-bar']}>{item.title}</div>
                    <div className={styles['product-price-bar']}>{item.itemSkuDetail.vipPrice}</div>
                  </div>
                ))
              }
            </div>
          </Swipeable>
          <div className={styles['recommend-list-pagination-bar']}>
            {
              paginationList.map((item, index) => (
                index === current ?
                  <span className={styles['dot-item-actived']} />
                  :
                  <span className={styles['dot-item']} />
              ))
            }
          </div>
        </div>
        :
        null
    );
  }
}

export default RecommendBar;
