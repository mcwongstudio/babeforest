import React, { PureComponent } from 'react';
import styles from './components.css';

const Group34 = require('assets/images/Group34.png');

class User extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // platform: false,
    };
  }

  render() {
    // const { contentHeight } = this.state;
    const { name, phone, adress } = this.props;

    return (
      <div
        className={styles.box1}
        ref={(head) => { this.contain = head; }}
      >
        {/* 开始 */}
        <section className={styles.section}>
          <div className={styles.userBox}>
            <img src={Group34} alt="Group34" />
            <div className={styles.word}>
              <span>{name}</span>
              <span>{phone}</span>
              <p>{adress}</p>
            </div>
          </div>
        </section>
        {/* <div className={styles.clear} /> */}
        {/* 结束 */}
      </div>
    );
  }
}

export default User;
