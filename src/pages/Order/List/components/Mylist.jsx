import React, { PureComponent } from 'react';
import styles from './components.css';

class Mylist extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // platform: false,
    };
  }

  render() {
    // const { contentHeight } = this.state;
    const {
      img, id, payState, describe, style, price, number, total, b1, b1b, b2, b2b,
    } = this.props;

    return (
      <div
        className={styles.box1}
        ref={(head) => { this.contain = head; }}
      >
        {/* 开始 */}
        <section className={styles.section}>
          <div className={styles.mylistBox}>
            {/* 顶部订单号 付款状态 */}
            <div className={styles.header}>
              <span>订单号：</span><span>{id}</span>
              <span>{payState}</span>
              <div className={styles.clear} />
            </div>
            {/* 商品信息 */}
            <div>
              <img src={img} alt="product" />
              <div className={styles.word}>
                <div className={styles.describe}>
                  <p>{describe}</p>
                  <div className={styles.colorStyle}>
                    <span>颜色分类：</span><span>{style}</span>
                  </div>
                </div>
                <div className={styles.clear} />
                <div className={styles.price}>
                  <span>￥</span><span>{price}</span>
                  <div className={styles.number}>
                    <span>x</span><span>1</span>
                  </div>
                  <div className={styles.clear} />
                </div>
              </div>
            </div>
            {/* 合计价格 */}
            <div className={styles.total}>
              <span>共</span><span>{number}</span><span>件商品</span>
              <span>合计 : ￥</span><span>{total}</span>
            </div>
            <div className={styles.clear} />
            {/* 付款、取消订单 */}
            <div className={styles.footer}>
              <button style={{ display: b1b }}>{b1}</button>
              <button style={{ display: b2b }}>{b2}</button>
            </div>
            <div className={styles.clear} />
          </div>
        </section>
        {/* 结束 */}
      </div>
    );
  }
}

export default Mylist;
