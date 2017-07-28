import React, { Component } from "react";
import PropTypes from "prop-types";
import scss from "./style/index.scss";
import {connect} from "react-redux";

/**
 * 底部banner组件
 * @namespace Banner
 * @comType present
 * @useRedux true
 */
@connect(state => {
    return {
        pageInfo: state.get("pageListInfo")
    };
})
export default class FooterBanner extends Component {
  static defaultProps = {
    bannerImg: "http://s3.fx.kgimg.com/staticPub/images/_41d08a3.png",
    footerShow: true,
    onClickFun:function(){},
    showArray:[1,2,3,4],
    haha:["123","234"]
  };

  static propTypes = {
    /**
     * 点击事件
     * @type function
     */
    onClickFun: PropTypes.func,
    /**
     * 下载事件
     * @type function
     */
    onDownClickFun: PropTypes.func,
    /**
     * banner图片地址
     * @type string
     */
    bannerImg: PropTypes.string,
    /**
     * @type boolean
     * banner显示隐藏
     * @reducer [footerbanner,footerShow]
     */
    footerShow: PropTypes.bool,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  handleOnDownClickFun(e) {
    const { onDownClickFun } = this.props;
    if (onDownClickFun) {
      onDownClickFun();
    }
    e.stopPropagation();
  }

  render() {
    let { bannerImg, footerShow, style } = this.props;
    const bannerStyle = {
      background: "url(" + bannerImg + ") no-repeat center",
      backgroundSize: "100% auto",
      display: footerShow ? "block" : "none",
      ...style
    };
    // onClick={this.props.onClickFun}
    // onClick={this.props.onDownClickFun}
    return (
      <div
        className={scss.banner}
        style={bannerStyle}
        onClick={this.props.onClickFun}
      >
        <div
          className={scss.download}
          onClick={this.handleOnDownClickFun.bind(this)}
        />
      </div>
    );
  }
}
