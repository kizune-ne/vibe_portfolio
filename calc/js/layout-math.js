

function roundTo30K(price) { if (isNaN(price) || price <= 0) return 0; let k = Math.round(price * 100); if (k > 0) { let rem = k % 30; k += (rem >= 15) ? (30 - rem) : -rem; } return k / 100; }

function getSheetProps(sheetStr) { if (!sheetStr) sheetStr = "450x320"; const parts = sheetStr.split('x'); const w = parseInt(parts[0]), h = parseInt(parts[1]); const isHalf = (w * h) <= 75000; return { w, h, isHalf, mult: isHalf ? 0.5 : 1 }; }

function calcLayout(sheetW, sheetH, margin, itemW, itemH, allowMixed = false) {
            const pW = sheetW - (margin * 2); const pH = sheetH - (margin * 2); const iW = margin === 0 ? itemW : itemW + 4; const iH = margin === 0 ? itemH : itemH + 4;
            let best = { total: 0, x: 0, y: 0, w: pW, h: pH, labelW: pW + " мм", labelH: pH + " мм", mix: false };
            const checkStandard = (w, h) => { let x = Math.floor(pW / w), y = Math.floor(pH / h); if (x * y >= best.total) { best = { total: x * y, x, y, w: pW, h: pH, labelW: pW + " мм", labelH: pH + " мм", mix: false, w1: w, h1: h }; } };
            checkStandard(iW, iH); checkStandard(iH, iW);
            if (allowMixed) {
                let bestMixed = null;
                const checkMixed = (w1, h1, w2, h2) => {
                    let nx = Math.floor(pW / w1), ny = Math.floor(pH / h1); let m1 = nx * ny; if (m1 === 0) return;
                    let rx = Math.floor((pW - nx * w1) / w2), ry = Math.floor(pH / h2); let rTot = m1 + (rx * ry);
                    let bx = Math.floor(pW / w2), by = Math.floor((pH - ny * h1) / h2); let bTot = m1 + (bx * by);
                    if (rTot > best.total && rTot >= bTot) { best.total = rTot; bestMixed = { mix: true, nx, ny, w1, h1, rx, ry, w2, h2, remType: 'right', total: rTot, w: pW, h: pH, labelW: pW + " мм", labelH: pH + " мм" }; }
                    if (bTot > best.total && bTot > rTot) { best.total = bTot; bestMixed = { mix: true, nx, ny, w1, h1, bx, by, w2, h2, remType: 'bottom', total: bTot, w: pW, h: pH, labelW: pW + " мм", labelH: pH + " мм" }; }
                };
                checkMixed(iW, iH, iH, iW); checkMixed(iH, iW, iW, iH);
                if (bestMixed) best = bestMixed;
            }
            return best;
        }


