import React, { Component } from 'react';
import { PageHeader } from 'components';
import config from 'config';
import request from 'utils/request';
import Toast from 'utils/toast';

import closeIcon from 'assets/images/remove.png';

import InputBar from './components/InputBar';
import styles from './join.css';

class Join extends Component {
  handleSubmit = () => {
    const company = this.Company.state.value;
    const contact = this.Contact.state.value;
    const phone = this.Phone.state.value;
    const email = this.Email.state.value;
    const message = this.Message.state.value;

    console.log('values: ', company, contact, phone, email, message);
    if (!company) {
      alert('请输入公司名称');
    } else if (!contact) {
      alert('请输入联系人姓名');
    } else if (!phone) {
      alert('请输入联系电话');
    } else {
      console.log('提交');
      const url = `${config.apiUri}/joins`;
      const method = 'POST';
      const data = {
        companyName: company,
        contractName: contact,
        telephone: phone,
        memo: message,
        email,
      };
      request({ url, method, data }, 'JSON').then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          Toast.show(res.data.message);
          setTimeout(() => {
            this.Header.handleBack();
          }, 1500);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  render() {
    return (
      <div className={styles['join-content']}>
        <PageHeader
          ref={(e) => {
            this.Header = e;
          }}
          style={{ display: 'none' }}
        />
        <div className={styles['close-bar']}>
          <div
            className={styles['close-icon']}
            onClick={() => {
              this.Header.handleBack();
            }}
          >
            <img src={closeIcon} alt="close-icon" />
          </div>
        </div>
        <div className={styles['join-title']}>申请加盟</div>
        <InputBar placeholder="请输入公司名称(必填)" ref={(company) => { this.Company = company; }} />
        <InputBar placeholder="请输入联系人姓名(必填)" ref={(contact) => { this.Contact = contact; }} />
        <InputBar placeholder="请输入联系电话(必填)" ref={(phone) => { this.Phone = phone; }} type="number" />
        <InputBar placeholder="请输入邮箱" ref={(email) => { this.Email = email; }} type="email" />
        <InputBar placeholder="留言" ref={(message) => { this.Message = message; }} category="textarea" />
        <div className={styles['submit-btn']} onClick={this.handleSubmit}>提交</div>
      </div>
    );
  }
}

export default Join;
