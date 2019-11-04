import React, { Component } from 'react';
import { RidingWindScrollList, RSTATES } from 'ridingwind-scrolllist';
import { Modal } from 'antd-mobile';
import config from 'config';
import request from 'utils/request';
import Toast from 'utils/toast';
import navigate from 'utils/navigate';
import toDecimal2 from 'utils/toDecimal2';
// import parseSpecification from 'utils/parseSpecification';
import { statusText, statusTabList } from 'utils/orderStatus';
import { PageHeader } from 'components';

import styles from './list.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentTab: 'all',
      hasMore: false,
      pageNum: 1,
      pageSize: 10,
      currentState: RSTATES.init,
      orderStatus: 'all',
      contentHeight: 0,
    };
  }

  componentDidMount() {
    this.setContentHeight();
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    const isIOS = JSON.parse(sessionStorage.isIOS);
    let height = 0;
    if (!isPage && isIOS) {
      height = 'calc(100% - (132 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (100 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  executeFunc = (currentState) => {
    if (currentState !== this.state.currentState) {
      if (currentState === RSTATES.refreshing) {
        // 刷新
        this.handRefreshing();
        this.setState({
          currentState: RSTATES.refreshed,
        });
      }
      if (currentState === RSTATES.loading) {
        // 加载更多
        this.handLoadMore();
      } else {
        this.setState({
          currentState,
        });
      }
    }
  }

  handRefreshing = () => {
    if (RSTATES.refreshing !== this.state.currentState) {
      const { pageSize, orderStatus } = this.state;
      const pageNum = 1;
      this.setState({
        currentState: RSTATES.refreshing,
      });

      this.getProductList({ pageNum, pageSize, orderStatus });
    }
  }

  handLoadMore = () => {
    if (RSTATES.loading !== this.state.currentState) {
      // 无更多内容则不执行后面逻辑
      if (this.state.hasMore) {
        this.setState({
          currentState: RSTATES.loading,
        });
        const { pageNum, pageSize, orderStatus } = this.state;
        this.getProductList({ pageNum, pageSize, orderStatus });
      }
    }
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getProductList({ pageNum, pageSize });
  }

  getProductList = ({ pageNum, pageSize, orderStatus }) => {
    let url = `${config.apiUri}/orders/details?pageNum=${pageNum}&pageSize=${pageSize}`;
    if (orderStatus && orderStatus !== 'all') {
      url += `&orderStatus=${orderStatus}`;
    }
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { list, total } = res.data.result;
        const oldList = this.state.list;
        let newList = oldList.concat(list);
        if (pageNum === 1) {
          newList = list;
        }
        const number = pageNum + 1;
        const current = pageNum * pageSize;
        const hasMore = total > current;
        this.setState({
          list: newList,
          hasMore,
          currentState: RSTATES.reset,
          pageNum: number,
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  selectTab = (e) => {
    const status = e.target.id;
    this.setState({ currentTab: status });
    if (status !== 'all') {
      this.getProductList({ pageNum: 1, pageSize: 10, orderStatus: status });
    } else {
      this.getProductList({ pageNum: 1, pageSize: 10 });
    }
  }

  // calculateTotalCost = (productList) => {
  //   let totalCost = 0;
  //   const loop = function loop(i) {
  //     const item = productList[i];
  //     if (item) {
  //       totalCost += (item.itemSkuDetail.purchaseCount * item.itemSkuDetail.singleAmount);
  //       loop(i + 1);
  //     }
  //   };
  //   loop(0);
  //   return totalCost;
  // }

  handlePay = (orderId) => {
    sessionStorage.setItem('orderId', orderId);
    navigate('/#/checkStand');
  }

  handleRefund = (item) => {
    Modal.alert('退款', '是否退款？', [
      {
        text: '否',
        onPress: () => console.log('cancel'),
      }, {
        text: '是',
        onPress: () => {
          sessionStorage.setItem('orderId', item.id);
          navigate('/#/refund');
        },
      },
    ]);
  }

  handleRefundGoods = (item) => {
    const flag = window.confirm('是否退款？');
    if (flag) {
      sessionStorage.setItem('orderId', item.id);
      sessionStorage.setItem('refundGoods', 1);
      navigate('/#/refund');
    }
  }

  handleCheckLogistics = (orderId) => {
    sessionStorage.setItem('orderId', orderId);
    navigate('/#/logistics');
  }

  handleCancelOrder = (orderId) => {
    const flag = window.confirm('是否取消该订单？');
    if (flag) {
      const url = `${config.apiUri}/orders`;
      const method = 'PUT';
      const data = { id: orderId, orderStatus: 'TRANSACTION_CANCEL' };
      request({ url, method, data }, 'JSON').then((res) => {
        if (res.data.code === 200) {
          this.getProductList({ pageNum: 1, pageSize: 10 });
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  handelEvaluate = (item) => {
    console.log(item);
    const orderId = item.id;
    sessionStorage.setItem('orderId', orderId);
    if (item.orderSpuDetailList.length) {
      const skuId = item.orderSpuDetailList[0].itemSkuDetail.id;
      sessionStorage.setItem('skuId', skuId);
      navigate('/#/evaluate');
    } else {
      Toast.show('订单有误');
    }
  }

  handelEditGoodsReturnedNote = (orderId) => {
    sessionStorage.setItem('orderId', orderId);
    navigate('/#/salesReturn');
  }

  render() {
    const {
      list,
      currentTab,
      currentState,
      hasMore,
      contentHeight,
    } = this.state;
    console.log(list);

    return (
      <div className={styles['order-list-page']} style={{ height: window.innerHeight }}>
        <PageHeader title="我的订单" />
        <section className={styles['order-list-content']} style={{ height: contentHeight }}>
          <div className={styles['status-tab-list']}>
            {
              statusTabList.map((status, index) => (
                <div
                  key={index}
                  className={status.id === currentTab ? `${styles['status-tab-item']} ${styles['status-actived']}` : styles['status-tab-item']}
                  onClick={this.selectTab}
                  id={status.id}
                >
                  { status.name }
                </div>
              ))
            }
          </div>
          {
            list.length !== 0 ?
              <div className={styles['order-list']}>
                <RidingWindScrollList
                  id="list"
                  pullDownSpace={100}
                  actionSpaceBottom={500}
                  currentState={currentState}
                  hasMore={hasMore}
                  executeFunc={this.executeFunc}
                >
                  <div className={styles['tab-content']}>
                    {
                      list.map((item, index) => (
                        <div key={index} className={styles['order-item']}>
                          <div className={styles['order-header']}>
                            <div className={styles['order-number']}>订单号：{item.id}</div>
                            <div className={styles['order-status']}>{statusText[item.orderStatus] || '未知状态'}</div>
                          </div>
                          <div className={styles['order-content']}>
                            {
                              item.orderSpuDetailList.map((order, orderIndex) => (
                                <div className={styles['order-inner-item']} key={orderIndex}>
                                  <div className={styles['product-cover']}><img src={order.itemSkuDetail.images} alt="cover" /></div>
                                  <div className={styles['product-info']}>
                                    <div className={styles['product-name']}>{order.title}</div>
                                    <div className={styles['product-specification']}>{order.itemSkuDetail.itemSpecs}</div>
                                  </div>
                                  <div className={styles['product-price-info']}>
                                    <div className={styles['product-price']}>{toDecimal2(order.itemSkuDetail.singleAmount)}</div>
                                    <div className={styles['product-number']}>x{order.itemSkuDetail.purchaseCount}</div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                          <div className={styles['order-footer']}>
                            <div className={styles['order-count-bar']}>
                              共{item.orderSpuDetailList.length}件商品 合计：<span className={styles['order-count-price']}>{toDecimal2(item.totalAmount)}</span>
                            </div>
                            {
                              item.orderStatus === 'Payments_Due' ?
                                <div className={styles['control-bar']}>
                                  <div className={styles['cancel-order-btn']} onClick={() => this.handleCancelOrder(item.id)}>取消订单</div>
                                  <div className={styles['pay-order-btn']} onClick={() => this.handlePay(item.id)}>付款</div>
                                </div>
                                : null
                            }
                            {
                              item.orderStatus === 'Payments_Made' ?
                                <div className={styles['control-bar']}>
                                  <div className={styles['refund-btn']} onClick={() => this.handleRefund(item)}>退款</div>
                                </div>
                                : null
                            }
                            {
                              item.orderStatus === 'Delivered' ?
                                <div className={styles['control-bar']}>
                                  <div className={styles['refund-return-btn']} onClick={() => this.handleRefundGoods(item)}>退款退货</div>
                                  <div className={styles['check-logistics-btn']} onClick={() => this.handleCheckLogistics(item.id)}>查看物流</div>
                                </div>
                                : null
                            }
                            {
                              item.orderStatus === 'FINISH' ?
                                <div className={styles['control-bar']}>
                                  <div className={styles['check-logistics-finish-btn']} onClick={() => this.handleCheckLogistics(item.id)}>查看物流</div>
                                  {
                                    item.isCommented ?
                                      null
                                    :
                                      <div className={styles['evaluate-btn']} onClick={() => this.handelEvaluate(item)}>评价</div>
                                  }
                                </div>
                                : null
                            }
                            {
                              item.orderStatus === 'AGREED' ?
                                <div className={styles['control-bar']}>
                                  <div className={styles['check-logistics-finish-btn']} onClick={() => this.handleCheckLogistics(item.id)}>查看物流</div>
                                  <div className={styles['evaluate-btn']} onClick={() => this.handelEditGoodsReturnedNote(item.id)}>填写退货单</div>
                                </div>
                                : null
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </RidingWindScrollList>
              </div>
              :
              <div className={styles['empty-order-list']}>暂无订单</div>
          }
        </section>
      </div>
    );
  }
}

export default List;
