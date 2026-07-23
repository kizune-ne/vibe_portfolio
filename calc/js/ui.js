












window.layoutOverrides = {};
        window.layoutExtras = { dense: {}, biz: {} };
        window.activeLayoutKey = { dense: null, biz: null };
        window.currentLamPrefix = null;
        window.lastSelectedDensities = window.lastSelectedDensities || { dense: {}, biz: {} };

        function renderCustomModules() {
            let mods = JSON.parse(localStorage.getItem('nvCustomMods') || '[]');
            let html = '';
            mods.forEach((m, i) => {
                html += `<div class="custom-mod-item" data-idx="${i}" style="display:flex; justify-content:space-between; align-items:center; background:#fafafa; padding:8px 10px; border-radius:5px; border:1px solid #eee; font-size:11px; margin-bottom: 5px;">`;
                if (m.type === 'once' || m.type === 'qty' || m.type === 'sheets' || m.type === 1 || m.type === 2) {
                    let typeLabel = m.type === 'once' || m.type === 1 ? 'разово' : (m.type === 'qty' ? 'за шт' : 'за лист');
                    html += `<label style="display:flex; gap:5px; align-items:center; cursor:pointer; flex:1;"><input type="checkbox" class="cmod-cb" onchange="recalculateActiveTab()"> <b>${m.name}</b> <span style="color:#888;">(${m.price.toFixed(2)} ${typeLabel})</span></label>`;
                } else if (m.type === 'input_qty' || m.type === 'input_time') {
                    let ph = m.type === 'input_time' ? 'мин' : 'шт';
                    let pr = m.type === 'input_time' ? '/ч' : '/шт';
                    html += `<label style="display:flex; gap:5px; align-items:center; cursor:pointer; flex:1;"><input type="checkbox" class="cmod-cb" onchange="recalculateActiveTab()"> <b>${m.name}</b> <span style="color:#888;">(${m.price.toFixed(2)}${pr})</span></label> <input type="number" class="cmod-val" min="0" placeholder="${ph}" style="width:45px; padding:2px; font-size:11px; border:1px solid #ccc; border-radius:3px;" oninput="this.parentElement.querySelector('.cmod-cb').checked = this.value > 0; recalculateActiveTab()">`;
                }
                html += `<button onclick="removeCustomModule(${i})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; font-size:14px; padding: 0 5px;">×</button></div>`;
            });
            if (mods.length === 0) html = '<div style="font-size:10px; color:#aaa; text-align:center;">Нет добавленных модулей</div>';
            document.getElementById('customModulesContainer').innerHTML = html;
        }

        window.updateCustomModuleDropdowns = function() {
            let targets = document.querySelectorAll('.cmod-target');
            if (targets.length === 0) return;
            
            // Only show dropdown if dense tab is active and has multiple layouts
            let isDenseActive = document.getElementById('tab-dense').classList.contains('active');
            let isMulti = isDenseActive && document.getElementById('denseMultiToggle')?.checked && window.layouts && window.layouts.length > 1;
            
            targets.forEach(sel => {
                if (!isMulti) {
                    sel.style.display = 'none';
                    sel.value = 'all';
                } else {
                    let currentVal = sel.value;
                    sel.style.display = 'block';
                    let opts = `<option value="all">Ко всем макетам</option>`;
                    window.layouts.forEach((l, idx) => {
                        opts += `<option value="${l.id}">К Макету ${idx+1} (${l.w}x${l.h})</option>`;
                    });
                    sel.innerHTML = opts;
                    if (currentVal && sel.querySelector(`option[value="${currentVal}"]`)) {
                        sel.value = currentVal;
                    }
                }
            });
        }

        let currentCustomModTabId = null;
        let currentCustomModLayoutId = null;

        function openCustomModModal(tabId = null, layoutId = null) {
            currentCustomModTabId = tabId;
            currentCustomModLayoutId = layoutId;
            document.getElementById('cmodName').value = '';
            document.getElementById('cmodPrice').value = '';
            document.getElementById('cmodType').value = 'once';
            updateCmodPriceLabel();
            document.getElementById('nv-custom-mod-modal').style.display = 'flex';
        }

        function closeCustomModModal() {
            document.getElementById('nv-custom-mod-modal').style.display = 'none';
        }

        function updateCmodPriceLabel() {
            let type = document.getElementById('cmodType').value;
            document.getElementById('cmodPriceLabel').textContent = type === 'input_time' ? 'Цена за ЧАС (BYN)' : 'Цена (BYN)';
        }

        function saveCustomModule() {
            let name = document.getElementById('cmodName').value;
            let price = parseFloat(document.getElementById('cmodPrice').value.replace(',', '.'));
            let type = document.getElementById('cmodType').value;
            if (!name || isNaN(price)) { alert('Заполните название и корректную цену!'); return; }

            if (currentCustomModTabId && currentCustomModLayoutId) {
                let tab = currentCustomModTabId;
                if (!window.layoutExtras[tab]) window.layoutExtras[tab] = {};
                if (!window.layoutExtras[tab][currentCustomModLayoutId]) window.layoutExtras[tab][currentCustomModLayoutId] = {};
                if (!window.layoutExtras[tab][currentCustomModLayoutId].customModules) window.layoutExtras[tab][currentCustomModLayoutId].customModules = [];
                
                window.layoutExtras[tab][currentCustomModLayoutId].customModules.push({ name, price, type });
                closeCustomModModal();
                
                if (tab === 'dense') calculateDensePrice();
                else if (tab === 'stickers') calculateStickerPrice();
                else if (tab === 'bizcards') calculateBizPrice();
                
                if (window.openLayoutDetailsModal) {
                    window.openLayoutDetailsModal(tab, currentCustomModLayoutId);
                }
            } else {
                let mods = JSON.parse(localStorage.getItem('nvCustomMods') || '[]');
                mods.push({ name, price, type });
                localStorage.setItem('nvCustomMods', JSON.stringify(mods));
                renderCustomModules();
                closeCustomModModal();
            }
        }

        function removeCustomModule(i) {
            let mods = JSON.parse(localStorage.getItem('nvCustomMods') || '[]');
            mods.splice(i, 1);
            localStorage.setItem('nvCustomMods', JSON.stringify(mods));
            renderCustomModules();
            recalculateActiveTab();
        }

        function getCustomModulesInfo(totalQty, totalSheets) {
            let mods = JSON.parse(localStorage.getItem('nvCustomMods') || '[]');
            let total = 0; let details = [];
            document.querySelectorAll('.custom-mod-item').forEach(el => {
                let m = mods[parseInt(el.dataset.idx)];
                if (!m) return;
                let cb = el.querySelector('.cmod-cb');
                if (cb && cb.checked) {
                    let cost = 0; let desc = m.name; let qtyForMod = 0;
                    if (m.type === 'once' || m.type === 1) { cost = m.price; qtyForMod = 1; }
                    else if (m.type === 'qty') { cost = m.price * totalQty; qtyForMod = totalQty; }
                    else if (m.type === 'sheets' || m.type === 2) { cost = m.price * totalSheets; qtyForMod = totalSheets; }
                    else if (m.type === 'input_qty') { let val = parseInt(el.querySelector('.cmod-val').value) || 0; cost = m.price * val; qtyForMod = val; }
                    else if (m.type === 'input_time') { let val = parseInt(el.querySelector('.cmod-val').value) || 0; cost = (m.price / 60) * val; qtyForMod = val; }
                    if (cost > 0) { total += cost; details.push({ name: m.name, cost: cost, desc: desc, qty: qtyForMod }); }
                }
            });
            return { total: total, details: details };
        }

        function getLayoutCustomModulesCost(tab, layoutId, qty, sheets) {
            let mods = (window.layoutExtras[tab] && window.layoutExtras[tab][layoutId] && window.layoutExtras[tab][layoutId].customModules) ? window.layoutExtras[tab][layoutId].customModules : [];
            let total = 0; let details = [];
            mods.forEach(m => {
                let cost = 0; let desc = m.name; let qtyForMod = 0;
                if (m.type === 'once' || m.type === 1) { cost = m.price; qtyForMod = 1; }
                else if (m.type === 'qty') { cost = m.price * qty; qtyForMod = qty; }
                else if (m.type === 'sheets' || m.type === 2) { cost = m.price * sheets; qtyForMod = sheets; }
                else if (m.type === 'input_qty' || m.type === 'input_time') { cost = m.price; qtyForMod = 1; } 
                if (cost > 0) { total += cost; details.push({ name: m.name, cost: cost, desc: desc, qty: qtyForMod, price: m.price }); }
            });
            return { total: total, details: details };
        }

        function initApp() {
    if (window.appInitialized) return;
    window.appInitialized = true;
            window.activeLayoutKey['biz'] = 'main';
            window.layoutExtras['biz']['main'] = { noCut: false, rounding: false, lam: 'none', punch: false, punchCount: 1, foil: false, plotter: false };
            for (let k in densePaperData) window.lastSelectedDensities.dense[k] = densePaperData[k].dens[0].g;
            for (let k in bizPaperData) window.lastSelectedDensities.biz[k] = bizPaperData[k].dens[0].g;
            let buildMats = (dict) => Object.keys(dict).map(key => `<div class="nv-option" data-value="${key}" onclick="selectCommonOption(this)">${dict[key].name}</div>`).join('');
            document.getElementById('denseMatOptions').innerHTML = buildMats(densePaperData);
            document.getElementById('bizMatOptions').innerHTML = buildMats(bizPaperData);

            loadSheetTemplates(); renderAllSizePresets(); updateDensities('tab-dense'); updateDensities('tab-bizcards'); renderCustomModules();
            addDenseRow(); addDrawRow('standard');

            document.getElementById('denseQuantity')?.addEventListener('wheel', handleDenseWheel, { passive: false });
            document.getElementById('bizSets')?.addEventListener('wheel', function (e) { e.preventDefault(); let sets = parseFloat(this.value.replace(',', '.')) || 0; const step = (document.getElementById('bizSizeSelect').getAttribute('data-value') === '90x50') ? 0.25 : (document.getElementById('bizSizeSelect').getAttribute('data-value') === '85x55' ? 0.2 : 1); sets += (e.deltaY < 0 ? step : -step); if (sets < step) sets = step; this.value = Math.round(sets * 100) / 100; updateBizFromSets(); }, { passive: false });
            document.getElementById('bizQuantity')?.addEventListener('wheel', function (e) { e.preventDefault(); const step = (document.getElementById('bizSizeSelect').getAttribute('data-value') === '90x50') ? 24 : 21; let qty = parseInt(this.value) || 0; qty += (e.deltaY < 0 ? step : -step); if (qty < step) qty = step; this.value = Math.ceil(qty / step) * step; document.getElementById('bizSets').value = Math.round((this.value / getBizSetSize()) * 100) / 100; calculateBizPrice(); }, { passive: false });
            document.getElementById('stickQuantity')?.addEventListener('wheel', function (e) { e.preventDefault(); let qty = parseInt(this.value) || 0; qty += (e.deltaY < 0 ? 1 : -1); if (qty < 1) qty = 1; this.value = qty; calculateStickerPrice(); }, { passive: false });
            renderHistory();
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(initApp, 1); } else { document.addEventListener('DOMContentLoaded', initApp); window.addEventListener('load', initApp); }

        function switchTab(tabId, btnElement) { document.querySelectorAll('.nv-tab-content').forEach(tab => tab.classList.remove('active')); document.querySelectorAll('.nv-tab-btn').forEach(btn => btn.classList.remove('active')); document.getElementById(tabId).classList.add('active'); btnElement.classList.add('active'); recalculateActiveTab(); }
        function getGlobalDiscountTier() { let val = document.getElementById('globalDiscountSelect').getAttribute('data-value'); if (val === '2.64') return 1; if (val === '2.40') return 2; if (val === '2.16') return 3; if (val === '1.80') return 4; return 0; }
        
        

        

        function recalculateActiveTab() {
            const activeTab = document.querySelector('.nv-tab-content.active').id;
            if (activeTab === 'tab-dense') calculateDensePrice();
            else if (activeTab === 'tab-drawings') calculateDrawPrice();
            else if (activeTab === 'tab-stickers') calculateStickerPrice();
            else if (activeTab === 'tab-bizcards') calculateBizPrice();
        }

        function renderAllSizePresets() { let sizes = JSON.parse(localStorage.getItem('nvCustomSizes') || '[]'); let html = ''; if (sizes.length > 0) { sizes.forEach((s, idx) => { html += `<div class="nv-option" style="display:flex; justify-content:space-between; align-items:center;" onclick="applySizePreset(this, ${s.w}, ${s.h})"><span>${s.label}</span><span style="color:#ff3333; font-weight:bold; font-size: 16px; padding:0 5px;" onclick="deleteSizePreset(${idx}, event)" title="Удалить">×</span></div>`; }); } else { html += `<div class="nv-option" style="color:#aaa; font-size:10px; text-align: center;">Нет добавленных</div>`; } html += `<div class="nv-option" style="background: #eee; font-weight: bold; border-top: 1px solid #ddd; text-align:center;" onclick="addNewSizePreset()">+ Добавить размер...</div>`; document.querySelectorAll('.user-size-options').forEach(el => el.innerHTML = html); }
        function addNewSizePreset() { let w = prompt("Введите ширину (мм):"); if (!w || isNaN(w)) return; let h = prompt("Введите высоту (мм):"); if (!h) return; let label = prompt("Введите название (например, А5):", `${w}×${h}`); let sizes = JSON.parse(localStorage.getItem('nvCustomSizes') || '[]'); sizes.push({ w: parseInt(w), h: parseInt(h), label: label || `${w}×${h}` }); localStorage.setItem('nvCustomSizes', JSON.stringify(sizes)); renderAllSizePresets(); }
        function deleteSizePreset(idx, e) { e.stopPropagation(); let sizes = JSON.parse(localStorage.getItem('nvCustomSizes') || '[]'); sizes.splice(idx, 1); localStorage.setItem('nvCustomSizes', JSON.stringify(sizes)); renderAllSizePresets(); }
        function applySizePreset(el, w, h) { const parentDrop = el.closest('.nv-custom-select'); if (parentDrop) parentDrop.classList.remove('open'); const group = el.closest('.nv-card-input-group') || el.closest('.nv-multi-row'); if (!group) return; const wInput = group.querySelector('input[placeholder="Ш"]'); const hInput = group.querySelector('input[placeholder="В"]'); if (wInput && hInput) { wInput.value = w; hInput.value = h; if (group.closest('#tab-dense')) { const qInput = group.closest('.nv-card-row')?.querySelector('input[placeholder="Кол-во"]') || group.querySelector('input[placeholder="Кол-во"]'); if (qInput && typeof snapDenseQuantity === 'function') snapDenseQuantity(qInput); calculateDensePrice(); } else if (group.closest('#tab-stickers')) calculateStickerPrice(); } }

        function openLamModal(prefix) { window.currentLamPrefix = prefix; document.getElementById('nv-lam-modal').style.display = 'flex'; }
        function closeLamModal() { document.getElementById('nv-lam-modal').style.display = 'none'; }
        function selectLamOption(val) { if (!window.currentLamPrefix) return; let prefix = window.currentLamPrefix; let el = document.getElementById(prefix + 'LamSelect'); if (el) { el.setAttribute('data-value', val); el.querySelector('.nv-select-trigger').textContent = LAM_NAMES[val] || 'Без ламинации'; } closeLamModal(); triggerExtraChange(prefix); }

        function saveUIStateToLayout(prefix) { if (prefix === 'biz') window.activeLayoutKey['biz'] = 'main'; let key = window.activeLayoutKey[prefix]; if (!key) return; if (!window.layoutExtras[prefix][key]) window.layoutExtras[prefix][key] = {}; let st = window.layoutExtras[prefix][key]; st.noCut = document.getElementById(prefix + 'NoCut')?.checked || false; st.rounding = document.getElementById(prefix + 'Rounding')?.checked || false; st.lam = document.getElementById(prefix + 'LamSelect')?.getAttribute('data-value') || 'none'; st.staple = document.getElementById(prefix + 'Staple')?.checked || false; st.foil = document.getElementById(prefix + 'Foiling')?.checked || false; st.plotter = document.getElementById(prefix + 'Plotter')?.checked || false; if (document.getElementById(prefix + 'Crease')) { st.crease = document.getElementById(prefix + 'Crease').checked; st.creaseCount = parseInt(document.getElementById(prefix + 'CreaseCount').value) || 1; } else st.crease = false; if (document.getElementById(prefix + 'Eyelet')) { st.eyelet = document.getElementById(prefix + 'Eyelet').checked; st.eyeletCount = parseInt(document.getElementById(prefix + 'EyeletCount').value) || 1; } else st.eyelet = false; if (document.getElementById(prefix + 'Punch')) { st.punch = document.getElementById(prefix + 'Punch').checked; st.punchCount = parseInt(document.getElementById(prefix + 'PunchCount').value) || 1; } else st.punch = false; if (document.getElementById(prefix + 'Glue')) { st.glue = document.getElementById(prefix + 'Glue').checked; st.glueCount = parseInt(document.getElementById(prefix + 'GlueCount').value) || 1; } else st.glue = false; if (document.getElementById(prefix + 'MaterialSelect')) st.mat = document.getElementById(prefix + 'MaterialSelect').getAttribute('data-value'); if (document.getElementById(prefix + 'DensitySelect')) st.dens = document.getElementById(prefix + 'DensitySelect').getAttribute('data-value'); if (document.getElementById(prefix + 'PrintTypeSelect')) st.printType = document.getElementById(prefix + 'PrintTypeSelect').getAttribute('data-value'); if (document.getElementById(prefix + 'SheetSelect')) st.sheetStr = document.getElementById(prefix + 'SheetSelect').getAttribute('data-value'); }
        function loadLayoutStateToUI(prefix, key) { if (prefix === 'biz') key = 'main'; let st = window.layoutExtras[prefix][key]; if (!st) return; let chk = (id, prop) => { let el = document.getElementById(prefix + id); if (el) el.checked = st[prop]; }; chk('NoCut', 'noCut'); chk('Rounding', 'rounding'); chk('Staple', 'staple'); chk('Foiling', 'foil'); chk('Plotter', 'plotter'); let elLam = document.getElementById(prefix + 'LamSelect'); if (elLam) { elLam.setAttribute('data-value', st.lam); elLam.querySelector('.nv-select-trigger').textContent = LAM_NAMES[st.lam] || 'Без ламинации'; } let setExtra = (id, checkProp, countProp) => { let el = document.getElementById(prefix + id); if (el) { el.checked = st[checkProp]; document.getElementById(prefix + id + 'Count').value = st[countProp] || 1; document.getElementById(prefix + id + 'Count').style.display = st[checkProp] ? 'block' : 'none'; } }; setExtra('Crease', 'crease', 'creaseCount'); setExtra('Eyelet', 'eyelet', 'eyeletCount'); setExtra('Punch', 'punch', 'punchCount'); setExtra('Glue', 'glue', 'glueCount'); let dict = prefix === 'dense' ? densePaperData : bizPaperData; let elMat = document.getElementById(prefix + 'MaterialSelect'); if (elMat && st.mat) { elMat.setAttribute('data-value', st.mat); if (dict[st.mat]) elMat.querySelector('.nv-select-trigger').textContent = dict[st.mat].name; updateDensities('tab-' + (prefix === 'biz' ? 'bizcards' : 'dense')); } let elDens = document.getElementById(prefix + 'DensitySelect'); if (elDens && st.dens && dict[st.mat]) { elDens.setAttribute('data-value', st.dens); let dObj = dict[st.mat].dens.find(d => String(d.g) === String(st.dens)); if (dObj) elDens.querySelector('.nv-select-trigger').textContent = dObj.g + (typeof dObj.g === 'number' ? " г/м²" : ""); } let elPrint = document.getElementById(prefix + 'PrintTypeSelect'); if (elPrint && st.printType) { elPrint.setAttribute('data-value', st.printType); let opt = elPrint.querySelector(`.nv-option[data-value="${st.printType}"]`); if (opt) elPrint.querySelector('.nv-select-trigger').textContent = opt.textContent; } let elSheet = document.getElementById(prefix + 'SheetSelect'); if (elSheet && st.sheetStr) { elSheet.setAttribute('data-value', st.sheetStr); let opt = elSheet.querySelector(`.nv-option[data-value="${st.sheetStr}"]`); if (opt) elSheet.querySelector('.nv-select-trigger').textContent = opt.textContent; } }
        function triggerExtraChange(prefix) { saveUIStateToLayout(prefix); if (prefix === 'dense') calculateDensePrice(); else if (prefix === 'biz') calculateBizPrice(); }
        function switchLayoutTabExt(btn, prefix, key, index) { switchLayoutTab(index, prefix); if (prefix !== 'biz') { window.activeLayoutKey[prefix] = key; loadLayoutStateToUI(prefix, key); } }
        function selectDiscountOption(el) { const parent = el.closest('.nv-custom-select'); parent.setAttribute('data-value', el.getAttribute('data-value')); parent.querySelector('.nv-select-trigger').textContent = el.textContent; parent.classList.remove('open'); recalculateActiveTab(); }

        function selectCommonOption(el) {
            const parent = el.closest('.nv-custom-select'); const val = el.getAttribute('data-value'); parent.setAttribute('data-value', val); parent.querySelector('.nv-select-trigger').textContent = el.textContent; parent.classList.remove('open'); const parentId = parent.id;
            if (parentId.includes('DensitySelect')) { let prefix = parentId.replace('DensitySelect', ''); let currentMat = document.getElementById(prefix + 'MaterialSelect').getAttribute('data-value'); window.lastSelectedDensities[prefix][currentMat] = val; }
            if (parentId.includes('MaterialSelect') || parentId.includes('SheetSelect') || parentId.includes('PrintTypeSelect') || parentId.includes('ColorSelect')) { let prefix = parentId.replace('MaterialSelect', '').replace('SheetSelect', '').replace('PrintTypeSelect', '').replace('ColorSelect', ''); if (prefix === 'dense') updateDensities('tab-dense'); if (prefix === 'biz') updateDensities('tab-bizcards'); }
            if (parentId.includes('dense')) calculateDensePrice(); else if (parentId.includes('draw')) calculateDrawPrice(); else if (parentId.includes('biz')) { if (parentId === 'bizSizeSelect') snapBizQuantity(); else calculateBizPrice(); } else if (parentId.includes('stick')) calculateStickerPrice();
        }

        function updateDensities(tabId) {
            let matSelectId = '', densSelectId = '', lastSelObj = '', dict = null;
            if (tabId === 'tab-dense') { matSelectId = 'denseMaterialSelect'; densSelectId = 'denseDensitySelect'; lastSelObj = 'dense'; dict = densePaperData; }
            else if (tabId === 'tab-bizcards') { matSelectId = 'bizMaterialSelect'; densSelectId = 'bizDensitySelect'; lastSelObj = 'biz'; dict = bizPaperData; } else return;
            const mat = document.getElementById(matSelectId).getAttribute('data-value'); if (!dict[mat]) return;
            const densContainer = document.querySelector(`#${densSelectId} .nv-options`);
            let filteredDens = dict[mat].dens;
            if (tabId === 'tab-bizcards') { filteredDens = filteredDens.filter(d => [250, 300, 350].includes(d.g)); if (filteredDens.length === 0) filteredDens = dict[mat].dens; }
            densContainer.innerHTML = filteredDens.map(d => `<div class="nv-option" data-value="${d.g}" onclick="selectCommonOption(this)">${d.g} ${typeof d.g === 'number' ? 'г/м²' : ''}</div>`).join('');
            let savedVal = window.lastSelectedDensities[lastSelObj][mat]; let found = filteredDens.find(d => String(d.g) === String(savedVal)) || filteredDens[0];
            document.getElementById(densSelectId).setAttribute('data-value', found.g); document.getElementById(densSelectId).querySelector('.nv-select-trigger').textContent = found.g + (typeof found.g === 'number' ? " г/м²" : "");
        }

        function toggleModalType() {
            let type = document.getElementById('modalType').value;
            if (type === 'Физ лица') document.getElementById('modalUrFields').style.display = 'none';
            else document.getElementById('modalUrFields').style.display = 'block';
        }

        function openSheetModal() {
            if (!window.currentCalcData) { alert("Сначала сделайте расчет!"); return; }
            document.getElementById('urCustomerList').innerHTML = JSON.parse(localStorage.getItem('nvUrCustomers') || '[]').map(c => `<option value="${c}">`).join('');
            document.getElementById('urJobList').innerHTML = JSON.parse(localStorage.getItem('nvUrJobs') || '[]').map(c => `<option value="${c}">`).join('');
            let defaultJob = window.currentCalcData.tabName;
            if (window.currentCalcData.tabName !== "Стикеры") defaultJob += " " + window.currentCalcData.title;
            document.getElementById('modalUrJobType').value = defaultJob;
            
            let d = window.currentCalcData;
            let paperContainer = document.getElementById('modalUrPaperContainer');
            if (paperContainer) {
                let phtml = '';
                let layouts = d?.perLayout || [];
                if (layouts.length === 0) layouts = [{id:'1', size:'Основной'}];
                
                layouts.forEach((l, idx) => {
                    let label = layouts.length > 1 ? `Бумага (Макет ${idx+1}: ${l.size})` : `Бумага (из базы)`;
                    phtml += `
                        <div style="text-align: left; margin-bottom: 10px; position: relative;">
                            <label style="font-size: 10px; font-weight: bold; color: #888; text-transform: uppercase;">${label}</label>
                            <input type="text" id="modalUrPaper_${idx}" class="nv-modal-input" placeholder="Введите от 3-х букв..." oninput="filterPaperDb(this.value, 'modalUrPaper_${idx}')">
                            <div id="paperAutocompleteList_modalUrPaper_${idx}" class="paperAutocompleteList" style="display:none; position:absolute; z-index:9999; background:#fff; border:1px solid #ccc; border-radius:4px; max-height:150px; overflow-y:auto; width:100%; top:50px; font-size:12px; box-shadow:0 4px 6px rgba(0,0,0,0.1);"></div>
                        </div>
                    `;
                });
                paperContainer.innerHTML = phtml;
            }
            
            toggleModalType(); document.getElementById('nv-sheet-modal').style.display = 'flex';
        }

        

        function showDetailsModal() {
            if (!window.currentCalcData || !window.currentCalcData.costDetails) { alert("Сначала сделайте расчет!"); return; }
            let d = window.currentCalcData.costDetails; let cd = window.currentCalcData; let html = '';
            const addRow = (name, val, qtyText = "") => { if (val && val > 0) { let qStr = qtyText ? ` (${qtyText})` : ""; html += `<div><span>${name}${qStr}</span> <b>${val.toFixed(2)} BYN</b></div>`; } };

            let sheetsTotal = cd.sheets || 0; if (cd.tab === 'tab-drawings') sheetsTotal = cd.qty || 0;
            let cutsTotal = cd.cuts !== undefined ? cd.cuts : (cd.globalCuts || 0);

            if (d.printAndMat) addRow("Печать и материал", d.printAndMat, sheetsTotal ? `${sheetsTotal} л.` : "");
            else { addRow("Печать", d.print, sheetsTotal ? `${sheetsTotal} л.` : ""); addRow("Материал", d.paper, sheetsTotal ? `${sheetsTotal} л.` : ""); }

            addRow("Резка", d.cut, cutsTotal ? `${cutsTotal} рез.` : "");
            addRow("Ламинация", d.lam, cd.lamType && cd.lamType !== "Нет" ? `${cd.lamType}, ${sheetsTotal} л.` : "");

            let c_cr = 0, c_rd = 0, c_ey = 0, c_st = 0, c_pu = 0, c_gl = 0, c_fo = 0, c_fd = 0;
            if (cd.perLayout && cd.perLayout.length > 0) {
                cd.perLayout.forEach(l => { if (l.extrasQty) { c_cr += l.extrasQty.crease || 0; c_rd += l.extrasQty.rounding || 0; c_ey += l.extrasQty.eyelet || 0; c_st += l.extrasQty.staple || 0; c_pu += l.extrasQty.punch || 0; c_gl += l.extrasQty.glue || 0; c_fo += l.extrasQty.foil || 0; c_fd += l.extrasQty.fold || 0; } });
            } else if (cd.extrasQty) { c_cr = cd.extrasQty.crease || 0; c_rd = cd.extrasQty.rounding || 0; c_ey = cd.extrasQty.eyelet || 0; c_st = cd.extrasQty.staple || 0; c_pu = cd.extrasQty.punch || 0; c_gl = cd.extrasQty.glue || 0; c_fo = cd.extrasQty.foil || 0; c_fd = cd.extrasQty.fold || 0; }

            addRow("Биговка", d.crease, c_cr ? `${c_cr} шт.` : ""); addRow("Скругление", d.rounding, c_rd ? `${c_rd} шт.` : "");
            addRow("Люверсы", d.eyelet, c_ey ? `${c_ey} шт.` : ""); addRow("Сшивка", d.staple, c_st ? `${c_st} шт.` : "");
            addRow("Дыроколение", d.punch, c_pu ? `${c_pu} шт.` : ""); addRow("Склейка", d.glue, c_gl ? `${c_gl} шт.` : "");
            addRow("Фольгирование", d.foil, c_fo ? `${c_fo} л.` : ""); addRow("Плоттерная резка", d.plotter, sheetsTotal ? `${sheetsTotal} л.` : "");
            addRow("Фальцовка", d.fold, c_fd ? `${c_fd} шт.` : "");

            if (d.customMods && d.customMods.length > 0) { d.customMods.forEach(mod => { addRow(mod.desc, mod.cost); }); }

            if (html === '') { html = '<div style="text-align:center; color:#888;">Нет данных</div>'; }
            document.getElementById('nv-details-list-container').innerHTML = html;
            document.getElementById('nv-details-total').textContent = cd.price + " BYN";
            document.getElementById('nv-details-modal').style.display = 'flex';
        }
        function closeDetailsModal() { document.getElementById('nv-details-modal').style.display = 'none'; }

        

        function createNewSheetTemplate() { let name = prompt("Введите название шаблона:"); if (!name) return; let w = prompt("Ширина в мм:"); if (!w) return; let h = prompt("Высота в мм:"); if (!h) return; let templates = JSON.parse(localStorage.getItem('nvSheetTemplates') || '[]'); templates.push({ name: name, val: `${Math.max(w, h)}x${Math.min(w, h)}`, label: `${name} (${Math.max(w, h)}×${Math.min(w, h)})` }); localStorage.setItem('nvSheetTemplates', JSON.stringify(templates)); loadSheetTemplates(); }
        function loadSheetTemplates() { let templates = JSON.parse(localStorage.getItem('nvSheetTemplates') || '[]');['dense', 'stick', 'biz'].forEach(tab => { const opt = document.getElementById(tab + 'SheetOptions'); if (opt) { let html = `<div class="nv-option" data-value="450x320" onclick="selectSheetOption('${tab}', this)">SRA3 (450×320)</div><div class="nv-option" data-value="420x297" onclick="selectSheetOption('${tab}', this)">A3 (420×297)</div><div class="nv-option" data-value="320x225" onclick="selectSheetOption('${tab}', this)">SRA4 (320×225)</div><div class="nv-option" data-value="297x210" onclick="selectSheetOption('${tab}', this)">A4 (297×210)</div>`; templates.forEach(t => html += `<div class="nv-option" data-value="${t.val}" onclick="selectSheetOption('${tab}', this)">${t.label} <span style="color:#ff3333; float:right; font-weight:bold; font-size: 16px; margin-left: 10px; line-height: 1;" onclick="deleteSheetTemplate('${t.name}', event)">×</span></div>`); html += `<div class="nv-option" style="background: #eee; font-weight: bold; border-top: 1px solid #ddd;" onclick="createNewSheetTemplate()">+ Создать шаблон...</div>`; opt.innerHTML = html; } }); }
        function deleteSheetTemplate(name, e) { e.stopPropagation(); localStorage.setItem('nvSheetTemplates', JSON.stringify(JSON.parse(localStorage.getItem('nvSheetTemplates') || '[]').filter(t => t.name !== name))); loadSheetTemplates(); }
        function selectSheetOption(tabPrefix, el) { const parent = el.closest('.nv-custom-select'); parent.setAttribute('data-value', el.getAttribute('data-value')); let clone = el.cloneNode(true); let span = clone.querySelector('span'); if (span) span.remove(); parent.querySelector('.nv-select-trigger').textContent = clone.textContent.trim(); parent.classList.remove('open'); recalculateActiveTab(); }
        function toggleSelect(trigger) { const parent = trigger.parentElement; const isOpen = parent.classList.contains('open'); document.querySelectorAll('.nv-custom-select').forEach(s => { s.classList.remove('open'); const group = s.closest('.nv-card-input-group') || s.closest('.nv-lam-wide'); if (group) group.style.zIndex = '990'; }); if (!isOpen) { parent.classList.add('open'); const group = parent.closest('.nv-card-input-group') || parent.closest('.nv-lam-wide'); if (group) group.style.zIndex = '9999'; } }
        function toggleExtraInput(checkId, inputId) { document.getElementById(inputId).style.display = document.getElementById(checkId).checked ? 'block' : 'none'; }
        window.onclick = function (e) { if (!e.target.closest('.nv-custom-select') && !e.target.closest('.hi-del') && !e.target.closest('.nv-lam-trigger')) { document.querySelectorAll('.nv-custom-select').forEach(s => { s.classList.remove('open'); const group = s.closest('.nv-card-input-group') || s.closest('.nv-lam-wide'); if (group) group.style.zIndex = '990'; }); } };
        function updateSegment(el) { const container = el.closest('.nv-segment-control'); container.querySelectorAll('.nv-segment-label').forEach(lbl => lbl.classList.remove('active')); el.closest('.nv-segment-label').classList.add('active'); }
        function switchLayoutTab(index, prefix) { document.querySelectorAll(`.${prefix}-layout-tab`).forEach((btn, i) => btn.classList.toggle('active', i === index)); document.querySelectorAll(`.${prefix}-layout-content`).forEach((content, i) => content.classList.toggle('active', i === index)); }

        function collectTabState(tabId) { let state = {}; let tab = document.getElementById(tabId); if (!tab) return state; tab.querySelectorAll('input').forEach(el => { if (el.id && el.type !== 'hidden') state[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value; }); tab.querySelectorAll('.nv-custom-select').forEach(el => { if (el.id) state[el.id] = el.getAttribute('data-value'); });['accountantRounding'].forEach(id => { let el = document.getElementById(id); if (el) state[id] = el.type === 'checkbox' ? el.checked : el.value; }); if (tabId === 'tab-dense') { let rows = []; tab.querySelectorAll(`.dense-multi-row`).forEach(r => { rows.push({ w: r.querySelector(`.dm-w`).value, h: r.querySelector(`.dm-h`).value, q: r.querySelector(`.dm-q`).value }); }); state.multiRows = rows; for (let r of document.getElementsByName(`denseLayoutMode`)) if (r.checked) state.layoutMode = r.value; } else if (tabId === 'tab-drawings') { let dRows = []; tab.querySelectorAll('.draw-multi-row').forEach(r => { dRows.push({ jobType: r.querySelector('.dr-job-type').value, fmt: r.querySelector('.dr-format').value, mult: r.querySelector('.dr-mult').value, fold: r.querySelector('.dr-fold').checked, w: r.querySelector('.dr-w').value, h: r.querySelector('.dr-h').value, q: r.querySelector('.dr-q').value, color: r.querySelector('.dr-color') ? r.querySelector('.dr-color').checked : false }); }); state.drawRows = dRows; } return state; }
        function saveToHistory(tabId, title, price) { let history = JSON.parse(localStorage.getItem('nvHistory') || '[]').filter(item => (Date.now() - item.timestamp) < 7 * 24 * 60 * 60 * 1000); let state = collectTabState(tabId); state.window.layoutExtras = JSON.stringify(window.layoutExtras); history.unshift({ id: Date.now().toString(), timestamp: Date.now(), tab: tabId, title: title, price: price, state: state }); if (history.length > 30) history.pop(); localStorage.setItem('nvHistory', JSON.stringify(history)); renderHistory(); }
        function deleteHistoryItem(id, e) { e.stopPropagation(); localStorage.setItem('nvHistory', JSON.stringify(JSON.parse(localStorage.getItem('nvHistory') || '[]').filter(item => item.id !== id.toString()))); renderHistory(); }
        function renderHistory() { const list = document.getElementById('nv-history-list'); if (!list) return; let history = JSON.parse(localStorage.getItem('nvHistory') || '[]').filter(item => (Date.now() - item.timestamp) < 7 * 24 * 60 * 60 * 1000); localStorage.setItem('nvHistory', JSON.stringify(history)); if (history.length === 0) { list.innerHTML = '<div style="color:#aaa; font-size:12px; text-align:center;">История пуста</div>'; return; } let html = ''; history.forEach(item => { let date = new Date(item.timestamp).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); let tabName = { 'tab-dense': 'Плотные', 'tab-drawings': 'Чертежи', 'tab-stickers': 'Стикеры', 'tab-bizcards': 'Визитки' }[item.tab] || ''; html += `<div class="nv-history-item" onclick="loadHistory('${item.id}')"><button class="hi-del" onclick="deleteHistoryItem('${item.id}', event)">×</button><div class="hi-title">${tabName}: ${item.title}</div><div class="hi-price">${item.price} BYN</div><div class="hi-date">${date}</div></div>`; }); list.innerHTML = html; }

        function loadHistory(id) {
            let item = JSON.parse(localStorage.getItem('nvHistory') || '[]').find(i => i.id === id.toString());
            if (!item) return;
            let tabBtn = document.querySelector(`.nv-tab-btn[onclick*="${item.tab}"]`);
            if (tabBtn) tabBtn.click();

            let state = item.state;
            if (state.window.layoutExtras) window.layoutExtras = JSON.parse(state.window.layoutExtras);

            let matSelectId = { 'tab-dense': 'denseMaterialSelect', 'tab-stickers': 'stickMaterialSelect', 'tab-bizcards': 'bizMaterialSelect' }[item.tab];
            if (matSelectId && state[matSelectId]) {
                let matSel = document.getElementById(matSelectId);
                let opt = matSel.querySelector(`.nv-option[data-value="${state[matSelectId]}"]`);
                if (opt) {
                    matSel.setAttribute('data-value', state[matSelectId]);
                    matSel.querySelector('.nv-select-trigger').textContent = opt.textContent;
                    let shortPrefix = item.tab.replace('tab-', '').replace('bizcards', 'biz');
                    if (shortPrefix !== 'stickers' && shortPrefix !== 'drawings') {
                        window.lastSelectedDensities[shortPrefix][state[matSelectId]] = state[`${shortPrefix}DensitySelect`];
                        updateDensities(item.tab);
                    }
                }
            }

            for (let key in state) {
                if (['multiRows', 'drawRows', 'layoutMode', matSelectId, 'window.layoutExtras'].includes(key)) continue;
                let el = document.getElementById(key);
                if (el) {
                    if (el.type === 'checkbox' || el.type === 'radio') el.checked = state[key];
                    else if (el.classList && el.classList.contains('nv-custom-select')) {
                        let opt = el.querySelector(`.nv-option[data-value="${state[key]}"]`);
                        if (opt) { el.setAttribute('data-value', state[key]); el.querySelector('.nv-select-trigger').textContent = opt.textContent; }
                    } else el.value = state[key];
                }
            }

            if (item.tab === 'tab-dense') {
                toggleExtraInput('denseCrease', 'denseCreaseCount'); toggleExtraInput('denseEyelet', 'denseEyeletCount'); toggleExtraInput('densePunch', 'densePunchCount'); toggleExtraInput('denseGlue', 'denseGlueCount');
                let list = document.getElementById(`denseMultiList`); list.innerHTML = '';
                if (state.multiRows && state.multiRows.length > 0) {
                    state.multiRows.forEach(r => {
                        let div = document.createElement('div'); div.className = `nv-multi-row dense-multi-row`; div.style.position = 'relative';
                        div.innerHTML = `<div class="nv-custom-select" style="width: auto; flex-shrink: 0; display:flex; align-items:center;"><div style="font-size:9.5px; color:#888; cursor:pointer; font-weight:800; text-transform:uppercase; padding: 2px 6px; border-radius: 5px; background: #eee; margin-right: 5px;" onclick="toggleSelect(this)">Шабл. ▾</div><div class="nv-options user-size-options" style="width: 180px; left: 0; z-index: 999999;"></div></div><input type="text" inputmode="numeric" class="nv-multi-input dm-w" placeholder="Ш" value="${r.w}" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()"><input type="text" inputmode="numeric" class="nv-multi-input dm-h" placeholder="В" value="${r.h}" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()"><input type="text" inputmode="numeric" class="nv-multi-input dm-q" placeholder="Кол-во" value="${r.q}" oninput="this.value = this.value.replace(/\\D/g, ''); calculateDensePrice()"><button class="nv-multi-del" onclick="this.parentElement.remove(); calculateDensePrice()">×</button>`;
                        list.appendChild(div); div.querySelector('.dm-q').addEventListener('wheel', handleDenseWheel, { passive: false });
                    }); renderAllSizePresets();
                } else addDenseRow();
                document.getElementsByName(`denseLayoutMode`).forEach(r => { if (r.value === state.layoutMode) { r.checked = true; updateSegment(r); } });
                let isMulti = document.getElementById(`denseMultiToggle`).checked; document.getElementById(`denseSingleBlock`).style.display = isMulti ? 'none' : 'block'; document.getElementById(`denseMultiBlock`).style.display = isMulti ? 'block' : 'none';
            }

            if (item.tab === 'tab-bizcards') toggleExtraInput('bizPunch', 'bizPunchCount');
            if (item.tab === 'tab-drawings') {
                let list = document.getElementById('drawMultiList'); list.innerHTML = '';
                if (state.drawRows && state.drawRows.length > 0) {
                    state.drawRows.forEach((r, idx) => {
                        addDrawRow(r.fmt === 'Custom' ? 'custom' : 'standard');
                        let rows = document.querySelectorAll('.draw-multi-row'); let lastRow = rows[rows.length - 1];
                        lastRow.querySelector('.dr-job-type').value = r.jobType || 'print';
                        if (r.fmt === 'Custom') { lastRow.querySelector('.dr-w').value = r.w; lastRow.querySelector('.dr-h').value = r.h; } else { lastRow.querySelector('.dr-format').value = r.fmt; if (lastRow.querySelector('.dr-mult')) lastRow.querySelector('.dr-mult').value = r.mult; }
                        lastRow.querySelector('.dr-q').value = r.q; if (lastRow.querySelector('.dr-fold')) lastRow.querySelector('.dr-fold').checked = r.fold; if (lastRow.querySelector('.dr-color')) lastRow.querySelector('.dr-color').checked = r.color;
                        updateDrawRow(lastRow.querySelector(r.fmt === 'Custom' ? '.dr-w' : '.dr-format'));
                    });
                } else addDrawRow('standard');
            }
            recalculateActiveTab();
        }

        function saveCurrentCalculation() { if (window.currentCalcData) { let customName = prompt("Введите название просчета (для истории):", window.currentCalcData.title); if (customName !== null) { saveToHistory(window.currentCalcData.tab, customName, window.currentCalcData.price); alert('Просчет сохранен!'); } } else alert("Сначала сделайте расчет!"); }
        
        
        
        
        

        

        

        

        

        // ==========================================
        // ЛОГИКА СТИКЕРОВ
        // ==========================================
        

        // ==========================================
        // ЛОГИКА ВИЗИТОК
        // ==========================================
        
        
        
        

        

        function sendOrder(type) {
            let data = window.currentCalcData;
            if (!data) return;

            let cModsStr = "";
            if (data.customModsDetails && data.customModsDetails.length > 0) {
                cModsStr = "\n\nДоп. услуги:\n" + data.customModsDetails.map(m => `- ${m.desc}: ${m.cost.toFixed(2)} BYN`).join("\n");
            }

            let msg = "";
            if (type === 'dense') {
                const isMulti = document.getElementById('denseMultiToggle').checked;
                let modeText = isMulti ? (document.querySelector('input[name="denseLayoutMode"]:checked')?.value === 'separate' ? " (Отдельные листы)" : " (По порядку)") : "";
                let lines = (data.layoutsArr || []).map((l, idx) => {
                    let info = `Макет ${idx + 1}: ${l.size}
Материал: ${l.mat}
Цветность: ${l.color}
Доп. работы: ${l.extras}`;
                    if (isMulti) info += `
Цена: ${l.price} BYN`;
                    return info;
                }).join('\n\n');
                msg = `Заказ: Плотные материалы${modeText}

${lines}${cModsStr}
---
Итого: ${document.getElementById('denseTotalPrice').textContent} BYN`;
            } else if (type === 'drawings') {
                let lines = (data.layoutsArr || []).map(l => `- ${l.size}: ${l.qty} шт.`).join('\n');
                msg = `Заказ: Чертежи и Скан
Материал: Инженерная 80 г/м²

Список макетов:
${lines}${cModsStr}
---
Итого: ${document.getElementById('drawTotalPrice').textContent} BYN`;
            } else if (type === 'stickers') {
                let isCut = document.getElementById('stickCut').checked;
                let extras = "Плоттерная резка" + (isCut ? ", Резка прямоугольниками" : "");
                msg = `Заказ: Стикеры

Макет: ${data.size} мм
Материал: ${data.mat}
Цветность: ${data.color}
Доп. работы: ${extras}
Тираж: ${data.qty} шт. (${data.totalOnSheet} шт на лист)
Макет с дозаливками: ${data.techW}x${data.techH} мм${cModsStr}
---
Итого: ${document.getElementById('stickTotalPrice').textContent} BYN`;
            } else if (type === 'bizcards') {
                let ext = window.layoutExtras['biz'][window.activeLayoutKey['biz']];
                let extras = [];
                if (ext && data) {
                    if (ext.lam !== "none") extras.push(`${LAM_NAMES[ext.lam]}`);
                    if (ext.noCut) extras.push("Без резки");
                    if (ext.rounding) extras.push("Скругление");
                    if (ext.punch) extras.push("Дыроколение");
                    if (ext.foil) extras.push("Фольгирование");
                    if (ext.plotter) extras.push("Плотт. резка");
                }
                let dens = data.dens;
                msg = `Заказ: Визитки

Макет: ${data.size} (${data.qty} шт) | На листе: ${data.totalOnSheet}
Материал: ${data.mat} ${dens} ${isNaN(parseInt(dens)) ? '' : 'г/м²'}
Цветность: ${data.color}
Доп. работы: ${extras.length ? extras.join(", ") : "нет"}${cModsStr}
---
Итого: ${document.getElementById('bizTotalPrice').textContent} BYN`;
            }
            copyToClipboard(msg, document.querySelector(`#tab-${type === 'drawings' ? 'drawings' : (type === 'bizcards' ? 'bizcards' : (type === 'stickers' ? 'stickers' : 'dense'))} .nv-card-action-btn`));
        }

        


