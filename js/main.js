/* ═══════════════════════════════════════════════
   IDUL FITRI 1447 H — Masud & Keluarga
   main.js — Pure Vanilla JS, no dependencies
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. LOADER + REVEAL SEQUENCE
───────────────────────────────────────────── */
window.addEventListener('load', function() {
    setTimeout(function() {
        // Sembunyikan loader
        document.getElementById('loader').classList.add('out');

        setTimeout(function() {
            // Tampilkan kartu dengan animasi
            var kartu = document.getElementById('kartu');
            kartu.classList.add('on');

            // Sesuaikan tinggi pulse rings dengan kartu
            setTimeout(function() {
                var h = kartu.offsetHeight;
                ['pr1', 'pr2', 'pr3'].forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) el.style.height = h + 'px';
                });
            }, 300);

            // Tampilkan tombol aksi
            setTimeout(function() {
                document.getElementById('actions').classList.add('on');
            }, 2900);

            // Ledakan kembang api
            setTimeout(fwBurst, 1300);
            setTimeout(fwBurst, 2500);
            setTimeout(fwBurst, 3700);

        }, 180);
    }, 3000);
});

/* ─────────────────────────────────────────────
   2. BACKGROUND STARFIELD CANVAS
───────────────────────────────────────────── */
(function() {
    var C = document.getElementById('bgCanvas');
    var ctx = C.getContext('2d');
    var W, H;

    function resize() {
        W = C.width = window.innerWidth;
        H = C.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Bintang */
    var STARS = Array.from({ length: 280 }, function() {
        return {
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.5 + 0.14,
            phase: Math.random() * Math.PI * 2,
            spd: Math.random() * 0.009 + 0.002,
            gold: Math.random() < 0.18,
        };
    });

    /* Bokeh glow */
    var BOKEH = [
        [0.18, 0.10, 170, 0.09],
        [0.82, 0.24, 100, 0.08],
        [0.50, 0.04, 210, 0.07],
        [0.30, 0.72, 85, 0.06],
        [0.72, 0.58, 120, 0.055],
        [0.42, 0.35, 62, 0.04],
    ];

    /* Bintang jatuh (shooting stars) */
    var shots = [];
    setInterval(function() {
        shots.push({
            x: W * (0.1 + Math.random() * 0.8),
            y: H * Math.random() * 0.43,
            len: 85 + Math.random() * 105,
            spd: 7 + Math.random() * 9,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.38,
            alpha: 1,
        });
    }, 2600);

    var t = 0;
    (function draw() {
        ctx.clearRect(0, 0, W, H);

        /* Langit gradient */
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#010b17');
        sky.addColorStop(0.5, '#06101f');
        sky.addColorStop(1, '#0c1d38');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        /* Bokeh */
        BOKEH.forEach(function(b) {
            var g = ctx.createRadialGradient(b[0] * W, b[1] * H, 0, b[0] * W, b[1] * H, b[2]);
            g.addColorStop(0, 'rgba(21,101,192,' + b[3] + ')');
            g.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(b[0] * W, b[1] * H, b[2], 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        });

        /* Bintang */
        STARS.forEach(function(s) {
            var a = 0.12 + 0.88 * Math.abs(Math.sin(t * s.spd + s.phase));
            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.gold ?
                'rgba(240,208,128,' + (a * 0.9) + ')' :
                'rgba(200,224,255,' + a + ')';
            ctx.fill();
        });

        /* Shooting stars */
        shots = shots.filter(function(s) { return s.alpha > 0.02; });
        shots.forEach(function(s) {
            var tx = s.x - s.len * Math.cos(s.angle);
            var ty = s.y - s.len * Math.sin(s.angle);
            var g = ctx.createLinearGradient(s.x, s.y, tx, ty);
            g.addColorStop(0, 'rgba(240,208,128,' + s.alpha + ')');
            g.addColorStop(1, 'rgba(240,208,128,0)');
            ctx.save();
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.restore();
            s.x += s.spd * Math.cos(s.angle);
            s.y += s.spd * Math.sin(s.angle);
            s.alpha -= 0.012;
        });

        t++;
        requestAnimationFrame(draw);
    })();
})();

/* ─────────────────────────────────────────────
   3. FIREWORKS CANVAS
───────────────────────────────────────────── */
(function() {
    var C = document.getElementById('fxCanvas');
    var ctx = C.getContext('2d');
    var W, H;

    function resize() {
        W = C.width = window.innerWidth;
        H = C.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var parts = [];

    var PAL = [
        [201, 168, 76],
        [240, 208, 128],
        [66, 165, 245],
        [144, 202, 249],
        [255, 246, 224],
        [255, 200, 100],
        [100, 181, 246],
        [255, 240, 150],
    ];

    function explode(x, y) {
        var c1 = PAL[Math.floor(Math.random() * PAL.length)];
        var c2 = PAL[Math.floor(Math.random() * PAL.length)];
        var n = 65 + Math.floor(Math.random() * 30);

        for (var i = 0; i < n; i++) {
            var a = (i / n) * Math.PI * 2 + Math.random() * 0.28;
            var spd = 2.5 + Math.random() * 5.5;
            var col = Math.random() < 0.5 ? c1 : c2;
            parts.push({
                x: x,
                y: y,
                vx: Math.cos(a) * spd,
                vy: Math.sin(a) * spd,
                col: col,
                life: 55 + Math.floor(Math.random() * 35),
                maxLife: 90,
                r: 2.4 + Math.random() * 1.6,
                trail: [],
                flash: false,
            });
        }

        /* Flash di pusat ledakan */
        parts.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            col: [255, 248, 200],
            life: 16,
            maxLife: 16,
            r: 10,
            trail: [],
            flash: true,
        });
    }

    /* Fungsi global dipanggil dari sequence */
    window.fwBurst = function() {
        var locs = [
            [W * (0.18 + Math.random() * 0.18), H * (0.12 + Math.random() * 0.24)],
            [W * (0.45 + Math.random() * 0.12), H * (0.08 + Math.random() * 0.20)],
            [W * (0.65 + Math.random() * 0.18), H * (0.12 + Math.random() * 0.26)],
        ];
        locs.forEach(function(loc) { explode(loc[0], loc[1]); });
    };

    /* Kembang api otomatis setiap 6–11 detik */
    (function sched() {
        setTimeout(function() { fwBurst();
            sched(); }, 6000 + Math.random() * 5000);
    })();

    /* Render loop kembang api */
    (function drawFx() {
        ctx.clearRect(0, 0, W, H);

        for (var i = parts.length - 1; i >= 0; i--) {
            var p = parts[i];
            var prog = 1 - p.life / p.maxLife;
            var al = p.life / p.maxLife;

            if (p.flash) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (1 + prog * 4), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.col.join(',') + ',' + (al * 0.85) + ')';
                ctx.fill();
                ctx.restore();
            } else {
                /* Jejak partikel */
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 5) p.trail.shift();

                if (p.trail.length > 1) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(' + p.col.join(',') + ',' + (al * 0.3) + ')';
                    ctx.lineWidth = p.r * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(p.trail[0].x, p.trail[0].y);
                    p.trail.forEach(function(tp) { ctx.lineTo(tp.x, tp.y); });
                    ctx.stroke();
                    ctx.restore();
                }

                /* Bola partikel */
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (1 - prog * 0.45), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.col.join(',') + ',' + al + ')';
                ctx.fill();
                ctx.restore();
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.065; /* gravitasi */
            p.vx *= 0.979; /* hambatan udara */
            p.vy *= 0.979;
            p.life--;

            if (p.life <= 0) parts.splice(i, 1);
        }

        requestAnimationFrame(drawFx);
    })();
})();

