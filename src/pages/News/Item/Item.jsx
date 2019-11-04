import React, { PureComponent } from 'react';
import config from 'config';
import { connect } from 'react-redux';
import { Header, Footer } from 'components';
import request from 'utils/request';
import styles from './item.css';
import RecommendBar from './components/RecommendBar';

class News extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      contentHeight: 0,
      title: '',
      time: '',
      content: '',
    };
  }

  componentWillMount() {
    const { newsId } = sessionStorage;
    this.getNewInfo(newsId);
  }

  componentDidMount() {
    this.setContentHeight();
  }

  getNewInfo = (newsId) => {
    const url = `${config.apiUri}/news/${newsId}`;
    const method = 'GET';
    const { token } = sessionStorage;
    const data = { token };
    request({ url, method, data }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        const info = res.data.result;
        const { title, publishTime, content } = info;
        this.setState({ title, time: publishTime, content });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  showNews = (x = 0) => {
    this.setState({ index: x });
    window.location.reload();
  }

  setContentHeight = () => {
    const isPage = JSON.parse(sessionStorage.isPage);
    let height = 0;
    if (!isPage) {
      height = 'calc(100% - (130 / 32 * 1rem))';
    } else {
      height = 'calc(100% - (98 / 32 * 1rem))';
    }
    this.setState({ contentHeight: height });
  }

  render() {
    const {
      index,
      contentHeight,
      title,
      time,
      content,
    } = this.state;
    console.log(index);
    return (
      <div className={styles.main}>
        <Header title="贝比森林" />
        <section className={styles.section} style={{ height: contentHeight }}>
          <div className={styles['show-box']}>
            <div className={styles['new-title']}>{title}</div>
            <div className={styles['new-time']}>{time}</div>
            <div className={styles['new-content']} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <RecommendBar />
          <div style={{ paddingBottom: 'calc(70 / 32 * 1rem)', background: '#fff' }}>
            <Footer />
          </div>
        </section>
      </div>
    );
  }
}

export default connect()(News);
