import React, { Component } from 'react';
import config from 'config';
import toDecimal2 from 'utils/toDecimal2';
import request from 'utils/request';
import Toast from 'utils/toast';
import navigate from 'utils/navigate';

import removeIcon from 'assets/images/remove.png';
import increaseIcon from 'assets/images/increase.png';
import decreaseIcon from 'assets/images/decrease.png';
import styles from './components.css';

class PopUpPanel extends Component {
  state = {
    productCount: 1,
    productTotal: 0,
    selectColor: '',
    selectSpecification: '',
    preferentialPrice: toDecimal2(0),
    originalPrice: toDecimal2(0),
    productCover: '',
    skuId: '',
    checked: {},
    // labelLength: 0,
  }

  componentWillMount() {
    this.getProductSpecification();
  }

  initSpecification = (specification) => {
    const specificationObj = JSON.parse(specification);
    const labelList = Object.keys(specificationObj);
    return {
      labelList,
      specificationObj,
    };
  }

  getProductSpecification = () => {
    const { skuId } = sessionStorage;
    const url = `${config.apiUri}/item/sku/${skuId}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const product = res.data.result;
        const {
          images,
          vipPrice,
          price,
          storageSize,
        } = product;
        this.setState({
          productCover: images,
          preferentialPrice: vipPrice,
          originalPrice: price,
          productTotal: storageSize,
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleIncrease = () => {
    const { productTotal } = this.state;
    let { productCount } = this.state;
    productCount += 1;
    if (productCount >= productTotal) {
      productCount = productTotal;
    }
    this.setState({ productCount });
  }

  handleDecrease = () => {
    let { productCount } = this.state;
    productCount -= 1;
    if (productCount < 1) {
      productCount = 1;
    }
    this.setState({ productCount });
  }

  onSelectSpecification = (label, value) => {
    const { specification } = this.props;
    const { checked } = this.state;
    const { specificationObj } = this.initSpecification(specification);
    for (let i = 0; i < specificationObj[label].length; i += 1) {
      const item = specificationObj[label][i];
      const checkKey = `${label},${item.title}`;
      if (item.title === value && !checked[checkKey]) {
        checked[checkKey] = true;
      } else {
        checked[checkKey] = false;
      }
    }
    this.setState({ checked });
    this.checkSelect();
  }

  checkSelect = () => {
    const { checked } = this.state;
    const checkedKeys = Object.keys(checked);
    let selectKey = '';
    for (let i = 0; i < checkedKeys.length; i += 1) {
      const flag = checked[checkedKeys[i]];
      if (flag) {
        const keyList = checkedKeys[i].split(',');
        if (!selectKey) {
          selectKey = keyList['1'];
        } else {
          selectKey += `,${keyList['1']}`;
        }
        const {
          productCover,
          skuId,
          originalPrice,
          preferentialPrice,
        } = this.getProductInfo(selectKey);
        if (productCover && skuId) {
          this.setState({
            productCover,
            skuId,
            originalPrice,
            preferentialPrice,
          });
          break;
        } else {
          this.setState({
            skuId: '',
          });
        }
      }
    }
  }

  getProductInfo = (selectKey) => {
    const { itemSkuList } = this.props;
    for (let i = 0; i < itemSkuList.length; i += 1) {
      const item = itemSkuList[i];
      if (item.itemSpecs === selectKey) {
        return {
          productCover: item.images,
          skuId: item.id,
          originalPrice: item.price,
          preferentialPrice: item.vipPrice,
        };
      }
    }
    return { productCover: '', skuId: '' };
  }

  componentWillUpdate = (nextProps, nextState) => {
    if (nextProps.specification && !Object.keys(nextState.checked).length) {
      this.initChecked(nextProps.specification);
    }
  }

  initChecked = (specification) => {
    const specificationObj = JSON.parse(specification);
    const specificationKeys = Object.keys(specificationObj);
    const { checked } = this.state;
    for (let i = 0; i < specificationKeys.length; i += 1) {
      const label = specificationKeys[i];
      // console.log(specificationObj[label]);
      for (let j = 0; j < specificationObj[label].length; j += 1) {
        const { title } = specificationObj[label][j];
        const checkKey = `${label},${title}`;
        checked[checkKey] = false;
      }
    }
    console.log(checked);
  }

  handleAddShoppingCart = () => {
    const {
      productCount,
      skuId,
    } = this.state;
    if (skuId) {
      const url = `${config.apiUri}/carts`;
      const method = 'POST';
      const data = { skuId, count: productCount };
      request({ url, method, data }).then((res) => {
        console.log(res);
        if (res && res.data.code === 200) {
          Toast.show(res.data.message);
        } else {
          window.location.href = '/#/login';
        }
      }).catch((err) => {
        console.error(err);
      });
    } else {
      Toast.show('请选择产品规格');
    }
  }

  handleBuy = () => {
    const {
      productCount,
      skuId,
    } = this.state;
    if (skuId) {
      const skuOrderInfoList = [{ skuId, number: productCount }];
      const url = `${config.apiUri}/orders/order-confirmation`;
      const method = 'POST';
      const data = { skuOrderInfoList };
      request({ url, method, data }, 'JSON').then((res) => {
        if (res.data.code === 200) {
          sessionStorage.setItem('orderId', res.data.result.id);
          sessionStorage.setItem('skuOrderInfoList', JSON.stringify(skuOrderInfoList));
          sessionStorage.setItem('confirmOrderSpuList', JSON.stringify(res.data.result.confirmOrderSpuList));
          navigate('/#/confirm');
        }
      }).catch((err) => {
        console.error(err);
      });
    } else {
      Toast.show('请选择产品规格');
    }
  }

  render() {
    const { visible, onClose, specification } = this.props;
    const { labelList, specificationObj } = this.initSpecification(specification);
    const {
      productCount,
      preferentialPrice,
      originalPrice,
      productCover,
      selectColor,
      selectSpecification,
      checked,
    } = this.state;
    const contentClass = visible ? `${styles['pop-up-content']} ${styles['show-content']}` : styles['pop-up-content'];
    const boxClass = visible ? `${styles['show-box']} ${styles['bottom-animation']}` : styles['show-box'];
    console.log(selectSpecification, selectColor);
    return (
      <div className={contentClass}>
        <div className={styles['pop-up-shadow']} onClick={onClose} />
        <div className={boxClass}>
          <div className={styles['show-header-bar']}>
            <div className={styles['show-product-info']}>
              <div className={styles['show-product-cover']}><img src={productCover} alt="product" /></div>
              <div className={styles['show-product-price']}>
                <div className={styles['show-price-bar']}>
                  <span className={styles['show-preferential-price']}>{ preferentialPrice }</span>
                  <span className={styles['show-original-price']}>{ originalPrice }</span>
                </div>
                <div className={styles['show-tips']}>请选择规格数量</div>
              </div>
            </div>
            <div className={styles['show-close-btn']} onClick={onClose}><img src={removeIcon} alt="remove" /></div>
          </div>
          <div className={styles['show-content-bar']}>
            <div className={styles['show-bar-title']}>规格</div>
            {
              labelList.map((label, index) => (

                <div key={`${label}${index}`}>
                  <div className={styles['show-bar-title']}>{label}</div>
                  <div className={styles['show-specification-bar']}>
                    {
                      specificationObj[`${label}`].map((item, key) => (
                        <div
                          className={checked[`${label},${item.title}`] ? styles['show-specification-item-actived'] : styles['show-specification-item']}
                          key={`${item.title}${key}`}
                          onClick={() => this.onSelectSpecification(label, item.title, key)}
                        >
                          { item.title }
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
            <div className={styles['show-bar-title']}>数量</div>
            <div className={styles['show-count-bar']}>
              <div className={styles['count-decrease-btn']} onClick={this.handleDecrease}><img src={decreaseIcon} alt="decrease" /></div>
              <div className={styles['show-count-number']}>{ productCount }</div>
              <div className={styles['count-increase-btn']} onClick={this.handleIncrease}><img src={increaseIcon} alt="increase" /></div>
            </div>
          </div>
          <div className={styles['show-control-bar']}>
            <div className={styles['buy-btn']} onClick={this.handleBuy}>立即购买</div>
            <div className={styles['add-btn']} onClick={this.handleAddShoppingCart}>加入购物车</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PopUpPanel;
