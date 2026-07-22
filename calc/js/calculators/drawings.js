


function calculateDrawPrice() {
            window.currentCalcData = null; let rows = document.querySelectorAll('.draw-multi-row'), totalCostRaw = 0, detailsHtml = "", layoutsDataArr = [], totalQty = 0, totalFoldsCount = 0, simpleImp = 0; let costDetails = { print: 0, fold: 0 };
            function getStandardFolds(fmt, mult) { let m = Math.ceil(mult); if (fmt === 'A4') return Math.max(0, m - 1); if (fmt === 'A3') return m === 1 ? 1 : m + 1; if (fmt === 'A2') return m === 1 ? 2 : 2 * m; if (fmt === 'A1') return m === 1 ? 3 : 2 * m + 2; if (fmt === 'A0') return m === 1 ? 5 : 2 * m + 4; return 0; }

            let engGroups = {}, simpleItems = [], scanItems = [];
            rows.forEach((r, i) => {
                let jobType = r.querySelector('.dr-job-type').value; let fmt = r.querySelector('.dr-format').value; let mult = parseFloat(r.querySelector('.dr-mult') ? r.querySelector('.dr-mult').value : 1) || 1; let q = parseInt(r.querySelector('.dr-q').value) || 0; let fold = r.querySelector('.dr-fold').checked; let color = r.querySelector('.dr-color') ? r.querySelector('.dr-color').checked : false; let w = parseInt(r.querySelector('.dr-w').value) || 0; let h = parseInt(r.querySelector('.dr-h').value) || 0;
                let rowFolds = 0; if (fold && q > 0 && jobType === 'print') { if (fmt === 'Custom') { if (w > 0 && h > 0) rowFolds = (Math.max(0, Math.ceil(w / 210) - 1) + Math.max(0, Math.ceil(h / 297) - 1)); } else { rowFolds = getStandardFolds(fmt, mult); } }
                if (q <= 0) return;
                if (fmt !== 'Custom' && ['A4', 'A3', 'A2'].includes(fmt) && mult === 2) return;
                if (jobType === 'scan') { if (fmt === 'Custom' && (w <= 0 || h <= 0)) return; scanItems.push({ fmt, mult, q, color, w, h, isCustom: fmt === 'Custom', rowFolds: 0 }); }
                else { if (fmt !== 'Custom' && mult === 1 && (fmt === 'A4' || fmt === 'A3')) { simpleImp += (fmt === 'A4' ? 0.5 : 1) * q; simpleItems.push({ fmt, mult, q, fold, color, rowFolds }); } else { if (fmt === 'Custom' && (w <= 0 || h <= 0)) return; let key = fmt === 'Custom' ? `Custom_${w}x${h}_${i}` : `${fmt}x${mult}_${i}`; engGroups[key] = { fmt, mult, w, h, isCustom: fmt === 'Custom', q, fold, color, rowFolds }; } }
            });

            let sIdx = getGlobalDiscountTier() || (simpleImp <= 10 ? 0 : simpleImp <= 50 ? 1 : simpleImp <= 100 ? 2 : simpleImp <= 300 ? 3 : 4);
            let perLayout = [];

            simpleItems.forEach(item => {
                let pArr = item.fmt === 'A4' ? (item.color ? getP("Печать SRA3", "Цвет_A4") : getP("Печать SRA3", "Офисная_A4")) : (item.color ? getP("Печать SRA3", "Цвет_A3") : getP("Печать SRA3", "Офисная_A3")); let cost = pArr[sIdx] * item.mult * item.q; let fCost = item.rowFolds > 0 ? (item.rowFolds * APP_PRICES["Доп. работы"]["Фальцовка"] * item.q) : 0;
                perLayout.push({ size: item.fmt + (item.mult !== 1 ? 'x' + item.mult : ''), sheetFormat: item.fmt + (item.mult !== 1 ? 'x' + item.mult : ''), mat: "Инженерная 80 г/м²", color: item.color ? "Цвет" : "1+0", qty: item.q, sheets: item.q * item.mult, impressions: item.q * item.mult, costs: { printAndMat: cost, fold: fCost }, extrasQty: { fold: item.rowFolds * item.q } });
                costDetails.fold += fCost; costDetails.print += cost; cost += fCost; totalFoldsCount += (item.rowFolds * item.q); totalCostRaw += cost; totalQty += item.q;
                let desc = "Печать " + item.fmt + (item.mult !== 1 ? 'x' + item.mult : '') + " " + (item.color ? 'Цвет' : 'Ч/Б') + (item.rowFolds > 0 ? " (" + item.rowFolds * item.q + " фальц.)" : ''); detailsHtml += "• <b>" + desc + "</b>: " + item.q + " шт. - " + cost.toFixed(2) + " BYN<br>"; layoutsDataArr.push({ size: desc, qty: item.q });
            });

            Object.values(engGroups).forEach(g => {
                let idx = g.q <= 10 ? 0 : g.q <= 20 ? 1 : g.q <= 50 ? 2 : 3, cost = 0, desc = "";
                if (g.isCustom) { let S = Math.min(g.w, g.h), L = Math.max(g.w, g.h); let closest = [{ w: 210, base: 'A4', div: 297 }, { w: 297, base: 'A4', div: 210 }, { w: 420, base: 'A3', div: 297 }, { w: 594, base: 'A2', div: 420 }, { w: 841, base: 'A1', div: 594 }].reduce((prev, curr) => Math.abs(curr.w - S) < Math.abs(prev.w - S) ? curr : prev); cost = getP("Чертежи Печать", closest.base, idx) * (L / closest.div) * g.q; desc = `Печать (Свой размер) ${g.w}x${g.h} мм`; }
                else { cost = getP("Чертежи Печать", g.fmt, idx) * g.mult * g.q; desc = `Печать ${g.fmt}${g.mult !== 1 ? 'x' + g.mult : ''} ${g.color ? 'Цвет' : 'Ч/Б'}`; }
                let fCost = g.rowFolds > 0 ? (g.rowFolds * APP_PRICES["Доп. работы"]["Фальцовка"] * g.q) : 0;
                perLayout.push({ size: g.isCustom ? (g.w + "x" + g.h) : g.fmt + (g.mult !== 1 ? 'x' + g.mult : ''), sheetFormat: g.isCustom ? "Разный" : g.fmt + (g.mult !== 1 ? 'x' + g.mult : ''), mat: "Инженерная 80 г/м²", color: g.color ? "Цвет" : "Ч/Б", qty: g.q, sheets: g.q * g.mult, impressions: g.q * g.mult, costs: { printAndMat: cost, fold: fCost }, extrasQty: { fold: g.rowFolds * g.q } });
                costDetails.fold += fCost; costDetails.print += cost; cost += fCost; if (g.rowFolds > 0) { totalFoldsCount += (g.rowFolds * g.q); desc += ` (${g.rowFolds * g.q} фальц.)`; }
                totalCostRaw += cost; totalQty += g.q; detailsHtml += `• <b>${desc}</b>: ${g.q} шт. - ${cost.toFixed(2)} BYN<br>`; layoutsDataArr.push({ size: desc, qty: g.q });
            });

            scanItems.forEach(g => {
                let cost = 0, desc = "";
                if (g.isCustom) { let S = Math.min(g.w, g.h), L = Math.max(g.w, g.h); let closest = [{ w: 210, base: 'A4', div: 297 }, { w: 297, base: 'A4', div: 210 }, { w: 420, base: 'A3', div: 297 }, { w: 594, base: 'A2', div: 420 }, { w: 841, base: 'A1', div: 594 }].reduce((prev, curr) => Math.abs(curr.w - S) < Math.abs(prev.w - S) ? curr : prev); let pColor = getP("Чертежи Скан", closest.base + (g.color ? "_Цвет" : "_ЧБ")) || 0; cost = pColor * (L / closest.div) * g.q; desc = `Скан (Свой размер) ${g.w}x${g.h} мм ${g.color ? 'Цвет' : 'Ч/Б'}`; }
                else { let pColor = getP("Чертежи Скан", g.fmt + (g.color ? "_Цвет" : "_ЧБ")) || 0; cost = pColor * g.mult * g.q; desc = `Скан ${g.fmt}${g.mult !== 1 ? 'x' + g.mult : ''} ${g.color ? 'Цвет' : 'Ч/Б'}`; }
                perLayout.push({ size: g.isCustom ? (g.w + "x" + g.h) : g.fmt + (g.mult !== 1 ? 'x' + g.mult : ''), sheetFormat: g.isCustom ? "Разный" : g.fmt + (g.mult !== 1 ? 'x' + g.mult : ''), mat: "-", color: g.color ? "Цвет" : "1+0", qty: g.q, sheets: g.q * g.mult, impressions: g.q * g.mult, costs: { scan: cost }, extrasQty: {} });
                costDetails.print += cost || 0; totalCostRaw += cost || 0; totalQty += g.q || 0; detailsHtml += `• <b>${desc}</b>: ${g.q} шт. - ${(cost || 0).toFixed(2)} BYN<br>`; layoutsDataArr.push({ size: desc, qty: g.q });
            });

            let cMods = getCustomModulesInfo(totalQty, totalQty); totalCostRaw += cMods.total; if (cMods.details.length > 0) costDetails.customMods = cMods.details;

            let totalCost = 0;
            let isAccRound = document.getElementById('accountantRounding')?.checked;
            if (isAccRound && totalQty > 0) {
                let withoutVat = totalCostRaw / 1.2;
                let ppp = Math.round((withoutVat / totalQty) * 100) / 100;
                totalCost = ppp * totalQty * 1.2;
            } else {
                totalCost = Math.max(totalCostRaw, 0);
            }

            document.getElementById('drawTotalPrice').textContent = totalCost.toFixed(2);
            let pppEl = document.getElementById('drawPricePerPiece'); if (totalQty > 0 && totalCost > 0) { pppEl.innerHTML = `Средняя цена за 1 шт: <span>${(totalCost / totalQty).toFixed(3)}</span> BYN`; pppEl.style.display = 'block'; } else { pppEl.style.display = 'none'; }
            document.getElementById('drawSummaryDetails').innerHTML = detailsHtml || "Добавьте чертежи для расчета";

            if (totalCost > 0) { window.currentCalcData = { tab: 'tab-drawings', title: `Чертежи и Скан (${totalQty} шт)`, price: totalCost.toFixed(2), qty: totalQty, tabName: "Чертежи", layoutsArr: layoutsDataArr, perLayout: perLayout, printPrice: totalCost.toFixed(2), color: "Смешанный", mat: "Инженерная 80 г/м²", sheets: totalQty, impressions: totalQty, folds: totalFoldsCount, sheetFormat: "Разный", extrasQty: { fold: totalFoldsCount }, costDetails: costDetails, customModsDetails: cMods.details }; }
        }

