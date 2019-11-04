import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
// import navigate from 'utils/navigate';
import styles from './components.css';

class RecommendBar extends Component {
  state = {
    list: [],
  }

  componentWillMount() {
    this.getRecommendList();
  }

  getRecommendList = () => {
    const url = `${config.apiUri}/news/show?pageNum=1&pageSize=10`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code) {
        const { list } = res.data.result;
        this.setState({ list });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  goItem = (id) => {
    sessionStorage.setItem('newsId', id);
    console.log(sessionStorage.Id);
    window.location.reload();
  }

  render() {
    const { list } = this.state;
    const newsId = JSON.parse(sessionStorage.newsId || '0');
    return (
      <div className={styles['recommend-bar']}>
        {
          list.map(item => (
            item.id !== newsId ?
              <div className={styles['recommend-item']} key={item.id} onClick={() => { this.goItem(item.id); }}>
                <div className={styles['news-cover']}><img src={item.imageUrl} alt="cover" /></div>
                <div className={styles['news-info']}>
                  <div className={styles['news-title']}>{item.title}</div>
                  <div className={styles['news-time']}>{item.publishTime}</div>
                  <div className={styles['news-content']} dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </div>
              : null
          ))
        }
      </div>
    );
  }
}

export default RecommendBar;
