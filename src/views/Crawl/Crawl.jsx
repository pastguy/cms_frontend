import React, { Component } from 'react';
import { Input, Button, NumberPicker, Form, Message } from '@alifd/next';
import styles from './Crawl.scss';
import Iframe from 'react-iframe';

const { Item: FormItem, Submit } = Form;

import { withRouter } from 'react-router';
import luoConnect from "../../store/luoConnect";

@withRouter
@luoConnect(["crawl/crawl"])
export default class Crawl extends Component {
  static displayName = 'Crawl';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://www.baidu.com',
      targetUrl: 'https://www.baidu.com',
    };
  }

  inputChange(name, value) {
    this.setState({
      [name]: value,
    });
  }

  /**
   * 预览
   */
  preview() {
    this.setState({
      targetUrl: this.state.url,
    });
  }

  /**
   * 执行
   */
  startCrawl() {
    this.props.dispatch({
      type: 'crawl/crawlStart',
      payload: {
        url: this.state.targetUrl,
      },
      callback: (e) => {
        if (e) return Message.error(e);
      },
    });
  }

  render() {
    return (
      <div style={{ background: 'white' }}>
        <Form inline>
          <FormItem
            label="输入url"
            size="large"
            required
            requiredMessage="不能为空"
            requiredTrigger="onBlur"
          >
            <Input
              name="targetUrl"
              value={this.state.url}
              placeholder="例如https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20190701055543&SearchText=shirt"
              style={{ width: '1000px' }}
              onChange={this.inputChange.bind(this, 'url')}
            />
          </FormItem>
          <FormItem>
            <Submit
              type="primary"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
              onClick={this.preview.bind(this)}
            >
              预览
            </Submit>
          </FormItem>
          <FormItem>
            <Submit
              type="primary"
              style={{ paddingLeft: '30px', paddingRight: '30px' }}
              onClick={this.startCrawl.bind(this)}
            >
              执行
            </Submit>
          </FormItem>
        </Form>
        <Iframe url={this.state.targetUrl}
                width="100%"
                height="700px"
                id="myId"
                className="myClassname"
                display="initial"
                position="relative"/>
      </div>
    );
  }
}
