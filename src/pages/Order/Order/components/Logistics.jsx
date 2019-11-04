import React, { PureComponent } from 'react';
import styles from './components.css';

const Group3 = require('assets/images/Group3.png');
const open = require('assets/images/open.png');

class Logistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // platform: false,
    };
  }

  render() {
    // const { contentHeight } = this.state;
    const { state, time } = this.props;

    return (
      <div
        className={styles.box1}
        ref={(head) => { this.contain = head; }}
      >
        {/* 开始 */}
        <section className={styles.section}>
          <div className={styles.logisticsBox}>
            <img src={Group3} alt="Group3" />
            <p>{state}</p>
            <p>{time}</p>
            <div className={styles.clear} />
            <img src={open} alt="open" />
          </div>
        </section>
        {/* <div className={styles.clear} /> */}
        {/* 结束 */}
      </div>
    );
  }
}

export default Logistics;
