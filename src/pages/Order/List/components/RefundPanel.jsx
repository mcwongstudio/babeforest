import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import Toast from 'utils/toast';

import checkBoxIcon from 'assets/images/checkbox.png';
import checkBoxActivedIcon from 'assets/images/checkbox-actived.png';
import closeIcon from 'assets/images/remove.png';

import styles from './components.css';

class RefundPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refundType: 'ALL',
      refundNo: props.refundNo,
      visible: props.visible,
      refundImageList: [],
      content: '',
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible !== nextState.visible) {
      this.updateState(nextProps);
    }
  }

  updateState = (nextProps) => {
    this.setState({
      visible: nextProps.visible,
      refundNo: nextProps.refundNo,
    });
  }

  handleSelectRefundType = (type) => {
    this.setState({
      refundType: type,
    });
  }

  handleSelectImage = () => {
    const fileDom = document.querySelector('#refundImage');
    fileDom.click();
  }

  handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
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
    }
  }

  handleClosePanel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.setState({
      refundType: 'ALL',
      refundNo: '',
      refundImageList: [],
      content: '',
    });
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
        console.log(res);
        if (res.data.code === 200) {
          const { onOk } = this.props;
          if (onOk) {
            onOk();
          }
          this.setState({
            refundType: 'ALL',
            refundNo: '',
            refundImageList: [],
            content: '',
          });
        }
      }).catch((err) => {
        console.error(err);
      });
    }
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

  render() {
    const {
      refundNo,
      refundType,
      visible,
      refundImageList,
      content,
    } = this.state;

    return (
      <div
        className={
          visible ?
            `${styles['refund-panel']} ${styles['show-panel']}`
            :
            styles['refund-panel']
        }
      >
        <div
          className={
            visible ?
              `${styles['refund-panel-content']} ${styles['show-refund-panel-content']}`
              :
              styles['refund-panel-content']
          }
        >
          <div className={styles['refund-panel-header']}>
            <div>退货订单：{refundNo}</div>
            <div className={styles['close-panel-btn']} onClick={this.handleClosePanel}><img src={closeIcon} alt="close" /></div>
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
              <div className={styles['refund-item-label']}><span className={styles['required-label']}>*</span>退款说明</div>
              <textarea
                className={styles['refund-input-bar']}
                placeholder="退款说明"
                rows="4"
                value={content}
                onChange={this.handleChangeContent}
              />
            </div>
            <div className={styles['refund-item']}>
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
                <div className={styles['refund-item-image']} onClick={this.handleSelectImage}>
                  <div>&#43;</div>
                  <div>选择图片</div>
                  <input type="file" id="refundImage" style={{ display: 'none' }} onChange={this.handleChangeImage} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles['refund-panel-footer']}>
            <div className={styles['cancel-submit-btn']} onClick={this.handleClosePanel}>取消</div>
            <div className={styles['submit-btn']} onClick={this.handleSubmit}>提交</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RefundPanel;
