import React, { PureComponent } from 'react';
import styles from './link.css';

class Link extends PureComponent {
  render() {
    const {
      className, price, title, productImg,
    } = this.props;

    return (
      <div className={`${styles.headerBox} ${className}`}>
        <img src={productImg} alt="productImg" className={styles.top} />
        <div>{title}</div>
        <p>{price}</p>
      </div>
    );
  }
}

export default Link;
