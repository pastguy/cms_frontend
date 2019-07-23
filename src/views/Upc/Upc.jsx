import React, { Component } from 'react';
import { Tab, Button, Icon } from '@alifd/next';
import Main from './Main/Main';
import UpcCode from './UpcCode/UpcCode';

const panes = [
  { tab: 'Upc主页', key: 0, closeable: false }
];

export default class Upc extends Component {

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
      extraPanes.push({ tab: '生成明细', key, closeable: true });
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
          <Tab.Item title='upc主页' key={0} closeable={false}>
            <Main onDetail={this.addTabpane.bind(this)} />
          </Tab.Item>
          {this.state.extraPanes.map(item => <Tab.Item title={item.tab} key={item.key} closeable={item.closeable}><UpcCode id={item.key} /></Tab.Item>)}
        </Tab>
      </div>
    );
  }
}
