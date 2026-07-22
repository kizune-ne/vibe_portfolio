const DEFAULT_APP_PRICES = {
            "Печать SRA3": { "Цвет": [2.88, 2.64, 2.40, 2.16, 1.80], "ЧБ": [1.92, 1.80, 1.68, 1.56, 1.44], "Цвет_A4": [1.44, 1.32, 1.20, 1.08, 0.90], "Цвет_A3": [2.88, 2.64, 2.40, 2.16, 1.80], "Офисная_A4": [0.54, 0.42, 0.36, 0.30, 0.24], "Офисная_A3": [1.08, 0.84, 0.72, 0.60, 0.48] },
            "Чертежи Печать": { "A4": [0.72, 0.66, 0.60, 0.54], "A3": [1.20, 1.08, 0.96, 0.84], "A2": [1.80, 1.74, 1.68, 1.56], "A1": [3.00, 2.76, 2.52, 2.40], "A0": [6.00, 5.76, 5.52, 5.40] },
            "Чертежи Скан": { "A4_Цвет": 0.54, "A4_ЧБ": 0.48, "A3_Цвет": 1.08, "A3_ЧБ": 0.78, "A2_Цвет": 1.80, "A2_ЧБ": 1.80, "A1_Цвет": 2.10, "A1_ЧБ": 2.10, "A0_Цвет": 4.80, "A0_ЧБ": 4.80 },
            "Доп. работы": { "Резка_База": 0.36, "Резка_Мелкая": 0.48, "Скругление": 1.20, "Сшивка": 1.08, "Биговка": 0.30, "Люверс": 0.84, "Дырокол": 0.30, "Фальцовка": 0.18, "Склейка": 0.48, "Плоттер_1": [4.80, 3.60, 3.00], "Плоттер_Много": [6.00, 5.40, 4.80], "ФольгаМалая_База": 3.60, "ФольгаМалая_Скидка": 3.00, "ФольгаБольшая_База": 5.40, "ФольгаБольшая_Скидка": 4.80 },
            "Ламинация": { "Рулон_Мат_1ст": [2.10, 1.50, 1.20], "Рулон_Мат_2ст": [3.60, 2.10, 1.80], "Рулон_Глянец_1ст": [2.10, 1.50, 1.20], "Рулон_Глянец_2ст": [3.60, 2.10, 1.80], "Рулон_SoftTouch_1ст": [2.70, 2.10, 1.80], "Рулон_SoftTouch_2ст": [4.20, 2.70, 2.10], "Пакет_А4_Глянец": [2.10, 1.80], "Пакет_А4_Мат": [3.60, 3.00], "Пакет_А3_Глянец": [3.00, 2.40], "Пакет_А3_Мат": [4.80, 4.20] },
            "Бумага (Плотность)": { "Мелованная": { "130": 0.24, "150": 0.30, "170": 0.36, "200": 0.48, "250": 0.60, "300": 0.72, "350": 0.96 }, "Калландр": { "90": 0.30, "100": 0.36, "120": 0.48, "160": 0.60, "200": 0.84, "250": 1.08, "300": 1.32, "350": 1.56 }, "Диз_Натур": { "250": 1.80, "300": 2.10 }, "Диз_Фактур": { "120": 1.08, "250": 2.40, "300": 2.70 }, "Диз_Металлик": { "120": 1.20, "250": 2.70, "300": 3.60 }, "Самоклейка_Бум": { "Стандарт": 2.40 }, "Самоклейка_Крафт": { "Стандарт": 3.60 }, "Пленка_Прозр": { "Стандарт": 4.80 }, "Пленка_Белая": { "Стандарт": 5.40 }, "Калька": { "90": 1.20, "133": 2.40, "210": 4.80 }, "SoftTouch": { "120": 1.50, "300": 4.80 } }
        };

        let APP_PRICES = JSON.parse(localStorage.getItem('nv_app_prices'));
        let PRICE_VERSION = localStorage.getItem('nv_price_v4');
        if (!APP_PRICES || !PRICE_VERSION) {
            APP_PRICES = JSON.parse(JSON.stringify(DEFAULT_APP_PRICES));
            localStorage.setItem('nv_app_prices', JSON.stringify(APP_PRICES));
            localStorage.setItem('nv_price_v4', 'true');
        }

        if (APP_PRICES && APP_PRICES["Стикеры"]) {
            delete APP_PRICES["Стикеры"];
            localStorage.setItem('nv_app_prices', JSON.stringify(APP_PRICES));
        }

        function getP(cat, key, index = null) { let p = APP_PRICES[cat][key]; if (index !== null && Array.isArray(p)) return p[Math.min(index, p.length - 1)]; return p; }
        function setByPath(obj, path, value) { path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, ''); let a = path.split('.'); for (let i = 0, n = a.length; i < n - 1; ++i) { let k = a[i]; if (!(k in obj)) obj[k] = {}; obj = obj[k]; } obj[a[a.length - 1]] = value; }
        function openPricesModal() { let c = document.getElementById('prices-editor-container'); c.innerHTML = ''; renderPricesEditor(APP_PRICES, c); document.getElementById('nv-prices-modal').style.display = 'flex'; }
        function closePricesModal() { document.getElementById('nv-prices-modal').style.display = 'none'; }

        function renderPricesEditor(obj, parentEl, path = '') {
            for (let key in obj) {
                let val = obj[key];
                if (typeof val === 'object' && !Array.isArray(val)) {
                    let div = document.createElement('div'); div.style.marginBottom = "10px"; div.style.marginLeft = path ? "15px" : "0px"; div.style.borderLeft = path ? "2px solid #ccc" : "none"; div.style.paddingLeft = path ? "10px" : "0px";
                    div.innerHTML = `<div style="font-weight: 800; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; color: #1a73e8; margin-top: 10px;">${key}</div>`;
                    parentEl.appendChild(div); renderPricesEditor(val, div, path ? path + '.' + key : key);
                } else {
                    let valDiv = document.createElement('div'); valDiv.style.display = "flex"; valDiv.style.alignItems = "center"; valDiv.style.gap = "8px"; valDiv.style.marginBottom = "4px";
                    let label = document.createElement('span'); label.textContent = key + ": "; label.style.width = "160px"; label.style.fontSize = "12px"; label.style.fontWeight = "600"; valDiv.appendChild(label);
                    if (Array.isArray(val)) {
                        val.forEach((v, i) => { let inp = document.createElement('input'); inp.type = "number"; inp.step = "0.01"; inp.value = v; inp.className = "nv-price-input"; inp.dataset.path = (path ? path + '.' : '') + key + '[' + i + ']'; valDiv.appendChild(inp); });
                    } else { let inp = document.createElement('input'); inp.type = "number"; inp.step = "0.01"; inp.value = val; inp.className = "nv-price-input"; inp.dataset.path = (path ? path + '.' : '') + key; valDiv.appendChild(inp); }
                    parentEl.appendChild(valDiv);
                }
            }
        }
        function savePrices() { document.querySelectorAll('.nv-price-input').forEach(inp => { let val = parseFloat(inp.value); if (!isNaN(val)) setByPath(APP_PRICES, inp.dataset.path, val); }); localStorage.setItem('nv_app_prices', JSON.stringify(APP_PRICES)); syncPapers(); updateDensities('tab-dense'); updateDensities('tab-bizcards'); recalculateActiveTab(); closePricesModal(); alert('Цены успешно сохранены!'); }
        function resetPrices() { if (confirm("Вернуть цены по умолчанию?")) { localStorage.removeItem('nv_app_prices'); APP_PRICES = JSON.parse(JSON.stringify(DEFAULT_APP_PRICES)); syncPapers(); updateDensities('tab-dense'); updateDensities('tab-bizcards'); recalculateActiveTab(); closePricesModal(); alert('Цены сброшены!'); } }

        const densePaperData = { office: { name: "Офисная", dens: [{ g: 80, p: 0 }] }, mel: { name: "Мелованная", dens: [{ g: 130, p: 0 }, { g: 150, p: 0 }, { g: 170, p: 0 }, { g: 200, p: 0 }, { g: 250, p: 0 }, { g: 300, p: 0 }, { g: 350, p: 0 }] }, cal: { name: "Калландрированная", dens: [{ g: 90, p: 0 }, { g: 100, p: 0 }, { g: 120, p: 0 }, { g: 160, p: 0 }, { g: 200, p: 0 }, { g: 250, p: 0 }, { g: 300, p: 0 }, { g: 350, p: 0 }] }, des_nat: { name: "Дизайнерская (натуральная)", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }] }, des_tex: { name: "Дизайнерская (фактурная)", dens: [{ g: 120, p: 0 }, { g: 250, p: 0 }, { g: 300, p: 0 }] }, des_met: { name: "Дизайнерская (металлик)", dens: [{ g: 120, p: 0 }, { g: 250, p: 0 }, { g: 300, p: 0 }] }, sa_pap: { name: "Самоклейка (бумага)", dens: [{ g: 'Стандарт', p: 0 }] }, sa_kr: { name: "Самоклейка (крафт)", dens: [{ g: 'Стандарт', p: 0 }] }, film_tr: { name: "Пленка (прозрачная)", dens: [{ g: 'Стандарт', p: 0 }] }, film_wh: { name: "Пленка (белая)", dens: [{ g: 'Стандарт', p: 0 }] }, trace: { name: "Калька", dens: [{ g: 90, p: 0 }, { g: 133, p: 0 }, { g: 210, p: 0 }] }, soft_touch: { name: "Софт-тач", dens: [{ g: 120, p: 0 }, { g: 300, p: 0 }] } };
        const bizPaperData = { mel: { name: "Мелованная", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }, { g: 350, p: 0 }] }, cal: { name: "Калландрированная", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }, { g: 350, p: 0 }] }, des_nat: { name: "Дизайнерская (натуральная)", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }] }, des_tex: { name: "Дизайнерская (фактурная)", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }] }, des_met: { name: "Дизайнерская (металлик)", dens: [{ g: 250, p: 0 }, { g: 300, p: 0 }] }, soft_touch: { name: "Софт-тач", dens: [{ g: 300, p: 0 }] } };
        const paperMap = { 'mel': 'Мелованная', 'cal': 'Калландр', 'des_nat': 'Диз_Натур', 'des_tex': 'Диз_Фактур', 'des_met': 'Диз_Металлик', 'sa_pap': 'Самоклейка_Бум', 'sa_kr': 'Самоклейка_Крафт', 'film_tr': 'Пленка_Прозр', 'film_wh': 'Пленка_Белая', 'trace': 'Калька', 'soft_touch': 'SoftTouch' };

        function syncPapers() {
            for (let k in densePaperData) { if (APP_PRICES["Бумага (Плотность)"][paperMap[k]]) { densePaperData[k].dens.forEach(d => { let newP = APP_PRICES["Бумага (Плотность)"][paperMap[k]][d.g.toString()]; if (newP !== undefined) d.p = newP; }); } }
            for (let k in bizPaperData) { if (APP_PRICES["Бумага (Плотность)"][paperMap[k]]) { bizPaperData[k].dens.forEach(d => { let newP = APP_PRICES["Бумага (Плотность)"][paperMap[k]][d.g.toString()]; if (newP !== undefined) d.p = newP; }); } }
        }
        syncPapers();

        const LAM_NAMES = { 'none': 'Без ламинации', '1_mat': 'Рулон: Матовая 1+0', '2_mat': 'Рулон: Матовая 1+1', '1_gly': 'Рулон: Глянцевая 1+0', '2_gly': 'Рулон: Глянцевая 1+1', '1_st': 'Рулон: Soft-touch 1+0', '2_st': 'Рулон: Soft-touch 1+1', 'pouch_a4_gly': 'Пакет: А4 Глянец', 'pouch_a4_mat': 'Пакет: А4 Матовая', 'pouch_a3_gly': 'Пакет: А3 Глянец', 'pouch_a3_mat': 'Пакет: А3 Матовая' };

        window.currentCalcData = null;
        window.lastSelectedDensities = { dense: {}, biz: {} };

