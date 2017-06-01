var state = {
}

function loadEditor() {
    var editor = state.editor = ace.edit("editor");

    editor.setOptions({
        fontSize: "18px",
        enableBasicAutocompletion: true
    });

    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/markdown");

    var staticWordCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            var wordList = ["Login as <name>", "Search for <book>", "Add <book> to the shopping cart"];
            callback(null, wordList.map(function (word) {
                return {
                    caption: word,
                    value: word,
                    meta: "static"
                };
            }));
        }
    }

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
        fetch: function (vnode) {
            m.request({
                method: 'GET',
                url: 'specification/' + vnode.attrs.file,
                deserialize: function (value) {
                    return value
                }
            }).then(function (text) {
                state.editor.getSession().setValue(text);
            });
        }
    }
}

var Specifications = {
    oninit: Data.specifications.fetch,
    view: function () {
        return [m('h3', 'Select a specification file'), m("ul", m("li", Data.specifications.list.map(function (specification) {
            return m("a", {
                href: "/specifications/" + specification,
                oncreate: m.route.link
            }, specification);
        })))];
    }
}

var Specification = {
    oninit: Data.specification.fetch,
    oncreate: loadEditor,
    view: function () {
        console.log("The text" + Data.specification.text);
        return m('pre#editor');
    }
}

m.route(document.getElementById("main"), '/specifications', {
    '/specifications': Specifications,
    '/specifications/:file': Specification
});