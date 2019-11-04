import React, { PureComponent } from 'react';
import styles from './footer.css';

import addressIcon from '../../assets/images/address.png';
import phoneIcon from '../../assets/images/phone.png';
import mailIcon from '../../assets/images/mail.png';
import wechatIcon from '../../assets/images/wechat.png';
import qqIcon from '../../assets/images/qq.png';

class Footer extends PureComponent {
  render() {
    return (
      <footer className={styles['footer-content']}>
        <div className={styles['address-bar']}>
          <span className={styles['address-icon']}><img src={addressIcon} alt="address" /></span>
          <span>地址：福建省厦门市思明区湖滨南路819号宝福大厦3101</span>
        </div>
        <div className={styles['phone-bar']}>
          <span className={styles['phone-icon']}><img src={phoneIcon} alt="phone" /></span>
          <span>电话：0592-5865702  15359231627</span>
        </div>
        <div className={styles['mail-bar']}>
          <span className={styles['mail-icon']}><img src={mailIcon} alt="mail" /></span>
          <span>邮箱：12345@bebeforest.com</span>
        </div>
        <div className={styles['info-bar']}>
          <div>闽公网安备35020302033188号  |  闽ICP备18016265号</div>
          <div>Copyright © 2018  贝比森林BebeForest.com 版权所有</div>
        </div>
        <div className={styles['logo-bar']}>
          <span className={styles['wechat-icon']}><img src={wechatIcon} alt="wechat" /></span>
          <span className={styles['qq-icon']}><img src={qqIcon} alt="qq" /></span>
        </div>
      </footer>
    );
  }
}

export default Footer;
