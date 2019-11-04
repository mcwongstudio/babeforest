import React, { Component } from 'react';
import request from 'utils/request';
import config from 'config';
import Products from './Products';

class ProductList extends Component {
  state = {
    list: [],
  }

  componentWillMount() {
    this.getProductList();
  }

  getProductList = () => {
    const url = `${config.apiUri}/item/categories/show?pageNum=1&pageSize=3&orderBy=sort+DESC`;
    const method = 'GET';
    const that = this;
    request({ url, method }).then((res) => {
      const { list } = res.data.result;
      that.setState({ list });
    }).catch((err) => {
      console.error(err);
    });
  };

  render() {
    const { list } = this.state;
    console.log(list);
    return (
      <div>
        {
          list.map(item => (
            <Products
              key={item.title}
              id={item.id}
              cover={item.image}
              title={item.title}
              description={item.description}
            />
          ))
        }
      </div>
    );
  }
}

export default ProductList;
