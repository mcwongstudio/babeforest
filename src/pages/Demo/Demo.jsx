import React, { Component } from 'react';
import { RidingWindScrollList, RSTATES } from 'ridingwind-scrolllist';
import styles from './demo.css';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      currentState: RSTATES.init,
      datas: new Array(15).fill('-'), // 测试代码
      index: 5, // 测试代码
    };
  }

  executeFunc = (currentState) => {
    if (currentState !== this.state.currentState) {
      if (currentState === RSTATES.refreshing) {
        // 刷新
        this.handRefreshing();
      } else if (currentState === RSTATES.loading) {
        // 加载更多
        this.handLoadMore();
      } else {
        this.setState({
          currentState,
        });
      }
    }
  }

  handRefreshing = () => {
    if (RSTATES.refreshing !== this.state.currentState) {
      setTimeout(() => {
        this.setState({
          hasMore: true,
          currentState: RSTATES.refreshed,
        });
      }, 3000);

      this.setState({
        currentState: RSTATES.refreshing,
      });
    }
  }

  handLoadMore = () => {
    if (RSTATES.loading !== this.state.currentState) {
      // 无更多内容则不执行后面逻辑
      if (this.state.hasMore) {
        setTimeout(() => {
          if (this.state.index === 0) {
            // 测试代码
            this.setState({
              currentState: RSTATES.reset, // 必须
              hasMore: false,
            });
          } else {
            this.setState({
              datas: this.state.datas.concat(new Array(15).fill('-')), // 测试代码
              currentState: RSTATES.reset, // 必须
              index: this.state.index - 1, // 测试代码
            });
          }
        }, 3000);

        this.setState({
          currentState: RSTATES.loading,
        });
      }
    }
  }

  render() {
    const { currentState, hasMore, datas } = this.state;

    return (
      <div>
        <RidingWindScrollList
          id="list"
          pullDownSpace={80}
          actionSpaceBottom={300}
          currentState={currentState}
          hasMore={hasMore}
          executeFunc={this.executeFunc}
        >
          {
            datas.map((item, index) => (
              <div
                key={index}
                className={styles.item}
              >
                <div className={styles.itemText}>
                  <div className={styles.itemTextTit}>
                    {index}: {item}国家税务总局：要将税收工作重大决策部署落实到位
                    国家税务总局：要将税收工作重大决策部署落实到位
                  </div>
                  <div className={styles.itemTextInfo}>新浪财经</div>
                </div>
              </div>
            ))
          }
        </RidingWindScrollList>
      </div>
    );
  }
}

export default Demo;
