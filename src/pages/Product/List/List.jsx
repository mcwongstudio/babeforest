import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Footer, SupplementBar } from 'components';
import request from 'utils/request';
import navigate from 'utils/navigate';
import config from 'config';

import styles from './list.css';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHeight: 0,
      seriesList: [],
      productList: {},
      pageNum: 1,
      pageSize: 10,
    };
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getProductSeries({ pageNum, pageSize });
  }

  componentDidMount() {
    this.setContentHeight();
  }

  getProductSeries = ({ pageNum, pageSize }) => {
    const url = `${config.apiUri}/item/categories/show?pageNum=${pageNum}&pageSize=${pageSize}&orderBy=sort+DESC`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      const { seriesList, productList } = this.state;
      const { list } = res.data.result;
      const that = this;

      list.forEach((item) => {
        productList[`series${item.id}`] = [];
      });

      this.setState({
        seriesList: [...seriesList, ...list],
        pageNum: pageNum + 1,
        pageSize,
        productList,
      });

      list.forEach((item) => {
        that.getProductList(item.id);
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  getProductList = (id) => {
    const url = `${config.apiUri}/item/spu/show?categoryId=${id}&pageNum=1&pageSize=10`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { productList } = this.state;
        const { list } = res.data.result;
        productList[`series${id}`] = list;
        console.log(productList);
        this.setState({ productList });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    let height = 0;
    if (!isPage) {
      height = 'calc(100% - (130 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (98 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  handleNavigate = (item) => {
    console.log(item);
    const productId = item.id;
    const skuId = item.itemSkuDetail.id;
    const { categoryId } = item;
    sessionStorage.setItem('productId', productId);
    sessionStorage.setItem('skuId', skuId);
    sessionStorage.setItem('categoryId', categoryId);
    navigate('/#/product');
  }

  render() {
    const {
      contentHeight,
      seriesList,
      productList,
    } = this.state;

    return (
      <div className={styles.main}>
        <Header title="贝比森林"className={styles.mainHeader} />
        <section className={styles.section} style={{ height: contentHeight }}>
          <div>
            {
              seriesList.map(item => (
                <div key={item.id} className={styles['product-series-item']}>
                  <div className={styles['product-series-cover']}>
                    <div className={styles['product-cover-shadow']} />
                    <img src={item.image} alt="cover" />
                    <div className={styles['product-cover-text']}>
                      <div className={styles['product-text-title']}>{item.title}</div>
                      <div className={styles['product-text-description']}>{item.description}</div>
                    </div>
                  </div>
                  <div className={styles['product-inner-list']}>
                    {
                      productList[`series${item.id}`].length ?
                        productList[`series${item.id}`].map(innerItem => (
                          <div
                            key={innerItem.itemSkuDetail.id}
                            className={styles['product-inner-item']}
                            onClick={() => this.handleNavigate(innerItem)}
                          >
                            <div className={styles['product-cover']}><img src={innerItem.itemSkuDetail.images} alt="cover" /></div>
                            <div className={styles['product-name']}>{innerItem.title}</div>
                            <div className={styles['product-price']}>
                              {
                                innerItem.itemSkuDetail.vipPrice ?
                                  innerItem.itemSkuDetail.vipPrice
                                  :
                                  innerItem.itemSkuDetail.price
                              }
                            </div>
                          </div>
                        ))
                        :
                        <div className={styles['empty-tips']}>暂无商品</div>
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <SupplementBar />
          <Footer />
        </section>
      </div>
    );
  }
}

export default connect()(List);