window.currentModalTab = '';
window.currentModalLayoutId = '';

window.openLayoutDetailsModalFromRow = function(btn, tabId) {
    // Find the index of this row
    let rows = document.querySelectorAll('.' + tabId + '-multi-row');
    let row = btn.closest('.' + tabId + '-multi-row');
    let idx = Array.from(rows).indexOf(row);
    if (idx !== -1) {
        window.openLayoutDetailsModal(tabId, 'item_' + idx);
    }
}

window.openLayoutDetailsModal = function(tabId, layoutId) {
    if(!window.currentCalcData || !window.currentCalcData.perLayout) {
        alert("Сначала сделайте расчет, чтобы увидеть детали.");
        return;
    }
    
    // Find the layout in perLayout
    let layoutObj = window.currentCalcData.perLayout.find(x => x.id === layoutId);
    if (!layoutObj) {
        // Might be a single layout or just recalculate
        layoutObj = window.currentCalcData.perLayout[0];
        if(!layoutObj) return;
    }
    
    window.currentModalTab = tabId;
    window.currentModalLayoutId = layoutId;
    
    // Populate Header
    let headerHtml = `<div>Бумага: ${layoutObj.mat}</div>
                      <div>Цветность: ${layoutObj.color}</div>
                      <div>Ламинация: ${layoutObj.lamType}</div>
                      <div style="margin-top:5px; border-top:1px solid #ddd; padding-top:5px;">Макет: ${layoutObj.size} (${layoutObj.qty} шт)</div>`;
                      
    document.getElementById('layout-details-header').innerHTML = headerHtml;
    
    // Populate Breakdown
    let bHtml = '';
    let c = layoutObj.costs;
    let eq = layoutObj.extrasQty;
    
    let sheetCnt = layoutObj.sheets || layoutObj.qty || 1;
    
    const fmtRow = (name, unitCost, qtyNum, qtyText, totalCost) => {
        return `<div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #eee; color:#555;"><span><b>${name}:</b></span> <span>${(unitCost).toFixed(2)} &times; ${qtyNum} ${qtyText} = <b>${totalCost.toFixed(2)}</b></span></div>`;
    };

    if (c.print > 0 || c.printAndMat > 0) {
        if (c.print > 0) bHtml += fmtRow('Печать', c.print / sheetCnt, sheetCnt, 'лист.', c.print);
        if (c.paper > 0) bHtml += fmtRow('Бумага', c.paper / sheetCnt, sheetCnt, 'лист.', c.paper);
        if (!c.print && !c.paper && c.printAndMat > 0) bHtml += fmtRow('Печать+Бумага', c.printAndMat / sheetCnt, sheetCnt, 'лист.', c.printAndMat);
    }
    
    if (c.cut > 0) bHtml += fmtRow('Резка', c.cut / (layoutObj.cuts || 1), layoutObj.cuts || 1, 'рез.', c.cut);
    if (c.lam > 0) bHtml += fmtRow('Ламинация', c.lam / sheetCnt, sheetCnt, 'лист.', c.lam);
    
    if (c.crease > 0) bHtml += fmtRow('Биговка', c.crease / eq.crease, eq.crease, 'шт.', c.crease);
    if (c.eyelet > 0) bHtml += fmtRow('Люверсы', c.eyelet / eq.eyelet, eq.eyelet, 'шт.', c.eyelet);
    if (c.rounding > 0) bHtml += fmtRow('Скругление', c.rounding / eq.rounding, eq.rounding, 'угл.', c.rounding);
    if (c.staple > 0) bHtml += fmtRow('Сшивка', c.staple / eq.staple, eq.staple, 'шт.', c.staple);
    if (c.punch > 0) bHtml += fmtRow('Дыроколение', c.punch / eq.punch, eq.punch, 'отв.', c.punch);
    if (c.glue > 0) bHtml += fmtRow('Склейка', c.glue / eq.glue, eq.glue, 'шт.', c.glue);
    if (c.foil > 0) bHtml += fmtRow('Фольгирование', c.foil / eq.foil, eq.foil, 'лист.', c.foil);
    if (c.plotter > 0) bHtml += fmtRow('Плотт. резка', c.plotter / sheetCnt, sheetCnt, 'лист.', c.plotter);
    
    document.getElementById('layout-details-breakdown').innerHTML = bHtml;
    
    let customHtml = '';
    let totalCMods = 0;
    if (layoutObj.customMods && layoutObj.customMods.length > 0) {
        layoutObj.customMods.forEach((cm, index) => {
            let p = cm.price || 0;
            let cost = cm.cost || 0;
            totalCMods += cost;
            customHtml += `<div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #eee; color:#555; align-items:center;">
                <span><b>${cm.name || 'Модуль'}:</b></span> 
                <span>${p.toFixed(2)} &times; ${cm.qty} = <b>${cost.toFixed(2)}</b>
                <button onclick="removeCustomModuleFromLayout('${tabId}', '${layoutId}', ${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; margin-left:5px;">&times;</button>
                </span>
            </div>`;
        });
    } else {
        customHtml = '<div style="color:#aaa; text-align:center; padding-bottom: 10px;">Нет добавленных кастомных модулей</div>';
    }
    
    let totalMaket = (c.printAndMat || (c.print || 0) + (c.paper || 0)) + (c.cut||0) + (c.lam||0) + (c.crease||0) + (c.eyelet||0) + (c.rounding||0) + (c.staple||0) + (c.punch||0) + (c.glue||0) + (c.foil||0) + (c.plotter||0) + totalCMods;
    customHtml += `<div style="text-align:right; margin-top:10px; padding-top:10px; font-size:15px; color:#333;">Итого по макету: <b>${totalMaket.toFixed(2)} BYN</b></div>`;
    
    document.getElementById('layout-details-custom-list').innerHTML = customHtml;
    
    document.getElementById('nv-layout-details-modal').style.display = 'flex';
}

