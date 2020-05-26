// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

var cloudRadians = Math.PI / 180,
    cw = 1 << 11 >> 5,
    ch = 1 << 11;

function onEnd(cloud, tags, bounds) {
    // drawing here
    var w = bounds[1].x - bounds[0].x;
    var h = bounds[1].y - bounds[0].y;
    var arr = ['<svg width="' + w + '" height="' + h + '"><g transform="translate(' + [w >> 1, h >> 1] + ')">'];

    for (var i = 0; i < tags.length; i++) {
        arr.push('<text font-family="' + tags[i].font + '" font-size="' + tags[i].size + 'px" fill="red" text-anchor="middle" transform="translate(' + [tags[i].x, tags[i].y] + ') rotate(' + tags[i].rotate + ')">' + tags[i].text + '</text>');
    }

    arr.push('</g></svg>');
    document.querySelector(svg_location).innerHTML = arr.join('');
}

function onWord(cloud, d) {
    // console.log(d);
}

function WordCloud() {
    var size = [256, 256],
        text = cloudText,
        font = cloudFont,
        fontSize = cloudFontSize,
        fontStyle = cloudFontNormal,
        fontWeight = cloudFontNormal,
        rotate = cloudRotate,
        padding = cloudPadding,
        spiral = archimedeanSpiral,
        words = [],
        timeInterval = Infinity,
        timer = null,
        random = Math.random,
        cloud = {},
        canvas = cloudCanvas;

    cloud.canvas = function (_) {
        return arguments.length ? (canvas = functor(_), cloud) : canvas;
    };

    cloud.start = function () {
        var contextAndRatio = getContext(canvas()),
            board = zeroArray((size[0] >> 5) * size[1]),
            bounds = null,
            n = words.length,
            i = -1,
            tags = [],
            data = words.map(function (d, i) {
                d.text = text.call(this, d, i);
                d.font = font.call(this, d, i);
                d.style = fontStyle.call(this, d, i);
                d.weight = fontWeight.call(this, d, i);
                d.rotate = rotate.call(this, d, i);
                d.size = ~~fontSize.call(this, d, i);
                d.padding = padding.call(this, d, i);
                return d;
            }).sort(function (a, b) { return b.size - a.size; });

        if (timer) clearInterval(timer);
        timer = setInterval(step, 0);
        step();

        return cloud;

        function step() {
            var start = Date.now();
            while (Date.now() - start < timeInterval && ++i < n && timer) {
                var d = data[i];
                d.x = (size[0] * (random() + .5)) >> 1;
                d.y = (size[1] * (random() + .5)) >> 1;
                cloudSprite(contextAndRatio, d, data, i);
                if (d.hasText && place(board, d, bounds)) {
                    tags.push(d);
                    onWord(cloud, d);
                    if (bounds) cloudBounds(bounds, d);
                    else bounds = [{ x: d.x + d.x0, y: d.y + d.y0 }, { x: d.x + d.x1, y: d.y + d.y1 }];
                    // Temporary hack
                    d.x -= size[0] >> 1;
                    d.y -= size[1] >> 1;
                }
            }
            if (i >= n) {
                cloud.stop();
                onEnd(cloud, tags, bounds);
            }
        }
    }

    cloud.stop = function () {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        return cloud;
    };

    function getContext(canvas) {
        canvas.width = canvas.height = 1;
        var ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
        canvas.width = (cw << 5) / ratio;
        canvas.height = ch / ratio;

        var context = canvas.getContext("2d");
        context.fillStyle = context.strokeStyle = "red";
        context.textAlign = "center";

        return { context: context, ratio: ratio };
    }

    function place(board, tag, bounds) {
        var perimeter = [{ x: 0, y: 0 }, { x: size[0], y: size[1] }],
            startX = tag.x,
            startY = tag.y,
            maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
            s = spiral(size),
            dt = random() < .5 ? 1 : -1,
            t = -dt,
            dxdy,
            dx,
            dy;

        while (dxdy = s(t += dt)) {
            dx = ~~dxdy[0];
            dy = ~~dxdy[1];

            if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;

            tag.x = startX + dx;
            tag.y = startY + dy;

            if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
                tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
            // TODO only check for collisions within current bounds.
            if (!bounds || !cloudCollide(tag, board, size[0])) {
                if (!bounds || collideRects(tag, bounds)) {
                    var sprite = tag.sprite,
                        w = tag.width >> 5,
                        sw = size[0] >> 5,
                        lx = tag.x - (w << 4),
                        sx = lx & 0x7f,
                        msx = 32 - sx,
                        h = tag.y1 - tag.y0,
                        x = (tag.y + tag.y0) * sw + (lx >> 5),
                        last;
                    for (var j = 0; j < h; j++) {
                        last = 0;
                        for (var i = 0; i <= w; i++) {
                            board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                        }
                        x += sw;
                    }
                    delete tag.sprite;
                    return true;
                }
            }
        }
        return false;
    }

    cloud.timeInterval = function (_) {
        return arguments.length ? (timeInterval = _ == null ? Infinity : _, cloud) : timeInterval;
    };

    cloud.words = function (_) {
        return arguments.length ? (words = _, cloud) : words;
    };

    cloud.size = function (_) {
        return arguments.length ? (size = [+_[0], +_[1]], cloud) : size;
    };

    cloud.font = function (_) {
        return arguments.length ? (font = functor(_), cloud) : font;
    };

    cloud.fontStyle = function (_) {
        return arguments.length ? (fontStyle = functor(_), cloud) : fontStyle;
    };

    cloud.fontWeight = function (_) {
        return arguments.length ? (fontWeight = functor(_), cloud) : fontWeight;
    };

    cloud.rotate = function (_) {
        return arguments.length ? (rotate = functor(_), cloud) : rotate;
    };

    cloud.text = function (_) {
        return arguments.length ? (text = functor(_), cloud) : text;
    };

    cloud.spiral = function (_) {
        return arguments.length ? (spiral = spirals[_] || _, cloud) : spiral;
    };

    cloud.fontSize = function (_) {
        return arguments.length ? (fontSize = functor(_), cloud) : fontSize;
    };

    cloud.padding = function (_) {
        return arguments.length ? (padding = functor(_), cloud) : padding;
    };

    cloud.random = function (_) {
        return arguments.length ? (random = _, cloud) : random;
    };

    return cloud;
};

