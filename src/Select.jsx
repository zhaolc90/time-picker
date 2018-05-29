import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import classnames from 'classnames';

const scrollTo = (element, to, duration) => {
  const requestAnimationFrame = window.requestAnimationFrame ||
    function requestAnimationFrameTimeout() {
      return setTimeout(arguments[0], 10);
    };
  // jump to target if duration zero
  if (duration <= 0) {
    element.scrollTop = to;
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = difference / duration * 10;

  requestAnimationFrame(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

class Select extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    type: PropTypes.string,
    onSelect: PropTypes.func,
    onMouseEnter: PropTypes.func,
  };

  constructor(props) {
    super(props) 
    this.state = {
      active: false,
      options: props.options,
    };
  }

  componentDidMount() {
    // jump to selected option
    this.scrollToSelected(0);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedIndex === this.props.selectedIndex) {
      return false
    }
  }

  componentDidUpdate(prevProps) {
    // smooth scroll to selected option
    if (prevProps.selectedIndex !== this.props.selectedIndex) {
      this.scrollToSelected(120);
    }
  }

  onSelect = (value) => {
    const { onSelect, type } = this.props;
    onSelect(type, value);
  }

  getOptions() {
    const { options, selectedIndex, prefixCls } = this.props;
    var head = options.concat()
    var tail = head.splice(selectedIndex)
    const newOptions = tail.concat(head)

    return newOptions.map((item, index) => {
      const cls = classnames({
        [`${prefixCls}-select-option-selected`]: index === 0,
        [`${prefixCls}-select-option-disabled`]: item.disabled,
      });
      let onclick = null;
      if (!item.disabled) {
        onclick = this.onSelect.bind(this, item.value);
      }
      return (<li
        className={cls}
        key={index}
        onClick={onclick}
        disabled={item.disabled}
      >
        {item.value}
      </li>);
    });
  }

  scrollToSelected(duration) {
    // move to selected item
    const select = ReactDom.findDOMNode(this);
    const list = ReactDom.findDOMNode(this.list);
    if (!list) {
      return;
    }
    let index = 0;
    const topOption = list.children[index];
    const to = topOption.offsetTop;
    scrollTo(select, to, duration);
  }

  handleMouseEnter = (e) => {
    this.setState({ active: true });
    this.props.onMouseEnter(e);
  }

  handleMouseLeave = () => {
    this.setState({ active: false });
  }

  saveList = (node) => {
    this.list = node;
  }

  render() {
    if (this.props.options.length === 0) {
      return null;
    }

    const { prefixCls } = this.props;
    const cls = classnames({
      [`${prefixCls}-select`]: 1,
      [`${prefixCls}-select-active`]: this.state.active,
    });

    return (
      <div
        className={cls}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <ul ref={this.saveList}>{this.getOptions()}</ul>
      </div>
    );
  }
}

export default Select;
