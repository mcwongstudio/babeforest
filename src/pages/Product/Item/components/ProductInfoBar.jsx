import React, { Component } from 'react';
import styles from './components.css';

class ProductInfoBar extends Component {
  render() {
    const { newPrice, oldPrice, productName } = this.props;
    return (
      <div className={styles['info-bar']}>
        <div className={styles['price-bar']}>
          <span className={styles['current-price']}>{newPrice}</span>
          <span className={styles['original-price']}>{oldPrice}</span>
        </div>
        <div className={styles['intro-bar']}>{productName}</div>
      </div>
    );
  }
}

export default ProductInfoBar;
