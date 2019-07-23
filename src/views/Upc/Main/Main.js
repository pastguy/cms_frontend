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
import luoConnect from "../../../store/luoConnect";
import styles from './Main.scss';
const { Item: FormItem, Submit } = Form;
const { Row, Col } = Grid;

@withRouter
@luoConnect(["upc/upc"])
export default class Main extends Component {
  static displayName = "Main";
  constructor(props, context) {
    super(props, context);
    this.state = {
      lists: [],
      requestParams: {
        pageNum: 1,
        pageSize: 10,
      },
      genParams: {
        first: 7,
        second: 10000,
        third: 10000,
        nums: 20,
      },
      loading: false,
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  inputChange(name, value) {
    this.setState({
      genParams: Object.assign({}, this.state.genParams, {
        [name]: value,
      }),
    });
  }

  getData() {
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'upc/getUpcGenPage',
      callback: (e) => {
        if (e) return Message.error(e);
        const { upcGenPage } = this.props.upc;
        this.setState({
          lists: upcGenPage.result,
          loading: false,
          totalCount: upcGenPage.totalCount,
        });
      },
    });
  }

  genUpc() {
    this.props.dispatch({
      type: 'upc/upcGen',
      payload: this.state.genParams,
      callback: (e) => {
        if (e) return Message.error(e);
        Message.success('正在生成中');
        this.getData();
      },
    });
  }

  onPageChange(pageNum) {
    this.setState(
      {
        requestParams: Object.assign({}, this.state.requestParams, {
          pageNum,
        }),
      },
      () => {
        this.getData();
      }
    );
  }

  onView(id) {
    this.props.onDetail(id);
  }

  onGenRetry(id) {
    this.props.dispatch({
      type: 'upc/upcGenRetry',
      payload: {
        genId: id,
      },
      callback: (e) => {
        if (e) return Message.error(e);
        Message.success('正在生成中');
        this.getData();
      },
    });
  }

  onRefresh() {
    this.getData();
  }

  renderStatusIcon(value) {
    return (
      <div>
        {value === 1 ? <Icon type="success-filling" />
          : (value === 0 ? <Icon type="loading" /> : <Icon type="delete-filling" />)}
      </div>
    );
  }

  renderOperate(value, index, record) {
    return (
      <div>
        {record.status === 2 ? <Button onClick={this.onGenRetry.bind(this, record.id)} size="small" type="primary"
                                       style={{ marginRight: '12px' }} >重新生成</Button> : ''}
        {record.status === 1 ? <Button onClick={this.onView.bind(this, record.id)} size="small" type="primary">查看</Button> : ''}
        {record.status === 0 ? <Button onClick={this.onRefresh.bind(this, record.id)} size="small" type="primary">刷新</Button> : ''}
      </div>
    );
  }

  render() {
    const { first, second, third, nums } = this.state.genParams;
    const { lists, loading, totalCount } = this.state;
    const { pageNum, pageSize } = this.state.requestParams;
    return (
      <div className={styles.auto}>
        <div className="top">
          <Form inline>
            <FormItem
              label="旗码"
              required
              asterisk
              requiredMessage="不能为空"
              requiredTrigger="onBlur"
            >
              <NumberPicker
                style={{ width: "50px" }}
                min={1}
                max={9}
                name="first"
                value={first}
                onChange={this.inputChange.bind(this, "first")}
              />
            </FormItem>
            <FormItem
              label="厂商代码"
              required
              asterisk
              requiredMessage="不能为空"
              requiredTrigger="onBlur"
            >
              <Input
                name="second"
                value={second}
                maxLength={5}
                placeholder="5位数字"
                style={{ width: "100px" }}
                onChange={this.inputChange.bind(this, "second")}
              />
            </FormItem>
            <FormItem
              label="商品代码"
              required
              asterisk
              requiredMessage="不能为空"
              requiredTrigger="onBlur"
            >
              <Input
                name="third"
                value={third}
                maxLength={5}
                placeholder="5位数字"
                style={{ width: "100px" }}
                onChange={this.inputChange.bind(this, "third")}
              />
            </FormItem>
            <FormItem
              label="数量"
              required
              asterisk
              requiredMessage="不能为空"
              requiredTrigger="onBlur"
            >
              <NumberPicker
                name="nums"
                value={nums}
                onChange={this.inputChange.bind(this, "nums")}
                min={0}
                max={1000}
                style={{ width: '60px' }}
              />
            </FormItem>
            <FormItem>
              <Submit
                type="primary"
                style={{ paddingLeft: "30px", paddingRight: "30px" }}
                onClick={this.genUpc.bind(this)}
              >
                生成
              </Submit>
            </FormItem>
          </Form>
          <Table dataSource={lists} loading={loading} >
            <Table.Column title="编号" dataIndex="id" align="center" />
            <Table.Column title="旗码" dataIndex="first" align="center" />
            <Table.Column title="厂商代码" dataIndex="second" align="center" />
            <Table.Column title="商品代码" dataIndex="third" align="center" />
            <Table.Column title="生成数量" dataIndex="nums" align="center" />
            <Table.Column title="生成时间" dataIndex="createTime" align="center" />
            <Table.Column title="完成时间" dataIndex="updateTime" align="center" />
            <Table.Column title="生成状态" dataIndex="status" align="center"
                          cell={this.renderStatusIcon.bind(this)}
            />
            <Table.Column
              title="操作"
              align="center"
              cell={this.renderOperate.bind(this)}
            />
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