window.closeLayoutDetailsModal = function() {
    document.getElementById('nv-layout-details-modal').style.display = 'none';
}

window.removeCustomModuleFromLayout = function(tab, layoutId, index) {
    if (window.layoutExtras[tab] && window.layoutExtras[tab][layoutId] && window.layoutExtras[tab][layoutId].customModules) {
        window.layoutExtras[tab][layoutId].customModules.splice(index, 1);
        // Force recalculation
        if(tab === 'dense') calculateDensePrice();
        if(tab === 'stickers') calculateStickerPrice();
        if(tab === 'bizcards') calculateBizPrice();
        // Refresh modal
        window.openLayoutDetailsModal(tab, layoutId);
    }
}


window.PAPER_DB_CACHE = ["Бумага Majestic RED SATIN, 250г/м2, Италия", "Бумага Color Copy, 350г/м2, белая SRA3, Россия", "Бумага дизайнерская Fancy Colorful White 320г/м2, Италия", "Крафт бумага Kraft Light 350г/м2, Китай", "Бумага дизайнерская Velvet Кремовый, 300г/м2, Турция", "Бумага дизайнерская Velvet Кремовый, 350г/м2, Турция", "Бумага дизайнерская TWILL BRIGHT WHITE, 300г/м2, Италия", "Бумага дизайнерская Elegant Cotton paper Light Grey (серый), 320г/м2, Китай", "Бумага дизайнерская GRANIT GRAY светло-серый, 270г/м2, Италия", "Бумага дизайнерская Kabuk GREEN Зеленый, 270г/м2, Турция", "Бумага мелованная CHORUS LUX 250г /м2 , Польша", "Бумага дизайнерская CRUSH Kiwi Киви, 250г/м2, Италия", "Бумага дизайнерская FlaxPaper natural (натурально-белый), 300г/м2, Китай", "Бумага дизайнерская Dawnt Moon Natural (натуральный белый), 180г /м2 , Китай", "Бумага дизайнерская Biancoflash Ivory Айвори, 300г/м2, Италия", "Бумага UPM Finesse Silk 2-х стороняя мелованная матовая 350г/м2, Польша", "Бумага в рулонах пл.80г/м2, 297*76*175м, Беларусь", "Конверт формата А6, Бумага дизайнерская ColorFlow Blue синий, 300г/м2, вырубка и склейка", "Конверты дизайнерскик Galaxy KUV Smooth black (110/220мм), 110г, Китай-Россия", "Фольга RM 34-210 золото (10см*122м), США", "Бумага Color Copy, 300г/м2 A4, Австрия", "Пленка для ламинирования кармашковая матовая ПЭТ WF 303мм*426мм, 75 мкм, А3, Китай", "Пленка самокл. Polylaser M W HS PERM DIGI FILM Kraft SP Stabilized 120 Solid Unprinted 450*320мм, Польша", "Бумага PROJECTA Ultra, марка А, 80г/м2 А4, Россия", "Бумага самоклеящаяся SEMIGLOSS AP904 WK85 SPL33, Италия", "Конверт формата А6, Бумага дизайнерская ColorFlow Gold Золото, 300г/м2, вырубка и склейка", "Бумага самоклеящаяся STIKER GLOSS 80G без просечек, Польша", "Бумага мелованная NEVIA MATT Digital 2-х ст.мелов.матовая беля 128г/м2, Россия", "Бумага Lomond матовая 230г/м2, формат А4, Россия", "Бумага дизайнерская ColorFlow Fresh Mint Свежая мята, 300г/м2, Китай", "Бумага дизайнерская CRUSH Grape Виноград, 250г/м2, Италия", "Бумага дизайнерская Kabuk WHITE Белый, 300г/м2, Турция", "Бумага дизайнерская Popular Soft Touch 1/S White (белый), 120г/м2, Китай", "Бумага Color Copy, 160г/м2, Австрия", "Бумага Color Copy, 100г/м2 SRA3, Австрия", "Бумага цветная А4, 80г/м2 \"Promega jet\" , желтый интен.-30%, Россия", "Крафт бумага Kraft brown 300г/м2, Китай", "Бумага дизайнерская TactiTouch Blue Parisian (Синий парижский), 300г/м2, Китай", "Конверты дизайнерскик DL Quill Ice Whate Белый, 120гм2, Китай", "Бумага дизайнерская TactiTouch burgundy (Бордо), 300г/м2, Китай", "Бумага в рулонах пл.80г/м2, 594*76*175, Беларусь", "Бумага Lomond глянцевая 230г/м2, 10*15см, Россия", "Бумага дизайнерская REMAKE ЭКО гладкая, medium, небесно-бирюзовый, 120г/м2", "Бумага Color Copy, 300г/м2, белая SRA3, Россия", "Бумага дизайнерская Kabuk GREY СЕРЫЙ, 270г/м2, Турция", "Фотобумага А4, 230г/м2, матовая \"Lomond\", Россия", "Бумага дизайнерская CRUSH Oliva Олива, 250г/м2, Италия", "Бумага мелованная Nevia MATT Digital 2-х ст. мелованная матовая белая 150г/м2, Россия", "Бумага дизайнерская TactiTouch Coffe (кофе), 300г/м2, Китай", "Бумага дизайнерская Majestic classic Candelight Cream Волшебная свеча, 290г/м2, Италия", "Бумага самокл. SZ 80 187г/м2 без насечек, Китай", "Бумага дизайнерская Galaxy Metallic, 300г/м2, 2S soft white/натуральный белый, Китай", "Пленка для ламинирования Dogital мат 320мм*200м*30мкм, Индия", "Бумага дизайнерская ColorFlow Damask blue Небо Дамаска, 300г/м2, Китай", "Фольга RM 34-100 серебро (10см*122м), США", "Бумага мелованная Nevia Digital матовая , 128г/м2, Россия", "Бумага дизайнерская Dawnt Moon creme (кремовый), 180г /м2 , Китай", "Бумага Fedrigoni Tintoretto Crema, 300г/м2, Италия", "Бумага Majestic Candelight Cream, 290г/м2, Италия", "Пленка д/ламинирования рул.Soft Touch БОПП \" 320мм*200м*30мкм, Китай", "Бумага дизайнерская Card Classical Color cream, кремовый, 260г/м2, Китай", "Бумага для цифровой печати Master Copy L 350г SRA3", "Бумага Ксерокс Колотек Плюс, 90г/м2, Австрия", "Конверт формата А6, Бумага дизайнерская ColorFlow Chrismas Рождественский зеленый, 300г/м2, вырубка и склейка", "Бумага Lomond матовая 230г/м2, 10*15см, Россия", "Бумага дизайнерская CRUSH Citrus Цитрус, 250г/м2, Италия", "Бумага Color Copy, 250г/м2 SRA3, Австрия", "Бумага Color Copy, 200г/м2, белая SRA3, Россия", "Бумага в рулонах пл.80г/м2, 297*76*175, Беларусь", "Обложка (перф.) пласт. прозр. 0,2мм, Китай", "Бумага дизайнерская Card Classical Color natural, натуральный, 120г/м2, Китай", "Бумага дизайнерская ASTRAL DREAM Saphire Волшебная свеча, 300г/м2, Турция", "Бумага дизайнерская Kabuk IVORY АЙВОРИ, 120г/м2, Турция", "Бумага Color Copy 200г/м2, белая, Словакия", "Пленочная самоклейка матовая белая K-Tak, 330*483мм", "Бумага Lomond сатин 270г/м2, 10*15см, Россия", "Бумага CURIOUS SKIN IVORY B1, 270 г/м2, Италия", "Пленка для ламинирования формама А5, глянцевая gloss, Китай", "Бумага дизайнерская Fancy Colorful vinous (винный),320г/м2, Китай", "Бумага PROJECTA Ultra, марка А, 80г/м2 А3, Россия", "315 ХКС Эпоксидная смола+отвердитель Elastia Crystal (3+1)", "Бумага Сolor Copy 100г/м2, 450х320мм, Австрия", "Бумага Color Copy, 160г/м2 SRA3, Австрия", "Бумага Lomond экономичная глянцевая, 230г/м2, 10*15см, Россия", "Бумага Color Copy, 160г/м2 , А4, Австрия", "Клише MOVA 95*24мм", "Бумага дизайнерская Kabuk Natural Натуральный, 300г/м2, Турция", "Бумага Majestic Milk, 290г/м2, Италия", "Пружины для перфопер. 10мм черные, Китай", "Бумага дизайнерская Kabuk GREEN, Зеленый, 270г/м2, Турция", "Бумага мелованная Nevia MATT Digital 2-х ст. мелован. матовая белая, 128г/м2, Китай", "Бумага /калька)дизайнерская Crystal Tracing Paper, 90г/м2, Турция", "Калька Wite Whispe Tracing paper white, белая, 210г/м2, Китай", "Бумага Ксерокс Колотек Плюс, 250г/м2 SRA3, Австрия", "Бумага в рулонах пл.80г/м2, 840*76*175м, Беларусь", "Бумага дизайнерская Knight color 300г brisk blue/морская волна, Китай", "Рул. пленка д/ламинирования Polynex 12/28 MATT 320мм*200м*40мкм, Корея", "Бумага дизайнерская Fancy Colorful white, 120г/м2, Италия", "Бумага дизайнерская TactiTouch Cold Blue (холодно-голубой), 300г/м2, Китай", "Бумага дизайнерская Knight color 300г /м2 , navy blue/темно-синий, Китай", "Бумага дизайнерская LUNAR Mini Лиловый, 240г/м2, Италия", "Пленка д/ламинирования 320мм*200м, 30мкм (втулка 25), БОПП матовая \"Диджитал\", Китай", "Бумага дизайнерская SENSE P5004-300гл.ст. софт-тач синий кобальт, 300г/м2, лист 787*1092мм, Китай", "Бумага Color Copy, 300г/м2 SRA3, Австрия", "Бумага NEVIA 80г/м2 , А4,Китай", "Люверсы d 4,8mm золото, Тайвань", "Бумага дизайнерская Card Classical Color whate, белый, 120г/м2, Китай", "Пленка д/ламинирования 32 РЕ FULL (PET) МАТОВАЯ 320мм*200м*30мкм, Индия", "Рул. пленка д/ламинирования МАТОВАЯ БОПП 320мм*200м*30мкм, Китай", "Бумага дизайнерская ZENIT Needle Point Green,  Зеленый, 270г/м2, Турция", "Пленка ламинационная SCUFF-FREE VELVET 320мм*200м*32мкм, Индия", "Бумага дизайнерская ColorFlow Gold Золото, 300г/м2, Китай", "Бумага дизайнерская Knight color 300г /м2 ,red/бордо, Китай", "Бумага самоклеющаяся RITRAMA Gloss с просечкой, Польша", "Калька Transpalux Tracing paper, 133г/м2, Китай", "Бумага дизайнерская TactiTouch Green (зеленый), 300г/м2, Китай", "Бумага дизайнерская Elegant Cotton paper orange (оранжевый), 320г/м2, Китай", "Бумага дизайнерская ColorFlow Blue Синий, 300г/м2, Китай", "Бумага дизайнерская Dawnt Moon Natural (натуральный белый), 300г /м2 , Китай", "Бумага Majestic Marble Wate, 290г/м2, Италия", "УПАКОВКА", "Бумага UPM Digi Finesse Silk 350г/м2 , Польша", "Бумага мелованная Nevia MATT Digital 2-х ст. мелованная матовая белая 250г/м2, Россия", "Бумага Color Copy, 200г/м2 SRA3, Австрия", "Пленка д/ламинирования кармашковая матовая WFПЭТ 303мм*216мм*75мкм, Китай", "Пленка д/ламинирования ПЭТ 303мм*216мм*75мкм, Китай", "Бумага дизайнерская Dawnt Moon creme (кремовый), 300г /м2 , Китай", "Пакет 35*455ПП (25мкм) скотч, Россия", "Пленка для ламинирования формама А7, глянцевая gloss, Китай", "Бумага дизайнерская SIRIUS WHITE Белый, 300г/м2, Турция", "Фотобумага Lomond глянцевая А4, 230г/м2, Россия", "Бумага офсетная улучш. Кач-ва 80г/м2, белый, 420*175*76мм, Россия", "Бумага дизайнерская Mohawk Loop Antique Vellum 298г Джут, Россия", "Бумага мелованная Maxima Silk 200г/м2, Польша", "Бумага дизайнерская Breeze 101 vinous (бордовый), 320г/м2, Китай", "Бумага Color Copy, 300г/м2, белая SRA3, Австрия", "Бумага UPM Dogi Finesse Premium 300г/м2 , Польша", "Бумага Color Copy, 160г/м2 белая, Австрия", "Бумага дизайнерская SL GRAPHICA Laid Diamond White 300г береза, Китай", "Бумага Ксерокс Колотек Плюс, 120г/м2 А3, Австрия", "Пленка д/ламинирования глянцевая БОПП \" 320мм*200м*30мкм, Россия", "Бумага дизайнерская Natural colour kraft Крафт, 150г/м2, Китай", "Бумага дизайнерская Galaxy Metallic, 300г/м2, 2S vanilla cream/кремовый, Россия", "Бумага дизайнерская Knight color 300г /м2 , grey/серый, Китай", "БУМАГА НА 01/06/2026", "Бумага дизайнерская Kabuk Cream Кремовый, 120г/м2, Турция", "Бумага дизайнерская ColorFlow Petal Розовый лепесток, 300г/м2, Китай", "Бумага Color Copy, пл.250 г/м2, белая, Австрия", "Бумага мелованная Maxima Silk 250г/м2, Польша", "Бумага Color Copy, 350г/м2 SRA3, Австрия", "Бумага дизайнерская ICEBLINK 2-ст тисн. лен белый, 300г/м2, Италия", "Бумага Majestic Pariour Pink, 290г/м2, Италия", "Бумага дизайнерская Fancy Colorful Green spruce (Зеленая ель), 320г/м2, Китай", "Бумага PRO-DIGITAL SILK 2-х ст.мелован.матовая белая 300г/м2 , Корея", "Бумага Сolor Copy, 300г/м2, А4, Австрия", "Бумага Biancoflash Ivory Айвори, 300г/м2, Италия", "Бумага дизайнерская TactiTouch Red (красный), 300г/м2, Китай", "Бумага дизайнерская Metal paper black черный, 250г/м2, Китай", "Бумага мелованная Nevia MATT Digital матовая 250г/м2, Россия", "Бумага в рулонах пл.80г/м2, 840*76*175, Беларусь", "Бумага самоклеющаяся RITRAMA SemiGloss без просечек, Польша", "Конверт формата А6, умага дизайнерская ColorFlow petal Розовый лепесток, 300г/м2, вырубка и склейка", "Бумага дизайнерская ColorFlow Cream Волшебная свеча, 300г/м2, Китай", "Бумага дизайнерская Quill Pearl White Айвори 300г /м2 , Китай", "Бумага UPM Digi FinessePremium Silk 300г/м2 , Польша", "Бумага Color Copy,160г/м2, белая SRA3, Россия", "Конверт формата А6, Бумага дизайнерская ColorFlow Cream Волшебная свеча, 300г/м2, вырубка и склейка", "Бумага дизайнерская Quill Ice White Белый 300г /м2 , Китай", "Бумага Burano SC ENGLISH GREEN, 250г/м2, Италия", "Бумага дизайнерская Rubber like black/черный 300г, Китай", "Конверт формата А6, Бумага дизайнерская ColorFlow Royal Blue Королевский синий, 300г/м2, вырубка и склейка", "Самоклеющаяся полиэстеровая пленка для листовой цифровой печати Raflatac PolyLaser HS75г матовая белая SRA3 без просечек 450*320мм, Россия", "файл", "Бумага Ксерокс Колотек Плюс, 300г/м2 А3, Австрия", "Пленка д/ламинирования А4/75 глянцевая, Китай", "Бумага 300/70х100/100/L RELEX LOTION КРЕМОВЫЙ 2СТ (картон)", "Бумага дизайнерская ColorFlow Christmas green Рождественский зеленый, 258г/м2, Китай", "Бумага Lomond шелковисто-матовая 260г/м2, 10*15см, Россия", "Пленка д/ламинирования МАТОВАЯ ROYAl A4 80мкм, Китай", "Бумага дизайнерская Imagin Lighte Craft, 300г/м2, Китай", "Бумага UPM Finesse Silk 2-х ст.мел.матов., 350г/м2, белая SRA3, Россия", "Бумага дизайнерская Gold pendant angel cream, кремовый, 120г/м2, Китай", "Пружины для перфопер. 25мм белые, Китай", "Обложка (перф.) А4 картон под кожу белая, Китай", "Буклет А4, красочность 4+4, бумага мелованная 130г/м2, 1 фальц, 1 комплект-1000шт.", "Бумага дизайнерская Blanket 2/S Bright White (натуральный белый), 280г/м2, Китай", "Бумага Color Copy, 300г/м2 белая SRA3, Россия", "Бумага MODI LASER DIGITAL CANDIDO 120г/м2", "Калька LumiVell Tracing paper (белая) 93г/м2, Китай", "Бумага дизайнерская FlaxPaper CREAM (кремовый), 300г/м2, Китай", "Бумага дизайнерская Card Classical Color natural, натуральный, 260г/м2, Китай", "Бумага STARDREAM CITRINE, золотой мрамор, 285г/м2, Турция", "Бумага самоклеющаяся RITRAMA SemiGloss АР904 WK 85 насеч.33мм, 180г/м2, Польша", "Бумага дизайнерская Сolor Crystal chameleon Розовый хамелеон, 250г/м2, Китай", "Бумага в рулонах пл.80г/м2, 420*76*175, Беларусь", "Бумага дизайнерская CRUSH Com Кукуруза, 250г/м2, Италия", "Бумага дизайнерская Card Classical Color cream, кремовый, 120г/м2, Китай", "Бумага дизайнерская Knight color 300г natural whate/натуральный белый, Китай", "Бумага дизайнерская Rubber like white/белый 300г, Китай", "Бумага Color Copy 350г/м2, Россия", "Бумага PROJECTA Ultra, марка А 80г/м2, А3, Росси", "Бумага Burano SC Nero Notte, 250г/м2, Италия", "Бумага Majestic Candelight Cream Волшебная свеча, 120г/м2, Италия", "Бумага дизайнерская Fancy Colorful cream, 120г/м2, Италия", "Бумага FEDRIGONI ARENA ROUGN NATURAL 300г/м2, Италия", "Пакет тип I СПП30 (80*120+40кл.)+с.л.", "Фотобумага Lomond матовая А6, 230г/м2, Россия"];

