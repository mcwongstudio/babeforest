import React from 'react';
import styles from './riskWarning.css';

/**
 * 底部的风险提示
 */
export default class RiskWarning extends React.PureComponent {
  render() {
    return (
      <div className={styles.riskWarning}>
        风险提示<br />
        本策略工具完全基于人工智能算法，<br />
        历史数据不代表未来趋势，仅供参考，投资需谨慎
      </div>
    );
  }
}

