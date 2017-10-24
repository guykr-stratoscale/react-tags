var React = require('react');
var PropTypes = require('prop-types')

class Suggestions extends React.Component {

    markIt(input, query) {
        var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
        var r = RegExp(escapedRegex, "gi");
        return {
          __html: input.replace(r, "<mark>$&</mark>")
        }
    }

    render() {
        var props = this.props;
        var suggestions = this.props.suggestions.map(function(item, i) {
            return (
                <li key={i}
                    onClick={props.handleClick.bind(null, i)}
                    onMouseOver={props.handleHover.bind(null, i)}
                    className={i == props.selectedIndex ? "active" : ""}>
                    <span dangerouslySetInnerHTML={this.markIt(item, props.query)} />
                 </li>
            )
        }.bind(this));

        var minQueryLength = props.minQueryLength || 2;
        if (suggestions.length === 0 || props.query.length < minQueryLength) {
            return <div className="ReactTags__suggestions"> </div>
        }

        return (
            <div className="ReactTags__suggestions">
                <ul> { suggestions } </ul>
            </div>
        )
    }

}

Suggestions.propTypes = {
        query: PropTypes.string.isRequired,
        selectedIndex: PropTypes.number.isRequired,
        suggestions: PropTypes.array.isRequired,
        handleClick: PropTypes.func.isRequired,
        handleHover: PropTypes.func.isRequired,
        minQueryLength: PropTypes.number
    },

module.exports = Suggestions;
