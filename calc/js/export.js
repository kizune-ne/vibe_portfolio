

function submitToSheet() {
            let data = window.currentCalcData;
            if (!data) return;

            let category = document.getElementById('modalType').value;
            let customer = document.getElementById('modalUrCustomer').value;
            let jobType = document.getElementById('modalUrJobType').value;
            let note = document.getElementById('modalUrNote') ? document.getElementById('modalUrNote').value : "";

            let pasteRows = [];
            
            let dGlobal = data.costDetails || {};
            let cModText = "";
            if (dGlobal.customMods && dGlobal.customMods.length > 0) {
                cModText = dGlobal.customMods.map(m => m.name + ": " + m.cost.toFixed(2).replace('.', ',')).join(" | ");
            }

            let totalPriceStr = parseFloat(data.price).toFixed(2).replace('.', ',');

            let globalNoteArr = [];
            if (note) globalNoteArr.push(note);
            if (cModText) globalNoteArr.push(cModText);

            globalNoteArr.push("Итого: " + totalPriceStr);
            let finalNote = globalNoteArr.join(" | ");

            if (category === "Юр лица") {
                if (data.perLayout && data.perLayout.length > 0) {
                    data.perLayout.forEach((l, idx) => {
                        let customPaper = document.getElementById('modalUrPaper_' + idx) ? document.getElementById('modalUrPaper_' + idx).value : '';
                        let d = l.costs || {}; let eq = l.extrasQty || {};
                        let lamStr = ""; if ((d.lam && d.lam > 0) || (l.lamType && l.lamType !== "Нет")) lamStr = l.lamType;
                        let plotterSheets = (d.plotter && d.plotter > 0) ? (l.sheets || "") : "";
                        let cuts = (idx === 0 && (data.globalCuts > 0 || data.globalCutCost > 0)) ? data.globalCuts : (l.cuts || "");
                        if (cuts === 0) cuts = "";
                        let roundingQty = (d.rounding && d.rounding > 0) ? eq.rounding : "";
                        let stapleQty = (d.staple && d.staple > 0) ? eq.staple : "";

                        let layoutNoteArr = [];
                        if (eq.foil && eq.foil > 0) layoutNoteArr.push("Фольга: " + eq.foil + " л.");
                        if (eq.glue && eq.glue > 0) layoutNoteArr.push("Склейка: " + eq.glue + " шт.");
                        if (l.customMods && l.customMods.length > 0) l.customMods.forEach(mod => { let modName = mod.name || mod.desc.split(' (')[0]; layoutNoteArr.push(modName + " " + mod.cost.toFixed(2)); });
                        if (idx === 0 && finalNote) layoutNoteArr.push(finalNote);
                        let rowNote = layoutNoteArr.join(" | ");

                        let finalColor = (l.color === "ЧБ" || l.color === "Ч/Б") ? "1+0" : l.color === "Цвет" ? "4+0" : l.color;
                        if (finalColor && typeof finalColor === 'string') {
                            finalColor = finalColor.replace(/\s+/g, '');
                            if (finalColor.includes('4+0')) finalColor = '4+0';
                            else if (finalColor.includes('4+4')) finalColor = '4+4';
                            else if (finalColor.includes('1+0')) finalColor = '1+0';
                            else if (finalColor.includes('1+1')) finalColor = '1+1';
                            else if (finalColor.includes('4+1')) finalColor = '4+1';
                        }

                        let urRow = new Array(29).fill("");
                        if (idx === 0) { urRow[0] = customer; urRow[1] = jobType; }
                        urRow[4] = l.size || data.size; urRow[5] = l.qty || ""; urRow[6] = finalColor || ""; 
                        urRow[7] = customPaper || l.mat || ""; // Бумага в ячейку K
                        urRow[8] = l.sheetFormat || ""; urRow[9] = l.sheets || ""; urRow[10] = l.impressions || "";
                        urRow[11] = cuts; urRow[12] = lamStr; urRow[13] = plotterSheets; urRow[14] = eq.crease || "";
                        urRow[15] = eq.fold || ""; urRow[17] = eq.eyelet || ""; urRow[19] = eq.punch || "";
                        urRow[20] = roundingQty; urRow[22] = stapleQty; urRow[25] = rowNote; // Примечание в ячейку AC

                        pasteRows.push(urRow);
                    });
                } else {
                    let customPaper = document.getElementById('modalUrPaper_0') ? document.getElementById('modalUrPaper_0').value : '';
                    let lamStr = data.lamType !== "Нет" ? data.lamType : "";
                    let urRow = new Array(29).fill("");
                    urRow[0] = customer;
                    urRow[1] = jobType;
                    urRow[4] = data.size;
                    urRow[5] = data.qty;
                    urRow[6] = data.color;
                    urRow[7] = customPaper || data.mat || ''; // Бумага в ячейку K
                    urRow[8] = data.sheetFormat;
                    urRow[9] = data.sheets;
                    urRow[10] = data.impressions || "";
                    urRow[11] = data.cuts || "";
                    urRow[12] = lamStr;
                    urRow[25] = finalNote; // Примечание в ячейку AC
                    pasteRows.push(urRow);
                }
            } else {
                function addPasteRow(service, format, material, color, qty, sum) {
                    if (parseFloat(sum) > 0 || parseFloat(qty) > 0) pasteRows.push([service, format || "", material || "", color || "", qty || "", parseFloat(sum).toFixed(2).replace('.', ','), ""]);
                }
                if (data.perLayout && data.perLayout.length > 0) {
                    data.perLayout.forEach((l, idx) => {
                        let d = l.costs || {}; let eq = l.extrasQty || {};
                        let printSum = typeof d.printAndMat !== 'undefined' ? d.printAndMat : ((d.print || 0) + (d.paper || 0) + (d.scan || 0));
                        let serviceName = typeof d.scan !== 'undefined' ? "сканирование" : "печать";
                        
                        let customPaper = document.getElementById('modalUrPaper_' + idx) ? document.getElementById('modalUrPaper_' + idx).value : '';
                        let finalMat = customPaper || (l.mat === "-" ? "" : l.mat);
                        let finalColor = (l.color === "ЧБ" || l.color === "Ч/Б") ? "1+0" : l.color === "Цвет" ? "4+0" : l.color;
                        if (finalColor && typeof finalColor === 'string') {
                            finalColor = finalColor.replace(/\s+/g, '');
                            if (finalColor.includes('4+0')) finalColor = '4+0';
                            else if (finalColor.includes('4+4')) finalColor = '4+4';
                            else if (finalColor.includes('1+0')) finalColor = '1+0';
                            else if (finalColor.includes('1+1')) finalColor = '1+1';
                            else if (finalColor.includes('4+1')) finalColor = '4+1';
                        }
                        let exportFmt;
                        let exportQty;
                        if (data.tab === 'tab-drawings') {
                            exportFmt = l.size || l.sheetFormat;
                            exportQty = l.qty;
                        } else if (data.tab === 'tab-bizcards' || data.tab === 'tab-stickers') {
                            exportFmt = l.size;
                            exportQty = l.sheets || l.qty;
                        } else {
                            exportFmt = l.sheetFormat;
                            exportQty = l.sheets || l.qty;
                        }

                        if (printSum > 0) addPasteRow(serviceName, exportFmt, finalMat, finalColor, exportQty, printSum);

                        if (d.lam && d.lam > 0) addPasteRow("ламинация", "", l.lamType || "", "", l.sheets, d.lam);
                        if (d.cut && d.cut > 0) addPasteRow("резка, рез", "", "", "", l.cuts || 0, d.cut);
                        if (d.rounding && d.rounding > 0) addPasteRow("скругление", "", "", "", eq.rounding || l.qty, d.rounding);
                        if (d.crease && d.crease > 0) addPasteRow("биговка", "", "", "", eq.crease || l.qty, d.crease);
                        if (d.eyelet && d.eyelet > 0) addPasteRow("установка люверсов", "", "", "", eq.eyelet || l.qty, d.eyelet);
                        if (d.staple && d.staple > 0) addPasteRow("сшивка", "", "", "", eq.staple || l.qty, d.staple);
                        if (d.punch && d.punch > 0) addPasteRow("дыроколение", "", "", "", eq.punch || l.qty, d.punch);
                        if (d.glue && d.glue > 0) addPasteRow("склейка", "", "", "", eq.glue || l.qty, d.glue);
                        if (d.foil && d.foil > 0) addPasteRow("фольгирование", "", "", "", eq.foil || l.sheets, d.foil);
                        if (d.plotter && d.plotter > 0) addPasteRow("плоттерная резка", "", "", "", l.sheets, d.plotter);
                        if (d.fold && d.fold > 0) addPasteRow("фальцовка", "", "", "", eq.fold || l.qty, d.fold);
                        if (l.customMods && l.customMods.length > 0) l.customMods.forEach(mod => { let modName = mod.name || mod.desc.split(' (')[0]; addPasteRow(modName, "", "", "", mod.qty || "", mod.cost); });
                    });
                    if (data.globalCuts > 0 || data.globalCutCost > 0) addPasteRow("резка, рез", "", "", "", data.globalCuts, data.globalCutCost || 0);
                    let dGlobal = data.costDetails || {};
                    if (dGlobal.customMods && dGlobal.customMods.length > 0) dGlobal.customMods.forEach(mod => { let modName = mod.name || mod.desc.split(' (')[0]; addPasteRow(modName, "", "", "", mod.qty || "", mod.cost); });
                }
                if (pasteRows.length > 0) { pasteRows[0][6] = parseFloat(data.price).toFixed(2).replace('.', ','); }
            }

            let tsvString = pasteRows.map(r => r.map(cell => String(cell).replace(/[\\r\\n\\t]+/g, ' ').trim()).join('\t')).join('\n');
            copyToClipboard(tsvString, document.getElementById('modalSubmitBtn'));
            setTimeout(() => { closeSheetModal(); }, 1200);
        }

function copyToClipboard(text, btn) {
            let textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                if (btn) {
                    let oldText = btn.textContent;
                    btn.textContent = "СКОПИРОВАНО!";
                    btn.style.background = "#1a73e8";
                    btn.style.color = "#fff";
                    setTimeout(() => {
                        btn.textContent = oldText;
                        btn.style.background = "#000";
                        btn.style.color = "var(--nv-yellow)";
                    }, 2000);
                }
            } catch (err) {
                alert('Не удалось скопировать. Скопируйте вручную:\n\n' + text);
            }
            textArea.remove();
        }

function closeSheetModal() { document.getElementById('nv-sheet-modal').style.display = 'none'; }


