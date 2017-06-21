const m = require('mithril');

var loader = function() {
    return new Promise(function(resolve, reject){
        var onLoaderResolved = () => {
            window.require(['vs/editor/editor.main'], () => {
                resolve();
            });
        };
        if(!window.require){
            var loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'vs/loader.js';
            loaderScript.addEventListener('load', onLoaderResolved);
            document.body.appendChild(loaderScript);
        } else{
            onLoaderResolved();
        }
    });
}

var init = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        loader()
        .then(() => {
            self.editor = monaco.editor.create(document.getElementById('editor'), {
                language: 'markdown',
                automaticLayout: true,
                fontSize: 16
            });
            monaco.languages.registerCompletionItemProvider('markdown', {
                provideCompletionItems : function(model, position) {
                    var prefix = model.getLineContent(position.lineNumber);
                    if(prefix.startsWith('* ')){
                        return m.request({
                            method: 'GET',
                            url: '/steps',
                            data: {filter: prefix}
                        })
                        .then(function (lines) {
                            return lines.map(function(l){
                                var counter=0;
                                var suggestion = l.replace(/\{\}/g, () => '{{param'+ ++counter + '}}');
                                return {
                                    label: l,
                                    kind: monaco.languages.CompletionItemKind.Snippet,
                                    insertText: suggestion
                                }
                            });
                        });
                    }
                    return [];
                },
            });
            resolve();
        }).catch(reject);
    });
};

var setValue = function(text) {
    if(this.editor)
        this.editor.setValue(text);
}

var getValue = function(text) {
    if(this.editor)
        return this.editor.getValue();
}

module.exports = {
    init: init,
    setValue: setValue,
    getValue: getValue
}
