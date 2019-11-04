import React, { PureComponent } from 'react';
import arrowIcon from 'assets/images/Group20.png';
import styles from './components.css';

class Products extends PureComponent {
  handleNavigate = () => {
    window.location.href = '/#/products';
  }

  render() {
    const {
      cover,
      title,
      description,
    } = this.props;

    return (
      <div className={styles.product} onClick={this.handleNavigate}>
        <div className={styles['product-cover']}>
          <img src={cover} alt="product" />
          <img src={arrowIcon} alt="arrow" />
        </div>
        <div className={styles['product-title']}>{title}</div>
        <div className={styles['product-description']}>{description}</div>
      </div>
    );
  }
}

export default Products;
