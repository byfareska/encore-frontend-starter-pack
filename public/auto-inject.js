const pushers = {
    js: url => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    },
    css: url => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    },
};

const pushToHtml = (type, urls) => {
    if (typeof pushers[type] === "undefined") {
        console.log(`No pusher defined for ${type}`);
        return;
    }

    urls.forEach(url => pushers[type](url));
};

const entriesToInject = document.currentScript.dataset.inject.split(" ");

fetch(`/build/entrypoints.json?_nocache=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        entriesToInject.forEach(entry => {
            Object.entries(data.entrypoints[entry] ?? [])
                .forEach(([type, urls]) => pushToHtml(type, urls))
        })
    });
