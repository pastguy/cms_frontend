import React, { Component } from 'react';
import { Tab, Button, Icon } from '@alifd/next';
import Product from './Product/Product';
import Sku from './Sku/Sku';

const panes = [
  { tab: '商品页', key: 0, closeable: false }
];

export default class CrawlProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      extraPanes: [],
      activeKey: 0
    };
  }

  removeTab(targetKey) {
    // let activeKey = this.state.activeKey;
    const extraPanes = [];
    this.state.extraPanes.forEach(pane => {
      if (pane.key != targetKey) {
        panes.push(pane);
      }
    });
    this.setState({ extraPanes, activeKey: 0 });
  }

  onClose = (targetKey) => {
    this.removeTab(targetKey);
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  addTabpane = (key) => {
    this.setState(prevState => {
      const { extraPanes } = prevState;
      extraPanes.push({ tab: 'sku列表', key, closeable: true });
      return { extraPanes, activeKey: key };
    });
  }

  render() {
    return (
      <div>
        <Tab
          shape="wrapped"
          activeKey={this.state.activeKey}
          onChange={this.onChange}
          onClose={this.onClose}
          className="custom-tab">
          <Tab.Item title='商品页' key={0} closeable={false}>
            <Product onDetail={this.addTabpane.bind(this)} />
          </Tab.Item>
          {this.state.extraPanes.map(item => <Tab.Item title={item.tab} key={item.key} closeable={item.closeable}><Sku smtProductId={item.key} /></Tab.Item>)}
        </Tab>
      </div>
    );
  }
}
