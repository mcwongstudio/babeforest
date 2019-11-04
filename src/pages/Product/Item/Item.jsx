import React, { Component } from 'react';
import { connect } from 'react-redux';
import arrowIcon from 'assets/images/arrow-green.png';
import { Header, Breadcrumb, Footer, SupplementBar } from 'components';
import request from 'utils/request';
import toDecimal2 from 'utils/toDecimal2';
import config from 'config';
import styles from './item.css';
import Banner from './components/Banner';
import ProductInfoBar from './components/ProductInfoBar';
import EvaluateBar from './components/EvaluateBar';
import RecommendBar from './components/RecommendBar';
import DetailBar from './components/DetailBar';
import PopUpPanel from './components/PopUpPanel';

class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      contentHeight: 0,
      bannerList: [],
      oldPrice: toDecimal2(0),
      newPrice: toDecimal2(0),
      productName: '',
      detailList: [],
      detailImage: '',
      specificationData: '{}',
      itemSkuList: [],
    };
    const skuId = sessionStorage.skuId || '';
    this.getProductInfo(skuId);
  }

  showSpecificationPanel = () => {
    this.setState({ showPanel: true });
  }

  getProductInfo = (skuId) => {
    const url = `${config.apiUri}/item/spu/sku/${skuId}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const info = res.data.result;
        const { title, images, specificationData } = info;
        const { price, vipPrice } = info.itemSkuDetail;
        const bannerList = info.itemDetails;
        const { itemSkuList } = info;

        this.initBannerList(bannerList);
        this.initDetailList(info.itemParamJSONObj);

        this.setState({
          oldPrice: price,
          newPrice: vipPrice,
          productName: title,
          detailImage: images,
          specificationData,
          itemSkuList,
        });
      } else {
        sessionStorage.removeItem('routes');
        window.location.href = '/#/login';
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  initBannerList = (bannerListText) => {
    const flag = bannerListText.indexOf(',') !== -1;
    let bannerList = [];
    if (flag) {
      // 有逗号
      bannerList = bannerListText.split(',');
    } else {
      bannerList.push(bannerListText);
    }
    this.setState({ bannerList });
  }

  initDetailList = (detailObj) => {
    const detailKeys = Object.keys(detailObj);
    const detailList = [];
    const loop = (i) => {
      const detailKey = detailKeys[i];
      if (detailKey) {
        detailList.push({ label: detailKey, value: detailObj[detailKey] });
        loop(i + 1);
      }
    };
    loop(0);
    this.setState({ detailList });
  }

  handleCancel = () => {
    setTimeout(() => this.setState({ showPanel: false }), 10);
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

  render() {
    const {
      showPanel,
      contentHeight,
      specificationData,
      detailList,
      bannerList,
      oldPrice,
      newPrice,
      productName,
      detailImage,
      itemSkuList,
    } = this.state;
    const contentStyle = showPanel ? { height: contentHeight, overflow: 'hidden' } : { height: contentHeight };

    return (
      <div className={styles.page} style={{ height: window.innerHeight }}>
        <Header />
        <div className={styles.content} style={contentStyle}>
          <Breadcrumb list={['所有产品', productName]} />
          <Banner list={bannerList} />
          <div className={styles['divide-bar']} />
          <ProductInfoBar
            oldPrice={oldPrice}
            newPrice={newPrice}
            productName={productName}
          />
          <div className={styles['divide-bar']} />
          <div className={styles['select-specification']} onClick={this.showSpecificationPanel}>
            <span>请选择规格数量</span>
            <span className={styles['arrow-icon']}><img src={arrowIcon} alt="arrow" /></span>
          </div>
          <div className={styles['divide-bar']} />
          <div className={styles['inner-content-bar']}>
            <EvaluateBar />
            <RecommendBar />
          </div>
          <div className={styles['divide-bar']} />
          <DetailBar list={detailList} detailImage={detailImage} />
          <SupplementBar />
          <Footer />
        </div>
        <PopUpPanel
          visible={showPanel}
          onClose={this.handleCancel}
          specification={specificationData}
          itemSkuList={itemSkuList}
        />
      </div>
    );
  }
}

export default connect()(ProductItem);
