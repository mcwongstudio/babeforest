import React, { Component } from 'react';

import CheckBoxIcon from 'assets/images/checkbox.png';
import CheckBoxActivedIcon from 'assets/images/checkbox-actived.png';

import styles from './components.css';

const gender = {
  1: '男',
  2: '女',
};

class SelectBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || 1,
      visible: false,
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    console.log(value);
  }

  showSelectPanel = () => {
    this.setState({
      visible: true,
    });
  }

  handleSelect = (value) => {
    this.setState({ value, visible: false });
  }

  render() {
    const { label } = this.props;
    const { value, visible } = this.state;
    return (
      <div className={styles['select-bar']}>
        <div className={styles['select-label']}>
          <span>{ label }</span>
        </div>
        <div className={styles['select-content']} onClick={this.showSelectPanel}>
          { gender[value] ? gender[value] : '' }
        </div>
        <div className={visible ? `${styles['select-panel-bar']} ${styles['show-panel']}` : styles['select-panel-bar']}>
          <div className={styles['select-panel-shadow']} />
          <div className={styles['select-panel']}>
            <div className={styles['select-panel-header']}>选择性别</div>
            <div className={styles['select-panel-content']}>
              <div className={styles['select-option']} onClick={() => this.handleSelect(1)}>
                <div className={styles['check-box-icon']}>
                  <img src={value === 1 ? CheckBoxActivedIcon : CheckBoxIcon} alt="check-box" />
                </div>
                男
              </div>
              <div className={styles['select-option']} onClick={() => this.handleSelect(2)}>
                <div className={styles['check-box-icon']}>
                  <img src={value === 2 ? CheckBoxActivedIcon : CheckBoxIcon} alt="check-box-actived" />
                </div>
                女
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectBar;
