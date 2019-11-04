import React, { Component } from 'react';
import styles from './components.css';

class DetailBar extends Component {
  render() {
    const { list, detailImage } = this.props;
    return (
      <div className={styles['detail-bar']}>
        <div className={styles['detail-title']}>宝贝详情</div>
        <div className={styles['detail-content']}>
          {
            list.map((item, index) => (
              <div className={styles['detail-item']} key={index}>
                <span className={styles['detail-label']}>{item.label}：</span>
                <span className={styles['detail-value']}>{item.value}</span>
              </div>
            ))
          }
        </div>
        <div className={styles['detail-image-bar']} dangerouslySetInnerHTML={{ __html: detailImage }} />
      </div>
    );
  }
}

export default DetailBar;
