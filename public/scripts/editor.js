var editor = ace.edit("editor");

editor.setOptions({
    fontSize: "18px",
    enableBasicAutocompletion: true,
    printMargin: false
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