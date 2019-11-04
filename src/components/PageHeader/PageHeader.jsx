import React, { Component } from 'react';
import arrowIcon from 'assets/images/back2.png';
import styles from './pageHeader.css';

class PageHeader extends Component {
  handleBack = () => {
    const routes = JSON.parse(sessionStorage.routes || '[]');
    const url = routes[routes.length - 1];
    if (url) {
      routes.splice(routes.length - 1, 1);
      console.log(routes);
      sessionStorage.setItem('routes', JSON.stringify(routes));
      window.location.href = url;
    }
  }

  componentWillMount() {
    sessionStorage.setItem('isPage', 1);
  }

  render() {
    const { title, children, style } = this.props;
    const routes = JSON.parse(sessionStorage.routes || '[]');
    return (
      <div className={styles['header-title']} style={style || {}}>
        {
          routes.length ?
            <span className={styles['back-arrow-btn']} onClick={this.handleBack}><img src={arrowIcon} alt="back" /></span>
            : null
        }
        <span>{title}</span>
        {
          children
        }
      </div>
    );
  }
}

export default PageHeader;
