import React, { Component } from "react";
import IceContainer from '@icedesign/container';
import {
  Message,
  Grid,
  Pagination,
} from '@alifd/next';
// import { Pagination, Grid, Message } from '@alifd/next/types';
import SingleItem from './SingleItem/SingleItem';
import styles from './Product.scss';

import { withRouter } from 'react-router';
import luoConnect from '../../../store/luoConnect';

const { Row, Col } = Grid;

const dataSource = [
  {
    subject: '衬衫女雪纺上衣2017大纺上衣2017大纺上衣2017大',
    productDesc: '预计佣金 ¥10',
    currency: 'currency',
    images:
      '//img.alicdn.com/bao/uploaded/i3/120976213/TB2O4nSnblmpuFjSZFlXXbdQXXa_!!120976213.jpg_240x240.jpg',
  },
];


@withRouter
@luoConnect(['crawl/crawl'])
export default class Product extends Component {
  static displayName = 'Product';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      requestParams: {
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.props.dispatch({
      type: 'crawl/getCrawlProduct',
      payload: this.state.requestParams,
      callback: (e) => {
        if (e) return Message.error(e);
        const { productPage } = this.props.crawl;
        this.setState({
          products: productPage.result,
          totalCount : productPage.totalCount,
        });
      },
    });
  }

  downloadExcelsWithSkus(id) {
    debugger;
    this.props.dispatch({
      type: 'crawl/downloadSkus',
      payload: {
        smtProductId: id,
      },
      callback: (e) => {
        if (e) return Message.error(e);
      },
    });
  }

  onPageChange(pageNum) {
    this.setState(
      {
        requestParams: Object.assign({}, this.state.requestParams, {
          pageNum
        }),
      },
      () => {
        this.getData();
      }
    );
  }

  renderItem = (item, index) => {
    return (
      <Col xxs={12} s={8} m={6} l={4} key={index}>
        <SingleItem {...item} {...this.props} onDownload={this.downloadExcelsWithSkus.bind(this, item.id)} />
      </Col>
    );
  };

  renderItemRow = () => {
    return <div className={styles.row}>{dataSource.map(this.renderItem)}</div>;
  };

  render() {
    const { pageNum, pageSize } = this.state.requestParams;
    return (
      <div>
        <IceContainer className={styles.card}>
          <Row wrap gutter={20}>
            {this.state.products.map(this.renderItem)}
          </Row>
          <div className={styles.paginationContainer}>
            <Pagination className="custom-pagination"
                        current={pageNum}
                        pageSize={pageSize}
                        onChange={this.onPageChange.bind(this)}
                        total={this.state.totalCount} totalRender={total => `总数: ${this.state.totalCount}`} />
          </div>
        </IceContainer>
      </div>
    );
  }
}
