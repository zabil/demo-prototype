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
                console.log(text);
                Data.specification.text = text;
            })
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

m.route(document.getElementById("main"), '/specifications', {
    '/specifications': Specifications,
    '/specifications/:file': Specifications
});