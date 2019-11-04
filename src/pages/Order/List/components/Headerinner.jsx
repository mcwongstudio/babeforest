import React, { PureComponent } from 'react';
// import { Link } from 'react-router-dom';
import { getPlatform } from '../../../../utils/tool';
import styles from './headerinner.css';
// import { calculate } from 'specificity';

const icon = require('assets/images/remove2.png');

class Headerinner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      platform: false,
    };
  }

  componentWillMount() {
    // ios11
    const platform = getPlatform();
    this.setState({ platform });
  }

  clickBack = () => {
    const { clickFunc } = this.props;
    clickFunc();
  }

  setHeaderHeight = () => {
    const height = document.querySelector(`.${styles['header-box']}`).offsetHeight;
    sessionStorage.setItem('height', height);
  }

  componentDidMount() {
    this.setHeaderHeight();
  }

  render() {
    const { platform } = this.state;
    const { className, title } = this.props;

    return (
      <div
        className={`${styles['header-box']} ${className}`}
        ref={(head) => { this.contain = head; }}
      >
        {/* 覆盖ios11顶部留白 开始 */}
        <div>
          {
            platform ? <div className={styles.ios11} /> : ''
          }
        </div>
        {/* 覆盖ios11顶部留白 结束 */}

        {/* 头部 开始 */}
        <header className={styles.header}>
          <div className={styles.icon}>
            <img src={icon} alt="icon" />
            <div className={styles.title}>{title}</div>
          </div>
          <div className={styles.clear} />
        </header>
        <div style={{ height: 'calc(98 / 32 * 1rem)' }} />
        {/* 头部 结束 */}
      </div>
    );
  }
}

export default Headerinner;