/* ─────────────────────────────────────────────
   4. FLOATING PARTICLES (Lentera & Bintang)
───────────────────────────────────────────── */
(function() {
    var wrap = document.getElementById('particles');
    var items = ['🏮', '🌙', '⭐', '✨', '🌟', '💫', '🏮', '🌙', '⭐', '✨', '🌟', '💫'];

    function spawn() {
        var el = document.createElement('div');
        el.className = 'par';
        el.textContent = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 1.6 + 0.65) + 'rem';
        var dur = 11 + Math.random() * 13;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = Math.random() * 4 + 's';
        wrap.appendChild(el);
        setTimeout(function() { el.remove(); }, (dur + 5) * 1000);
    }

    for (var i = 0; i < 14; i++) {
        (function(idx) { setTimeout(spawn, idx * 420); })(i);
    }
    setInterval(spawn, 1600);
})();

/* ─────────────────────────────────────────────
   5. BINTANG BERKELIP DI HEADER KARTU
───────────────────────────────────────────── */
(function() {
    var wrap = document.getElementById('hStars');
    if (!wrap) return;

    var positions = [
        [8, 22],
        [17, 60],
        [26, 14],
        [37, 75],
        [46, 32],
        [54, 82],
        [64, 18],
        [72, 64],
        [81, 28],
        [90, 50],
        [95, 72],
        [3, 78],
        [50, 50]
    ];

    positions.forEach(function(pos) {
        var el = document.createElement('div');
        el.className = 'hstar';
        el.textContent = Math.random() < 0.5 ? '✦' : '★';
        el.style.left = pos[0] + '%';
        el.style.top = pos[1] + '%';
        el.style.animationDuration = (1.4 + Math.random() * 2.2) + 's';
        el.style.animationDelay = (Math.random() * 2.5) + 's';
        wrap.appendChild(el);
    });
})();

