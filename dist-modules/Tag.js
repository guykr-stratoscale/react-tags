'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var _require = require('react-dnd');

var DragSource = _require.DragSource;
var DropTarget = _require.DropTarget;

var flow = require('lodash/function/flow');
var PropTypes = require('prop-types');

var ItemTypes = { TAG: 'tag' };

var tagSource = {
    beginDrag: function beginDrag(props) {
        return { id: props.tag.id };
    }
};

var tagTarget = {
    hover: function hover(props, monitor) {
        var draggedId = monitor.getItem().id;
        if (draggedId !== props.id) {
            props.moveTag(draggedId, props.tag.id);
        }
    }
};

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

var Tag = (function (_React$Component) {
    _inherits(Tag, _React$Component);

    function Tag() {
        _classCallCheck(this, Tag);

        _get(Object.getPrototypeOf(Tag.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Tag, [{
        key: 'getDefaultProps',
        value: function getDefaultProps() {
            return {
                labelField: 'text'
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var label = this.props.tag[this.props.labelField];
            var _props = this.props;
            var connectDragSource = _props.connectDragSource;
            var isDragging = _props.isDragging;
            var connectDropTarget = _props.connectDropTarget;

            return connectDragSource(connectDropTarget(React.createElement(
                'span',
                { style: { opacity: isDragging ? 0 : 1 },
                    className: 'ReactTags__tag' },
                label,
                React.createElement(
                    'a',
                    { className: 'ReactTags__remove',
                        onClick: this.props.onDelete },
                    '×'
                )
            )));
        }
    }]);

    return Tag;
})(React.Component);

Tag.propTypes = {
    labelField: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    tag: PropTypes.object.isRequired,
    moveTag: PropTypes.func.isRequired
}, module.exports = flow(DragSource(ItemTypes.TAG, tagSource, dragCollect), DropTarget(ItemTypes.TAG, tagTarget, dropCollect))(Tag);