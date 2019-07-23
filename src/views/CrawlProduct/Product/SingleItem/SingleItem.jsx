import React, { Component } from '_react@16.8.6@react';
import IceImg from '@icedesign/img';
import styles from './SingleItem.scss';

export default class SingleItem extends Component {
  static displayName = 'SingleItem';

  viewSkus(id) {
    this.props.onDetail(id);
  }

  downloadExcelsWithSkus(id) {
    console.log(this.props);
    this.props.onDownload(id);
  }

  render() {
    const {
      id,
      style,
      className = '',
      active,
      subject,
      images,
      currency,
      productDesc,
    } = this.props;
    return (
      <div
        className={`${className} ${styles.singleItem}`}
        style={{
          ...style,
          width: '165px',
          height: '250px',
          cursor: 'pointer',
          borderRadius: '4px',
          margin: '0 auto',
          backgroundColor: active ? '#f4f4f4' : undefined,
        }}
      >
        <IceImg
          src={images[0]}
          width={149}
          height={149}
          style={{ margin: '8px' }}
        />
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            fontSize: '12px',
            lineHeight: '18px',
            margin: '0 14px',
          }}
        >
          {subject}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            lineHeight: '18px',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          {currency}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            lineHeight: '18px',
            color: '#C0C0C0',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          {productDesc}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            lineHeight: '18px',
            color: '#C0C0C0',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          <a onClick={this.viewSkus.bind(this, id)}>查看</a>
          <a onClick={this.downloadExcelsWithSkus.bind(this, id)}>下载</a>
        </div>
      </div>
    );
  }
}
