import React, { Component } from 'react';
import { Header, Footer, Map } from 'components';
import config from 'config';
import navigate from 'utils/navigate';
import request from 'utils/request';

import Bitmap1 from 'assets/images/Bitmap-1.png';
import Bitmap2 from 'assets/images/Bitmap-2.png';
import logoIcon from 'assets/images/logo2.png';
import copy2 from 'assets/images/copy2.png';
import Group8Icon from 'assets/images/Group8.png';
import join5 from 'assets/images/join5.png';
import join6 from 'assets/images/join6.png';
import join7 from 'assets/images/join7.png';
import goDown from 'assets/images/go-down.png';

import ProductList from './components/ProductList';
import NewsBar from './components/NewsBar';
import styles from './home.css';

class Home extends Component {
  state = {
    contentHeight: 0,
    showAgent: false,
    showJoin: false,
    showFlow: false,
    banner1: '',
    banner2: '',
  }

  componentWillMount() {
    const url = window.location.href;
    if (url.includes('?')) {
      const search = url.substring(url.indexOf('?') + 1);
      if (search.includes('&')) {
        const searchList = search.split('&');
        const that = this;
        const loop = (i) => {
          const item = searchList[i];
          if (item) {
            const searchObj = item.split('=');
            if (searchObj[0] === 'code') {
              that.handleWechatLogin(searchObj[1]);
            } else {
              loop(i + 1);
            }
          }
        };
        loop(0);
      } else {
        console.log(search);
        const searchObj = search.split('=');
        this.handleWechatLogin(searchObj[1]);
      }
    }
    this.getBannerList({ pageNum: 1, pageSize: 10 });
  }

