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
// import luoConnect from "../../../store/luoConnect";
import styles from './UpcCode.scss';
import luoConnect from '../../../store/luoConnect';
const { Item: FormItem, Submit } = Form;
const { Row, Col } = Grid;

@withRouter
@luoConnect(["upc/upc"])
export default class UpcCode extends Component {
  static displayName = "UpcCode";
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
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'upc/getUpcCode',
      payload: {
        upcGenId: this.props.id,
      },
      callback: (e) => {
        if (e) return Message.error(e);
        const { upcCodes } = this.props.upc;
        this.setState({
          lists: upcCodes,
          loading: false,
        });
      },
    });
  }

  onPageChange(pageNum) {
    this.setState(
      {
        requestParams: Object.assign({}, this.state.requestParams, {
          pageNum: pageNum
        })
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
            <Table.Column title="upc编码" dataIndex="upcCode" align="center" />
            <Table.Column title="生成时间" dataIndex="createTime" align="center" />
            <Table.Column title="完成时间" dataIndex="updateTime" align="center" />
          </Table>
        </div>
        <Row
          style={{
            marginTop: "10px",
            padding: "5px 15px",
            background: "#ebebeb",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "15px"
            }}
          >
            <span style={{ paddingRight: "10px" }}>
              共{totalCount}条数据，每页{pageSize}条
            </span>
            <Pagination
              size="medium"
              shape="arrow-only"
              current={pageNum}
              pageSize={pageSize}
              total={totalCount}
              onChange={this.onPageChange.bind(this)}
            />
          </div>
        </Row>
      </div>
    );
  }
}
