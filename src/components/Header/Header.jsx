import React, { PureComponent } from 'react';
import { getPlatform } from 'utils/tool';
import navigate from 'utils/navigate';

import logo from 'assets/images/logo.png';
import accountLogo from 'assets/images/account.png';
import shoppingCartLogo from 'assets/images/shopping-cart.png';
import couponIcon from 'assets/images/coupon.png';
import listLogo from 'assets/images/list.png';

import styles from './header.css';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      platform: false,
      panelClass: styles['list-panel'],
      showShadow: false,
    };
  }

  componentWillMount() {
    // ios11
    const platform = getPlatform();
    sessionStorage.setItem('isIOS', platform);
    sessionStorage.setItem('isPage', 0);
    this.setState({ platform });
    sessionStorage.removeItem('routes');
  }

  handleShowPanel = () => {
    this.setState({
      panelClass: `${styles['list-panel']} ${styles.actived}`,
      showShadow: true,
    });
  }

  handleHidePanel = () => {
    this.setState({
      panelClass: styles['list-panel'],
      showShadow: false,
    });
  }

  handleNavigate = (path) => {
    this.setState({
      panelClass: styles['list-panel'],
      showShadow: false,
    });
    navigate(path);
  }

  render() {
    const { platform, panelClass, showShadow } = this.state;

    return (
      <div className={styles['header-box']} ref={(head) => { this.contain = head; }}>
        {/* 覆盖ios11顶部留白 */}
        {
          platform ? <div className={styles.ios11} /> : ''
        }

        <header className={styles.header}>
          <div className={styles['icon-left']}><img src={logo} alt="logo" /></div>
          <div className={styles['control-bar']}>
            <div
              className={styles['account-logo']}
              onClick={() => {
                if (sessionStorage.token) {
                  navigate('/#/userCenter');
                } else {
                  navigate('/#/login');
                }
              }}
            >
              <img src={accountLogo} alt="account" />
            </div>
            <div
              className={styles['shopping-cart-logo']}
              onClick={() => navigate('/#/shoppingCart')}
            >
              <img src={shoppingCartLogo} alt="shoppingCart" />
            </div>
            <div
              className={styles['shopping-cart-logo']}
              onClick={() => navigate('/#/couponCenter')}
            >
              <img src={couponIcon} alt="coupon" />
            </div>
            <div className={styles.stall} />
            <div className={styles['list-logo']} onClick={this.handleShowPanel}>
              <img src={listLogo} alt="list" />
            </div>
          </div>
        </header>

        <div className={panelClass}>
          <div className={styles['route-item']} onClick={() => this.handleNavigate('/#/')}>首页</div>
          <div className={styles['route-item']} onClick={() => this.handleNavigate('/#/products')}>产品</div>
          <div className={styles['route-item']} onClick={() => this.handleNavigate('/#/news')}>资讯</div>
        </div>

        {
          showShadow ?
            <div className={styles['panel-shadow']} onClick={this.handleHidePanel}>
              <div className={styles['shadow-content']} />
            </div>
            : null
        }
      </div>
    );
  }
}

export default Header;
