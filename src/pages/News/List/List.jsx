import React, { Component } from 'react';
import { Header, Footer } from 'components';
import request from 'utils/request';
import navigate from 'utils/navigate';
import config from 'config';
import styles from './list.css';

class List extends Component {
  state = {
    contentHeight: 0,
    list: [],
    pageNum: 1,
    pageSize: 100,
  }

  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    this.getNewsList({ pageNum, pageSize });
  }

  componentDidMount() {
    this.setContentHeight();
  }

  getNewsList = ({ pageSize, pageNum }) => {
    const url = `${config.apiUri}/news/show?pageNum=${pageNum}&pageSize=${pageSize}&orderBy=sort+DESC`;
    const { token } = sessionStorage;
    const data = { token };
    request({ url, method: 'GET', data }).then((res) => {
      if (res.data.code === 200) {
        const { list } = res.data.result;
        this.setState({ list });
      }
    }).catch((err) => {
      console.error(err);
    });
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

  goItem = (id) => {
    sessionStorage.setItem('newsId', id);
    navigate('/#/new');
  }

  render() {
    const { list, contentHeight } = this.state;
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles['news-list']} style={{ height: contentHeight }}>
          {
            list.map(item => (
              <div className={styles['news-item']} key={item.id} onClick={() => this.goItem(item.id)}>
                <div className={styles['news-info']}>
                  <div className={styles['news-title']}>{item.title}</div>
                  <div className={styles['news-time']}>{item.publishTime}</div>
                </div>
                <div className={styles['news-cover']}><img src={item.imageUrl} alt="cover" /></div>
              </div>
            ))
          }
          <Footer />
        </div>
      </div>
    );
  }
}

export default List;
