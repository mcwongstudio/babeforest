import React, { Component } from 'react';

import packageIcon from 'assets/images/package.png';
import serviceIcon from 'assets/images/service.png';
import safeIcon from 'assets/images/safe.png';
import casingIcon from 'assets/images/casing.png';

import styles from './supplementBar.css';


class SupplementBar extends Component {
  render() {
    return (
      <div className={styles['supplement-bar']}>
        <div className={styles['show-item']}>
          <div className={`${styles['show-cover']} ${styles['icon-1']}`}><img src={packageIcon} alt="package" /></div>
          <div className={styles['show-title']}>免费邮寄</div>
        </div>
        <div className={styles['show-item']}>
          <div className={`${styles['show-cover']} ${styles['icon-2']}`}><img src={serviceIcon} alt="service" /></div>
          <div className={styles['show-title']}>会员服务</div>
        </div>
        <div className={styles['show-item']}>
          <div className={`${styles['show-cover']} ${styles['icon-3']}`}><img src={safeIcon} alt="safe" /></div>
          <div className={styles['show-title']}>安全付款</div>
        </div>
        <div className={styles['show-item']}>
          <div className={`${styles['show-cover']} ${styles['icon-4']}`}><img src={casingIcon} alt="casing" /></div>
          <div className={styles['show-title']}>精美包装</div>
        </div>
      </div>
    );
  }
}

export default SupplementBar;
