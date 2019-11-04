import React, { Component } from 'react';
import start1 from 'assets/images/start1.png';
import start2 from 'assets/images/start2.png';
import styles from './components.css';

const score = 0;

class Start extends Component {
  state = {
    startLight1: styles.none,
    startDark1: styles.inline,
    startLight2: styles.none,
    startDark2: styles.inline,
    startLight3: styles.none,
    startDark3: styles.inline,
    startLight4: styles.none,
    startDark4: styles.inline,
    startLight5: styles.none,
    startDark5: styles.inline,
    score: 0,
  }

  zero = () => {
    this.setState({
      startLight1: styles.none,
      startDark1: styles.inline,
      startLight2: styles.none,
      startDark2: styles.inline,
      startLight3: styles.none,
      startDark3: styles.inline,
      startLight4: styles.none,
      startDark4: styles.inline,
      startLight5: styles.none,
      startDark5: styles.inline,
    });
  }

  one = () => {
    this.setState({
      startLight1: styles.inline,
      startDark1: styles.none,
      startLight2: styles.none,
      startDark2: styles.inline,
      startLight3: styles.none,
      startDark3: styles.inline,
      startLight4: styles.none,
      startDark4: styles.inline,
      startLight5: styles.none,
      startDark5: styles.inline,
    });
  }
  two = () => {
    this.setState({
      startLight1: styles.inline,
      startDark1: styles.none,
      startLight2: styles.inline,
      startDark2: styles.none,
      startLight3: styles.none,
      startDark3: styles.inline,
      startLight4: styles.none,
      startDark4: styles.inline,
      startLight5: styles.none,
      startDark5: styles.inline,
    });
  }
  three = () => {
    this.setState({
      startLight1: styles.inline,
      startDark1: styles.none,
      startLight2: styles.inline,
      startDark2: styles.none,
      startLight3: styles.inline,
      startDark3: styles.none,
      startLight4: styles.none,
      startDark4: styles.inline,
      startLight5: styles.none,
      startDark5: styles.inline,
    });
  }
  four = () => {
    this.setState({
      startLight1: styles.inline,
      startDark1: styles.none,
      startLight2: styles.inline,
      startDark2: styles.none,
      startLight3: styles.inline,
      startDark3: styles.none,
      startLight4: styles.inline,
      startDark4: styles.none,
      startLight5: styles.none,
      startDark5: styles.inline,
    });
  }
  five = () => {
    this.setState({
      startLight1: styles.inline,
      startDark1: styles.none,
      startLight2: styles.inline,
      startDark2: styles.none,
      startLight3: styles.inline,
      startDark3: styles.none,
      startLight4: styles.inline,
      startDark4: styles.none,
      startLight5: styles.inline,
      startDark5: styles.none,
    });
  }

  showStart = (score_) => {
    try {
      sessionStorage.removeItem('score');
    } catch (e) {
      console.log(e);
    }
    sessionStorage.setItem('score', `${score_}`);
    switch (score_) {
      case 0:
        this.zero();
        break;
      case 1:
        this.one();
        break;
      case 2:
        this.two();
        break;
      case 3:
        this.three();
        break;
      case 4:
        this.four();
        break;
      case 5:
        this.five();
        break;
      default:
        console.log('err');
    }
  }

  assessmentScore = (x) => {
    if (this.state.score === x) {
      this.showStart(0);
      this.setState({ score: 0 });
    } else {
      this.showStart(x);
      this.setState({ score: x });
    }
    const { onBlur } = this.props;
    setTimeout(() => {
      onBlur();
    }, 50);
  }

  initScore = () => {
    sessionStorage.setItem('score', `${score}`);
  }

  componentWillMount() {
    this.initScore();
  }

  render() {
    const {
      startLight1,
      startDark1,
      startLight2,
      startDark2,
      startLight3,
      startDark3,
      startLight4,
      startDark4,
      startLight5,
      startDark5,
    } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <div className={styles['start-content']}>
          <div className={styles.start1} onClick={() => this.assessmentScore(1)}>
            <img className={startLight1} src={start1} alt="start1" />
            <img className={startDark1} src={start2} alt="start2" />
          </div>
          <div className={styles.start2} onClick={() => this.assessmentScore(2)}>
            <img className={startLight2} src={start1} alt="start1" />
            <img className={startDark2} src={start2} alt="start2" />
          </div>
          <div className={styles.start3} onClick={() => this.assessmentScore(3)}>
            <img className={startLight3} src={start1} alt="start1" />
            <img className={startDark3} src={start2} alt="start2" />
          </div>
          <div className={styles.start4} onClick={() => this.assessmentScore(4)}>
            <img className={startLight4} src={start1} alt="start1" />
            <img className={startDark4} src={start2} alt="start2" />
          </div>
          <div className={styles.start5} onClick={() => this.assessmentScore(5)}>
            <img className={startLight5} src={start1} alt="start1" />
            <img className={startDark5} src={start2} alt="start2" />
          </div>
        </div>
      </div>
    );
  }
}
export default Start;
