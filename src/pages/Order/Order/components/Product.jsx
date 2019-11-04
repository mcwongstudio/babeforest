import React, { PureComponent } from 'react';
import styles from './components.css';

const Bitmap = require('assets/images/Bitmap-3.png');

class Product extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // platform: false,
    };
  }

  render() {
    // const { contentHeight } = this.state;
    const {
      name, style, price, number,
    } = this.props;

    return (
      <div
        className={styles.box1}
        ref={(head) => { this.contain = head; }}
      >
        {/* 开始 */}
        <section className={styles.section}>
          <div className={styles.productBox}>
            <img src={Bitmap} alt="Bitmap" />
            <div className={styles.word}>
              <p>{name}</p>
              <div className={styles.line2}>
                <span>颜色分类&nbsp;:&nbsp;&nbsp;</span><span>{style}</span>
              </div>
              <div className={styles.line3}>
                <span>￥&nbsp;</span><span>{price}</span><span>&times;</span><span>{number}</span>
              </div>
            </div>
            <div className={styles.clear} />
          </div>
        </section>
        {/* <div className={styles.clear} /> */}
        {/* 结束 */}
      </div>
    );
  }
}

export default Product;
