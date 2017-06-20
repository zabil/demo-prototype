const m = require('mithril')
const monaco = require("./monaco");

var Data = {
    specifications: {
        list: [],
        isEmpty: function () {
            return Data.specifications.list.length === 0;
        },
        fetch: function (callback) {
            return new Promise(function(resolve, reject){
                if (Data.specifications.isEmpty()) {
                    m.request({
                        method: 'GET',
                        url: 'specifications'
                    }).then(function (specifications) {
                        Data.specifications.list = specifications;
                        resolve(specifications[0]);
                    })
                } else {
                    resolve(Data.specifications.list[0]);
                }
            });
        }
    },
    specification: {
        text: '',
        current: '',
        fetch: function (file) {
            if (Data.specification.current !== file) {
                m.request({
                    method: 'GET',
                    url: 'specification/:file',
                    data: {file: file},
                    deserialize: function (value) {
                        return value
                    }
                }).then(function (text) {
                    Data.specification.current = file;
                    monaco.setValue(text);
                });
            }
        }
    }
};

var Specification = {
    onupdate: function (vnode) {
        Data.specification.fetch(vnode.attrs.file);
    },
    oninit: function () {
        monaco.init()
        .then(Data.specifications.fetch)
        .then(function (first_spec) {
            m.route.set('/' + first_spec);
        });
    },
    view: function (vnode) {
        return [
            m('div#navigator', [
                m('div.logo',
                    m('img', {src: 'images/logo.svg', height: 38, width: 100})),
                m("ul",
                    m("li", Data.specifications.list.map(function (specification) {
                        return m("a", {
                            href: "/" + specification,
                            class: vnode.attrs.file === specification ? 'active' : '',
                            oncreate: m.route.link
                        }, specification);
                    })))]),
            m('div#action', [
                m('h3', vnode.attrs.file),
                m('button', 'Save')]),
            m('pre#editor')];
    }
};

m.route(document.getElementById("main"), '/', {
    '/': Specification,
    '/:file': Specification,
});