// https://www.cnblogs.com/lvonve/p/10821703.html
let ul = document.getElementsByTagName('ul')[0];

function vanish() {
    html2canvas(ul).then(function (canvas) {
        const {
            width,
            height
        } = canvas;
        let ctx = canvas.getContext('2d');
        let originalFrame = ctx.getImageData(0, 0, width, height);
        let frames = [];
        const COUNT = 32;
        for (let i = 0; i < COUNT; i++) {
            frames[i] = ctx.createImageData(width, height);
        }

        let x;
        let y;
        let offset;
        for (x = 0; x < width; ++x) {
            for (y = 0; y < height; ++y) {
                let frameIndex = Math.floor((COUNT * (Math.random() + (2 * x) / width)) / 3);
                let pixelIndex = 4 * (y * width + x);
                for (offset = 0; offset < 4; offset++) {
                    frames[frameIndex].data[pixelIndex + offset] = originalFrame.data[pixelIndex + offset];
                }
            }
        }

        let container = document.createElement('div');
        let content = document.getElementsByClassName('content')[0];
        container.className = 'canvas-wrapper';
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        let frames2doms = frames.map((frameData, i) => {
            let domCopy = canvas.cloneNode(true);
            domCopy.getContext('2d').putImageData(frameData, 0, 0);
            domCopy.style.transitionDelay = `${(1.35 * i) / frames.length}s`;
            container.appendChild(domCopy);
            return domCopy;
        });
        content.appendChild(container);
        container.offsetLeft;
        ul.classList.add('hide');
        frames2doms.forEach(item => {
            let random = 2 * Math.PI * (Math.random() - 0.5);
            item.style.transform = ` 
            rotate(${15 * (Math.random() - 0.5)}deg)
            translate(${60 * Math.cos(random)}px, ${30 * Math.sin(random)}px)
            rotate(${-15 * (Math.random() - 0.5)}deg) 
          `;
            item.style.opacity = 0;
        });
    });
}

ul.addEventListener('mouseenter', vanish);