/* ─────────────────────────────────────────────
   6. CONFETTI (3 gelombang)
───────────────────────────────────────────── */
(function() {
    var colors = ['#C9A84C', '#F0D080', '#42A5F5', '#90CAF9', '#fffbe0', '#fff', '#FFF3CD', '#64B5F6', '#FFD700'];
    var shapes = ['■', '●', '◆', '★', '▲', '✦', '✿', '⬟', '❋'];

    function burst(n) {
        for (var i = 0; i < n; i++) {
            (function() {
                setTimeout(function() {
                    var el = document.createElement('div');
                    el.className = 'cf';
                    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                    el.style.left = Math.random() * 100 + 'vw';
                    el.style.color = colors[Math.floor(Math.random() * colors.length)];
                    el.style.fontSize = (Math.random() * 11 + 4) + 'px';
                    var dur = 2.2 + Math.random() * 2.8;
                    el.style.animationDuration = dur + 's';
                    el.style.animationDelay = Math.random() * 1.8 + 's';
                    document.body.appendChild(el);
                    setTimeout(function() { el.remove(); }, (dur + 2) * 1000);
                }, Math.random() * 700);
            })();
        }
    }

    /* 3 gelombang setelah loader hilang */
    setTimeout(function() {
        burst(110);
        setTimeout(function() { burst(80); }, 1900);
        setTimeout(function() { burst(60); }, 4000);
    }, 2400);
})();

/* ─────────────────────────────────────────────
   7. FUNGSI BAGIKAN
───────────────────────────────────────────── */
var PAGE_URL = window.location.href;

function doShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Kartu Idul Fitri 1447 H dari Masud & Keluarga',
            text: 'Minal Aidin Wal Faizin 🌙 Mohon Maaf Lahir & Batin',
            url: PAGE_URL,
        }).catch(function() { copyURL(); });
    } else {
        copyURL();
    }
}

function doWhatsApp() {
    var msg = "Assalamu'alaikum Warahmatullahi Wabarakatuh 🌙\n\n" +
        "*Selamat Hari Raya Idul Fitri 1447 H*\n\n" +
        "Minal Aidin Wal Faizin 🤲\n" +
        "Mohon Maaf Lahir & Batin\n\n" +
        "_Dari: Masud & Keluarga_\n\n" +
        PAGE_URL;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function copyURL() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(PAGE_URL)
            .then(function() { showToast('📋 Link berhasil disalin!'); })
            .catch(function() { fallbackCopy(); });
    } else {
        fallbackCopy();
    }
}

function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = PAGE_URL;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 Link berhasil disalin!');
}

/* ─────────────────────────────────────────────
   8. TOAST NOTIFIKASI
───────────────────────────────────────────── */
var toastTimer;

function showToast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        el.classList.remove('show');
    }, 3000);
}
