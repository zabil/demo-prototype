m = require('mithril');
ace = require('brace');

require('brace/mode/markdown');
require('brace/ext/language_tools');

module.exports = {
    load: function () {
        var editor = this.editor = ace.edit("editor");
        editor.$blockScrolling = Infinity;

        editor.setOptions({
            fontSize: "16px",
            enableBasicAutocompletion: true
        });

        editor.session.setMode("ace/mode/markdown");

        var staticWordCompleter = {
            getCompletions: function (editor, session, pos, prefix, callback) {
                m.request({
                    method: 'GET',
                    url: '/steps',
                    data: {filter: prefix}
                }).then(function (lines) {
                    callback(null, lines.map(function (line) {
                        return {
                            caption: line,
                            value: line,
                            meta: "static"
                        };
                    }));
                })
            }
        };

        editor.completers = [staticWordCompleter];
        editor.focus();
    },
    setValue: function (text) {
        this.editor.getSession().setValue(text);
    }
};