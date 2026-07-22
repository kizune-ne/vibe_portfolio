



function calculateDensePrice() {
            const layouts = getDenseLayouts(); const sheetWrapper = document.getElementById('denseSheetWrapper'); const errorMsgEl = document.getElementById('dense-size-error-msg');
            if (errorMsgEl) errorMsgEl.style.display = 'none';
            if (layouts.length === 0 || layouts.some(l => l.w < 40 || l.h < 40)) { if (layouts.length > 0 && errorMsgEl) errorMsgEl.style.display = 'block'; sheetWrapper.innerHTML = ''; document.getElementById('denseTotalPrice').textContent = "0.00"; document.getElementById('denseOldPrice').style.display = 'none'; document.getElementById('densePricePerPiece').style.display = 'none'; return; }

            let uniqueSizes = new Set(layouts.map(l => `${l.w}x${l.h}`)); let allSameSize = uniqueSizes.size === 1 && layouts.length > 0;
            let multiToggle = document.getElementById('denseMultiToggle');
            let seqRadio = document.querySelector('input[name="denseLayoutMode"][value="sequential"]');
            let sepRadio = document.querySelector('input[name="denseLayoutMode"][value="separate"]');
            let mode = multiToggle.checked ? (document.querySelector('input[name="denseLayoutMode"]:checked')?.value || 'separate') : 'separate';
            
            if (mode === 'sequential' && !allSameSize) mode = 'separate';
            if (seqRadio && sepRadio) {
                if (!allSameSize) {
                    if (seqRadio.checked) { seqRadio.checked = false; sepRadio.checked = true; updateSegment(sepRadio); }
                    seqRadio.parentElement.style.opacity = '0.5'; seqRadio.disabled = true;
                } else {
                    seqRadio.parentElement.style.opacity = '1'; seqRadio.disabled = false;
                }
            }

            // arrGroups is now exactly 1-to-1 with layouts. We do NOT merge them!
            let arrGroups = layouts.map(l => ({ w: l.w, h: l.h, q: l.q, id: l.id, sheetStr: l.sheetStr }));
            let isMultiLayout = document.getElementById('denseMultiToggle').checked && arrGroups.length > 1;

            if (!window.activeLayoutKey['dense'] || !arrGroups.find(g => g.id === window.activeLayoutKey['dense'])) window.activeLayoutKey['dense'] = arrGroups.length > 0 ? arrGroups[0].id : null;
            if (window.activeLayoutKey['dense']) saveUIStateToLayout('dense');

            let globalMat = document.getElementById('denseMaterialSelect').getAttribute('data-value'); let globalDens = document.getElementById('denseDensitySelect').getAttribute('data-value'); let globalPrint = document.getElementById('densePrintTypeSelect').getAttribute('data-value'); let globalSheet = document.getElementById('denseSheetSelect').getAttribute('data-value') || "450x320";
            arrGroups.forEach(g => { 
                if (!window.layoutExtras['dense'][g.id]) window.layoutExtras['dense'][g.id] = { mat: globalMat, dens: globalDens, printType: globalPrint, sheetStr: globalSheet, noCut: false, rounding: false, lam: 'none', crease: false, creaseCount: 1, eyelet: false, eyeletCount: 1, staple: false, punch: false, punchCount: 1, foil: false, plotter: false, glue: false, glueCount: 1 }; 
                
                // Применяем индивидуальные настройки
                let override = window.layoutOverrides[g.id];
                if (override) {
                    if (override.material) window.layoutExtras['dense'][g.id].mat = override.material;
                    if (override.density) window.layoutExtras['dense'][g.id].dens = override.density;
                    if (override.color) window.layoutExtras['dense'][g.id].printType = override.color;
                    if (override.lam) window.layoutExtras['dense'][g.id].lam = override.lam;
                }
            });

            window.currentCalcData = null;
            const margin = parseInt(document.getElementById('denseMargin').value) || 0;
            document.getElementById('denseCutTogetherWrap').style.display = (layouts.length > 1 && allSameSize && document.getElementById('denseMultiToggle').checked) ? 'block' : 'none';
            let cutTogether = (document.getElementById('denseCutTogether')?.checked && allSameSize) || (mode === 'sequential');

            let manualCutsVal = document.getElementById('manualCutsInput')?.value; let useManualCuts = manualCutsVal !== "" && !isNaN(parseInt(manualCutsVal));
            let totalCuts = 0, totalSheets = 0; let sheetsInfoHTML = ""; let cutCost = 0, lamCost = 0, baseLamCost = 0, extraCost = 0, extraCostBase = 0;
            let costDetails = { cut: 0, lam: 0, rounding: 0, crease: 0, eyelet: 0, staple: 0, punch: 0, foil: 0, plotter: 0, glue: 0 };
            let layoutsDataArr = []; let impColor = 0, impBW = 0, impOfficeBW = 0; let foilSmallSheets = 0, foilLargeSheets = 0;
            let extrasQty = { crease: 0, eyelet: 0, punch: 0, glue: 0, rounding: 0, staple: 0, foil: 0 };
            
            let sharedSheets = 0; let seqTotalQ = 0; let seqBest = null; let seqGroupCuts = 0;
            if (mode === 'sequential' && arrGroups.length > 0) {
                seqTotalQ = arrGroups.reduce((sum, g) => sum + g.q, 0);
                const sProps = getSheetProps(globalSheet);
                seqBest = calcLayout(sProps.w, sProps.h, margin, arrGroups[0].w, arrGroups[0].h, false);
                if (seqBest && seqBest.total > 0) {
                    sharedSheets = Math.ceil(seqTotalQ / seqBest.total);
                    let baseCuts = (seqBest.x === 1 || seqBest.y === 1) ? ((seqBest.x || 0) + (seqBest.y || 0) + 2) : ((seqBest.x || 0) + (seqBest.y || 0) + 3); 
                    if (seqBest.x > 1 && seqBest.y > 1 && sharedSheets === 1 && sProps.w !== 420 && sProps.w !== 297) baseCuts -= 1;
                    let densG = globalMat === 'office' ? 80 : (densePaperData[globalMat]?.dens.find(d => Number(d.p) === Number(globalDens))?.g || 300); if (isNaN(densG)) densG = 170;
                    seqGroupCuts = Math.ceil(baseCuts * Math.max(1, (seqTotalQ * (densG / 1000)) / 30));
                }
            }

            arrGroups.forEach(g => {
                let st = window.layoutExtras['dense'][g.id] || {};
                if (st.crease) extrasQty.crease += g.q * st.creaseCount;
                if (st.eyelet) extrasQty.eyelet += g.q * st.eyeletCount;
                if (st.glue) extrasQty.glue += g.q * st.glueCount;

                const sProps = getSheetProps(st.sheetStr || globalSheet);
                let totalOnSheet = calcLayout(sProps.w, sProps.h, margin, g.w, g.h, st.plotter === true).total || 0;
                if (totalOnSheet > 0) {
                    let sheets = Math.ceil(g.q / totalOnSheet); let ptype = st.printType || '40';
                    let imp = 0; if (ptype === '44' || ptype === '11' || ptype === '41') imp = 2; else if (ptype === '40' || ptype === '10') imp = 1;
                    let extraImp = (st.foil && st.lam !== 'none') ? sheets : 0;
                    if (st.mat === 'office' && (ptype === '10' || ptype === '11')) impOfficeBW += (sheets * imp);
                    else { if (ptype.includes('4')) impColor += (sheets * imp) + extraImp; else impBW += (sheets * imp) + extraImp; }

                    if (st.foil) {
                        if (sProps.isHalf) foilSmallSheets += sheets; else foilLargeSheets += sheets;
                        extrasQty.foil += sheets;
                    }
                    if (st.rounding) extrasQty.rounding += Math.ceil(g.q / 10);
                    if (st.staple) extrasQty.staple += g.q;

                    let dObj = densePaperData[st.mat]?.dens.find(d => String(d.g) === String(st.dens)); let densG = st.mat === 'office' ? 80 : (dObj ? parseInt(dObj.g) : 300); if (isNaN(densG)) densG = 170;
                    if (st.punch) extrasQty.punch += Math.ceil(g.q * (densG / 1000) / 1.5) * st.punchCount;
                }
            });

            let forcedTier = getGlobalDiscountTier();
            let idxColor = forcedTier || (impColor <= 10 ? 0 : impColor <= 50 ? 1 : impColor <= 100 ? 2 : impColor <= 300 ? 3 : 4);
            let idxBW = forcedTier || (impBW <= 10 ? 0 : impBW <= 50 ? 1 : impBW <= 100 ? 2 : impBW <= 300 ? 3 : 4);
            let idxOfficeBW = forcedTier || (impOfficeBW <= 10 ? 0 : impOfficeBW <= 50 ? 1 : impOfficeBW <= 100 ? 2 : impOfficeBW <= 300 ? 3 : 4);

            let tabsHTML = '<div class="nv-layout-tabs">'; let contentsHTML = ''; let totalQ = layouts.reduce((sum, l) => sum + l.q, 0); let totalPaperCostAccum = 0; let totalPrintCostAccum = 0; let perLayout = [];

            arrGroups.forEach((g, i) => {
                let st = window.layoutExtras['dense'][g.id] || {}; const sProps = getSheetProps(st.sheetStr || globalSheet);
                let best = calcLayout(sProps.w, sProps.h, margin, g.w, g.h, st.plotter === true);
                g.best = best; g.sProps = sProps; g.st = st; g.sheets = 0; g.groupCuts = 0; g.printCost = 0; g.basePrintCost = 0; g.cutCost = 0; g.lamCost = 0; g.baseLamCost = 0; g.extraCost = 0;
                if (!best || !best.total || best.total === 0) return;

                let sheets = Math.ceil(g.q / best.total); g.sheets = sheets; totalSheets += sheets;
                let ptype = st.printType || '40'; let paperPrice = 0, printClickPrice = 0, baseClickPrice = 0; let extraImpCost = 0, extraImpCostBase = 0;
                let imp = 0; if (ptype === '44' || ptype === '11' || ptype === '41') imp = 2; else if (ptype === '40' || ptype === '10') imp = 1;

                if (ptype === '00') {
                    paperPrice = (densePaperData[st.mat]?.dens.find(d => String(d.g) === String(st.dens))?.p || 0) * sProps.mult;
                    if (st.foil && st.lam !== 'none') { let bArr = getP("Печать SRA3", "ЧБ"); extraImpCost = sheets * bArr[idxBW] * sProps.mult; extraImpCostBase = sheets * bArr[0] * sProps.mult; }
                } else if (st.mat === 'office' && !ptype.includes('4')) {
                    let pArr = sProps.isHalf ? getP("Печать SRA3", "Офисная_A4") : getP("Печать SRA3", "Офисная_A3"); printClickPrice = pArr[idxOfficeBW]; baseClickPrice = pArr[0]; if (ptype === '11') { printClickPrice *= 2; baseClickPrice *= 2; }
                } else {
                    paperPrice = (densePaperData[st.mat]?.dens.find(d => String(d.g) === String(st.dens))?.p || 0) * sProps.mult; let idxToUse = ptype.includes('4') ? idxColor : idxBW;
                    let cArr = getP("Печать SRA3", "Цвет"); let bArr = getP("Печать SRA3", "ЧБ");
                    if (ptype === '40') { printClickPrice = cArr[idxToUse]; baseClickPrice = cArr[0]; } else if (ptype === '44') { printClickPrice = cArr[idxToUse] * 2; baseClickPrice = cArr[0] * 2; } else if (ptype === '10') { printClickPrice = bArr[idxToUse]; baseClickPrice = bArr[0]; } else if (ptype === '11') { printClickPrice = bArr[idxToUse] * 2; baseClickPrice = bArr[0] * 2; } else if (ptype === '41') { printClickPrice = cArr[idxToUse] + bArr[idxToUse]; baseClickPrice = cArr[0] + bArr[0]; }
                    printClickPrice *= sProps.mult; baseClickPrice *= sProps.mult;
                    if (st.foil && st.lam !== 'none') { extraImpCost = sheets * bArr[idxToUse] * sProps.mult; extraImpCostBase = sheets * bArr[0] * sProps.mult; }
                }

                g.printCostRaw = sheets * printClickPrice + extraImpCost;
                g.paperCostRaw = sheets * paperPrice;
                g.printCost = sheets * (printClickPrice + paperPrice) + extraImpCost; g.basePrintCost = sheets * (baseClickPrice + paperPrice) + extraImpCostBase;
                totalPaperCostAccum += sheets * paperPrice; totalPrintCostAccum += sheets * printClickPrice + extraImpCost;

                let EX = APP_PRICES["Доп. работы"]; let dObj = densePaperData[st.mat]?.dens.find(d => String(d.g) === String(st.dens)); let densG = st.mat === 'office' ? 80 : (dObj ? parseInt(dObj.g) : 300); if (isNaN(densG)) densG = 170;

                if (useManualCuts) { g.groupCuts = 0; g.cutCost = 0; } else if (!cutTogether) {
                    let baseCuts = (best.x === 1 || best.y === 1) ? ((best.x || 0) + (best.y || 0) + 2) : ((best.x || 0) + (best.y || 0) + 3); if (best.x > 1 && best.y > 1 && Math.ceil(sheets) === 1 && sProps.w !== 420 && sProps.w !== 297) baseCuts -= 1;
                    g.groupCuts = Math.ceil(baseCuts * Math.max(1, (g.q * (densG / 1000)) / 30));
                    if (!st.noCut) { totalCuts += g.groupCuts; g.cutCost = g.groupCuts * ((best.total >= 16) ? EX["Резка_Мелкая"] : EX["Резка_База"]); cutCost += g.cutCost; }
                } else if (mode === 'sequential') {
                    // For sequential, cutTogether is true, but we assign fractional cuts to layout for details breakdown
                    g.groupCuts = seqGroupCuts * (g.q / seqTotalQ);
                    g.cutCost = g.groupCuts * ((best.total >= 16) ? EX["Резка_Мелкая"] : EX["Резка_База"]);
                    // We don't add to cutCost / totalCuts globally here, because it is calculated entirely after the loop.
                }

                let LM = APP_PRICES["Ламинация"];
                if (st.lam && st.lam !== 'none') {
                    let globalDiscountActive = getGlobalDiscountTier() !== 0; let effLamSheets = sheets; let pLamBase = 0, pLam = 0;
                    if (st.lam.startsWith('pouch_')) { let kMap = { 'pouch_a4_gly': 'Пакет_А4_Глянец', 'pouch_a4_mat': 'Пакет_А4_Мат', 'pouch_a3_gly': 'Пакет_А3_Глянец', 'pouch_a3_mat': 'Пакет_А3_Мат' }; let arr = LM[kMap[st.lam]]; pLamBase = arr[0]; pLam = (globalDiscountActive || effLamSheets >= 11) ? arr[1] : arr[0]; }
                    else { let effLamSheetsForRoll = (globalDiscountActive && sheets <= 10) ? 11 : sheets; let kMap = { '1_mat': 'Рулон_Мат_1ст', '2_mat': 'Рулон_Мат_2ст', '1_gly': 'Рулон_Глянец_1ст', '2_gly': 'Рулон_Глянец_2ст', '1_st': 'Рулон_SoftTouch_1ст', '2_st': 'Рулон_SoftTouch_2ст' }; let arr = LM[kMap[st.lam]]; pLamBase = arr[0]; if (effLamSheetsForRoll >= 51) pLam = arr[2]; else if (effLamSheetsForRoll >= 11) pLam = arr[1]; else pLam = arr[0]; }
                    
                    if (sProps.isHalf && !st.lam.startsWith('pouch_')) { pLam /= 2; pLamBase /= 2; }
                    
                    g.lamCost = sheets * pLam; g.baseLamCost = sheets * pLamBase; lamCost += g.lamCost; baseLamCost += g.baseLamCost;
                }

                let c_rounding = st.rounding ? Math.ceil(g.q / 10) * EX["Скругление"] : 0; let c_staple = st.staple ? g.q * EX["Сшивка"] : 0; let c_crease = st.crease ? g.q * EX["Биговка"] * st.creaseCount : 0; let c_eyelet = st.eyelet ? g.q * EX["Люверс"] * st.eyeletCount : 0;
                let punchQty = Math.ceil(g.q * (densG / 1000) / 1.5) * st.punchCount; let c_punch = st.punch ? punchQty * EX["Дырокол"] : 0;
                let c_glue = st.glue ? g.q * EX["Склейка"] * st.glueCount : 0;
                let c_foil = 0, c_foil_base = 0;
                if (st.foil) { let fPrice = sProps.isHalf ? (foilSmallSheets >= 11 ? EX["ФольгаМалая_Скидка"] : EX["ФольгаМалая_База"]) : (foilLargeSheets >= 11 ? EX["ФольгаБольшая_Скидка"] : EX["ФольгаБольшая_База"]); let fPriceBase = sProps.isHalf ? EX["ФольгаМалая_База"] : EX["ФольгаБольшая_База"]; c_foil = sheets * fPrice; c_foil_base = sheets * fPriceBase; }

                let c_plotter = 0, c_plotter_base = 0;
                if (st.plotter) {
                    let pArr = (best.total === 1) ? EX["Плоттер_1"] : EX["Плоттер_Много"]; let pTier = sheets <= 10 ? 0 : (sheets <= 50 ? 1 : 2);
                    c_plotter = sheets * (pArr[pTier] || pArr[pArr.length - 1]); c_plotter_base = sheets * pArr[0];
                }

                let c_mods = getLayoutCustomModulesCost('dense', g.id, g.q, g.sheets);
                extraCost += c_mods.total; extraCostBase += c_mods.total;

                g.extraCost = c_rounding + c_staple + c_crease + c_eyelet + c_punch + c_glue + c_foil + c_plotter + c_mods.total; 
                g.extraCostBase = c_rounding + c_staple + c_crease + c_eyelet + c_punch + c_glue + c_foil_base + c_plotter_base + c_mods.total; 
                
                costDetails.rounding += c_rounding; costDetails.staple += c_staple; costDetails.crease += c_crease; costDetails.eyelet += c_eyelet; costDetails.punch += c_punch; costDetails.glue += c_glue; costDetails.foil += c_foil; costDetails.plotter += c_plotter;

                let matName = densePaperData[st.mat]?.name || st.mat; let colorName = ptype.replace('40', '4+0').replace('44', '4+4').replace('41', '4+1').replace('10', '1+0').replace('11', '1+1');
                let l_lamType = st.lam !== "none" && st.lam ? LAM_NAMES[st.lam] : "Нет";
                let sheetFormatStr = document.getElementById('denseSheetSelect').querySelector('.nv-select-trigger').textContent.split(' ')[0]; let densName = st.mat === 'office' ? "80" : (dObj ? dObj.g : "300");

                let pQty = { crease: st.crease ? g.q * st.creaseCount : 0, eyelet: st.eyelet ? g.q * st.eyeletCount : 0, punch: st.punch ? punchQty : 0, glue: st.glue ? g.q * st.glueCount : 0, rounding: st.rounding ? Math.ceil(g.q / 10) : 0, staple: st.staple ? g.q : 0, foil: st.foil ? sheets : 0 };

                perLayout.push({
                    id: g.id, size: `${g.w}x${g.h}`, sheetFormat: sheetFormatStr, mat: `${matName} ${densName} ${isNaN(parseInt(densName)) ? '' : 'г/м²'}`, color: colorName, qty: g.q, sheets: g.sheets,
                    impressions: Math.ceil(g.sheets * imp + ((st.foil && st.lam !== 'none') ? g.sheets : 0)), lamType: l_lamType, cuts: (useManualCuts || (cutTogether && mode !== 'sequential')) ? 0 : g.groupCuts,
                    costs: { printAndMat: g.printCost, print: g.printCostRaw, paper: g.paperCostRaw, cut: (useManualCuts || (cutTogether && mode !== 'sequential')) ? 0 : g.cutCost, lam: g.lamCost, rounding: c_rounding, staple: c_staple, crease: c_crease, eyelet: c_eyelet, punch: c_punch, glue: c_glue, foil: c_foil, plotter: c_plotter },
                    extrasQty: pQty
                });

                let extrasArr = [];
                if (st.lam !== "none") extrasArr.push(`${LAM_NAMES[st.lam]}`);
                if (st.noCut) extrasArr.push("Без резки");
                if (st.eyelet) extrasArr.push(`Люверсы (${pQty.eyelet} шт.)`);
                if (st.crease) extrasArr.push(`Биговка (${pQty.crease} шт.)`);
                if (st.rounding) extrasArr.push(`Скругление (${pQty.rounding} шт.)`);
                if (st.staple) extrasArr.push(`Сшивка (${pQty.staple} шт.)`);
                if (st.punch) extrasArr.push(`Дыроколение (${pQty.punch} шт.)`);
                if (st.glue) extrasArr.push(`Склейка (${pQty.glue} шт.)`);
                if (st.foil) extrasArr.push(`Фольгирование (${pQty.foil} л.)`);
                if (st.plotter) extrasArr.push(`Плотт. резка (${sheets} л.)`);
                
                // Save this so we can append custom modules to it in the second pass
                g.extrasArr = extrasArr;
                g.sheetsInfoSheets = sheets;
                g.matName = matName;
                g.densName = densName;
                g.colorName = colorName;
            });

            if (useManualCuts) {
                totalCuts = parseInt(manualCutsVal); cutCost = totalCuts * APP_PRICES["Доп. работы"]["Резка_База"];
            } else if (cutTogether && arrGroups.length > 0) {
                let activeExt = window.layoutExtras['dense'][window.activeLayoutKey['dense']] || {}; const sProps = getSheetProps(activeExt.sheetStr || globalSheet); let best = calcLayout(sProps.w, sProps.h, margin, arrGroups[0].w, arrGroups[0].h, false);
                if (best && best.total > 0) {
                    let totalGroupSheets = (mode === 'sequential') ? sharedSheets : Math.ceil(totalQ / best.total); 
                    let baseCuts = (best.x === 1 || best.y === 1) ? ((best.x || 0) + (best.y || 0) + 2) : ((best.x || 0) + (best.y || 0) + 3); 
                    if (best.x > 1 && best.y > 1 && totalGroupSheets === 1 && sProps.w !== 420 && sProps.w !== 297) baseCuts -= 1;
                    let densG = activeExt.mat === 'office' ? 80 : (densePaperData[activeExt.mat]?.dens.find(d => Number(d.p) === Number(activeExt.dens))?.g || 300); if (isNaN(densG)) densG = 170;
                    totalCuts = (mode === 'sequential') ? seqGroupCuts : Math.ceil(baseCuts * Math.max(1, (totalQ * (densG / 1000)) / 30));
                    if (!activeExt.noCut) { cutCost = totalCuts * (best.total >= 16 ? APP_PRICES["Доп. работы"]["Резка_Мелкая"] : APP_PRICES["Доп. работы"]["Резка_База"]); }
                }
            }

            window.updateCustomModuleDropdowns(); // Update UI
            let cMods = getCustomModulesInfo(totalQ, totalSheets, arrGroups, perLayout); extraCost += cMods.total; extraCostBase += cMods.total; if (cMods.details.length > 0) costDetails.customMods = cMods.details;

            let finalTotalRaw = 0; let finalTotalBaseRaw = 0;
            // Add global custom modules that don't belong to a specific layout
            if (cMods && cMods.details) {
                cMods.details.forEach(cm => {
                    if (!cm.desc.includes('Только Макет')) {
                        finalTotalRaw += cm.cost;
                        finalTotalBaseRaw += cm.cost;
                    }
                });
            }

            // SECOND PASS: generate UI arrays and HTML strings
            arrGroups.forEach((g, i) => { 
                if (!g.best || !g.best.total || g.best.total === 0) return; 
                
                // Process Custom Modules for this specific layout
                let pl = perLayout.find(x => x.id === g.id);
                if (pl && pl.customMods) {
                    let modCost = pl.customMods.reduce((s, cm) => s + cm.cost, 0);
                    g.extraCost += modCost;
                    g.extraCostBase += modCost;
                    pl.customMods.forEach(cm => g.extrasArr.push(`${cm.name} (${cm.qty} ${cm.label})`));
                }

                let effectiveCutCost = (useManualCuts || cutTogether) ? 0 : g.cutCost; 
                finalTotalRaw += g.printCost + effectiveCutCost + g.lamCost + g.extraCost; 
                finalTotalBaseRaw += g.basePrintCost + effectiveCutCost + g.baseLamCost + g.extraCostBase; 

                let extraStr = g.extrasArr.length > 0 ? '| ' + g.extrasArr.join(', ') : '';
                sheetsInfoHTML += `<div style="margin-top:2px;"><b>Макет ${i + 1} (${g.w}x${g.h})</b>: ${g.sheetsInfoSheets} л. | Рез: ${g.groupCuts} ${extraStr}</div>`;

                let layoutTotalCost = g.printCost + ((useManualCuts || cutTogether) ? 0 : g.cutCost) + g.lamCost + g.extraCost;
                layoutsDataArr.push({ size: `${g.w}x${g.h} (${g.q} шт) [${g.sProps.w}x${g.sProps.h}]`, mat: `${g.matName} ${g.densName} ${isNaN(parseInt(g.densName)) ? '' : 'г/м²'}`, color: g.colorName, extras: g.extrasArr.length > 0 ? g.extrasArr.join(', ') : 'нет', price: layoutTotalCost.toFixed(2) });

                let scale = Math.min(240 / (g.best.w || 1), 240 / (g.best.h || 1)); let activeClass = (g.id === window.activeLayoutKey['dense']) ? 'active' : '';
                let gearSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
                tabsHTML += `<div style="display:inline-block; position:relative; margin-right: 5px; margin-bottom: 5px;"><button class="nv-layout-tab dense-layout-tab ${activeClass}" onclick="switchLayoutTabExt(this, 'dense', '${g.id}', ${i})" style="padding-right: 25px; margin: 0;">Раскладка ${g.w}x${g.h}</button><div onclick="openLayoutDetailsModal('tab-dense', '${g.id}')" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); cursor:pointer; display:flex;">${gearSvg}</div></div>`;

                let gridHtml = '';
                if (g.best.mix) {
                    const b = g.best; let pctX = (val) => (val / b.w) * 100; let pctY = (val) => (val / b.h) * 100; let gridContent = '';
                    const addCells = (cx, cy, w, h, ox, oy) => { for (let yi = 0; yi < cy; yi++) { for (let xi = 0; xi < cx; xi++) { gridContent += `<div class="card-cell" style="position:absolute; left:${pctX(ox + xi * w)}%; top:${pctY(oy + yi * h)}%; width:${pctX(w)}%; height:${pctY(h)}%; border-radius: 2px; border: 1px dashed #64748b; background: #ffffff;"></div>`; } } };
                    addCells(b.nx, b.ny, b.w1, b.h1, 0, 0); if (b.remType === 'right') addCells(b.rx, b.ry, b.w2, b.h2, b.nx * b.w1, 0); if (b.remType === 'bottom') addCells(b.bx, b.by, b.w2, b.h2, 0, b.ny * b.h1);
                    gridHtml = `<div class="nv-layout-grid" style="width: 100%; height: 100%; position: relative; background: #cbd5e1; padding: 0;">${gridContent}</div>`;
                } else {
                    let displayX = g.best.x || 1; let displayY = g.best.y || 1; let gridWidth = ((displayX * (g.best.w1) / (g.best.w || 1)) * 100); let gridHeight = ((displayY * (g.best.h1) / (g.best.h || 1)) * 100);
                    gridHtml = `<div class="nv-layout-grid" style="width: ${gridWidth}%; height: ${gridHeight}%; grid-template-columns: repeat(${displayX}, 1fr);">${Array(Math.min(g.best.total || 0, 150)).fill('<div class="card-cell"></div>').join('')}</div>`;
                }
                let tabPriceStr = isMultiLayout ? ` <span style="color:#000;">(${layoutTotalCost.toFixed(2)} BYN)</span>` : '';
                contentsHTML += `<div id="dense-layout-${i}" class="nv-layout-content dense-layout-content ${activeClass}"><div style="font-size: 11px; font-weight: bold; margin-bottom: 5px; text-align: center; color: #666; width: 100%;">Раскладка: ${g.w}x${g.h}${tabPriceStr}</div><div class="nv-sheet-area" style="width: ${(g.best.w || 1) * scale}px; height: ${(g.best.h || 1) * scale}px; display:block;">${gridHtml}<div class="nv-card-grid-txt label-x">${g.best.labelW || ''}</div><div class="nv-card-grid-txt label-y">${g.best.labelH || ''}</div></div></div>`;
            });
            tabsHTML += '</div>';

            if (useManualCuts || cutTogether) { finalTotalRaw += cutCost; finalTotalBaseRaw += cutCost; }

            let finalTotal = 0; let totalNoDiscount = Math.max(finalTotalBaseRaw, 0);
            let isAccRound = document.getElementById('accountantRounding')?.checked;
            if (isAccRound && totalQ > 0) {
                let ppp = Math.round((finalTotalRaw / 1.2) / totalQ * 100) / 100;
                let totalWithoutVat = ppp * totalQ;
                let vat = Math.round(totalWithoutVat * 0.2 * 100) / 100;
                finalTotal = totalWithoutVat + vat;
            } else {
                finalTotal = Math.max(finalTotalRaw, 0);
            }

            if (useManualCuts) { sheetsInfoHTML += `<div style="color:#1a73e8; font-weight:bold; margin-top: 5px;">Ручные резы: ${totalCuts}</div>`; }
            else if (cutTogether && arrGroups.length > 0) { let activeExt = window.layoutExtras['dense'][window.activeLayoutKey['dense']] || {}; sheetsInfoHTML += `<div style="color:#1a73e8; font-weight:bold; margin-top: 5px;">Общая резка: ${activeExt.noCut ? 0 : totalCuts} резов.</div>`; }

            if (arrGroups.length <= 1) tabsHTML = ''; sheetWrapper.innerHTML = tabsHTML + contentsHTML;
            costDetails.cut = cutCost; costDetails.lam = lamCost; costDetails.paper = totalPaperCostAccum; costDetails.print = totalPrintCostAccum;

            document.getElementById('denseTotalPrice').textContent = finalTotal.toFixed(2);
            if (finalTotal < totalNoDiscount - 0.01) { document.getElementById('denseOldPrice').textContent = totalNoDiscount.toFixed(2) + " BYN"; document.getElementById('denseOldPrice').style.display = 'block'; } else document.getElementById('denseOldPrice').style.display = 'none';

            let pppEl = document.getElementById('densePricePerPiece');
            if (totalQ > 0 && finalTotal > 0) { pppEl.innerHTML = `Цена за 1 шт: <span>${(finalTotal / totalQ).toFixed(3)}</span> BYN`; pppEl.style.display = 'block'; } else pppEl.style.display = 'none';

            let allImpInfo = [impColor > 0 ? `Цвет (плотная): ${impColor}` : "", impBW > 0 ? `Ч/Б (плотная): ${impBW}` : "", impOfficeBW > 0 ? `Ч/Б (офисная): ${impOfficeBW}` : ""].filter(Boolean).join(" | ");
            document.getElementById('denseSheetsRequired').innerHTML = `<div style="margin-bottom:8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">Всего листов: <b>${totalSheets} шт.</b> | Оттисков для скидок -> ${allImpInfo}</div><div style="text-align: left; font-size: 11.5px; line-height: 1.4;">${sheetsInfoHTML}</div>`;

            if (finalTotal > 0) {
                let title = document.getElementById('denseMultiToggle').checked ? `Сборка (${arrGroups.length} мак.)` : `${document.getElementById('denseWidth').value || 0}x${document.getElementById('denseHeight').value || 0} (${document.getElementById('denseQuantity').value || 0} шт)`;
                let sheetFormatStr = document.getElementById('denseSheetSelect').querySelector('.nv-select-trigger').textContent.split(' ')[0];
                let actualCuts = (useManualCuts || cutTogether) ? totalCuts : arrGroups.reduce((s, g) => s + g.groupCuts, 0);
                window.currentCalcData = { tab: 'tab-dense', title: title, price: finalTotal.toFixed(2), size: title, qty: totalQ, sheetFormat: sheetFormatStr, sheets: totalSheets, impressions: Math.max(impColor, impBW, impOfficeBW), globalCuts: (useManualCuts || cutTogether) ? totalCuts : 0, globalCutCost: (useManualCuts || cutTogether) ? cutCost : 0, cuts: actualCuts, extrasQty: extrasQty, tabName: "Плотные", layoutsArr: layoutsDataArr, perLayout: perLayout, printPrice: (finalTotal - cutCost - lamCost - extraCost).toFixed(2), costDetails: costDetails, customModsDetails: cMods.details };
            }
        }

