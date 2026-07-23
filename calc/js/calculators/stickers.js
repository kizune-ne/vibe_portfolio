



function calculateStickerPrice() {
            window.currentCalcData = null; const valW = document.getElementById('stickWidth').value, valH = document.getElementById('stickHeight').value, valQty = document.getElementById('stickQuantity').value; if (!valW || !valH || !valQty) { document.getElementById('stickPricePerPiece').style.display = 'none'; return; }
            const w = parseInt(valW), h = parseInt(valH), qty = parseInt(valQty); const sProps = getSheetProps(document.getElementById('stickSheetSelect').getAttribute('data-value')); 
            const bleedInput = document.getElementById('stickBleed'); const bleed = bleedInput ? parseFloat(bleedInput.value) || 0 : 1;
            const techW = w + (bleed * 2), techH = h + (bleed * 2);
            let shortSide = Math.min(sProps.w, sProps.h); let longSide = Math.max(sProps.w, sProps.h);
            let pW_P = shortSide - 14, pH_P = longSide - 34;
            let pW_L = longSide - 34, pH_L = shortSide - 14;
            let resP = { count: Math.max(0, Math.floor(pW_P / techW) * Math.floor(pH_P / techH)), x: Math.floor(pW_P / techW), y: Math.floor(pH_P / techH), w: pW_P, h: pH_P, name: "Книжный лист", id: 'portrait' };
            let resL = { count: Math.max(0, Math.floor(pW_L / techW) * Math.floor(pH_L / techH)), x: Math.floor(pW_L / techW), y: Math.floor(pH_L / techH), w: pW_L, h: pH_L, name: "Альбомный лист", id: 'landscape' };
            window.stickActiveOrientation = window.stickActiveOrientation || (resP.count >= resL.count ? 'portrait' : 'landscape');
            let best = window.stickActiveOrientation === 'portrait' ? resP : resL;
            if (!best || !best.count) { document.getElementById('stickPricePerPiece').style.display = 'none'; return; }
            let sheets = Math.ceil(qty / (best.count || 1)); let colorVal = document.getElementById('stickColorSelect').getAttribute('data-value'); let mat = document.getElementById('stickMaterialSelect').getAttribute('data-value');

            let stickMatToGlobalMat = { 'paper': 'sa_pap', 'kraft': 'sa_kr', 'transparent': 'film_tr', 'white': 'film_wh' };
            let globalMatId = stickMatToGlobalMat[mat] || mat;
            let paperPrice = parseFloat(APP_PRICES["Бумага (Плотность)"][paperMap[globalMatId]]?.["Стандарт"] || 2.40);
            let printPrice = 0;
            let plotterPrice = 6.00;

            if (colorVal === '00') {
                plotterPrice = 0;
            } else if (colorVal === '40') {
                let cArr = getP("Печать SRA3", "Цвет");
                let forcedTier = getGlobalDiscountTier();
                let idx = forcedTier || (sheets <= 10 ? 0 : (sheets <= 50 ? 1 : (sheets <= 100 ? 2 : (sheets <= 300 ? 3 : 4))));
                printPrice = cArr[idx];
            } else if (colorVal === '10') {
                let bArr = getP("Печать SRA3", "ЧБ");
                let forcedTier = getGlobalDiscountTier();
                let idx = forcedTier || (sheets <= 10 ? 0 : (sheets <= 50 ? 1 : (sheets <= 100 ? 2 : (sheets <= 300 ? 3 : 4))));
                printPrice = bArr[idx];
            }

            let totalPaperCost = sheets * paperPrice * sProps.mult;
            let totalPrintCost = sheets * printPrice * sProps.mult;
            let totalPlotterCost = sheets * plotterPrice * sProps.mult;

            if (best.count > 100 && colorVal !== '00') {
                totalPaperCost *= 1.3;
                totalPrintCost *= 1.3;
                totalPlotterCost *= 1.3;
            }

            let totalCostRaw = totalPaperCost + totalPrintCost + totalPlotterCost;
            let isCut = document.getElementById('stickCut').checked; let cutCost = 0; let totalCuts = 0;
            let manualCutsVal = document.getElementById('manualCutsInput')?.value; let useManualCuts = manualCutsVal !== "" && !isNaN(parseInt(manualCutsVal));

            if (useManualCuts) { totalCuts = parseInt(manualCutsVal); cutCost = totalCuts * APP_PRICES["Доп. работы"]["Резка_База"]; }
            else if (isCut) { let baseCuts = (best.x === 1 || best.y === 1) ? ((best.x || 0) + (best.y || 0) + 2) : ((best.x || 0) + (best.y || 0) + 3); if (best.x > 1 && best.y > 1 && sheets === 1 && sProps.w !== 420 && sProps.w !== 297) baseCuts -= 1; totalCuts = Math.ceil(baseCuts * Math.max(1, (qty * (170 / 1000)) / 30)); cutCost = totalCuts * (best.count >= 16 ? APP_PRICES["Доп. работы"]["Резка_Мелкая"] : APP_PRICES["Доп. работы"]["Резка_База"]); }

            let cMods = getCustomModulesInfo(qty, sheets);
            let lMods = getLayoutCustomModulesCost('stickers', 'main', qty, sheets);
            let totalCostRawAll = totalCostRaw + cutCost + cMods.total + lMods.total;

            let finalTotalCost = 0;
            let isAccRound = document.getElementById('accountantRounding')?.checked;
            if (isAccRound && qty > 0) {
                let withoutVat = totalCostRawAll / 1.2;
                let ppp = Math.round((withoutVat / qty) * 100) / 100;
                finalTotalCost = ppp * qty * 1.2;
            } else {
                finalTotalCost = Math.max(totalCostRawAll, 0);
            }

            const sheetWrapper = document.getElementById('stickSheetWrapper'); let scaleP = Math.min(240 / (resP.w || 1), 240 / (resP.h || 1)); let scaleL = Math.min(240 / (resL.w || 1), 240 / (resL.h || 1));
            let gridHTML_P = Array(resP.count).fill('<div class="card-cell" style="border-radius:1px; background: #ffffff; border: 1px dashed #64748b;"></div>').join('');
            let gridHTML_L = Array(resL.count).fill('<div class="card-cell" style="border-radius:1px; background: #ffffff; border: 1px dashed #64748b;"></div>').join('');
            sheetWrapper.innerHTML = `<div class="nv-layout-tabs"><button class="nv-layout-tab stick-layout-tab ${window.stickActiveOrientation === 'portrait' ? 'active' : ''}" onclick="window.stickActiveOrientation='portrait'; calculateStickerPrice()">Книжный лист</button><button class="nv-layout-tab stick-layout-tab ${window.stickActiveOrientation === 'landscape' ? 'active' : ''}" onclick="window.stickActiveOrientation='landscape'; calculateStickerPrice()">Альбомный лист</button></div><div id="stick-layout-0" class="nv-layout-content stick-layout-content ${window.stickActiveOrientation === 'portrait' ? 'active' : ''}"><div class="nv-sheet-area" style="width: ${(resP.w || 1) * scaleP}px; height: ${(resP.h || 1) * scaleP}px; display:block; padding: 2px; box-sizing: border-box; background: #ffffff; border: 1.5px solid #000;"><div class="nv-layout-grid" style="width: 100%; height: 100%; grid-template-columns: repeat(${resP.x || 1}, 1fr); gap:2px; position: relative; top: 0; left: 0; transform: none; background: #cbd5e1;">${gridHTML_P}</div><div class="nv-card-grid-txt label-x">${resP.w || ''} мм</div><div class="nv-card-grid-txt label-y">${resP.h || ''} мм</div></div></div><div id="stick-layout-1" class="nv-layout-content stick-layout-content ${window.stickActiveOrientation === 'landscape' ? 'active' : ''}"><div class="nv-sheet-area" style="width: ${(resL.w || 1) * scaleL}px; height: ${(resL.h || 1) * scaleL}px; display:block; padding: 2px; box-sizing: border-box; background: #ffffff; border: 1.5px solid #000;"><div class="nv-layout-grid" style="width: 100%; height: 100%; grid-template-columns: repeat(${resL.x || 1}, 1fr); gap:2px; position: relative; top: 0; left: 0; transform: none; background: #cbd5e1;">${gridHTML_L}</div><div class="nv-card-grid-txt label-x">${resL.w || ''} мм</div><div class="nv-card-grid-txt label-y">${resL.h || ''} мм</div></div></div>`;

            document.getElementById('stickLayoutDetails').innerHTML = `Листов (${sProps.w}×${sProps.h}): <strong>${sheets} шт.</strong> | На листе: <strong>${best.count} шт.</strong><br><span style="color:#888; font-size:11px">Макет с дозаливками: ${techW}x${techH} мм | Рядов: ${best.x || 0}x${best.y || 0} | Резов: ${useManualCuts || isCut ? totalCuts : 0}</span>`;
            document.getElementById('stickOrientationLabel').textContent = "Раскладка: " + best.name; document.getElementById('stickTotalPrice').textContent = finalTotalCost.toFixed(2);
            let pppEl = document.getElementById('stickPricePerPiece'); if (qty > 0 && finalTotalCost > 0) { pppEl.innerHTML = `Цена за 1 шт: <span>${(finalTotalCost / qty).toFixed(3)}</span> BYN`; pppEl.style.display = 'block'; } else pppEl.style.display = 'none';

            if (finalTotalCost > 0) {
                let costDetails = { print: totalPrintCost, paper: totalPaperCost, plotter: totalPlotterCost, cut: cutCost, lam: 0, rounding: 0, crease: 0, punch: 0, foil: 0 };
                if (cMods.details.length > 0) costDetails.customMods = cMods.details;
                let sheetFormatStr = document.getElementById('stickSheetSelect').querySelector('.nv-select-trigger').textContent.split(' ')[0];
                let perLayout = [{ id: 'main', size: `${w}x${h}`, sheetFormat: sheetFormatStr, mat: document.getElementById('stickMaterialSelect').querySelector('.nv-select-trigger').textContent, color: colorVal === '40' ? '4+0' : '1+0', qty: qty, sheets: sheets, impressions: sheets, lamType: "Нет", cuts: useManualCuts || isCut ? totalCuts : 0, costs: { printAndMat: totalPrintCost + totalPaperCost, print: totalPrintCost, paper: totalPaperCost, plotter: totalPlotterCost, cut: cutCost }, extrasQty: {}, customMods: lMods.details }];
                window.currentCalcData = { tab: 'tab-stickers', title: `${w}x${h} (${qty} шт)`, price: finalTotalCost.toFixed(2), mat: document.getElementById('stickMaterialSelect').querySelector('.nv-select-trigger').textContent, color: colorVal === '40' ? '4+0' : '1+0', size: `${w}x${h}`, qty: qty, sheetFormat: sheetFormatStr, sheets: sheets, impressions: sheets, lamType: "Нет", cuts: useManualCuts || isCut ? totalCuts : 0, perLayout: perLayout, extrasQty: {}, tabName: "Стикеры", techW: techW, techH: techH, totalOnSheet: best.count, printPrice: totalCostRaw.toFixed(2), costDetails: costDetails, customModsDetails: cMods.details };
            }
        }


