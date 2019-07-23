import React, { Component } from "react";
import {
  NumberPicker,
  Input,
  Table,
  Form,
  Button,
  Message,
  Grid,
  Pagination, Select, Dialog, Icon,
} from '@alifd/next';

import { withRouter } from 'react-router';
import styles from './Sku.scss';
import luoConnect from '../../../store/luoConnect';
const { Item: FormItem, Submit } = Form;
const { Row, Col } = Grid;


@withRouter
@luoConnect(['crawl/crawl'])
export default class Sku extends Component {
  static displayName = 'Sku';
  constructor(props, context) {
    super(props, context);
    this.state = {
      lists: [],
      requestParams: {
        pageNum: 1,
        pageSize: 10,
      },
      loading: false,
      totalCount: 0,
      skuPropertyList: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'crawl/getCrawlSku',
      payload: Object.assign({}, this.state.requestParams, {
        smtProductId: this.props.smtProductId,
      }),
      callback: (e) => {
        if (e) return Message.error(e);
        const { skuPage } = this.props.crawl;

        const skuList = skuPage.result;
        const lists = [];
        const skuPropertyList = [];
        if (skuList) {
          skuList.forEach((sku) => {
            const valueList = sku.propertyValueEntityList;
            if (valueList) {
              valueList.forEach((value) => {
                const skuPropertyName = value.skuPropertyName;
                sku[skuPropertyName] = value.skuPropertyValueName;
                if (skuPropertyList.indexOf(skuPropertyName) < 0) {
                  skuPropertyList.push(skuPropertyName);
                }
              });
            };
            lists.push(sku);
          });
        };
        this.setState({
          lists,
          skuPropertyList,
          totalCount: skuPage.totalCount,
          loading: false,
        });
      },
    });
  }

  onPageChange(pageNum) {
    this.setState(
      {
        requestParams: Object.assign({}, this.state.requestParams, {
          pageNum: pageNum,
        }),
      },
      () => {
        this.getData();
      }
    );
  }

  render() {
    const { lists, loading, requestParams, totalCount } = this.state;
    const { pageNum, pageSize } = requestParams;
    return (
      <div className={styles.auto}>
        <div className="top">
          <Table dataSource={lists} loading={loading}>
            <Table.Column title="商品id" dataIndex="smtProductId" align="center" />
            <Table.Column title="商品价格" dataIndex="price" align="center" />
            <Table.Column title="图片" dataIndex="picUrl" align="center" />
            {this.state.skuPropertyList.map((item) => {
              return (
                <Table.Column title={item} dataIndex={item} align="center" />
              );
            })}
          </Table>
        </div>
        <div className={styles.paginationContainer}>
          <Pagination className="custom-pagination"
                      current={pageNum}
                      pageSize={pageSize}
                      onChange={this.onPageChange.bind(this)}
                      total={this.state.totalCount} totalRender={total => `总数: ${this.state.totalCount}`} />
        </div>
      </div>
    );
  }
}