window.filterPaperDb = function(query, inputId) {
    let listDiv = document.getElementById('paperAutocompleteList_' + inputId);
    if (!listDiv) return;
    
    if (!query || query.length < 3) {
        listDiv.style.display = 'none';
        return;
    }
    
    let q = query.toLowerCase();
    let matches = window.PAPER_DB_CACHE.filter(p => p.toLowerCase().includes(q));
    
    if (matches.length > 0) {
        let html = '';
        matches.slice(0, 50).forEach(m => {
            html += `<div style="padding:5px 10px; cursor:pointer; border-bottom:1px solid #eee;" 
                          onmouseover="this.style.background='#f0f0f0'" 
                          onmouseout="this.style.background=''" 
                          onclick="document.getElementById('${inputId}').value='${m.replace(/'/g, "\\\'")}'; document.getElementById('paperAutocompleteList_${inputId}').style.display='none';">${m}</div>`;
        });
        listDiv.innerHTML = html;
        listDiv.style.display = 'block';
    } else {
        listDiv.style.display = 'none';
    }
}

// Close autocomplete when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nv-modal-input')) {
        document.querySelectorAll('.paperAutocompleteList').forEach(l => l.style.display = 'none');
    }
});



window.currentModalTab = '';
window.currentModalLayoutId = '';

window.openLayoutDetailsModalFromRow = function(btn, tabId) {
    // Find the index of this row
    let rows = document.querySelectorAll('.' + tabId + '-multi-row');
    let row = btn.closest('.' + tabId + '-multi-row');
    let idx = Array.from(rows).indexOf(row);
    if (idx !== -1) {
        window.openLayoutDetailsModal(tabId, 'item_' + idx);
    }
}





