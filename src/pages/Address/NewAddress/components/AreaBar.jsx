import React, { Component } from 'react';
import config from 'config';
import request from 'utils/request';
// import Picker from 'react-mobile-picker';
import { Picker } from 'antd-mobile';
// import CCAZ from 'utils/china-city-area-zip';
import styles from './components.css';

class InputBar extends Component {
  constructor(props) {
    super(props);
    this.initState(props);
  }

  initState = (props) => {
    const { initialValue } = props;
    let province = initialValue[0] || '';
    let city = initialValue[1] || '';
    const area = initialValue[2] || '';
    if (province && province.includes('省')) {
      province = province.substr(0, province.indexOf('省'));
    }
    if (city && city.includes('市')) {
      city = city.substr(0, city.indexOf('市'));
    }
    this.state = {
      value: [province, city, area],
      valueGroups: {
        province,
        city,
        area,
      },
      oldValueGroups: {
        province,
        city,
        area,
      },
      dataSource: [{
        value: '北京',
        label: '北京',
        children: [],
      }, {
        value: '广东',
        label: '广东',
        children: [{
          value: '广州',
          label: '广州',
          children: [{
            value: '荔湾区',
            label: '荔湾区',
            children: [],
          }, {
            value: '增城区',
            label: '增城区',
            children: [],
          }],
        }],
      }],
    };
  }

  componentWillMount() {
    this.initProvinceList();
  }

  initProvinceList = () => {
    const url = `${config.apiUri}/address/provinces`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const dataSource = [];
        const province = res.data.result;
        const { valueGroups, value } = this.state;
        if (!valueGroups.province) {
          valueGroups.province = province['0'];
          valueGroups.city = '';
          valueGroups.area = '';
          value['0'] = province['0'];
          value['1'] = '';
          value['2'] = '';
        }
        const loop = (i) => {
          const item = province[i];
          if (item) {
            dataSource.push({ value: item, label: item, children: [] });
            loop(i + 1);
          }
        };
        loop(0);
        this.setState({
          dataSource,
          valueGroups,
          value,
        });
        this.initCityList(valueGroups.province);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  initCityList = (provinceName) => {
    const url = `${config.apiUri}/address/cities?provinceName=${provinceName}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const {
          dataSource,
          valueGroups,
          value,
        } = this.state;
        const city = res.data.result;
        if (!valueGroups.city) {
          valueGroups.city = city['0'];
          value['1'] = city['0'];
        }
        const loop = (i) => {
          if (dataSource[i]) {
            if (dataSource[i].value === provinceName) {
              const cityLoop = (j) => {
                const cityItem = city[j];
                if (cityItem) {
                  dataSource[i].children.push({ value: cityItem, label: cityItem, children: [] });
                  cityLoop(j + 1);
                }
              };
              cityLoop(0);
            } else {
              loop(i + 1);
            }
          }
        };
        loop(0);
        this.setState({
          dataSource,
          valueGroups,
          value,
        });
        this.initAreaList(provinceName, valueGroups.city);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  initAreaList = (provinceName, cityName) => {
    const url = `${config.apiUri}/address/areas?provinceName=${provinceName}&cityName=${cityName}`;
    const method = 'GET';
    request({ url, method }).then((res) => {
      if (res.data.code === 200) {
        const {
          dataSource,
          valueGroups,
          value,
        } = this.state;
        const area = res.data.result;
        if (!valueGroups.area) {
          valueGroups.area = area['0'] || '';
          value['2'] = area['0'];
        }
        const loop = (i) => {
          const item = dataSource[i];
          if (item) {
            if (item.value === provinceName) {
              const cityLoop = (j) => {
                const cityItem = item.children[j];
                if (cityItem) {
                  if (cityItem.value === cityName) {
                    const areaLoop = (k) => {
                      const areaItem = area[k];
                      if (areaItem) {
                        dataSource[i].children[j].children.push({
                          value: areaItem,
                          label: areaItem,
                          children: [],
                        });
                        areaLoop(k + 1);
                      }
                    };
                    areaLoop(0);
                  } else {
                    cityLoop(j + 1);
                  }
                }
              };
              cityLoop(0);
            } else {
              loop(i + 1);
            }
          }
        };
        loop(0);
        this.setState({
          dataSource,
          valueGroups,
          value,
        });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  handleChange = (name, value) => {
    const { valueGroups } = this.state;
    valueGroups[name] = value;
    this.setState({ valueGroups });
    if (name === 'province' && value) {
      this.initCityList(value);
    } else if (name === 'city' && value) {
      this.initAreaList(value);
    }
  }

  handleChangeSelect = (selectList) => {
    this.setState({
      value: [
        selectList[0] || '',
        selectList[1] || '',
        selectList[2] || '',
      ],
      valueGroups: {
        province: selectList[0] || '',
        city: selectList[1] || '',
        area: selectList[2] || '',
      },
    });
    const { length } = selectList;
    if (length === 1 && selectList[0]) {
      this.initCityList(selectList[0]);
    } else if (length === 2 && selectList[0] && selectList[1]) {
      this.initAreaList(selectList[0], selectList[1]);
    }
  }

  handleSelect = () => {
    const { value } = this.state;
    const province = value[0] || '';
    const city = value[1] || '';
    const area = value[2] || '';
    this.setState({
      oldValueGroups: {
        province,
        city,
        area,
      },
      valueGroups: {
        province,
        city,
        area,
      },
    });
  }

  handleCancelSelect = () => {
    const { oldValueGroups } = this.state;
    const { province, city, area } = oldValueGroups;
    this.setState({ value: [province, city, area] });
  }

  render() {
    const label = this.props.label || '输入框';
    const {
      value,
      dataSource,
    } = this.state;
    return (
      <div>
        <div className={styles['input-bar']}>
          <span className={styles['input-label']}>{ label }</span>
          <Picker
            value={value}
            data={dataSource}
            onOk={this.handleSelect}
            onDismiss={this.handleCancelSelect}
            onPickerChange={this.handleChangeSelect}
          >
            <div className={styles['value-content']}>{value}</div>
          </Picker>
        </div>
      </div>
    );
  }
}

export default InputBar;