function cloudText(d) {
    return d.text;
}

function cloudFont() {
    return "serif";
}

function cloudFontNormal() {
    return "normal";
}

function cloudFontSize(d) {
    return Math.sqrt(d.value);
}

function cloudRotate() {
    return (~~(Math.random() * 6) - 3) * 30;
}

function cloudPadding() {
    return 1;
}

// Fetches a monochrome sprite bitmap for the specified text.
// Load in batches for speed.
function cloudSprite(contextAndRatio, d, data, di) {
    if (d.sprite) return;
    var c = contextAndRatio.context,
        ratio = contextAndRatio.ratio;

    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
    var x = 0,
        y = 0,
        maxh = 0,
        n = data.length;
    --di;
    while (++di < n) {
        d = data[di];
        c.save();
        c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
        var w = c.measureText(d.text + "m").width * ratio,
            h = d.size << 1;
        if (d.rotate) {
            var sr = Math.sin(d.rotate * cloudRadians),
                cr = Math.cos(d.rotate * cloudRadians),
                wcr = w * cr,
                wsr = w * sr,
                hcr = h * cr,
                hsr = h * sr;
            w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
            h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
        } else {
            w = (w + 0x1f) >> 5 << 5;
        }
        if (h > maxh) maxh = h;
        if (x + w >= (cw << 5)) {
            x = 0;
            y += maxh;
            maxh = 0;
        }
        if (y + h >= ch) break;
        c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
        if (d.rotate) c.rotate(d.rotate * cloudRadians);
        c.fillText(d.text, 0, 0);
        if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
        c.restore();
        d.width = w;
        d.height = h;
        d.xoff = x;
        d.yoff = y;
        d.x1 = w >> 1;
        d.y1 = h >> 1;
        d.x0 = -d.x1;
        d.y0 = -d.y1;
        d.hasText = true;
        x += w;
    }
    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
        sprite = [];
    while (--di >= 0) {
        d = data[di];
        if (!d.hasText) continue;
        var w = d.width,
            w32 = w >> 5,
            h = d.y1 - d.y0;
        // Zero the buffer
        for (var i = 0; i < h * w32; i++) sprite[i] = 0;
        x = d.xoff;
        if (x == null) return;
        y = d.yoff;
        var seen = 0,
            seenRow = -1;
        for (var j = 0; j < h; j++) {
            for (var i = 0; i < w; i++) {
                var k = w32 * j + (i >> 5),
                    m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
                sprite[k] |= m;
                seen |= m;
            }
            if (seen) seenRow = j;
            else {
                d.y0++;
                h--;
                j--;
                y++;
            }
        }
        d.y1 = d.y0 + seenRow;
        d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
    }
}

