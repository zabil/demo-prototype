var Data = {
    specifications: {
        list: [],
        fetch: function () {
            m.request({
                method: 'GET',
                url: 'specs'
            }).then(function (specifications) {
                Data.specifications.list = specifications;
            })
        }
    }
}

var Specifications = {
    oninit: Data.specifications.fetch,
    view: function () {
        return m("ul", m("li", Data.specifications.list.map(function (specification) {
            return m("a", {href: "#!/hello"}, specification);
        })));
    }
}