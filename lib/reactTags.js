var React = require('react');
var ReactDOM = require('react-dom');
var Tag = require('./Tag');
var Suggestions = require('./Suggestions');
var { DragDropContext } = require('react-dnd');
var HTML5Backend = require('react-dnd-html5-backend');
var PropTypes = require('prop-types')

// Constants
const Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

class ReactTags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            suggestions: this.props.suggestions,
            query: "",
            selectedIndex: -1,
            selectionMode: false
        }
    }

    componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    }

    filteredSuggestions(query, suggestions) {
        return suggestions.filter(function(item) {
            return item.toLowerCase().startsWith(query.toLowerCase());
        });
    }

    componentWillReceiveProps(props) {
        var suggestions = this.filteredSuggestions(this.state.query, props.suggestions);
        this.setState({
            suggestions: suggestions
        });
    }

    handleDelete(i, e) {
        this.props.handleDelete(i);
        this.setState({ query: "" });
    }

    handleChange(e) {
        if (this.props.handleInputChange){
            this.props.handleInputChange(e.target.value.trim())
        }

        var query = e.target.value.trim();
        var suggestions = this.filteredSuggestions(query, this.props.suggestions);

        this.setState({
            query: query,
            suggestions: suggestions
        });
    }

    handleKeyDown(e) {
        var { query, selectedIndex, suggestions } = this.state;

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

    addTag(tag) {
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

    handleSuggestionClick(i, e) {
        this.addTag(this.state.suggestions[i]);
    }

    handleSuggestionHover(i, e) {
        this.setState({
            selectedIndex: i,
            selectionMode: true
        });
    }

    moveTag(id, afterId) {
        var tags = this.props.tags;

        // locate tags
        var tag = tags.filter(t => t.id === id)[0];
        var afterTag = tags.filter(t => t.id === afterId)[0];

        // find their position in the array
        var tagIndex = tags.indexOf(tag);
        var afterTagIndex = tags.indexOf(afterTag);

        // call handler with current position and after position
        this.props.handleDrag(tag, tagIndex, afterTagIndex);
    }

    render() {
        var tagItems = this.props.tags.map(function(tag, i) {
            return <Tag key={tag.id}
                        tag={tag}
                        labelField={this.props.labelField}
                        onDelete={this.handleDelete.bind(this, i)}
                        moveTag={this.moveTag}/>
        }.bind(this));

        // get the suggestions for the given query
        var query = this.state.query.trim(),
            selectedIndex = this.state.selectedIndex,
            suggestions = this.state.suggestions,
            placeholder = this.props.placeholder;

        const tagInput =  (
            <div className="ReactTags__tagInput">
                <input ref="input"
                       type="text"
                       placeholder={placeholder}
                       onChange={this.handleChange}
                       onKeyDown={this.handleKeyDown}/>
                <Suggestions query={query}
                             suggestions={suggestions}
                             selectedIndex={selectedIndex}
                             handleClick={this.handleSuggestionClick}
                             handleHover={this.handleSuggestionHover}
                             minQueryLength={this.props.minQueryLength}/>
            </div>
        );

        return (
            <div className="ReactTags__tags">
                <div className="ReactTags__selected">
                    {tagItems}
                    {this.props.inline && tagInput}
                </div>
                {!this.props.inline && tagInput}
            </div>
        )
    }
}

ReactTags.propTypes =  {
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
}

ReactTags.defaultProps = {
    placeholder: 'Add new tag',
    tags: [],
    suggestions: [],
    delimeters: [Keys.ENTER, Keys.TAB],
    autofocus: true,
    inline: true,
    allowDeleteFromEmptyInput: true,
    minQueryLength: 2
}



module.exports = {
    WithContext: DragDropContext(HTML5Backend)(ReactTags),
    WithOutContext: ReactTags,
    Keys: Keys
};
