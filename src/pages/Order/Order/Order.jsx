import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Logistics from './components/Logistics';
import User from './components/User';
import Product from './components/Product';
import Headerinner from './components/Headerinner';
// import List from './components/List';
import styles from './order.css';


class Order extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: ['卖家已发货', '等待卖家发货'],
      logistics: {
        state: '金华市【金华转运中心】，正在发往【福州转运中心】',
        time: '2019.02.14  13:18',
      },
      user: {
        name: '王小明',
        phone: '12345678910',
        adress: '福建省 厦门市 思明区 湖滨南路819宝福大厦3101',
      },
      orderId: '12345678910',
      product: {
        name: '贝比森林BabeForest新生儿奶瓶硅胶pp宽口怪硅胶奶嘴耐衰仿胀气',
        style: '绿色-8007-05',
        price: 339.00,
        number: 1,
      },
    };
  }

  goBackFunc = () => {
    window.history.go(-1);
  }


  render() {
    const {
      orderStatus, logistics, user, orderId, product,
    } = this.state;

    return (
      <div className={styles.main}>
        {/* 顶部 */}
        <div className={styles.header}>
          <Headerinner title="订单详情" />
        </div>

        {/* <section className={styles.section} style={{ height: window.innerHeight }} > */}
        <section className={styles.section}>
          <div>
            {/* 发货状态+ */}
            <div className={styles.state}>
              <p>{orderStatus[0]}</p>
            </div>

            {/* 物流信息 */}
            <div>
              <Logistics state={logistics.state} time={logistics.time} />
            </div>
            <hr />
            {/* 用户 */}
            <div className={styles.user}>
              <User name={user.name} phone={user.phone} adress={user.adress} />
            </div>
            <div style={{ height: '10px', backgroundColor: '#f9f9f9' }} />
            {/* 订单号 */}
            <div className={styles.orderId}>
              <span>订单号&nbsp;:&nbsp;</span><span>{orderId}</span>
            </div>
            <hr className={styles.shorthr} />
            {/* 宝贝信息 */}
            <div className={styles.product}>
              <Product
                name={product.name}
                style={product.style}
                price={product.price}
                number={product.number}
              />
            </div>
            <div style={{ height: '130px', backgroundColor: '#f9f9f9' }} />
          </div>
        </section>
        <footer>
          <button>再次购买</button>
          <button>查看物流</button>
        </footer>
      </div>
    );
  }
}

export default connect()(Order);
