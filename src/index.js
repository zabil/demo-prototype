m = require('mithril');
ace = require('brace');
require('brace/mode/markdown');
require('brace/ext/language_tools');

var state = {}

function loadEditor() {
    var editor = state.editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    editor.setOptions({
        fontSize: "16px",
        enableBasicAutocompletion: true
    });

    editor.session.setMode("ace/mode/markdown");

    var staticWordCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            m.request({
                method: 'POST',
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
    }

    editor.commands.addCommand({
        name: "showFileSelector",
        bindKey: {win: "Ctrl-e", mac: "Command-e"},
        exec: function () {
            m.route.set('/specifications');
        }
    });

    editor.completers = [staticWordCompleter];
    editor.focus();
}

var Data = {
    specifications: {
        list: [],
        fetch: function () {
            if (Data.specifications.list.length === 0) {
                m.request({
                    method: 'GET',
                    url: 'specifications'
                }).then(function (specifications) {
                    Data.specifications.list = specifications;
                })
            }
        }
    },
    specification: {
        text: '',
        fetch: function (file) {
            if (file) {
                m.request({
                    method: 'GET',
                    url: 'specification/' + file,
                    deserialize: function (value) {
                        return value
                    }
                }).then(function (text) {
                    state.editor.getSession().setValue(text);
                });
            }
        }
    }
};

var Specifications = {
    oninit: Data.specifications.fetch,
    view: function () {
        return [
            m('button', {
                onclick: function () {
                    m.route.set('/specification')
                }
            }, 'Create new'),
            m('p', 'Or'),
            m('h3', 'Select a specification file'),
            m("ul", m("li", Data.specifications.list.map(function (specification) {
                return m("a", {
                    href: "/specification/" + specification,
                    oncreate: m.route.link
                }, specification);
            })))];
    }
};

var Specification = {
    oninit: function (vnode) {
        Data.specification.fetch(vnode.attrs.file);
    },
    oncreate: loadEditor,
    view: function () {
        return m('pre#editor');
    }
};

m.route(document.getElementById("main"), '/specifications', {
    '/specifications': Specifications,
    '/specification/:file': Specification,
    '/specification': Specification
});