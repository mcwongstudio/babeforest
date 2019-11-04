import React, { PureComponent } from 'react';
import toDecimal2 from 'utils/toDecimal2';
import styles from './components.css';

const product = require('assets/images/Bitmap-3.png');

class Order extends PureComponent {
  getSpecification = (specificationObj) => {
    console.log(specificationObj);
    return '';
  }

  render() {
    const {
      title,
      specification,
      price,
      number,
      id,
    } = this.props;

    return (
      <div className={styles.box1} key={id}>
        {/* 开始 */}
        <section className={styles.section}>
          <div className={styles.mylistBox}>

            {/* 商品信息 */}
            <div>
              <img src={product} alt="product" />
              <div className={styles.word}>
                <div className={styles.describe}>
                  <p>{title}</p>
                  <div className={styles.colorStyle}>
                    {
                      () => this.getSpecification(specification)
                    }
                  </div>
                  <div className={styles.price}>
                    <span>￥</span><span>{toDecimal2(price)}</span>
                    <span>x</span><span>{number}</span>
                  </div>
                </div>
                <div className={styles.clear} />
              </div>
            </div>
            <div className={styles.clear} />
          </div>
        </section>
        {/* 结束 */}
      </div>
    );
  }
}

export default Order;
