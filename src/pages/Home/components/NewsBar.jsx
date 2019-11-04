import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
import navigate from 'utils/navigate';

import goLeft from 'assets/images/go-left.png';
import goRight from 'assets/images/go-right.png';
import styles from './components.css';

class NewsBar extends Component {
  state = {
    list: [],
    transformX: 0,
    current: 0,
    title: '贝比森林实力斩获妈妈帮2018年度母婴盛典—卓越口碑奖',
    time: '2019.02.03',
    content: `2019年1月5日，妈妈帮“2018年度母婴盛典”圆满落幕。贝比森林实力斩获“卓越口碑奖。”
              此次活动评选了5大类2018年度最值得推荐的母婴品牌“口碑榜单”，分别是最具影响力奖、卓越口碑奖、创新突…`,
  }

  componentWillMount() {
    this.getNewsList();
  }

  getNewsList = () => {
    const url = `${config.apiUri}/news/show?pageNum=1&pageSize=3`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const { list } = res.data.result;
        let { title, time, content } = this.state;
        const { current } = this.state;
        if (list.length) {
          title = list[current].title || '';
          time = list[current].publishTime;
          content = list[current].introduction;
        }
        this.setState({
          list,
          title,
          time,
          content,
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleNavigate = (newsId) => {
    sessionStorage.setItem('newsId', newsId);
    navigate('/#/new');
  }

  handleMoveLeft = () => {
    const { list } = this.state;
    let { current } = this.state;
    const max = list.length - 1;
    current -= 1;
    if (current < 0) {
      current = max;
    }
    const transformX = (current * window.innerWidth) * -1;
    this.setState({ current, transformX });
    this.updateNews();
  }

  handleMoveRight = () => {
    const { list } = this.state;
    let { current } = this.state;
    const max = list.length - 1;
    current += 1;
    if (current > max) {
      current = 0;
    }
    const transformX = (current * window.innerWidth) * -1;
    this.setState({ current, transformX });
    this.updateNews();
  }

  updateNews = () => {
    const { transformX, list } = this.state;
    const max = list.length - 1;
    let articleKey = (transformX / -375) + 1;
    if (articleKey > max) {
      articleKey = 0;
    }
    const article = list[articleKey];
    this.setState({
      title: article.title,
      time: article.publishTime,
      content: article.content,
    });
  }

  render() {
    const {
      list,
      transformX,
      title,
      time,
      content,
    } = this.state;

    return (
      <div className={styles['news-bar']}>
        <div
          className={styles['news-show-list']}
        >
          <div
            className={styles['news-show-item']}
            style={{ width: `calc(100% * ${list.length})`, transform: `translate3d(${transformX}px, 0px, 0px)`, transition: 'transform .2s' }}
          >
            {
              list.map(item => (
                <div
                  key={item.id}
                  className={styles['news-cover']}
                  style={{ width: `calc(100% / ${list.length})` }}
                  onClick={() => this.handleNavigate(item.id)}
                >
                  <img src={item.imageUrl} alt="cover" />
                </div>
              ))
            }
          </div>
          <div className={styles['news-description']}>
            <div className={styles['news-title']}>{title}</div>
            <div className={styles['news-time']}>{time}</div>
            <div className={styles['news-content']} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        {
          list.length > 1 ?
            <div>
              <div className={styles['left-arrow']} onClick={this.handleMoveLeft}>
                <img src={goLeft} alt="left-arrow" />
              </div>
              <div className={styles['right-arrow']} onClick={this.handleMoveRight}>
                <img src={goRight} alt="right-arrow" />
              </div>
            </div>
            : null
        }
      </div>
    );
  }
}

export default NewsBar;
