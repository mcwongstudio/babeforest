import React, { PureComponent } from 'react';
import styles from './item.css';

class Item extends PureComponent {
  render() {
    const {
      className, productTop, title1, title2,
    } = this.props;

    return (
      <div className={`${styles.headerBox} ${className}`}>
        <div className={styles.top} style={{ backgroundImage: `url(${productTop})` }} />
        <div className={styles.topFont}>
          <p>{title1}</p>
          <p>{title2}</p>
        </div>
      </div>
    );
  }
}

export default Item;
