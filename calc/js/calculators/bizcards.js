



function calculateBizPrice() {
            window.currentCalcData = null;
            const sizeStr = document.getElementById('bizSizeSelect').getAttribute('data-value'); let qty = parseInt(document.getElementById('bizQuantity').value);
            if (!sizeStr || !qty) { document.getElementById('bizSheetArea').style.display = 'none'; document.getElementById('bizTotalPrice').textContent = "0.00"; document.getElementById('bizOldPrice').style.display = 'none'; document.getElementById('bizWarningText').style.display = 'none'; document.getElementById('bizPricePerSet').style.display = 'none'; document.getElementById('bizPricePerPiece').style.display = 'none'; return; }
            const valW = parseInt(sizeStr.split('x')[0]), valH = parseInt(sizeStr.split('x')[1]);
            const bizWarning = document.getElementById('bizWarningText');
            if ((valW === 90 && valH === 50) || (valW === 50 && valH === 90)) { bizWarning.textContent = "Этот размер идет кратно количеству: 24 шт."; bizWarning.style.display = 'block'; qty = Math.max(1, Math.ceil(qty / 24)) * 24; }
            else if ((valW === 85 && valH === 55) || (valW === 55 && valH === 85)) { bizWarning.textContent = "Этот размер идет кратно количеству: 21 шт."; bizWarning.style.display = 'block'; qty = Math.max(1, Math.ceil(qty / 21)) * 21; } else bizWarning.style.display = 'none';

            if (!window.layoutExtras['biz']['main']) window.layoutExtras['biz']['main'] = { noCut: false, rounding: false, lam: 'none', punch: false, punchCount: 1, foil: false, plotter: false };
            window.activeLayoutKey['biz'] = 'main'; saveUIStateToLayout('biz'); let ext = window.layoutExtras['biz']['main'];

            const sProps = getSheetProps(document.getElementById('bizSheetSelect').getAttribute('data-value')); const margin = parseInt(document.getElementById('bizMargin').value) || 0;
            let allowMixed = ext.plotter === true; let best = calcLayout(sProps.w, sProps.h, margin, valW, valH, allowMixed);

            if (!best || best.total === 0) { document.getElementById('bizSheetArea').style.display = 'none'; document.getElementById('bizTotalPrice').textContent = "0.00"; document.getElementById('bizOldPrice').style.display = 'none'; document.getElementById('bizPricePerSet').style.display = 'none'; document.getElementById('bizPricePerPiece').style.display = 'none'; return; }

            let sheets = Math.ceil(qty / best.total);
            const bizMat = document.getElementById('bizMaterialSelect').getAttribute('data-value');
            const bizDens = document.getElementById('bizDensitySelect').getAttribute('data-value');
            const paperPrice = (bizPaperData[bizMat]?.dens.find(d => String(d.g) === String(bizDens))?.p || 0) * sProps.mult;
            const printType = document.getElementById('bizPrintTypeSelect').getAttribute('data-value');
            const isDouble = (printType === '44' || printType === '11' || printType === '41');
            const printImp = (printType === '00') ? 0 : (isDouble ? 2 : 1);
            const totalImpressions = (sheets * printImp) + ((ext.foil && ext.lam !== 'none') ? sheets : 0);

            let idx = getGlobalDiscountTier() || (totalImpressions <= 10 ? 0 : totalImpressions <= 50 ? 1 : totalImpressions <= 100 ? 2 : totalImpressions <= 300 ? 3 : 4);
            let printCost = 0, basePrintCost = 0; let cArr = getP("Печать SRA3", "Цвет"); let bArr = getP("Печать SRA3", "ЧБ");

            if (printType === '00') { printCost = 0; basePrintCost = 0; } else if (printType === '40') { printCost = cArr[idx]; basePrintCost = cArr[0]; } else if (printType === '44') { printCost = cArr[idx] * 2; basePrintCost = cArr[0] * 2; } else if (printType === '10') { printCost = bArr[idx]; basePrintCost = bArr[0]; } else if (printType === '11') { printCost = bArr[idx] * 2; basePrintCost = bArr[0] * 2; } else if (printType === '41') { printCost = cArr[idx] + bArr[idx]; basePrintCost = cArr[0] + bArr[0]; }
            printCost *= sProps.mult; basePrintCost *= sProps.mult;
            let extraImpCost = (ext.foil && ext.lam !== 'none') ? (sheets * bArr[idx] * sProps.mult) : 0;
            let extraImpCostBase = (ext.foil && ext.lam !== 'none') ? (sheets * bArr[0] * sProps.mult) : 0;
            const totalSheetsCost = sheets * (printCost + paperPrice) + extraImpCost;
            const totalSheetsCostBase = sheets * (basePrintCost + paperPrice) + extraImpCostBase;

            let EX = APP_PRICES["Доп. работы"]; let LM = APP_PRICES["Ламинация"];
            let manualCutsVal = document.getElementById('manualCutsInput')?.value;
            let useManualCuts = manualCutsVal !== "" && !isNaN(parseInt(manualCutsVal));

            let totalCuts = 0, cutCost = 0;
            if (useManualCuts) {
                totalCuts = parseInt(manualCutsVal); cutCost = totalCuts * EX["Резка_База"];
            } else if (!ext.noCut) {
                let baseCuts = (best.x === 1 || best.y === 1) ? ((best.x || 0) + (best.y || 0) + 2) : ((best.x || 0) + (best.y || 0) + 3);
                if (best.x > 1 && best.y > 1 && sheets === 1 && sProps.w !== 420 && sProps.w !== 297) baseCuts -= 1;
                totalCuts = Math.ceil(baseCuts * Math.max(1, (qty * ((parseInt(document.getElementById('bizDensitySelect').querySelector('.nv-select-trigger').textContent) || 300) / 1000)) / 30));
                cutCost = totalCuts * ((best.total >= 16) ? EX["Резка_Мелкая"] : EX["Резка_База"]);
            }

            let lamCost = 0, baseLamCost = 0;
            if (ext.lam && ext.lam !== 'none') {
                let globalDiscountActive = getGlobalDiscountTier() !== 0; let effLamSheets = sheets; let pLamBase = 0, pLam = 0;
                if (ext.lam.startsWith('pouch_')) {
                    let kMap = { 'pouch_a4_gly': 'Пакет_А4_Глянец', 'pouch_a4_mat': 'Пакет_А4_Мат', 'pouch_a3_gly': 'Пакет_А3_Глянец', 'pouch_a3_mat': 'Пакет_А3_Мат' };
                    let arr = LM[kMap[ext.lam]]; pLamBase = arr[0]; pLam = (globalDiscountActive || effLamSheets >= 11) ? arr[1] : arr[0];
                } else {
                    let effLamSheetsForRoll = (globalDiscountActive && sheets <= 10) ? 11 : sheets;
                    let kMap = { '1_mat': 'Рулон_Мат_1ст', '2_mat': 'Рулон_Мат_2ст', '1_gly': 'Рулон_Глянец_1ст', '2_gly': 'Рулон_Глянец_2ст', '1_st': 'Рулон_SoftTouch_1ст', '2_st': 'Рулон_SoftTouch_2ст' };
                    let arr = LM[kMap[ext.lam]]; pLamBase = arr[0];
                    if (effLamSheetsForRoll >= 51) pLam = arr[2];
                    else if (effLamSheetsForRoll >= 11) pLam = arr[1];
                    else pLam = arr[0];
                }
                if (sProps.isHalf && !ext.lam.startsWith('pouch_')) { pLam /= 2; pLamBase /= 2; }
                lamCost = sheets * pLam; baseLamCost = sheets * pLamBase;
            }

            const roundingCost = ext.rounding ? Math.ceil(qty / 10) * EX["Скругление"] : 0;
            let punchCost = ext.punch ? Math.ceil(qty * ((parseInt(document.getElementById('bizDensitySelect').querySelector('.nv-select-trigger').textContent) || 300) / 1000) / 1.5) * ext.punchCount * EX["Дырокол"] : 0;
            let fPrice = sProps.isHalf ? (sheets >= 11 ? EX["ФольгаМалая_Скидка"] : EX["ФольгаМалая_База"]) : (sheets >= 11 ? EX["ФольгаБольшая_Скидка"] : EX["ФольгаБольшая_База"]);
            let fPriceBase = sProps.isHalf ? EX["ФольгаМалая_База"] : EX["ФольгаБольшая_База"];
            let foilCost = ext.foil ? sheets * fPrice : 0; let foilCostBase = ext.foil ? sheets * fPriceBase : 0;

            let plotterCost = 0, plotterCostBase = 0;
            if (ext.plotter) {
                let pArr = (best.total === 1) ? EX["Плоттер_1"] : EX["Плоттер_Много"]; let pTier = sheets <= 10 ? 0 : (sheets <= 50 ? 1 : 2);
                plotterCost = sheets * (pArr[pTier] || pArr[pArr.length - 1]); plotterCostBase = sheets * pArr[0];
            }

            let cMods = getCustomModulesInfo(qty, sheets); let customModsCost = cMods.total;
            let lMods = getLayoutCustomModulesCost('bizcards', 'main', qty, sheets); customModsCost += lMods.total;
            let paperCostAccum = sheets * paperPrice; let printCostAccum = sheets * printCost + extraImpCost;

            let costDetails = { printAndMat: printCostAccum + paperCostAccum, print: printCostAccum, paper: paperCostAccum, cut: cutCost, lam: lamCost, rounding: roundingCost, punch: punchCost, foil: foilCost, plotter: plotterCost };
            if (cMods.details.length > 0) costDetails.customMods = cMods.details;

            let exactSets = qty / getBizSetSize(), roundedPPS = 0, finalTotalRaw = 0, totalNoDiscountRaw = 0;
            if (exactSets > 0) {
                roundedPPS = roundTo30K((totalSheetsCost + cutCost + lamCost + roundingCost + punchCost + foilCost + plotterCost + customModsCost) / exactSets);
                finalTotalRaw = roundedPPS * exactSets;
                totalNoDiscountRaw = roundTo30K((totalSheetsCostBase + cutCost + baseLamCost + roundingCost + punchCost + foilCostBase + plotterCostBase + customModsCost) / exactSets) * exactSets;
            }

            let finalTotal = 0; let totalNoDiscount = roundTo30K(totalNoDiscountRaw);
            let isAccRound = document.getElementById('accountantRounding')?.checked;
            if (isAccRound && qty > 0) {
                let withoutVat = finalTotalRaw / 1.2;
                let ppp = Math.round((withoutVat / qty) * 100) / 100;
                finalTotal = ppp * qty * 1.2;
            } else {
                finalTotal = roundTo30K(finalTotalRaw);
            }

            document.getElementById('bizTotalPrice').textContent = finalTotal.toFixed(2);
            if (finalTotal < totalNoDiscount - 0.01) { document.getElementById('bizOldPrice').textContent = totalNoDiscount.toFixed(2) + " BYN"; document.getElementById('bizOldPrice').style.display = 'block'; } else document.getElementById('bizOldPrice').style.display = 'none';
            if (exactSets > 0 && finalTotal > 0) { document.getElementById('bizPricePerSet').innerHTML = `Цена за 1 комплект: <span>${(finalTotal / exactSets).toFixed(2)}</span> BYN`; document.getElementById('bizPricePerSet').style.display = 'block'; } else document.getElementById('bizPricePerSet').style.display = 'none';

            let pppEl = document.getElementById('bizPricePerPiece');
            if (qty > 0 && finalTotal > 0) { pppEl.innerHTML = `Цена за 1 шт: <span>${(finalTotal / qty).toFixed(3)}</span> BYN`; pppEl.style.display = 'block'; } else { pppEl.style.display = 'none'; }

            document.getElementById('bizSheetsRequired').innerHTML = `Листов (${sProps.w}×${sProps.h}): ${sheets} шт. | Оттисков: ${totalImpressions}<br>На листе: ${best.total} шт. | Резов: ${ext.noCut && !useManualCuts ? 0 : totalCuts}`;

            let gridContentContainer = document.getElementById('bizGrid');
            document.getElementById('bizSheetArea').style.display = 'block';

            let scale = Math.min(240 / (best.w || 1), 240 / (best.h || 1));
            document.getElementById('bizSheetArea').style.width = ((best.w || 1) * scale) + "px";
            document.getElementById('bizSheetArea').style.height = ((best.h || 1) * scale) + "px";
            document.getElementById('bizLabelW').textContent = best.labelW || '';
            document.getElementById('bizLabelH').textContent = best.labelH || '';

            if (best.mix) {
                const b = best; let pctX = (val) => (val / b.w) * 100; let pctY = (val) => (val / b.h) * 100; let gridContent = '';
                const addCells = (cx, cy, w, h, ox, oy) => { for (let yi = 0; yi < cy; yi++) { for (let xi = 0; xi < cx; xi++) { gridContent += `<div class="card-cell" style="position:absolute; left:${pctX(ox + xi * w)}%; top:${pctY(oy + yi * h)}%; width:${pctX(w)}%; height:${pctY(h)}%; border-radius: 4px; box-shadow: inset 0 0 0 1px #444;"></div>`; } } };
                addCells(b.nx, b.ny, b.w1, b.h1, 0, 0); if (b.remType === 'right') addCells(b.rx, b.ry, b.w2, b.h2, b.nx * b.w1, 0); if (b.remType === 'bottom') addCells(b.bx, b.by, b.w2, b.h2, 0, b.ny * b.h1);
                gridContentContainer.style.width = "100%"; gridContentContainer.style.height = "100%"; gridContentContainer.style.display = "block"; gridContentContainer.style.position = "relative"; gridContentContainer.style.background = "var(--nv-yellow)"; gridContentContainer.innerHTML = gridContent;
            } else {
                let displayX = best.x || 1; let displayY = best.y || 1;
                gridContentContainer.style.display = "grid"; gridContentContainer.style.background = "var(--nv-yellow)";
                gridContentContainer.style.width = ((displayX * (best.w1) / (best.w || 1)) * 100) + "%";
                gridContentContainer.style.height = ((displayY * (best.h1) / (best.h || 1)) * 100) + "%";
                gridContentContainer.style.gridTemplateColumns = `repeat(${displayX}, 1fr)`;
                gridContentContainer.innerHTML = Array(Math.min(best.total || 0, 80)).fill('<div class="card-cell"></div>').join('');
            }

            if (finalTotal > 0) {
                let sheetFormatStr = document.getElementById('bizSheetSelect').querySelector('.nv-select-trigger').textContent.split(' ')[0];
                let lamTypeStr = ext.lam !== "none" && ext.lam ? LAM_NAMES[ext.lam] : "Нет";

                let extrasQty = {
                    crease: ext.crease ? qty * ext.creaseCount : 0,
                    eyelet: ext.eyelet ? qty * ext.eyeletCount : 0,
                    punch: ext.punch ? Math.ceil(qty * ((parseInt(document.getElementById('bizDensitySelect').querySelector('.nv-select-trigger').textContent) || 300) / 1000) / 1.5) * ext.punchCount : 0,
                    glue: ext.glue ? qty * ext.glueCount : 0,
                    rounding: ext.rounding ? Math.ceil(qty / 10) : 0,
                    staple: ext.staple ? qty : 0,
                    foil: ext.foil ? sheets : 0
                };

                let perLayout = [{
                    id: 'main',
                    size: `${valW}x${valH}`,
                    sheetFormat: sheetFormatStr,
                    mat: `${document.getElementById('bizMaterialSelect').querySelector('.nv-select-trigger').textContent} ${document.getElementById('bizDensitySelect').querySelector('.nv-select-trigger').textContent}`,
                    color: document.getElementById('bizPrintTypeSelect').querySelector('.nv-select-trigger').textContent,
                    qty: qty,
                    sheets: sheets,
                    impressions: totalImpressions,
                    lamType: lamTypeStr,
                    cuts: ext.noCut && !useManualCuts ? 0 : totalCuts,
                    costs: costDetails,
                    extrasQty: extrasQty,
                    customMods: lMods.details
                }];

                window.currentCalcData = {
                    tab: 'tab-bizcards',
                    title: `${valW}x${valH}`,
                    price: finalTotal.toFixed(2),
                    mat: document.getElementById('bizMaterialSelect').querySelector('.nv-select-trigger').textContent,
                    dens: document.getElementById('bizDensitySelect').querySelector('.nv-select-trigger').textContent,
                    color: document.getElementById('bizPrintTypeSelect').querySelector('.nv-select-trigger').textContent,
                    size: `${valW}x${valH}`,
                    qty: qty,
                    sheetFormat: sheetFormatStr,
                    sheets: sheets,
                    impressions: totalImpressions,
                    lamType: lamTypeStr,
                    cuts: ext.noCut && !useManualCuts ? 0 : totalCuts,
                    extrasQty: extrasQty,
                    tabName: "Визитки",
                    totalOnSheet: best.total,
                    perLayout: perLayout,
                    printPrice: totalSheetsCost.toFixed(2),
                    costDetails: costDetails,
                    customModsDetails: cMods.details
                };
            }
        }

function getBizSetSize() { const s = document.getElementById('bizSizeSelect').getAttribute('data-value'); if (!s) return 100; return (s === '90x50' || s === '50x90') ? 96 : ((s === '85x55' || s === '55x85') ? 105 : 100); }

function updateBizFromSets() { let sets = parseFloat(document.getElementById('bizSets').value.replace(',', '.')) || 0; document.getElementById('bizQuantity').value = sets > 0 ? Math.round(sets * getBizSetSize()) : ''; calculateBizPrice(); }

function updateBizFromQty() { calculateBizPrice(); }

function snapBizQuantity() { const s = document.getElementById('bizSizeSelect').getAttribute('data-value'); if (!s) return; let step = (s === '90x50' || s === '50x90') ? 24 : ((s === '85x55' || s === '55x85') ? 21 : 1); let qty = parseInt(document.getElementById('bizQuantity').value) || 0; if (step > 1) document.getElementById('bizQuantity').value = Math.max(1, Math.ceil(qty / step)) * step; document.getElementById('bizSets').value = Math.round((parseInt(document.getElementById('bizQuantity').value) / getBizSetSize()) * 100) / 100; calculateBizPrice(); }