function addDrawRow(type = 'standard') {
            const div = document.createElement('div'); div.className = 'nv-multi-row draw-multi-row'; div.style.flexWrap = 'wrap';
            let selectJobType = `<select class="nv-multi-input dr-job-type" style="width:90px; padding:12px 5px;" onchange="updateDrawRow(this); calculateDrawPrice()"><option value="print">Печать</option><option value="scan">Скан</option></select>`;
            let content = type === 'standard' ? `${selectJobType}<select class="nv-multi-input dr-format" style="width:70px; padding:12px 5px;" onchange="updateDrawRow(this)"><option value="A4">A4</option><option value="A3">A3</option><option value="A2">A2</option><option value="A1">A1</option><option value="A0">A0</option></select><span class="dr-mult-cross" style="font-weight:bold; color:#aaa; margin:0 2px;">x</span><input type="number" class="nv-multi-input dr-mult" value="1" min="0.1" step="0.1" style="width:60px; padding:12px 5px;" oninput="updateDrawRow(this)"><input type="hidden" class="dr-w" value="210"><input type="hidden" class="dr-h" value="297">` : `${selectJobType}<div style="font-size:11px; font-weight:bold; margin-right:5px; color:#555;">СВОЙ:</div><input type="hidden" class="dr-format" value="Custom"><input type="hidden" class="dr-mult" value="1"><input type="text" class="nv-multi-input dr-w" placeholder="Ш" value="" style="width:60px;" oninput="this.value = this.value.replace(/\\D/g, ''); updateDrawRow(this)"><span class="dr-mult-cross" style="font-weight:bold; color:#aaa; margin:0 2px;">x</span><input type="text" class="nv-multi-input dr-h" placeholder="В" value="" style="width:60px;" oninput="this.value = this.value.replace(/\\D/g, ''); updateDrawRow(this)">`;
            div.innerHTML = `<div style="display:flex; align-items:center; gap:5px; flex:1; width:100%;">${content}<input type="text" class="nv-multi-input dr-q" placeholder="Шт" style="width:50px;" value="1" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDrawPrice()"><label class="nv-crease-label dr-color-label" style="flex-direction:row; margin-left:5px; display:none;"><input type="checkbox" class="dr-color" onchange="calculateDrawPrice()"><span class="nv-crease-checkbox"></span> Цвет</label><label class="nv-crease-label dr-fold-label" style="flex-direction:row; margin-left:5px;"><input type="checkbox" class="dr-fold" onchange="calculateDrawPrice()"><span class="nv-crease-checkbox"></span> Фальц</label><button class="nv-multi-del" onclick="this.parentElement.parentElement.remove(); calculateDrawPrice()">×</button></div>`;
            document.getElementById('drawMultiList').appendChild(div);
            let multInput = div.querySelector('.dr-mult'); if (multInput) { multInput.addEventListener('wheel', function (e) { e.preventDefault(); let val = parseFloat(this.value) || 1; val += e.deltaY < 0 ? 1 : -1; if (val < 0.1) val = 0.1; this.value = (Math.round(val * 10) / 10).toString().replace('.0', ''); updateDrawRow(this); }); }
            let qInput = div.querySelector('.dr-q'); if (qInput) { qInput.addEventListener('wheel', function (e) { e.preventDefault(); let val = parseInt(this.value) || 1; val += e.deltaY < 0 ? 1 : -1; if (val < 1) val = 1; this.value = val; calculateDrawPrice(); }); }
            updateDrawRow(div.querySelector(type === 'standard' ? '.dr-format' : '.dr-w'));
        }