// Use mask-based collision detection.
function cloudCollide(tag, board, sw) {
    sw >>= 5;
    var sprite = tag.sprite,
        w = tag.width >> 5,
        lx = tag.x - (w << 4),
        sx = lx & 0x7f,
        msx = 32 - sx,
        h = tag.y1 - tag.y0,
        x = (tag.y + tag.y0) * sw + (lx >> 5),
        last;
    for (var j = 0; j < h; j++) {
        last = 0;
        for (var i = 0; i <= w; i++) {
            if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
                & board[x + i]) return true;
        }
        x += sw;
    }
    return false;
}

function cloudBounds(bounds, d) {
    var b0 = bounds[0],
        b1 = bounds[1];
    if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
    if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
    if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
    if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
}

function collideRects(a, b) {
    return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
}

function archimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function (t) {
        return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
    };
}

function rectangularSpiral(size) {
    var dy = 4,
        dx = dy * size[0] / size[1],
        x = 0,
        y = 0;
    return function (t) {
        var sign = t < 0 ? -1 : 1;
        // See triangular numbers: T_n = n * (n + 1) / 2.
        switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
            case 0: x += dx; break;
            case 1: y += dy; break;
            case 2: x -= dx; break;
            default: y -= dy; break;
        }
        return [x, y];
    };
}

// TODO reuse arrays?
function zeroArray(n) {
    var a = [],
        i = -1;
    while (++i < n) a[i] = 0;
    return a;
}

function cloudCanvas() {
    return document.createElement("canvas");
}

function functor(d) {
    return typeof d === "function" ? d : function () { return d; };
}

var spirals = {
    archimedean: archimedeanSpiral,
    rectangular: rectangularSpiral
};


var instance = new WordCloud();
var text_string = `About a dozen states are seeing an uptick in new coronavirus cases, even as all 50 states move to reopen in some way. States that reopened earlier — or never fully shut down — are among those showing signs of further spread.

Alabama, Florida, Georgia, North Carolina and Tennessee are among the states that have had recent growth in newly reported new cases, several weeks after moving to reopen.Arkansas and North Dakota, two states that shut down businesses but did not issue formal stay - at - home orders, are also reporting an increase in cases.

The Washington D.C., region, which has been locked down for weeks, also saw a jump in new cases as the city approaches a planned reopening on Friday.

The new numbers could reflect increased testing capacity in some places, though it is also an indication that the virus’s grip on the country is far from over.Experts have warned that opening too early could lead to a second wave. 
The latest figures come as the overall pace of new cases and deaths slows in the United States, and some Americans are relaxing social distancing, in crowds at pools and parties over Memorial Day weekend.

Some of the hardest hit states, like New York and New Jersey, have reported steep downward trendlines. Other states, from Oregon to Pennsylvania, are also showing signs of progress.
The stock trading floor of the New York Stock Exchange reopened on Tuesday, though at a reduced head count in order to allow space for social distancing measures to remain in force. The governor rang the opening bell to mark the start of trading at 9:30 a.m.

Floor brokers and trading floor officials will be allowed back, while designated market makers — the specialist traders who buy and sell in order to “make markets” in certain securities — will continue to operate remotely.`;

var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

var word_count = {};

var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
if (words.length == 1) {
    word_count[words[0]] = 1;
} else {
    words.forEach(function (word) {
        var word = word.toLowerCase();
        if (word != "" && common.indexOf(word) == -1 && word.length > 1) {
            if (word_count[word]) {
                word_count[word]++;
            } else {
                word_count[word] = 1;
            }
        }
    })
}

function entries(obj) {
    var keys = Object.getOwnPropertyNames(obj);
    var res = [];
    for (var i = 0; i < keys.length; i++) {
        res.push({
            key: keys[i],
            value: i
        });
    }
    return res;
}

var svg_location = "#chart";
var width = window.innerWidth;
var height = window.innerHeight;

function xScale(v) {
    var res = Math.random() * v;
    if (res > 100) {
        res = 100;
    }
    if (res < 10) {
        res = 10;
    }
    return res;
}

var instance = new WordCloud();
instance.size([width, height])
        .words(entries(word_count))
        .timeInterval(20)
        .fontSize(function (d) { return xScale(+d.value); })
        .text(function (d) { return d.key; })
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .start();