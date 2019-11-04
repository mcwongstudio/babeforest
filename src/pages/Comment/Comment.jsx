import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import { PageHeader } from 'components';
import styles from './comment.css';

class Comment extends Component {
  state = {
    list: [],
    pageNum: 1,
    pageSize: 100,
    contentHeight: 0,
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getCommentList({ pageNum, pageSize });
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

  getCommentList = ({ pageNum, pageSize }) => {
    const { productId } = sessionStorage;
    const url = `${config.apiUri}/comment/${productId}?pageNum=${pageNum}&pageSize=${pageSize}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { list } = res.data.result;
        this.setState({ list });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const {
      list,
      contentHeight,
    } = this.state;
    console.log(list);

    return (
      <div className={styles['comment-page']}>
        <PageHeader title="宝贝评价" />
        <div
          className={styles['comment-content']}
          style={{ height: contentHeight }}
          onScroll={console.log('滚动')}
        >
          {
            list.length ?
              <div className={styles['comment-list']}>
                {
                  list.map(item => (
                    <div key={item.id} className={styles['comment-item']}>
                      <div className={styles['comment-nickname']}>{item.user.nick}</div>
                      <div className={styles['comment-time']}>{item.createAt}</div>
                      <div className={styles['comment-message']}>{item.content}</div>
                    </div>
                  ))
                }
              </div>
              :
              <div className={styles['empty-list']}>暂无评价</div>
          }
        </div>
      </div>
    );
  }
}

export default Comment;