  getBannerList = ({ pageNum, pageSize }) => {
    console.log();
    const url = `${config.apiUri}/crop-service/banners/all/show?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const bannerList = res.data.result.list;
        const banner1 = bannerList[0].imgUrl || '';
        const banner2 = bannerList[1].imgUrl || '';
        this.setState({ banner1, banner2 });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleWechatLogin = (code) => {
    const url = `${config.apiUri}/wx-service/wx-mini/mobile/login?code=${code}`;
    const method = 'POST';
    request({ url, method }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        sessionStorage.setItem('token', res.headers['x-auth-token']);
      }
    }).catch((err) => {
      console.error(err);
    });
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

  handleShowAgent = () => {
    if (!this.state.showAgent) {
      this.setState({ showAgent: true });
    } else {
      this.setState({ showAgent: false });
    }
  }

  handleShowJoin = () => {
    if (!this.state.showJoin) {
      this.setState({ showJoin: true });
    } else {
      this.setState({ showJoin: false });
    }
  }

  handleShowFlow = () => {
    if (!this.state.showFlow) {
      this.setState({ showFlow: true });
    } else {
      this.setState({ showFlow: false });
    }
  }

  render() {
    window.scrollTo(0, 0);
    const {
      contentHeight,
      showAgent,
      showJoin,
      showFlow,
      banner1,
      banner2,
    } = this.state;
    return (
      <div className={styles.page}>
        <Header title="贝比森林" />
        <div className={styles['home-content']} style={{ height: contentHeight }} >
          {/* 前面两张图片 */}
          <div className={styles.Bitmap1}><img src={banner1 || Bitmap1} alt="img" /></div>
          <div className={styles.Bitmap2}><img src={banner2 || Bitmap2} alt="img" /></div>
          {/* 于人于己 育儿于心 */}
          <div className={styles.white}>
            <div className={styles.writing}>
              <img src={logoIcon} alt="logo" />
            </div>
            <div className={styles.word}>
              <div className={styles.word1}>
                <p>“育人于己  育儿于心”</p>
                <p>Babe Forest为你开启新时代的健康育儿生活</p>
              </div>
              <div className={styles.word2}>
                <p>一起去探索自然、感知世界</p>
                <p>体会生命的美妙</p>
                <p>将有温度的爱、和有质感的产品</p>
                <p>给与最亲爱的宝贝</p>
              </div>
            </div>

          </div>

          <div className={styles.title} onClick={() => { window.location.href = '/#/products'; }}>
            <p>产品系列</p>
            <img src={copy2} alt="copy2" />
          </div>
          <ProductList />

          <div className={styles.title}>
            <p>新闻资讯</p>
          </div>
          <NewsBar />
          <div className={`${styles.title} ${styles['white-background']}`}>
            <p>加入我们</p>
          </div>
          <div className={`${styles.joinus} ${styles['white-background']}`}>
            <img src={Group8Icon} alt="add" />
          </div>
          <div className={`${styles.advantage} ${styles['white-background']}`}>
            <div className={styles.joinus2} onClick={this.handleShowAgent}>
              <img src={join5} alt="join5" />
              <p>代理优势</p>
              <img src={goDown} alt="goDown" />
            </div>
            {
              showAgent ?
                <div className={styles['advantage-text']}>
                  {
                    ['1.统一的门店设计，统一的品牌，给予品牌文化支持。',
                    '2.独家供货，独家经销、垄断经营，严防区域窜货，保证各代理商的独家利益。',
                    '3.提供一件代发销售服务，免去库存风险，节约运营成本。',
                    '4.可持续发展的产品，中长期市场营销战略规划，享受总部安排的统一促销活动。',
                    '5.完善的企划服务，多种促销和活动支持，免费提供产品宣传物料(针对外贸代理商提供英文物料服务)',
                    '6.快捷高效的物流配送，订单24小时内发出（法定节日除外)',
                    '7.经销商巨大的利润空间。'].map(text => (
                      <div key={text}>{text}</div>
                    ))
                  }
                </div>
                : null
            }
          </div>
          <div className={`${styles.joins} ${styles['white-background']}`}>
            <div className={styles.joinus2}>
              <img src={join6} alt="join6" onClick={this.handleShowJoin} />
            </div>
            {
              showJoin ?
                <div className={styles['advantage-text']}>
                  {
                    [
                      '1.合作者必须是年满18周岁具有完全民事行为能力的公民，法人和其他合法的组织。',
                      '2.具有自己的网店，且每天有固定的时间管理和经营网店。',
                      '3.对“贝比森林BebeForest”品牌以及品牌经营理念有较高的认同。',
                      '4.具有卓越的品牌意识、理念及营销运作能力，有事业心，具备知名母婴品牌成功经营背景更佳。',
                      '5.热爱网络营销工作，有积极向上的学习精神，长期合作，共同发展。',
                      '6.愿意接受总部的系统培训和经营指导，执行总部规定的价格体系、服务及区域保护等市场政策。',
                    ].map(text => (
                      <div key={text}>{text}</div>
                    ))
                  }
                </div>
                : null
            }
            <div style={{ height: '30px' }} />
            <div className={styles.joinus2} onClick={this.handleShowFlow}>
              <img src={join7} alt="join7" />
            </div>
            {
              showFlow ?
                <div className={styles['advantage-text']}>
                  {
                    [
                      '1.申请代理需提供您的实体店名称、实体店地址、阿里巴巴旺旺ID、真实姓名、联系方式。',
                      '2.首批进货量不限，可以申请一件代发服务。',
                      '3.代理会员不得过低压制价格1.3-1.5倍左右，不得恶意压低价格造成不正当竞争',
                      '4.年进货量满到一定我司规定的金额，可以申请地区独家代理。',
                      '加盟代理等级（按月累计）',
                      '1.初级代理商：交易金额10000元，或交易次数800笔，享受9.8折。',
                      '2.中级代理商：交易金额50000元，或交易次数900笔，享受9.7折。',
                      '3.高级代理商：交易金额80000元，或交易次数1000笔，享受9.6折。',
                      '4.VIP代理商：交易金额120000元，或交易次数1100笔，享受9.5折。',
                    ].map(text => (
                      <div key={text}>{text}</div>
                    ))
                  }
                </div>
                : null
            }
            <div style={{ height: '30px' }} />
            <div className={styles.joinus2}>
              <div
                className={styles['join-btn']}
                onClick={() => {
                  navigate('/#/join');
                }}
              >
              申请加盟
              </div>
            </div>
          </div>

          <div className={`${styles.callus} ${styles['white-background']}`}>
            <div className={styles.title}>
              <p>联系我们</p>
            </div>
            <div className={styles.map}>
              <Map />
            </div>
          </div>
          <div className={styles['home-footer']}>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