function updateDrawRow(el) {
            const row = el.closest('.draw-multi-row'); const fmt = row.querySelector('.dr-format').value; const jobType = row.querySelector('.dr-job-type').value; const isCustom = fmt === 'Custom';

            let multInput = row.querySelector('.dr-mult');
            let mult = multInput ? (parseFloat(multInput.value) || 1) : 1;

            let existingErr = row.querySelector('.dr-mult-error');
            if (existingErr) existingErr.remove();

            if (fmt !== 'Custom' && ['A4', 'A3', 'A2'].includes(fmt) && mult === 2) {
                let errMsg = document.createElement('div');
                errMsg.className = 'dr-mult-error';
                errMsg.style.cssText = 'color: #ff3333; font-size: 11px; font-weight: bold; width: 100%; text-align: center; margin-top: 5px;';
                errMsg.innerText = `Ошибка: ${fmt}x2 недоступен. Выберите ${fmt}x1, ${fmt}x3 или другой формат.`;
                row.appendChild(errMsg);
            }

            if (isCustom) { row.querySelector('.dr-w').style.display = 'inline-block'; row.querySelector('.dr-h').style.display = 'inline-block'; if (row.querySelector('.dr-mult-cross')) row.querySelector('.dr-mult-cross').style.display = 'none'; if (row.querySelector('.dr-mult')) row.querySelector('.dr-mult').style.display = 'none'; } else { row.querySelector('.dr-w').style.display = 'none'; row.querySelector('.dr-h').style.display = 'none'; if (row.querySelector('.dr-mult-cross')) row.querySelector('.dr-mult-cross').style.display = 'inline-block'; if (row.querySelector('.dr-mult')) row.querySelector('.dr-mult').style.display = 'inline-block'; }

            let allowColor = false;
            if (jobType === 'scan') {
                allowColor = true;
            } else {
                if (!isCustom && (fmt === 'A4' || fmt === 'A3') && mult === 1) {
                    allowColor = true;
                }
            }

            if (allowColor) {
                row.querySelector('.dr-color-label').style.display = 'flex';
            } else {
                row.querySelector('.dr-color-label').style.display = 'none';
                row.querySelector('.dr-color').checked = false;
            }

            if (jobType === 'scan') { row.querySelector('.dr-fold-label').style.display = 'none'; row.querySelector('.dr-fold').checked = false; } else { row.querySelector('.dr-fold-label').style.display = 'flex'; }
            calculateDrawPrice();
        }


