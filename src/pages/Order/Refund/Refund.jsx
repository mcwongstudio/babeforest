import React, { Component } from 'react';
import config from 'config';
import { PageHeader } from 'components';
import request from 'utils/request';
import Toast from 'utils/toast';

import checkBoxIcon from 'assets/images/checkbox.png';
import checkBoxActivedIcon from 'assets/images/checkbox-actived.png';
import closeIcon from 'assets/images/remove.png';
import addIcon from 'assets/images/increase.png';

import styles from './refund.css';

class Refund extends Component {
  constructor(props) {
    super(props);
    const { orderId } = sessionStorage;
    this.state = {
      refundType: 'ALL',
      refundNo: orderId,
      refundImageList: [],
      content: '',
      contentHeight: 0,
    };
  }

  componentDidMount() {
    this.setContentHeight();
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    const isIOS = JSON.parse(sessionStorage.isIOS);
    let height = 0;
    if (!isPage && isIOS) {
      height = 'calc(100% - (132 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (100 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  handleSelectRefundType = (type) => {
    this.setState({
      refundType: type,
    });
  }

  handleSelectImage = () => {
    // const fileDom = document.querySelector('#refundImage');
    console.log(this.RefundImage);
    this.RefundImage.click();
  }

  handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png') {
        const url = `${config.apiUri}/file-service/files/`;
        const method = 'POST';
        const form = new FormData();
        form.append('file', file);
        const data = form;
        request({ url, method, data }, 'UPLOAD').then((res) => {
          if (res.data.code === 200) {
            const { refundImageList } = this.state;
            refundImageList.push(res.data.result);
            this.setState({ refundImageList });
          }
        }).catch((err) => {
          console.error(err);
        });
      } else {
        Toast.show('请选择图片进行上传');
      }
    }
  }

  handleSubmit = () => {
    const {
      refundType,
      refundNo,
      refundImageList,
      content,
    } = this.state;
    if (!content) {
      Toast.show('请输入退款说明');
    } else {
      const url = `${config.apiUri}/refundapply`;
      const method = 'POST';
      const data = {
        content,
        orderId: refundNo,
        images: refundImageList.toString(),
        type: refundType,
      };
      request({ url, method, data }, 'JSON').then((res) => {
        if (res.data.code === 200) {
          // const refundGoods = JSON.parse(sessionStorage.refundGoods || '0');
          // if (refundGoods) {
          //   window.location.href = '/#/salesReturn';
          // } else {
          //   this.Header.handleBack();
          // }
          this.Header.handleBack();
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  handleCancel = () => {
    window.location.href = '/#/orders';
  }

  handleRemoveImage = (index) => {
    const { refundImageList } = this.state;
    refundImageList.splice(index, 1);
    this.setState({ refundImageList });
  }

  handleChangeContent = (e) => {
    const { value } = e.target;
    this.setState({
      content: value,
    });
  }

  handleClickText = () => {
    this.TextArea.focus();
  }

  render() {
    const {
      refundNo,
      refundType,
      refundImageList,
      content,
      contentHeight,
    } = this.state;

    return (
      <div className={styles['refund-panel']}>
        <PageHeader
          title="退款退货"
          ref={(header) => {
            this.Header = header;
          }}
        />
        <div className={styles['refund-panel-content']} style={{ height: contentHeight }}>
          <div className={styles['refund-panel-header']}>
            <div>退货单号：{refundNo}</div>
          </div>
          <div className={styles['refund-panel-section']}>
            <div className={styles['refund-item']}>
              <div className={styles['refund-item-label']}>服务类型</div>
              <div className={styles['refund-select-bar']}>
                {
                  refundType === 'ALL' ?
                    <div className={styles['refund-select-item-actived']}>
                      <div className={styles['refund-select-icon']}>
                        <img src={checkBoxActivedIcon} alt="check-box" />
                      </div>
                      <div>全部退款</div>
                    </div>
                    :
                    <div className={styles['refund-select-item']} onClick={() => this.handleSelectRefundType('ALL')}>
                      <div className={styles['refund-select-icon']}>
                        <img src={checkBoxIcon} alt="check-box-actived" />
                      </div>
                      <div>全部退款</div>
                    </div>
                }
                {
                  refundType === 'PART' ?
                    <div className={styles['refund-select-item-actived']}>
                      <div className={styles['refund-select-icon']}>
                        <img src={checkBoxActivedIcon} alt="check-box" />
                      </div>
                      <div>部分退款</div>
                    </div>
                    :
                    <div className={styles['refund-select-item']} onClick={() => this.handleSelectRefundType('PART')}>
                      <div className={styles['refund-select-icon']}>
                        <img src={checkBoxIcon} alt="check-box-actived" />
                      </div>
                      <div>部分退款</div>
                    </div>
                }
              </div>
            </div>
            <div className={styles['refund-item']}>
              <div className={styles['refund-item-label']}>退款说明<span className={styles['required-label']}>*</span></div>
              <div className={styles['refund-input-bar']} onClick={this.handleClickText}>
                <textarea
                  ref={(e) => {
                    this.TextArea = e;
                  }}
                  placeholder="退款说明"
                  rows="4"
                  value={content}
                  onChange={this.handleChangeContent}
                />
              </div>
            </div>
          </div>
          <div className={styles['token-bar']}>
            <div className={styles['refund-item-label']}>上传凭证</div>
            <div className={styles['refund-image-list']}>
              {
                refundImageList.map((url, index) => (
                  <div className={styles['refund-item-image']} key={url}>
                    <div className={styles['remove-refund-image-btn']} onClick={() => this.handleRemoveImage(index)}>
                      <img src={closeIcon} alt="remove" />
                    </div>
                    <div className={styles['refund-image-content']}><img src={url} alt="url" /></div>
                  </div>
                ))
              }
              <div className={styles['refund-item-image']}>
                <div className={styles['refund-image-icon']}>
                  <img src={addIcon} alt="add" />
                </div>
                <div>上传凭证</div>
                <input type="file" onChange={this.handleChangeImage} />
              </div>
            </div>
          </div>
          <div className={styles['refund-panel-footer']}>
            <div className={styles['cancel-submit-btn']} onClick={this.handleCancel}>取消</div>
            <div className={styles['submit-btn']} onClick={this.handleSubmit}>确认提交</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Refund;
