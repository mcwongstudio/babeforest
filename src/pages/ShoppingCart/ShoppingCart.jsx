import React, { Component } from 'react';
import { PageHeader } from 'components';
import request from 'utils/request';
import Toast from 'utils/toast';
import parseSpecification from 'utils/parseSpecification';
import config from 'config';
import toDecimal2 from 'utils/toDecimal2';
import navigate from 'utils/navigate';

import decreaseIcon from 'assets/images/decrease.png';
import increaseIcon from 'assets/images/increase.png';
import checkboxIcon from 'assets/images/checkbox.png';
import trashIcon from 'assets/images/trash.png';
import checkboxActivedIcon from 'assets/images/checkbox-actived.png';

import styles from './shoppingCart.css';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
      },
      isQuantity: 0,
      isAllChecked: false,
      showTrash: false,
      total: toDecimal2(0),
      list: [],
      selectedSkuIds: [],
      contentHeight: 0,
    };
  }

  componentWillMount() {
    this.getShoppingCartList({ pageNum: 1, pageSize: 100 });
  }

  componentDidMount() {
    this.setContentHeight();
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    const isIOS = JSON.parse(sessionStorage.isIOS);
    let height = 0;
    if (!isPage && isIOS) {
      height = 'calc(100% - (232 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (200 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  getShoppingCartList = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/carts?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      const { list } = res.data.result;
      this.setState({ list });
      this.initCheck();
    }).catch((err) => {
      console.error(err);
    });
  }

  handlePreOrder = () => {
    const { list, checked } = this.state;
    let flag = false;
    const skuOrderInfoList = [];
    const loop = (i) => {
      const item = list[i];
      if (item) {
        if (checked[item.itemSkuId]) {
          skuOrderInfoList.push({ skuId: item.itemSkuId, number: item.skuCount });
          flag = true;
        }
        loop(i + 1);
      }
    };
    loop(0);
    if (flag) {
      sessionStorage.setItem('skuOrderInfoList', JSON.stringify(skuOrderInfoList));
      sessionStorage.removeItem('addressId');
      sessionStorage.removeItem('couponName');
      sessionStorage.removeItem('couponId');
      navigate('/#/confirm');
    } else {
      Toast.show('请选择需要购买的商品');
    }
  }

  removeItem = (productId) => {
    const url = `${config.apiUri}/carts/${productId}`;
    const method = 'DELETE';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        this.checkSelect();
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  removeAll = () => {
    const url = `${config.apiUri}/carts/clears`;
    const method = 'DELETE';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        this.checkSelect();
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  initCheck = () => {
    const { list, checked } = this.state;
    const loop = (i) => {
      const item = list[i];
      if (item) {
        checked[item.id] = false;
        loop(i + 1);
      }
    };
    loop(0);
    this.setState({ checked });
  }

  handleSelect = (item) => {
    const { checked } = this.state;
    const { itemSkuId } = item;
    checked[itemSkuId] = !checked[itemSkuId];
    const price = (item.itemSpuInfo.itemSkuDetail.vipPrice
      ||
      item.itemSpuInfo.itemSkuDetail.price) * 1;
    const total = this.state.total * 1;
    let totalPrice = 0;
    if (checked[itemSkuId]) {
      totalPrice = total + price;
    } else {
      totalPrice = total - price;
    }
    this.setState({ checked, total: toDecimal2(totalPrice) });
    this.checkSelect();
  }

  checkSelect = () => {
    const { checked, list } = this.state;
    let flag = true;
    let showTrash = false;
    let total = 0;
    let count = 0;
    const selectedSkuIds = [];

    const loop = function loop(i) {
      const item = list[i];
      if (item) {
        loop(i + 1);
        if (checked[item.itemSkuId]) {
          selectedSkuIds.push(item.itemSkuId);
          showTrash = true;
          const { vipPrice, price } = item.itemSpuInfo.itemSkuDetail;
          const newPrice = item.skuCount * (vipPrice || price);
          total += newPrice;
          count += 1;
        } else {
          flag = checked[item.itemSkuId];
        }
      }
    };
    loop(0);
    this.setState({
      isAllChecked: flag,
      showTrash,
      total: toDecimal2(total),
      isQuantity: count,
      selectedSkuIds,
    });
  }

  handleDescrease = (itemSkuId) => {
    const { list } = this.state;
    let skuId = '';
    let differ = 0;
    const loop = (i) => {
      if (list[i]) {
        if (list[i].itemSkuId === itemSkuId) {
          skuId = list[i].itemSkuId;
          list[i].skuCount -= 1;
          if (list[i].skuCount < 1) {
            list[i].skuCount = 1;
          }
          differ = list[i].skuCount;
        } else {
          loop(i + 1);
        }
      }
    };
    loop(0);
    this.setState({ list });
    this.checkSelect();
    if (skuId && differ) {
      this.updateProductNumber({ skuId, differ });
    }
  }

  handleInscrease = (itemSkuId) => {
    const { list } = this.state;
    let skuId = '';
    let differ = 0;
    const loop = (i) => {
      if (list[i]) {
        if (list[i].itemSkuId === itemSkuId) {
          skuId = list[i].itemSkuId;
          list[i].skuCount += 1;
          if (list[i].skuCount >= list[i].itemSpuInfo.itemSkuDetail.storageSize) {
            list[i].skuCount = list[i].itemSpuInfo.itemSkuDetail.storageSize;
          }
          differ = list[i].skuCount;
        } else {
          loop(i + 1);
        }
      }
    };
    loop(0);
    this.setState({ list });
    this.checkSelect();
    if (skuId && differ) {
      this.updateProductNumber({ skuId, differ });
    }
  }

  updateProductNumber = ({ skuId, differ }) => {
    const { selectedSkuIds } = this.state;
    const url = `${config.apiUri}/carts?skuId=${skuId}&differ=${differ}&selectedSkuIds=${selectedSkuIds.toString()}`;
    const method = 'PUT';
    request({ url, method }).then((res) => {
      if (res.data.code !== 200) {
        Toast.show('更新商品数量失败，请重试!');
      }
      this.getShoppingCartList({ pageNum: 1, pageSize: 100 });
    }).catch((err) => {
      console.error(err);
    });
  }

  checkAll = () => {
    const { checked, list } = this.state;
    const flag = this.state.isAllChecked;
    if (list.length) {
      let loop;
      if (flag) {
        loop = (i) => {
          const item = list[i];
          if (item) {
            checked[item.itemSkuId] = false;
            loop(i + 1);
          }
        };
      } else {
        loop = (i) => {
          const item = list[i];
          if (item) {
            checked[item.itemSkuId] = true;
            loop(i + 1);
          }
        };
      }
      loop(0);
      this.setState({
        checked,
        isAllChecked: !flag,
        showTrash: !flag,
      });
      this.checkSelect();
    }
  }

  removeProduct = () => {
    const { checked, list } = this.state;
    const newList = [];
    const removeList = [];
    const loop = function loop(i) {
      const item = list[i];
      if (item) {
        if (!checked[item.itemSkuId]) {
          newList.push(item);
        } else {
          removeList.push(item.id);
        }
        loop(i + 1);
      }
    };
    loop(0);
    if (removeList.length === list.length) {
      this.removeAll();
    } else {
      const that = this;
      const removeLoop = (i) => {
        const removeId = removeList[i];
        if (removeId) {
          that.removeItem(removeId);
          removeLoop(i + 1);
        }
      };
      removeLoop(0);
    }
    this.setState({ list: newList, isAllChecked: false, showTrash: false });
  }

  render() {
    const {
      list,
      checked,
      isQuantity,
      isAllChecked,
      total,
      showTrash,
      contentHeight,
    } = this.state;
    return (
      <div className={styles['shopping-cart-page']}>
        <PageHeader title="购物车">
          {
            showTrash ?
              <div className={styles['remove-product-btn']} onClick={this.removeProduct}><img src={trashIcon} alt="trash-icon" /></div>
              :
              null
          }
        </PageHeader>
        <div className={styles['product-content']} style={{ height: contentHeight }}>
          {
          !list.length ?
            <div className={styles['empty-tips']}>暂无商品</div>
            :
            list.map(item => (
              <div className={styles['product-item']} key={item.itemSkuId}>
                <div className={styles['product-checkbox']} onClick={() => this.handleSelect(item)}>
                  {
                    checked[item.itemSkuId] ?
                      <img src={checkboxActivedIcon} alt="checkbox-actived" />
                      :
                      <img src={checkboxIcon} alt="checkbox" />
                  }
                </div>
                <div className={styles['product-cover']}><img src={item.itemSpuInfo.itemSkuDetail.images} alt="cover" /></div>
                <div className={styles['product-info']}>
                  <div className={styles['product-name']}>{ item.itemSpuInfo.title }</div>
                  <div className={styles['product-specification']}>{ parseSpecification(item.itemSpuInfo.itemParams) }</div>
                  <div className={styles['info-bottom']}>
                    <div className={styles['product-price']}>{ toDecimal2(item.itemSpuInfo.itemSkuDetail.vipPrice) }</div>
                    <div className={styles['product-number-bar']}>
                      <span className={styles['descrease-btn']} onClick={() => this.handleDescrease(item.itemSkuId)}><img src={decreaseIcon} alt="decrease" /></span>
                      <span>{ item.skuCount }</span>
                      <span className={styles['inscrease-btn']} onClick={() => this.handleInscrease(item.itemSkuId)}><img src={increaseIcon} alt="increase" /></span>
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
        </div>
        <div className={styles['shopping-cart-footer']}>
          <div className={styles['confirm-bar']}>
            <div className={styles['check-all-btn']} onClick={this.checkAll}>
              {
                isAllChecked ?
                  <img src={checkboxActivedIcon} alt="checkbox-actived" />
                  :
                  <img src={checkboxIcon} alt="checkbox" />
              }
              <span>全选</span>
            </div>
            <div className={styles['total-bar']}>合计:<span className={total !== '0.00' ? styles['price-bar'] : ''}>¥{ total }</span></div>
          </div>
          <div className={styles['submit-btn']} onClick={this.handlePreOrder}>去结算({ isQuantity })</div>
        </div>
      </div>
    );
  }
}

export default ShoppingCart;
