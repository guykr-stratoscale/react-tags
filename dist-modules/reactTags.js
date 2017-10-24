'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Tag = require('./Tag');
var Suggestions = require('./Suggestions');

var _require = require('react-dnd');

var DragDropContext = _require.DragDropContext;

var HTML5Backend = require('react-dnd-html5-backend');
var PropTypes = require('prop-types');

// Constants
var Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

var ReactTags = (function (_React$Component) {
    _inherits(ReactTags, _React$Component);

    function ReactTags(props) {
        _classCallCheck(this, ReactTags);

        _get(Object.getPrototypeOf(ReactTags.prototype), 'constructor', this).call(this, props);
        this.state = {
            suggestions: this.props.suggestions,
            query: "",
            selectedIndex: -1,
            selectionMode: false
        };
    }

    _createClass(ReactTags, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.autofocus) {
                this.refs.input.focus();
            }
        }
    }, {
        key: 'filteredSuggestions',
        value: function filteredSuggestions(query, suggestions) {
            return suggestions.filter(function (item) {
                return item.toLowerCase().startsWith(query.toLowerCase());
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            var suggestions = this.filteredSuggestions(this.state.query, props.suggestions);
            this.setState({
                suggestions: suggestions
            });
        }
    }, {
        key: 'handleDelete',
        value: function handleDelete(i, e) {
            this.props.handleDelete(i);
            this.setState({ query: "" });
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            if (this.props.handleInputChange) {
                this.props.handleInputChange(e.target.value.trim());
            }

            var query = e.target.value.trim();
            var suggestions = this.filteredSuggestions(query, this.props.suggestions);

            this.setState({
                query: query,
                suggestions: suggestions
            });
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(e) {
            var _state = this.state;
            var query = _state.query;
            var selectedIndex = _state.selectedIndex;
            var suggestions = _state.suggestions;

            // hide suggestions menu on escape
            if (e.keyCode === Keys.ESCAPE) {
                e.preventDefault();
                this.setState({
                    selectedIndex: -1,
                    selectionMode: false,
                    suggestions: []
                });
            }

            // When one of the terminating keys is pressed, add current query to the tags.
            // If no text is typed in so far, ignore the action - so we don't end up with a terminating
            // character typed in.
            if (this.props.delimeters.indexOf(e.keyCode) !== -1) {
                e.preventDefault();
                if (query !== "") {
                    if (this.state.selectionMode) {
                        query = this.state.suggestions[this.state.selectedIndex];
                    }
                    this.addTag(query);
                }
            }

            // when backspace key is pressed and query is blank, delete tag
            if (e.keyCode === Keys.BACKSPACE && query == "" && this.props.allowDeleteFromEmptyInput) {
                this.handleDelete(this.props.tags.length - 1);
            }

            // up arrow
            if (e.keyCode === Keys.UP_ARROW) {
                e.preventDefault();
                var selectedIndex = this.state.selectedIndex;
                // last item, cycle to the top
                if (selectedIndex <= 0) {
                    this.setState({
                        selectedIndex: this.state.suggestions.length - 1,
                        selectionMode: true
                    });
                } else {
                    this.setState({
                        selectedIndex: selectedIndex - 1,
                        selectionMode: true
                    });
                }
            }

            // down arrow
            if (e.keyCode === Keys.DOWN_ARROW) {
                e.preventDefault();
                this.setState({
                    selectedIndex: (this.state.selectedIndex + 1) % suggestions.length,
                    selectionMode: true
                });
            }
        }
    }, {
        key: 'addTag',
        value: function addTag(tag) {
            var input = this.refs.input;

            // call method to add
            this.props.handleAddition(tag);

            // reset the state
            this.setState({
                query: "",
                selectionMode: false,
                selectedIndex: -1
            });

            // focus back on the input box
            input.value = "";
            input.focus();
        }
    }, {
        key: 'handleSuggestionClick',
        value: function handleSuggestionClick(i, e) {
            this.addTag(this.state.suggestions[i]);
        }
    }, {
        key: 'handleSuggestionHover',
        value: function handleSuggestionHover(i, e) {
            this.setState({
                selectedIndex: i,
                selectionMode: true
            });
        }
    }, {
        key: 'moveTag',
        value: function moveTag(id, afterId) {
            var tags = this.props.tags;

            // locate tags
            var tag = tags.filter(function (t) {
                return t.id === id;
            })[0];
            var afterTag = tags.filter(function (t) {
                return t.id === afterId;
            })[0];

            // find their position in the array
            var tagIndex = tags.indexOf(tag);
            var afterTagIndex = tags.indexOf(afterTag);

            // call handler with current position and after position
            this.props.handleDrag(tag, tagIndex, afterTagIndex);
        }
    }, {
        key: 'render',
        value: function render() {
            var tagItems = this.props.tags.map((function (tag, i) {
                return React.createElement(Tag, { key: tag.id,
                    tag: tag,
                    labelField: this.props.labelField,
                    onDelete: this.handleDelete.bind(this, i),
                    moveTag: this.moveTag });
            }).bind(this));

            // get the suggestions for the given query
            var query = this.state.query.trim(),
                selectedIndex = this.state.selectedIndex,
                suggestions = this.state.suggestions,
                placeholder = this.props.placeholder;

            var tagInput = React.createElement(
                'div',
                { className: 'ReactTags__tagInput' },
                React.createElement('input', { ref: 'input',
                    type: 'text',
                    placeholder: placeholder,
                    onChange: this.handleChange,
                    onKeyDown: this.handleKeyDown }),
                React.createElement(Suggestions, { query: query,
                    suggestions: suggestions,
                    selectedIndex: selectedIndex,
                    handleClick: this.handleSuggestionClick,
                    handleHover: this.handleSuggestionHover,
                    minQueryLength: this.props.minQueryLength })
            );

            return React.createElement(
                'div',
                { className: 'ReactTags__tags' },
                React.createElement(
                    'div',
                    { className: 'ReactTags__selected' },
                    tagItems,
                    this.props.inline && tagInput
                ),
                !this.props.inline && tagInput
            );
        }
    }]);

    return ReactTags;
})(React.Component);

ReactTags.propTypes = {
    tags: PropTypes.array,
    placeholder: PropTypes.string,
    labelField: PropTypes.string,
    suggestions: PropTypes.array,
    delimeters: PropTypes.array,
    autofocus: PropTypes.bool,
    inline: PropTypes.bool,
    handleDelete: PropTypes.func.isRequired,
    handleAddition: PropTypes.func.isRequired,
    handleDrag: PropTypes.func.isRequired,
    allowDeleteFromEmptyInput: PropTypes.bool,
    handleInputChange: PropTypes.func,
    minQueryLength: PropTypes.number
};

ReactTags.defaultProps = {
    placeholder: 'Add new tag',
    tags: [],
    suggestions: [],
    delimeters: [Keys.ENTER, Keys.TAB],
    autofocus: true,
    inline: true,
    allowDeleteFromEmptyInput: true,
    minQueryLength: 2
};

module.exports = {
    WithContext: DragDropContext(HTML5Backend)(ReactTags),
    WithOutContext: ReactTags,
    Keys: Keys
};