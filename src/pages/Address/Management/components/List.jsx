import React, { PureComponent } from 'react';
import styles from './components.css';

const edit = require('assets/images/edit.png');

class List extends PureComponent {
  render() {
    const {
      name, phone, address, doEdit,
    } = this.props;

    return (
      <div className={styles['link-box']}>
        <div className={styles['info-bar']}>
          <div className={styles['user-info']}>
            <div className={styles['user-name']}>{name}</div>
            <div className={styles['user-mobile']}>{phone}</div>
          </div>
          <div className={styles['address-info']}>{address}</div>
        </div>
        <span className={styles['edit-icon']} onClick={doEdit}>
          <img src={edit} alt="edit" />
        </span>
      </div>
    );
  }
}

export default List;
