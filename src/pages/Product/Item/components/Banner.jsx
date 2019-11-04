import React, { Component } from 'react';

import Swiper from 'swiper/dist/js/swiper';
import 'swiper/dist/css/swiper.min.css';

import styles from './components.css';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      max: props.list.length || 0,
      transformX: 0,
    };
  }

  componentDidMount() {
    const that = this;
    const swiper = new Swiper('.swiper-container', {
      observer: true,
      on: {
        slideChange() {
          // console.log(this.activeIndex);
          that.setState({
            current: this.activeIndex,
          });
        },
      },
    });
    console.log(swiper);
  }

  handleMoveSwipeLeft = () => {
    const { max } = this.state;
    let { current } = this.state;
    current += 1;
    if (current > (max - 1)) {
      current = (max - 1);
    }
    const transformX = ((window.innerWidth * current) * -1);
    this.setState({ transformX, current });
  }

  componentWillUpdate(nextProps, nextState) {
    this.checkBannerMax({ nextProps, nextState });
  }

  checkBannerMax = ({ nextProps, nextState }) => {
    if (nextProps.list.length !== nextState.max) {
      this.setState({ max: nextProps.list.length });
    }
  }

  handleMoveSwipeRight = () => {
    let { current } = this.state;
    current -= 1;
    if (current < 0) {
      current = 0;
    }
    const transformX = (window.innerWidth * current) * -1;
    this.setState({ transformX, current });
  }

  render() {
    const list = this.props.list || [];
    // const swipeConfig = {
    //   delta: 10,
    //   preventDefaultTouchmoveEvent: false,
    //   trackTouch: true,
    //   trackMouse: false,
    //   rotationAngle: 0,
    //   onSwipedLeft: this.handleMoveSwipeLeft,
    //   onSwipedRight: this.handleMoveSwipeRight,
    // };
    const {
      transformX,
      current,
    } = this.state;
    console.log(transformX, current);
    return (
      <div className={`${styles['banner-bar']} swiper-container`}>
        <div className="swiper-wrapper">
          {
            list.map((item, index) => (
              <div
                key={index}
                className={`${styles['banner-item']} swiper-slide`}
              >
                <img src={item} alt="banner" />
              </div>
            ))
          }
        </div>
        <div className={styles['pagination-bar']}>
          { current + 1 }/{ list.length }
        </div>
      </div>
    );
  }
}

export default Banner;
