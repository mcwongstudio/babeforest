import React, { Component } from 'react';
import styles from './breadcrumb.css';

class Breadcrumb extends Component {
  render() {
    const { list } = this.props;
    return (
      <div className={styles['bread-crumb-bar']}>
        {
          list.map((item, index) => (
            index === (list.length - 1) ?
              <span className={styles['bread-crumb-item']} key={index}>{item}</span>
              :
              <span
                className={`${styles['bread-crumb-item']} ${styles['bread-crumb-arrow']}`}
                key={index}
                onClick={() => {
                  window.location.href = '/#/products';
                }}
              >
                {item}
              </span>
          ))
        }
      </div>
    );
  }
}

export default Breadcrumb;