function getDenseLayouts() { let layouts = []; const isMulti = document.getElementById('denseMultiToggle').checked; let globalSheetStr = document.getElementById('denseSheetSelect').getAttribute('data-value') || "450x320"; if (!isMulti) { let w = parseInt(document.querySelector('.dm-w-single').value) || 0; let h = parseInt(document.querySelector('.dm-h-single').value) || 0; let q = parseInt(document.querySelector('.dm-q-single').value) || 0; if (w >= 40 && h >= 40 && q > 0) layouts.push({ w, h, q, id: 'item_0', sheetStr: globalSheetStr }); } else { document.querySelectorAll('.dense-multi-row').forEach((row, i) => { let w = parseInt(row.querySelector('.dm-w').value) || 0; let h = parseInt(row.querySelector('.dm-h').value) || 0; let q = parseInt(row.querySelector('.dm-q').value) || 0; let sheetStr = window.layoutExtras['dense'][`item_${i}`]?.sheetStr || globalSheetStr; if (w >= 40 && h >= 40 && q > 0) layouts.push({ w, h, q, id: `item_${i}`, sheetStr }); }); } return layouts; }

function addDenseRow() { const div = document.createElement('div'); div.className = 'nv-multi-row dense-multi-row'; div.style.position = 'relative'; div.innerHTML = `<div class="nv-custom-select" style="width: auto; flex-shrink: 0; display:flex; align-items:center;"><div style="font-size:9.5px; color:#888; cursor:pointer; font-weight:800; text-transform:uppercase; padding: 2px 6px; border-radius: 5px; background: #eee; margin-right: 5px;" onclick="toggleSelect(this)">Шабл. ▾</div><div class="nv-options user-size-options" style="width: 180px; left: 0; z-index: 999999;"></div></div><input type="text" inputmode="numeric" class="nv-multi-input dm-w" placeholder="Ш" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()"><input type="text" inputmode="numeric" class="nv-multi-input dm-h" placeholder="В" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()"><input type="text" inputmode="numeric" class="nv-multi-input dm-q" placeholder="Кол-во" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()" onblur="snapDenseQuantity(this)"><button class="nv-multi-del" onclick="this.parentElement.remove(); calculateDensePrice()">×</button><div onclick="window.openLayoutDetailsModalFromRow(this, 'dense')" style="cursor:pointer; display:flex; align-items:center; margin-left:5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>`; document.getElementById('denseMultiList').appendChild(div); div.querySelector('.dm-q').addEventListener('wheel', handleDenseWheel, { passive: false }); renderAllSizePresets(); }

function toggleDenseMulti() { const isMulti = document.getElementById('denseMultiToggle').checked; document.getElementById('denseSingleBlock').style.display = isMulti ? 'none' : 'block'; document.getElementById('denseMultiBlock').style.display = isMulti ? 'block' : 'none'; calculateDensePrice(); }

function snapDenseQuantity(inputEl) { let qty = parseInt(inputEl.value) || 0; if (qty > 0) inputEl.value = qty; calculateDensePrice(); }

function handleDenseWheel(e) { e.preventDefault(); let step = 1; let qty = parseInt(this.value) || 0; qty += (e.deltaY < 0 ? step : -step); if (qty < 1) qty = 1; this.value = qty; calculateDensePrice(); }


