/* ══════════════════════════════════════════════════════════════════════
   BOLIVIA MACRO SIMULATOR
   ══════════════════════════════════════════════════════════════════════ */

/* ══ NAV ══ */
function showPage(id, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (el) el.classList.add('active');
    /* CORRECCIÓN: antes cambiar de pestaña no recalculaba nada — si el usuario
       movía una palanca en un canal y luego navegaba, la Síntesis podía quedar
       desactualizada. Ahora cada cambio de pestaña fuerza un recálculo. */
    if (typeof computeEffects === 'function' && document.getElementById('eff-pib')) computeEffects();
}

/* ══ SUB-PESTAÑAS DE DATOS (7 bloques) — clase propia .datapanel para no
   interferir con .subpanel del Simulador (evita que cambiar de bloque en
   Datos desactive por error la sub-pestaña activa del Simulador). ══ */
function showDataPanel(id, btn) {
    document.querySelectorAll('.datapanel').forEach(p => p.classList.remove('active'));
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

/* ══ SUB-PESTAÑAS DENTRO DEL SIMULADOR (Fiscal/Monetario/Crédito/Externa) ══
   A diferencia de showPage(), esto NUNCA oculta la Síntesis — vive fuera de
   los subpanel, como hermano en el mismo .page. Por eso el cambio de canal
   jamás puede desincronizarla: sigue viendo los mismos sliders en el DOM. */
function showSubPanel(id, btn) {
    document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('active'));
    /* CORRECCIÓN: antes intentaba escopar por '.section' compartida con el
       toggle interno Monetario/Macro, que vive en la MISMA sección — eso
       hacía que un cambio de canal apagara sin querer ese otro toggle.
       Ahora usa la clase propia .canal-tabs, sin ambigüedad. */
    if (btn) btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (btn) btn.classList.add('active');
    computeEffects();
}

/* ══ MODO: Histórico / Contrafactual / Hipotético ══════════════════════
   Histórico: todas las palancas bloqueadas, la herramienta es un visor.
   Contrafactual: palancas activas, ancladas al año base elegido arriba.
   Hipotético: palancas activas con rangos más amplios en RIN y CIN, para
   explorar economías fuera del rango histórico observado. */
function setModoSimulacion() {
    const modo = document.getElementById('sel-modo-sim').value;
    const desc = document.getElementById('modo-desc');
    const banner = document.getElementById('banner-historico');
    const controles = document.querySelectorAll(
        '#sp-fiscal input, #sp-fiscal button, #sp-monetario input, #sp-monetario button, #sp-credito input, #sp-credito button, #sp-externa input, .policy-btn, #sl-choque-oferta'
    );
    const slRin = document.getElementById('sl-rin');
    const slCin = document.getElementById('sl-cin');

    if (banner) banner.style.display = modo === 'historico' ? 'block' : 'none';

    if (modo === 'historico') {
        controles.forEach(c => c.disabled = true);
        if (desc) desc.textContent = 'Modo lectura: las palancas están bloqueadas, se muestra exactamente el año base observado.';
        resetTotal();
    } else {
        controles.forEach(c => c.disabled = false);
        if (modo === 'hipotetico') {
            if (slRin) slRin.min = 0;
            if (slCin) { slCin.min = -15000; slCin.max = 15000; }
            if (desc) desc.textContent = 'Rangos ampliados: RIN puede llegar a 0 meses, CIN hasta ±15.000 MM Bs — explora economías fuera del rango histórico.';
        } else {
            if (slRin) slRin.min = 1;
            if (slCin) { slCin.min = -10000; slCin.max = 10000; }
            if (desc) desc.textContent = 'Las palancas están activas y ancladas al año base elegido arriba.';
        }
    }
    computeEffects();
}

/* ══ POLÍTICAS PRECARGADAS — CANAL FISCAL Y CANAL CRÉDITO ══════════════
   Antes solo el Canal Monetario tenía botones de política. Estas mueven
   directamente la palanca propia de cada canal (inversión real / CIN). */
function applyPolicyFiscal(tipo) {
    const sl = document.getElementById('sl-inv-real');
    if (!sl) return;
    const valores = { recorte: 80, estimulo: 140, gradual: 90 };
    sl.value = valores[tipo];
    onCanalSliderInput('inv-real');
}
function applyPolicyCredito(tipo) {
    const sl = document.getElementById('sl-cin');
    if (!sl) return;
    const valores = { monetizacion: 5000, disciplina: -8000 };
    sl.value = valores[tipo];
    onCanalSliderInput('cin');
}

/* ══ DATOS REALES 2010-2014 (EN MILES DE BS donde aplica) ══
   Generados desde SimuMon_Bloques_1-7_Consolidado.xlsx vía DATOS_V14 (ver datos_v7.js).
   Mismo formato de objeto que v5 (m1..m4p, pib, inf, des, pob, inv, etc.), extendido a 5 años
   y con campos NUEVOS: inv_real_bs1990_miles (canal fiscal Opción B), cin_fiscal_mmbs
   (condicionalidad Canal C), precio_gas_usdton, deuda_externa_musd, salario_minimo,
   afiliados_sip, pea, desocupados, pobExt, tasa_activa_mn_prom/me_prom.
   null = ausencia real en la fuente (2010 sin Encuesta de Hogares: des/pea/desocupados/pob/pobExt) */
const BASE = {};
Object.keys(DATOS_V14.BASE).forEach(y => { BASE[y] = DATOS_V14.BASE[y]; });


const KEYS   = ['m1', 'm1p', 'm2', 'm2p', 'm3', 'm3p', 'm4', 'm4p'];
const LABELS  = ['M1', "M'1", 'M2', "M'2", 'M3', "M'3", 'M4', "M'4"];
const BADGES  = ['bm1', 'bm1p', 'bm2', 'bm2p', 'bm3', 'bm3p', 'bm4', 'bm4p'];

const SLIDER_RANGES = {
    m1: [20000000, 120000000], m1p: [25000000, 140000000],
    m2: [33000000, 180000000], m2p: [40000000, 220000000],
    m3: [47000000, 270000000], m3p: [60000000, 330000000],
    m4: [49000000, 280000000], m4p: [61000000, 345000000]
};

/* ══ REGÍMENES ESTRUCTURALES — restringidos a 2010-2014 (verificado) ══
   v5 tenía 4 regímenes (2006-2025); ajuste/pandemia/escasez quedan fuera
   de esta versión por decisión explícita (pertenecen a la plataforma futura
   con rango de datos ampliado — Track 2). Aquí solo el rango con datos reales.
   Criterio de corte: signo del balance fiscal / CIN (Hoja 06 del Excel).
   k_fiscal: mediana de las transiciones reales-reales (Opción B, motor v7).
   ══════════════════════════════════════════════════════════════════════ */
const REGIMENES = {
    superciclo: {
        label: '2010–2013 · Superávit fiscal',
        k_fiscal: 2.66,   /* mediana real/real 2010-2013 (motor v7, Opción B) */
        beta_cred: 0.688, /* ΔM3/ΔInv 2012→2013 · BCB/VIPFE — se mantiene, verificado */
        theta_MF: 0.25,   /* punto de partida; se ajusta dinámicamente por dolarización del año base */
        descripcion: 'Precio gas en ascenso/pico · superávit fiscal · CIN negativo (sin monetización) · bolivianización avanzando'
    },
    quiebre: {
        label: '2014 · Déficit fiscal',
        k_fiscal: 4.02,   /* transición 2013→2014, mayor por caída de inversión real relativa */
        beta_cred: 0.688,
        theta_MF: 0.25,
        descripcion: 'Primer déficit fiscal desde 2006 · Canal C se activa (CIN positivo) · deuda externa casi duplicada'
    }
};
/* CORRECCIÓN v11: se llamaba "Régimen estructural" (Superciclo/Quiebre), lo
   que sugería una clasificación estadística de cambio de régimen (ruptura
   de Chow, Markov-switching). En realidad es una etiqueta de un solo
   criterio (signo del CIN) sobre un solo año — se renombra a "Contexto
   fiscal del año" para no prometer más solidez metodológica de la que tiene.
   La estructura interna (k_fiscal por grupo) se conserva sin cambios. */

/* Grupo fiscal activo — por defecto superávit (coincide con 2012-2013) */
let regimenActivo = 'superciclo';

/* ══ COEFICIENTES ACTIVOS (se actualizan con el régimen) ══════════════ */
let COEF = {
    /* Canal A — Fiscal (dominante bajo TC fijo)
       CORRECCIÓN v7 (Opción B validada): antes k=0.40/0.42 mezclaba PIB real (Bs 1990)
       con inversión en USD corrientes — inconsistencia dimensional. Ahora ambos lados
       en Bs de 1990 (inversión deflactada con el deflactor implícito de FBKF, INE).
       k=2.66: ΔPIB_real/ΔInv_real, transición 2012→2013 (mediana del período: 2.66)
       Fuente: INE Cuadro 1.01.01/2.01.01 + VIPFE Cuadro III.10, deflactado */
    k_fiscal: 2.66,

    /* Canal B — Monetario atenuado (θ = eficacia del canal doméstico, no movilidad de capitales en sentido estricto)
       CORRECCIÓN v7: θ ya no es un valor fijo — se recalcula por año base como
       función de la dolarización observada ese año (a mayor bolivianización,
       mayor eficacia del canal doméstico). Este valor es solo el arranque inicial.
       Fuente: BCB, Sistema Financiero (depósitos por moneda) */
    theta_MF: 0.25,

    /* Sensibilidad demanda de dinero a la tasa (pendiente LM)
       h=6.39: ΔM2/Δr = 17.75% / 2.78pp (tasa 2012: 9.00% → 2013: 6.22%)
       Fuente: BCB tasas activas 30ACS2012.pdf / 30ACM2013.pdf */
    h_lm: 6.39,

    /* Pendiente IS (sensibilidad inversión a la tasa)
       b=1.80: estimación teórica consistente con elasticidad I/r Bolivia
       Fuente: calibración propia sobre datos BCB/INE */
    b_is: 1.80,

    /* Elasticidad M3 respecto a inversión pública (Canal C · BCB→TGN)
       β=0.688: ΔM3/ΔInv = 20.99% / 30.50%
       Fuente: BCB Sector Monetario dic-2012→dic-2013 / VIPFE Cuadro III.10
       CORRECCIÓN v7: el canal ahora es CONDICIONAL — solo transmite si el CIN
       fiscal del año base es positivo (necesidad de financiamiento monetizada).
       2010-2013: CIN negativo (superávit) → canal inactivo. 2014: CIN positivo → activo. */
    beta_cred: 0.688,

    /* Caída de velocidad de circulación del dinero 2012→2013
       δV = −4.47%: ΔPIBnom(13.2%) − ΔM3(20.99%) = ajustado por IPC
       Fuente: INE Cuadro 6.01.02 + BCB Sector Monetario */
    delta_v: -4.47,

    /* Techo de capacidad productiva (penaliza si PIB simulado > 108% del base)
       Refleja restricciones de oferta en economía boliviana con alta informalidad */
    max_capacity: 1.08,

    /* Elasticidad pobreza-PIB: Δpob/ΔPIB = −4.4pp / 6.80pp
       Fuente: INE Cuadro 3.06.01.01 (FGT0) · 2012→2013 */
    eps_pob: -0.647,

    /* Coeficiente Okun: Δu / ΔPIB
       ε=−0.30: u y π subieron juntos → estanflación de oferta → se usa Okun no Phillips
       Fuente: INE Cuadro 3.04.01.01 · PEA/PD 2012→2013 */
    eps_okun: -0.30
};

/* Multiplicador real/real por transición (Opción B) — para el desplegable
   del Canal A y para que el usuario vea el rango completo, no solo la mediana */
const K_FISCAL_TRANSICIONES = {
    2011: 2.544, 2012: 2.141, 2013: 2.660, 2014: 4.019
};

/* ══ FUNCIÓN φ_t — PENALIZACIÓN POR ESCASEZ DE RIN ══════════════════
   Implementa la restricción externa activa (artículo Sección 3.3)
   rin_meses: razón RIN / importaciones mensuales promedio
   CORRECCIÓN v7: rampa CONTINUA en vez de 4 escalones discretos (v5 tenía
   una discontinuidad artificial en cada borde 1/3/6 meses). Umbral = 6 meses
   (estándar de adecuación de reservas). Con los datos 2010-2014 (17-21 meses)
   φ=0 siempre — el mecanismo está especificado pero nunca se activó en la
   historia observada. Opera en modo escenario si el usuario drena las RIN. */
/* Umbral de φ — seleccionable en la UI (6 meses = convención estándar de
   cobertura de importaciones; 12 meses = criterio más conservador citado
   en parte de la literatura para economías dependientes de commodities). */
let UMBRAL_PHI = 6;
function calcPhi(rin_meses) {
    return Math.max(0, Math.min(0.5, (UMBRAL_PHI - rin_meses) / UMBRAL_PHI * 0.5));
}
function onUmbralPhiChange() {
    const sel = document.getElementById('sel-umbral-phi');
    UMBRAL_PHI = sel ? parseFloat(sel.value) : 6;
    const label = document.getElementById('phi-umbral-label');
    if (label) label.textContent = `🌐 RESTRICCIÓN EXTERNA φ — RIN (rampa continua, umbral ${UMBRAL_PHI} meses)`;
    computeEffects();
}

/* ══ ACTUALIZAR RÉGIMEN ══ */
function aplicarRegimen(key) {
    regimenActivo = key;
    const r = REGIMENES[key];
    COEF.k_fiscal  = r.k_fiscal;
    COEF.beta_cred = r.beta_cred;
    COEF.theta_MF  = r.theta_MF;

    /* Etiqueta de solo lectura (ya no selector — se deriva del año base) */
    const label = document.getElementById('regimen-label');
    if (label) label.textContent = r.label;

    const desc = document.getElementById('regimen-desc');
    if (desc) desc.textContent = r.descripcion;

    /* CORRECCIÓN v8: se apunta al <span> interno, no al div completo —
       v7 tenía un bug latente que habría borrado los desplegables de
       Canal A/B (sel-k-fiscal, sel-theta-modo) al sobrescribir su contenedor. */
    const labelA = document.getElementById('canal-a-label-text');
    if (labelA) labelA.textContent =
        `🏛 CANAL A — FISCAL (dominante · k=${r.k_fiscal})`;

    const labelB = document.getElementById('canal-b-label-text');
    if (labelB) labelB.textContent =
        `💰 CANAL B — MONETARIO ATENUADO (θ ajustado por dolarización, punto de partida=${r.theta_MF})`;

    computeEffects();
    buildSimChart();
}

/* Régimen = clasificación derivada del año base, no una elección independiente.
   Elimina la posibilidad de contradicción (ej. Régimen=Quiebre con año=2011). */
function regimenDeAnio(y) {
    return BASE[y] && BASE[y].cin_fiscal_mmbs > 0 ? 'quiebre' : 'superciclo';
}

/* ══ DARK MODE ══ */
const gc   = () => window.matchMedia('(prefers-color-scheme:dark)').matches;
const gridC = () => gc() ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
const txtC  = () => gc() ? '#a8a8a2' : '#5a5a56';

const baseOpts = () => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } },
        y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }
    }
});

/* ══ CHARTS ESTÁTICOS ══ */
function initStaticCharts() {
    buildPanoramaCharts('anual');
    if (document.getElementById('c-desemp')) {
        new Chart(document.getElementById('c-desemp'), {
            type: 'bar',
            data: {
                labels: ['2011', '2012', '2013', '2014'],
                datasets: [
                    { label: 'PEA (miles)', data: [5286, 5023, 5374, 5551], backgroundColor: 'rgba(55,138,221,0.25)', borderRadius: 3, yAxisID: 'y1' },
                    { label: 'Desocupados (miles)', data: [140, 116, 153, 130], backgroundColor: '#D85A30', borderRadius: 3, yAxisID: 'y' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: {
                    x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } },
                    y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: 'Desocupados (miles)', color: txtC(), font: { size: 10 } } },
                    y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: 'PEA (miles)', color: txtC(), font: { size: 10 } } }
                }
            }
        });
    }
    if (document.getElementById('c-pob')) {
        new Chart(document.getElementById('c-pob'), {
            type: 'bar',
            data: {
                labels: ['2011', '2012', '2013', '2014'],
                datasets: [
                    { label: 'Moderada %', data: [45.1, 43.3, 38.9, 39.1], backgroundColor: '#5DCAA5', borderRadius: 3 },
                    { label: 'Extrema %', data: [21.0, 21.6, 18.7, 17.2], backgroundColor: '#1D9E75', borderRadius: 3 }
                ]
            },
            options: { ...baseOpts(), plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } } } }
        });
    }
    if (document.getElementById('c-inv')) {
        new Chart(document.getElementById('c-inv'), {
            type: 'bar',
            data: {
                labels: ['2009', '2010', '2011', '2012', '2013', '2014'],
                datasets: [{ data: [1439, 1521, 2182, 2897, 3781, 4507], backgroundColor: ['#CECBF6', '#CECBF6', '#CECBF6', '#534AB7', '#3C3489', '#2A2560'], borderRadius: 5 }]
            },
            options: { ...baseOpts(), plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '$us ' + c.raw.toLocaleString() + ' MM' } } } }
        });
    }
    if (document.getElementById('c-cin')) {
        new Chart(document.getElementById('c-cin'), {
            type: 'bar',
            data: {
                labels: ['2010', '2011', '2012', '2013', '2014'],
                datasets: [{ data: [-3730, -4347, -7631, -6645, 4597], backgroundColor: c => c.raw < 0 ? '#5DCAA5' : '#D85A30',
                    backgroundColor: [-3730, -4347, -7631, -6645, 4597].map(v => v < 0 ? '#5DCAA5' : '#D85A30'), borderRadius: 4 }]
            },
            options: { ...baseOpts(), plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => (c.raw < 0 ? 'Superávit (inactivo): ' : 'Déficit (Canal C activo): ') + c.raw.toLocaleString() + ' MM Bs' } } } }
        });
    }
    if (document.getElementById('c-rin')) {
        new Chart(document.getElementById('c-rin'), {
            type: 'line',
            data: {
                labels: ['2010', '2011', '2012', '2013', '2014'],
                datasets: [
                    { label: 'RIN (meses)', data: [20.8, 18.2, 19.5, 17.9, 17.0], borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.10)', fill: true, tension: .25, pointRadius: 4 },
                    { label: 'Umbral φ', data: [6, 6, 6, 6, 6], borderColor: '#D85A30', borderDash: [5, 3], pointRadius: 0 }
                ]
            },
            options: { ...baseOpts(), plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } } }, scales: { ...baseOpts().scales, y: { ...baseOpts().scales.y, min: 0, max: 24 } } }
        });
    }
    if (document.getElementById('c-rin-externa')) {
        new Chart(document.getElementById('c-rin-externa'), {
            type: 'line',
            data: {
                labels: ['2010', '2011', '2012', '2013', '2014'],
                datasets: [
                    { label: 'RIN (meses)', data: [20.8, 18.2, 19.5, 17.9, 17.0], borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.10)', fill: true, tension: .25, pointRadius: 4 },
                    { label: 'Umbral φ', data: [6, 6, 6, 6, 6], borderColor: '#D85A30', borderDash: [5, 3], pointRadius: 0 }
                ]
            },
            options: { ...baseOpts(), plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } } }, scales: { ...baseOpts().scales, y: { ...baseOpts().scales.y, min: 0, max: 24 } } }
        });
    }
    if (document.getElementById('c-tasas')) {
        const meses = Object.keys(DATOS_V14.MENSUAL).sort();
        new Chart(document.getElementById('c-tasas'), {
            type: 'line',
            data: {
                labels: meses,
                datasets: [
                    { label: 'Activa MN', data: meses.map(k => DATOS_V14.MENSUAL[k].tasa_activa_mn), borderColor: '#1D9E75', pointRadius: 0, tension: .2 },
                    { label: 'Activa ME', data: meses.map(k => DATOS_V14.MENSUAL[k].tasa_activa_me), borderColor: '#378ADD', pointRadius: 0, tension: .2 },
                    { label: 'Pasiva MN', data: meses.map(k => DATOS_V14.MENSUAL[k].tasa_pasiva_mn), borderColor: '#BA7517', borderDash: [4, 3], pointRadius: 0, tension: .2 },
                    { label: 'Pasiva ME', data: meses.map(k => DATOS_V14.MENSUAL[k].tasa_pasiva_me), borderColor: '#D85A30', borderDash: [4, 3], pointRadius: 0, tension: .2 },
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + (c.raw != null ? c.raw.toFixed(2) + '%' : '—') } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 12 } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 }, callback: v => v + '%' } } }
            }
        });
    }
    if (document.getElementById('c-agg-compare')) {
        const meses = Object.keys(DATOS_V14.MENSUAL).sort();
        const colores = {
            m1: '#9FE1CB', m1p: '#1D9E75', m2: '#B9DDF8', m2p: '#378ADD',
            m3: '#D8CEF2', m3p: '#7A5FC7', m4: '#F6C9A6', m4p: '#D85A30'
        };
        new Chart(document.getElementById('c-agg-compare'), {
            type: 'line',
            data: {
                labels: meses,
                datasets: KEYS.map((k, i) => ({
                    label: LABELS[i],
                    data: meses.map(mes => DATOS_V14.MENSUAL[mes][k] / 1000),
                    borderColor: colores[k],
                    borderDash: k.endsWith('p') ? [] : [3, 3],
                    pointRadius: 0, tension: .2, borderWidth: k.endsWith('p') ? 2 : 1.5
                }))
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 }, boxWidth: 12 } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + c.raw.toLocaleString(undefined, {maximumFractionDigits:0}) + ' MM Bs' } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 12 } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 }, callback: v => v.toLocaleString() } } }
            }
        });
    }
}

/* ══ SIMULADOR ══ */
let simChart = null;
let year = 2012;
let sim  = {};

function fmt(n) { return Math.round(n).toLocaleString(); }

/* PIB real anual (miles de Bs de 1990), sumando los 4 trimestres — usado
   por el Canal Fiscal (v8) para expresar el efecto de la inversión como
   % del PIB real, en la misma base de precios (Opción B, motor v7/v8). */
function pibRealAnual(y) {
    let s = 0;
    for (let t = 1; t <= 4; t++) s += DATOS_V14.TRIMESTRAL[`${y}T${t}`].pib_real;
    return s;
}
function pibNominalAnual(y) {
    let s = 0;
    for (let t = 1; t <= 4; t++) s += DATOS_V14.TRIMESTRAL[`${y}T${t}`].pib_nominal;
    return s;
}

function buildSliders() {
    const c = document.getElementById('sliders-container');
    if (!c) return;
    c.innerHTML = '';
    KEYS.forEach((k, i) => {
        const [mn, mx] = SLIDER_RANGES[k];
        c.innerHTML += `
        <div class="slider-group">
            <div class="slider-header">
                <div class="slider-label">
                    <span class="edit-badge ${BADGES[i]}" style="font-size:9px;">${LABELS[i]}</span>
                </div>
                <div class="slider-val" id="sv-${k}">—</div>
            </div>
            <input type="range" id="sl-${k}" min="${mn}" max="${mx}" step="100000"
                oninput="syncSlider('${k}', this.value)">
        </div>`;
    });
}

function initSim() {
    const d = BASE[year];
    /* Régimen auto-derivado del año base (ya no selector independiente) */
    aplicarRegimen(regimenDeAnio(year));
    sim = { ...d };
    KEYS.forEach(k => {
        const inp = document.getElementById('inp-' + k);
        if (inp) inp.value = d[k];
        const sl = document.getElementById('sl-' + k);
        if (sl) sl.value = d[k];
        const sv = document.getElementById('sv-' + k);
        if (sv) sv.textContent = fmt(d[k]) + ' miles Bs';
    });
    ['pib', 'inf', 'des', 'inv', 'pob'].forEach(k => {
        const sl = document.getElementById('msl-' + k);
        if (sl) sl.value = d[k];
        updateMacroLabel(k, d[k]);
    });
    /* Palancas propias por canal (v8) — se reinician al valor observado del año */
    const slInv = document.getElementById('sl-inv-real');
    if (slInv) { slInv.value = 100; document.getElementById('sv-inv-real').textContent = '100%'; }
    const slCin = document.getElementById('sl-cin');
    if (slCin) { slCin.value = Math.round(d.cin_fiscal_mmbs); onCanalSliderInputSilencioso('cin'); }
    const slRin = document.getElementById('sl-rin');
    if (slRin) { slRin.value = d.rin_meses; onCanalSliderInputSilencioso('rin'); }
    const slChoque = document.getElementById('sl-choque-oferta');
    if (slChoque) { slChoque.value = 0; document.getElementById('sv-choque-oferta').textContent = '0.0 pp'; }

    /* Mostrar el valor observado del año base en cada canal — antes cambiar
       de año sin mover sliders se sentía "igual" en Fiscal/Crédito/Externa
       porque solo se mostraba el delta relativo (siempre 0 al reiniciar). */
    const setObs = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setObs('obs-anio-fiscal', year);
    setObs('obs-inv-real', fmt(d.inv_real_bs1990_miles / 1000) + ' MM Bs 1990 (' + fmt(d.inv) + ' MM $us)');
    setObs('obs-anio-credito', year);
    setObs('obs-cin', (d.cin_fiscal_mmbs >= 0 ? '+' : '') + fmt(d.cin_fiscal_mmbs) + ' MM Bs' + (d.cin_fiscal_mmbs > 0 ? ' (activo)' : ' (inactivo)'));
    setObs('obs-anio-externa', year);
    setObs('obs-rin', d.rin_meses.toFixed(1) + ' meses');

    computeEffects();
    buildSimChart();
    updateMacroEffects(d.pib, d.inf, d.des, d.inv, d.pob);
}

function updateMacroLabel(k, v) {
    const el = document.getElementById('msv-' + k);
    if (!el) return;
    if (k === 'inv') el.textContent = '$us ' + Math.round(v);
    else if (k === 'pob') el.textContent = parseFloat(v).toFixed(1) + '%';
    else el.textContent = parseFloat(v).toFixed(2) + '%';
}

function updateBase() {
    const sel = document.getElementById('baseYear');
    if (sel) year = parseInt(sel.value);
    /* Defensa adicional: 2010 no tiene año previo en la muestra (pib=null) ni
       Encuesta de Hogares (des/pob=null). El <option> ya está disabled, pero
       si algo lo fuerza, no se ejecuta el motor con datos inexistentes. */
    if (BASE[year] && BASE[year].pib == null) {
        alert('2010 no puede ser año base del simulador interactivo (sin año previo en la muestra ni Encuesta de Hogares). Se mantiene el año base anterior.');
        sel.value = String(year === 2010 ? 2012 : year);
        year = parseInt(sel.value);
    }
    initSim();
}

function resetToBase() {
    const sel = document.getElementById('baseYear');
    if (sel) year = parseInt(sel.value);
    initSim();
}

function resetTotal() {
    const sel = document.getElementById('baseYear');
    if (sel) year = parseInt(sel.value);
    initSim();
    const b = BASE[year];
    ['pib', 'inf', 'des', 'inv', 'pob'].forEach(k => {
        const sl = document.getElementById('msl-' + k);
        if (sl) sl.value = b[k];
        updateMacroLabel(k, b[k]);
    });
    updateMacroEffects(b.pib, b.inf, b.des, b.inv, b.pob);
    computeEffects();
}

/* ══ CONSISTENCIA PROPORCIONAL ══ */
function syncInput(key) {
    let val = parseFloat(document.getElementById('inp-' + key).value) || 0;
    val = Math.max(0, val);
    const b = BASE[year];
    const ratio = val / b[key];
    KEYS.forEach(k => { sim[k] = Math.round(b[k] * ratio); });
    KEYS.forEach(k => {
        const inp = document.getElementById('inp-' + k);
        if (inp) inp.value = sim[k];
        const sl = document.getElementById('sl-' + k);
        if (sl) sl.value = sim[k];
        const sv = document.getElementById('sv-' + k);
        if (sv) sv.textContent = fmt(sim[k]) + ' miles Bs';
    });
    computeEffects();
    updateSimChart();
}

function syncSlider(key, val) {
    val = Math.max(0, parseFloat(val));
    const b = BASE[year];
    const ratio = val / b[key];
    KEYS.forEach(k => { sim[k] = Math.round(b[k] * ratio); });
    KEYS.forEach(k => {
        const inp = document.getElementById('inp-' + k);
        if (inp) inp.value = sim[k];
        const sl = document.getElementById('sl-' + k);
        if (sl && sl.value != sim[k]) sl.value = sim[k];
        const sv = document.getElementById('sv-' + k);
        if (sv) sv.textContent = fmt(sim[k]) + ' miles Bs';
    });
    computeEffects();
    updateSimChart();
}

/* ══ MATRIZ DE POLÍTICAS ══ */
/* CORRECCIÓN v8 (hallazgo de esta sesión): las políticas monetarias movían
   M1-M4' pero Canal A y C, al tener ahora palanca propia (inversión real,
   CIN), habían quedado sin recibir el efecto — contradecía la propia tabla
   de políticas ("A+C dominantes", "C parcial", etc.). Canal A (inversión
   pública real) es una decisión FISCAL, no monetaria: correctamente no debe
   moverse con estos botones. Canal C (CIN, crédito BCB→TGN) SÍ es monetario:
   se agrega cinDelta (MM Bs, sumado al CIN histórico del año base). */
const POLICY_EFFECTS = {
    expansiva:       { m1: 1.15, m2: 1.15, m3: 1.15, m4: 1.12, m1p: 1.08, m2p: 1.08, m3p: 1.08, m4p: 1.05, cinDelta: 3000 },
    contractiva:     { m1: 0.85, m2: 0.85, m3: 0.85, m4: 0.88, m1p: 0.88, m2p: 0.88, m3p: 0.88, m4p: 0.92, cinDelta: -3000 },
    'oma-compra':    { m1: 1.10, m2: 1.05, m3: 1.03, m4: 1.02, m1p: 1.07, m2p: 1.04, m3p: 1.02, m4p: 1.01, cinDelta: 1200 },
    'oma-venta':     { m1: 0.90, m2: 0.96, m3: 0.98, m4: 0.99, m1p: 0.93, m2p: 0.97, m3p: 0.99, m4p: 0.995, cinDelta: -800 },
    'encaje-sube':   { m1: 1.02, m2: 0.92, m3: 0.92, m4: 0.93, m1p: 1.01, m2p: 0.94, m3p: 0.94, m4p: 0.95, cinDelta: -400 },
    bolivianizacion: { m1: 1.12, m2: 1.10, m3: 1.10, m4: 1.08, m1p: 1.04, m2p: 1.03, m3p: 1.02, m4p: 0.98, cinDelta: 1500 }
};

function applyPolicy(policyKey) {
    const b = BASE[year];
    const effects = POLICY_EFFECTS[policyKey];
    if (!effects) return;
    KEYS.forEach(k => { sim[k] = Math.round(b[k] * (effects[k] || 1.0)); });
    KEYS.forEach(k => {
        const inp = document.getElementById('inp-' + k);
        if (inp) inp.value = sim[k];
        const sl = document.getElementById('sl-' + k);
        if (sl) sl.value = sim[k];
        const sv = document.getElementById('sv-' + k);
        if (sv) sv.textContent = fmt(sim[k]) + ' miles Bs';
    });
    /* Mover también el Canal C (CIN) — antes las políticas no lo tocaban */
    const slCin = document.getElementById('sl-cin');
    if (slCin) {
        const nuevoCin = Math.max(-10000, Math.min(10000, Math.round(b.cin_fiscal_mmbs + effects.cinDelta)));
        slCin.value = nuevoCin;
        onCanalSliderInputSilencioso('cin');
    }
    computeEffects();
    updateSimChart();
}

/* ══════════════════════════════════════════════════════════════════════
   MOTOR ECONÓMICO v5 — CORRECCIONES FASE 0:
   [FIX 1] dY_monetario ahora SUMA al dY_total (antes ignorado)
   [FIX 2] Presión cambiaria reemplazada por índice RIN calibrado con φ_t
   [FIX 3] k y β se penalizan automáticamente según RIN del régimen activo
   ══════════════════════════════════════════════════════════════════════ */
function computeEffects() {
    const b = BASE[year];
    const pibNomBaseParaV = pibNominalAnual(year); /* usado por señoreaje y por ΔV más abajo */
    const dM1  = (sim.m1  - b.m1)  / b.m1;
    const dM2  = (sim.m2  - b.m2)  / b.m2;
    const dM3  = (sim.m3  - b.m3)  / b.m3;
    const dM4p = (sim.m4p - b.m4p) / b.m4p;
    /* CORRECCIÓN v11: antes usaba el promedio de TODOS los plazos (corto y
       largo mezclados) — pero el canal LM transmite política monetaria
       principalmente vía la tasa de CORTO plazo (1-30 días), que reacciona
       rápido; la de largo plazo (181-360 días) responde a otra dinámica.
       Se usa la serie de corto plazo específica, extraída del mismo
       archivo BCB (columna 1-30 días), en vez del promedio ciego a plazos. */
    const tasaRef = b.tasa_activa_mn_corto_prom != null ? b.tasa_activa_mn_corto_prom : b.tasa_activa_mn_prom;

    /* ── RESTRICCIÓN EXTERNA ACTIVA (φ_t) ─────────────────────────────
       Calcula penalización en tiempo real según el estado de RIN.
       RIN_meses base = dato histórico del año. La simulación puede
       moverlo vía slider de RIN (si existe) o usa el valor base. */
    const rin_slider = document.getElementById('sl-rin');
    const rin_meses  = rin_slider ? parseFloat(rin_slider.value) : b.rin_meses;
    const phi = calcPhi(rin_meses);
    const r   = REGIMENES[regimenActivo];

    /* θ_MF DINÁMICO — CORRECCIÓN v7: anclado al punto empírico original (2012,
       θ=0.25, dolarización=27.1%). Se escala inversamente con la dolarización
       observada del año base: a menor dolarización, mayor eficacia del canal.
       Desplegable Canal B permite comparar contra el θ fijo de v5. */
    const DOLAR_REF = BASE[2012].dolarizacion, THETA_REF = 0.25;
    const selTheta = document.getElementById('sel-theta-modo');
    const theta_din = (selTheta && selTheta.value === 'fijo')
        ? THETA_REF
        : THETA_REF * (DOLAR_REF / b.dolarizacion);

    /* k_base: mediana del período o una transición específica (desplegable Canal A) */
    const selK = document.getElementById('sel-k-fiscal');
    const k_base = (selK && selK.value !== 'mediana' && K_FISCAL_TRANSICIONES[selK.value])
        ? K_FISCAL_TRANSICIONES[selK.value] : r.k_fiscal;
    const k_adj = k_base * (1 - phi);

    /* ── CANAL A: FISCAL — PALANCA PROPIA (v8) ────────────────────────
       CORRECCIÓN v8: antes Canal A heredaba el mismo dM3 del slider
       monetario (no existía una palanca fiscal independiente). Ahora usa
       su propio slider de inversión pública real (sl-inv-real, 40%-160%).
       dY_A = k_adj × ΔInv_real(Bs) / PIB_real_base(Bs) × 100          */
    const selInv = document.getElementById('sl-inv-real');
    const invFactor = selInv ? parseFloat(selInv.value) / 100 : 1;
    const invRealBase = b.inv_real_bs1990_miles;
    const pibRealBase = pibRealAnual(year);
    const dInvReal = invRealBase * (invFactor - 1);
    let dY_fiscal = k_adj * (dInvReal / pibRealBase) * 100;

    /* ── CANAL C: CRÉDITO BCB — PALANCA PROPIA, RAMPA SUAVE (v11) ─────
       CORRECCIÓN v11: antes la activación era un interruptor binario
       exacto en CIN=0 (inactivo/activo). No hay evidencia de que los
       efectos de credibilidad/expectativas de un mercado que anticipa
       monetización sean verdaderamente discontinuos en ese punto exacto
       — es más razonable modelar una transición suave. Se usa una
       sigmoide centrada en 0, con un ancho de transición declarado
       (ANCHO_RAMPA = 2.000 MM Bs, SUPUESTO). El badge ACTIVO/INACTIVO
       sigue usando el cruce por cero como referencia visual simple. */
    const ANCHO_RAMPA_CIN = 2000; // MM Bs — declarado, no calibrado
    const activacionCanalC = (cin) => 1 / (1 + Math.exp(-4 * cin / ANCHO_RAMPA_CIN));
    const selCin = document.getElementById('sl-cin');
    const cinSim = selCin ? parseFloat(selCin.value) : b.cin_fiscal_mmbs;
    const canalC_activo = cinSim > 0; // umbral visual del badge, sin cambios
    const activHist = activacionCanalC(b.cin_fiscal_mmbs);
    const activSim  = activacionCanalC(cinSim);
    const expansionHist_miles = activHist * b.cin_fiscal_mmbs * 1000;
    const expansionSim_miles  = activSim  * cinSim * 1000;
    const dExpansion_miles = expansionSim_miles - expansionHist_miles; /* delta vs. lo ya ocurrido */
    const beta_adj = r.beta_cred * (1 - phi);
    const dG_implicita = dExpansion_miles / b.m3;
    let dY_credito = k_adj * beta_adj * dG_implicita * 100;

    /* Penalidad por capacidad productiva (aplica a la suma de A+C, el
       componente con fundamento real de expansión de demanda agregada) */
    const dY_AC = dY_fiscal + dY_credito;
    const pib_simulado  = b.pib + dY_AC;
    const capacidad_usada = pib_simulado / (b.pib * COEF.max_capacity);
    if (capacidad_usada > 0.95) {
        const penalidad = Math.max(0.1, 1 - (capacidad_usada - 0.95) * 2.5);
        dY_fiscal   *= penalidad;
        dY_credito  *= penalidad;
    }
    /* CORRECCIÓN: capacidad_usada, calculada arriba, refleja el efecto BRUTO
       sobre el PIB antes de aplicar la penalidad (dY_AC sin corregir). Más
       abajo, ese mismo capacidad_usada se reutilizaba para calcular el
       choque de oferta por saturación — pero el PIB que efectivamente se
       reporta ya viene penalizado. Esto producía un desglose inconsistente:
       un efecto de PIB modesto (ya corregido) combinado con una inflación
       de oferta calculada sobre un escenario bruto muy superior a la
       realidad reportada. Se recalcula la capacidad usada con los valores
       YA penalizados, para que el desglose de inflación sea consistente
       con el PIB que efectivamente se muestra al usuario. */
    const capacidad_usada_final = (b.pib + dY_fiscal + dY_credito) / (b.pib * COEF.max_capacity);

    /* ── CANAL B: MONETARIO ATENUADO (θ_MF dinámico) ───────────────── */
    const dM_liq      = 0.60 * dM1 + 0.40 * dM2;
    const delta_r     = -(dM_liq * tasaRef) / COEF.h_lm;
    const delta_I_priv = -COEF.b_is * delta_r;
    /* CORRECCIÓN: antes usaba k_base (sin penalizar por φ) mientras Canal A
       y C sí usan k_adj — inconsistente, dado que la restricción externa
       debería atenuar la demanda agregada sin importar por qué canal llega.
       Ahora los 3 canales usan k_adj de forma consistente. */
    const dY_monetario = theta_din * k_adj * delta_I_priv * 0.06;

    /* ── dY_TOTAL = CANAL A + CANAL C + CANAL B (v8: los 3 con palanca propia) */
    const dY_total = dY_fiscal + dY_credito + dY_monetario;
    const newPIB   = +(b.pib + dY_total).toFixed(2);
    const newTasa  = +(tasaRef + delta_r).toFixed(2);

    /* ── INFLACIÓN ─────────────────────────────────────────────────── */
    const dM_pond = 0.20 * dM1 + 0.30 * dM2 + 0.30 * dM3 + 0.20 * dM4p;
    let delta_inf_dem = (dM_pond * 100 - dY_total) * 0.35;
    let delta_inf_ofe = 0;
    if (capacidad_usada_final > 0.95) {
        delta_inf_ofe = (capacidad_usada_final - 0.95) * 3.0;
        delta_inf_dem = delta_inf_dem * 0.7;
    }
    /* Choque de oferta simulado (climático/logístico) — palanca propia,
       independiente del ONI (ver nota en el HTML). Suma directo a Δπ_oferta,
       igual que hizo el choque de alimentos real de 2013. */
    const selChoque = document.getElementById('sl-choque-oferta');
    const choqueOferta = selChoque ? parseFloat(selChoque.value) : 0;
    delta_inf_ofe += choqueOferta;
    /* CORRECCIÓN: antes solo mostraba choqueOferta (el slider), ocultando el
       componente de saturación de capacidad cuando estaba activo. Ahora
       muestra el total real de Δπ_oferta, que es lo que efectivamente se
       suma a la inflación — coherente con lo que el usuario ve en cn-dinf. */
    const setCOferta = document.getElementById('cn-dinf-ofe');
    if (setCOferta) setCOferta.textContent = (delta_inf_ofe >= 0 ? '+' : '') + delta_inf_ofe.toFixed(2) + ' pp';
    const delta_inf    = delta_inf_dem + delta_inf_ofe;
    const newInf       = +(b.inf    + delta_inf).toFixed(2);
    const newInfNuc    = +(b.infNuc + delta_inf_dem).toFixed(2);

    /* ── MERCADO LABORAL Y POBREZA ─────────────────────────────────── */
    const delta_des = COEF.eps_okun * dY_total + 0.05 * delta_inf_ofe;
    const newDes    = +(b.des + delta_des).toFixed(2);
    const delta_pob = COEF.eps_pob * dY_total + 0.15 * Math.max(0, delta_inf_dem);
    const newPob    = +(b.pob + delta_pob).toFixed(1);

    /* ── [FIX 2] ÍNDICE DE PRESIÓN CAMBIARIA — RIN CALIBRADO ──────────
       ANTES (bug): índice arbitrario sin base empírica (50–200)
       AHORA (fix): índice basado en φ_t (0–100 donde 100=sin presión)
       0   = RIN < 1 mes (crisis cambiaria crítica, φ=0.50)
       50  = RIN 1-3 meses (zona de alerta, φ=0.30)
       70  = RIN 3-6 meses (precaución, φ=0.15)
       100 = RIN ≥ 6 meses (zona segura, φ=0)
       Adicionalmente incorpora presión por expansión de M4' */
    const presion_M4 = Math.max(0, dM4p * 15);  /* expansión M4' presiona TC */
    let   idx_cam;
    if      (rin_meses < 1)  idx_cam = Math.max(0,  10 - presion_M4);
    else if (rin_meses < 3)  idx_cam = Math.max(0,  45 - presion_M4);
    else if (rin_meses < 6)  idx_cam = Math.max(20, 70 - presion_M4);
    else                     idx_cam = Math.max(50, 100 - presion_M4);
    const newCam = +idx_cam.toFixed(1);

    const newInvP = +(100 + delta_I_priv * 0.3).toFixed(1);

    /* ── ACTUALIZAR CANALES EN UI ────────────────────────────────────── */
    const setC = (id, val, suf = '', dec = 2) => {
        const el = document.getElementById(id);
        if (el) el.textContent = (val >= 0 ? '+' : '') + val.toFixed(dec) + suf;
    };
    /* Canal A — ahora impulsado por el slider de inversión real, no por M3 */
    setC('cn-dinv',   (invFactor - 1) * 100, '%');
    setC('cn-dy-f',   dY_fiscal,        ' pp');
    /* Canal C — ahora impulsado por el slider de CIN, no por M3 */
    setC('cn-dcin',   cinSim,           ' MM Bs', 0);
    setC('cn-dg',     dG_implicita * 100, '%');
    setC('cn-dy-c',   dY_credito,       ' pp');
    /* Señoreaje / impuesto inflacionario — CORRECCIÓN v11 (punto 9 de la
       auditoría económica): indicador clásico ausente pese a que el Canal
       C trata literalmente de esto. Se calcula como la expansión de base
       monetaria simulada (activación suave × CIN simulado) sobre el PIB
       nominal del año base. */
    const senoreaje_pct = pibNomBaseParaV ? (expansionSim_miles / pibNomBaseParaV) * 100 : 0;
    const elSenoreaje = document.getElementById('cn-senoreaje');
    if (elSenoreaje) elSenoreaje.textContent = (senoreaje_pct >= 0 ? '+' : '') + senoreaje_pct.toFixed(2) + '% PIB';
    /* Canal B — sin cambios, sigue impulsado por los 8 sliders monetarios */
    setC('cn-dm2',    dM2 * 100,        '%');
    setC('cn-dr',     delta_r,          ' pp');
    setC('cn-di',     delta_I_priv,     '',  1);
    setC('cn-dy-m',   dY_monetario,     ' pp');
    /* Síntesis */
    setC('cn-dy-tot', dY_total,         ' pp');
    setC('cn-dy-f-s', dY_fiscal + dY_credito, ' pp');
    setC('cn-dy-m-s', dY_monetario,     ' pp');
    setC('cn-dm4p',   dM4p * 100,       '%');
    /* ΔV — CORRECCIÓN: antes mostraba COEF.delta_v, una constante fija
       (-4.47%) que nunca cambiaba sin importar el escenario. Ahora se
       calcula de verdad: V = PIB nominal / M4'. Nominal del escenario
       aproximado como PIB real simulado × (1 + inflación simulada). */
    const pibNomSim = pibNomBaseParaV * (1 + (dY_total + delta_inf) / 100);
    const vBase = pibNomBaseParaV / b.m4p;
    const vSim  = pibNomSim / sim.m4p;
    const deltaV = (vSim / vBase - 1) * 100;
    setC('cn-dv',     deltaV,           '%');
    COEF.delta_v = +deltaV.toFixed(2); /* mantiene coherencia con cualquier otra referencia a COEF.delta_v */
    setC('cn-dinf-d', delta_inf_dem,    ' pp');
    setC('cn-dinf',   delta_inf,        ' pp');
    setC('cn-du',     delta_des,        ' pp');
    setC('cn-dpob',   delta_pob,        ' pp', 1);

    /* Mostrar φ activo en UI */
    const elPhi = document.getElementById('phi-activo');
    if (elPhi) elPhi.textContent = `φ=${phi.toFixed(2)} · k_adj=${k_adj.toFixed(2)} · β_adj=${beta_adj.toFixed(3)}`;

    /* Badge de estado del Canal C — condicional al CIN fiscal del año base.
       Ahora muestra también el % de activación de la rampa suave (activSim),
       ya que el canal puede estar "parcialmente activo", no solo binario. */
    const badgeC = document.getElementById('canal-c-badge');
    if (badgeC) {
        const pctActiv = Math.round(activSim * 100);
        badgeC.textContent = (canalC_activo ? 'ACTIVO ' : 'INACTIVO ') + pctActiv + '%';
        badgeC.style.background = canalC_activo ? 'var(--teal-bg)' : 'var(--red-bg)';
        badgeC.style.color = canalC_activo ? 'var(--teal)' : 'var(--red)';
    }

    setEff('eff-pib',  'eff-pib-d',  newPIB,  b.pib,  '%', true);
    setEff('eff-inf',  'eff-inf-d',  newInf,  b.inf,  '%', false);
    setEff('eff-infn', 'eff-infn-d', newInfNuc, b.infNuc, '%', false);
    setEff('eff-tasa', 'eff-tasa-d', newTasa, tasaRef,'%', false);
    setEff('eff-des',  'eff-des-d',  newDes,  b.des,  '%', false);
    setEff('eff-pob',  'eff-pob-d',  newPob,  b.pob,  '%', false);
    setEff('eff-inv',  'eff-inv-d',  newInvP, 100,    '',  true);
    setEff('eff-cam',  'eff-cam-d',  newCam,  (rin_meses >= 6 ? 100 : rin_meses >= 3 ? 70 : rin_meses >= 1 ? 45 : 10), '', false);

    /* ── PANEL DE ALERTAS SEMÁFORO ────────────────────────────────────── */
    updateAlertas(b, newInf, rin_meses, delta_inf_dem, dY_total, cinSim, pibNomBaseParaV);
}

/* ══════════════════════════════════════════════════════════════════════
   SISTEMA DE ALERTAS — 5 UMBRALES (artículo Sección 3.5 / Tabla 3)
   Cada alerta evalúa el umbral y actualiza el elemento HTML si existe.
   Las alertas ⚠️ NARANJA y 🔴 ROJO también modifican el motor implícitamente
   vía φ_t (RIN) y θ_MF (dolarización) que ya están en computeEffects.
   ══════════════════════════════════════════════════════════════════════ */
function updateAlertas(b, newInf, rin_meses, delta_inf_dem, dY_total, cinSim, pibNomBase) {
    /* 1. RIN CRÍTICA — Canal Externa (φ) */
    setAlerta('alerta-rin',
        rin_meses < 1  ? 'rojo'    :
        rin_meses < 3  ? 'rojo'    :
        rin_meses < 6  ? 'naranja' : 'verde',
        rin_meses < 1  ? `🔴 [Externa] RIN CRÍTICA — ${rin_meses.toFixed(1)} meses. k reducido 50%. Riesgo de crisis cambiaria.` :
        rin_meses < 3  ? `🔴 [Externa] RIN BAJA — ${rin_meses.toFixed(1)} meses. k reducido 30%. Zona de alerta.` :
        rin_meses < 6  ? `🟠 [Externa] RIN PRECAUCIÓN — ${rin_meses.toFixed(1)} meses. k reducido 15%. Monitorear.` :
                         `🟢 [Externa] RIN ADECUADA — ${rin_meses.toFixed(1)} meses. Sin penalización.`
    );

    /* 2. BRECHA CAMBIARIA — Canal Externa */
    const brecha = b.brecha_cam || 0;
    setAlerta('alerta-cam',
        brecha > 15 ? 'rojo'    :
        brecha > 8  ? 'naranja' : 'verde',
        brecha > 15 ? `🔴 [Externa] BRECHA CAMBIARIA ${brecha.toFixed(1)}% — Fuga de capitales activa. Canal monetario severamente atenuado.` :
        brecha > 8  ? `🟠 [Externa] BRECHA CAMBIARIA ${brecha.toFixed(1)}% — Presión sobre TC oficial. Vigilar reservas.` :
                      `🟢 [Externa] BRECHA CAMBIARIA ${brecha.toFixed(1)}% — Mercado cambiario estable.`
    );

    /* 3. INFLACIÓN DE ALIMENTOS — Síntesis (cruza Canal B + shock exógeno) */
    /* CORRECCIÓN: usaba b.inf_alim, que es el NIVEL del índice IPC-Alimentos
       (ej. 161.5), no una tasa — comparado contra umbrales de porcentaje
       (>10, >6), esta alerta estaba en ROJO permanentemente sin importar el
       escenario. Ahora usa inf_alim_pct (variación dic-dic real). */
    const inf_alim = (b.inf_alim_pct != null ? b.inf_alim_pct : 5) + delta_inf_dem * 1.3; /* alimentos más sensibles a demanda */
    setAlerta('alerta-inf-alim',
        inf_alim > 10 ? 'rojo'    :
        inf_alim > 6  ? 'naranja' : 'verde',
        inf_alim > 10 ? `🔴 [Síntesis] INFLACIÓN ALIMENTOS ${inf_alim.toFixed(1)}% — Recomendar política de oferta (subsidios focalizados).` :
        inf_alim > 6  ? `🟠 [Síntesis] INFLACIÓN ALIMENTOS ${inf_alim.toFixed(1)}% — Presión de demanda en alimentos. Monitorear.` :
                        `🟢 [Síntesis] INFLACIÓN ALIMENTOS ${inf_alim.toFixed(1)}% — Dentro de rango normal.`
    );

    /* 4. DÉFICIT FISCAL — Canal Fiscal / Crédito
       CORRECCIÓN: antes solo reaccionaba indirectamente a dY_total (el
       crecimiento del PIB), con signo tal que monetizar MÁS (CIN↑) hacía
       ver el déficit MEJOR — lo opuesto a la realidad. Ahora se liga
       directamente al CIN que el usuario mueve en Canal Crédito: más CIN
       positivo = más financiamiento monetario del déficit = peor balance. */
    const dCIN_pctPIB = pibNomBase ? ((cinSim - b.cin_fiscal_mmbs) * 1000) / pibNomBase * 100 : 0;
    /* dCIN_pctPIB: cinSim/b.cin_fiscal_mmbs están en MM Bs (millones); pibNomBase
       está en miles de Bs → factor ×1000 para llevar millones a miles antes de dividir */
    const deficit = b.deficit_pib + dCIN_pctPIB;
    setAlerta('alerta-deficit',
        deficit > 5 ? 'rojo'    :
        deficit > 3 ? 'naranja' : 'verde',
        deficit > 5 ? `🔴 [Fiscal/Crédito] DÉFICIT FISCAL ${deficit.toFixed(1)}% PIB — Insostenible. Riesgo de monetización.` :
        deficit > 3 ? `🟠 [Fiscal/Crédito] DÉFICIT FISCAL ${deficit.toFixed(1)}% PIB — Elevado. Restricción de gasto recomendada.` :
                      `🟢 [Fiscal/Crédito] DÉFICIT FISCAL ${deficit.toFixed(1)}% PIB — Dentro de rango manejable.`
    );

    /* 5. DOLARIZACIÓN FINANCIERA — Canal Monetario (θ_MF) */
    const dolar = b.dolarizacion;
    setAlerta('alerta-dolar',
        dolar > 60 ? 'rojo'    :
        dolar > 45 ? 'naranja' : 'verde',
        dolar > 60 ? `🔴 [Monetario] DOLARIZACIÓN ${dolar.toFixed(1)}% — Canal monetario severamente atenuado. θ_MF automáticamente reducido.` :
        dolar > 45 ? `🟠 [Monetario] DOLARIZACIÓN ${dolar.toFixed(1)}% — Efectividad monetaria moderada. Bolivianización recomendada.` :
                     `🟢 [Monetario] DOLARIZACIÓN ${dolar.toFixed(1)}% — Canal monetario efectivo. Bolivianización avanzada.`
    );
}

function setAlerta(id, nivel, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `alerta-item alerta-${nivel}`;
    el.textContent = texto;
}

function setEff(vId, dId, val, base, suf, goodIfUp) {
    const elVal   = document.getElementById(vId);
    const elDelta = document.getElementById(dId);
    if (!elVal || !elDelta) return;
    elVal.textContent = val + suf;
    const diff = +(val - base).toFixed(2);
    if (Math.abs(diff) < 0.01) {
        elDelta.textContent = '— sin cambio';
        elDelta.className = 'effect-delta';
        return;
    }
    const arrow = diff > 0 ? '▲ +' : '▼ ';
    elDelta.textContent = arrow + Math.abs(diff) + suf + ' vs base';
    elDelta.className = 'effect-delta ' + ((diff > 0) === goodIfUp ? 'pos' : 'neg');
}

/* ══ MACRO → MONETARIO ══ */
function updateMacro() {
    const pib = parseFloat(document.getElementById('msl-pib').value);
    const inf = parseFloat(document.getElementById('msl-inf').value);
    const des = parseFloat(document.getElementById('msl-des').value);
    const inv = parseFloat(document.getElementById('msl-inv').value);
    const pob = parseFloat(document.getElementById('msl-pob').value);
    ['pib', 'inf', 'des', 'inv', 'pob'].forEach(k => {
        updateMacroLabel(k, document.getElementById('msl-' + k).value);
    });
    updateMacroEffects(pib, inf, des, inv, pob);
}

function updateMacroEffects(pib, inf, des, inv, pob) {
    const b = BASE[year];
    if (pib === undefined) return;
    const dPIB = (pib - b.pib) / (b.pib || 1);
    const dInf = (inf - b.inf) / (b.inf || 1);
    const dInv = (inv - b.inv) / (b.inv || 1);
    const newM1  = Math.round(b.m1  * (1 + dPIB * 0.38 + dInf * 0.50 + dInv * 0.30));
    const newM2  = Math.round(b.m2  * (1 + dPIB * 0.38 + dInf * 0.60 + dInv * COEF.beta_cred * 0.6));
    const newM3  = Math.round(b.m3  * (1 + dPIB * 0.38 + dInf * 0.70 + dInv * COEF.beta_cred));
    const newM4p = Math.round(b.m4p * (1 + dPIB * 0.38 + dInf * 0.80 + dInv * COEF.beta_cred * 0.8));
    setMAgg('meff-m1',  'meff-m1-d',  newM1,  b.m1);
    setMAgg('meff-m2',  'meff-m2-d',  newM2,  b.m2);
    setMAgg('meff-m3',  'meff-m3-d',  newM3,  b.m3);
    setMAgg('meff-m4p', 'meff-m4p-d', newM4p, b.m4p);
}

function setMAgg(vId, dId, val, base) {
    const elVal   = document.getElementById(vId);
    const elDelta = document.getElementById(dId);
    if (!elVal || !elDelta) return;
    elVal.textContent = (val / 1000).toFixed(1) + ' miles M Bs';
    const diff = val - base;
    const pct  = +((diff / base) * 100).toFixed(1);
    if (Math.abs(diff) < 50000) {
        elDelta.textContent = '— sin cambio';
        elDelta.className = 'effect-delta';
        return;
    }
    elDelta.textContent = (diff > 0 ? '▲ +' : '▼ ') + Math.abs(pct) + '% vs base';
    elDelta.className = 'effect-delta ' + (diff > 0 ? 'pos' : 'neg');
}

/* ══ CHART SIMULACIÓN ══ */
function buildSimChart() {
    const b        = BASE[year];
    const baseData = KEYS.map(k => Math.round(b[k] / 1000));
    const simData  = KEYS.map(k => Math.round(sim[k] / 1000));
    const ctx = document.getElementById('c-sim');
    if (!ctx) return;
    if (simChart) simChart.destroy();
    simChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: LABELS,
            datasets: [
                { label: 'Base histórica', data: baseData, backgroundColor: 'rgba(29,158,117,0.25)', borderRadius: 3 },
                { label: 'Simulación',     data: simData,  backgroundColor: '#1D9E75',               borderRadius: 3 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + c.raw.toLocaleString() + ' miles M Bs' } } },
            scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 }, callback: v => v.toLocaleString() } } }
        }
    });
}

function updateSimChart() {
    if (!simChart) return;
    simChart.data.datasets[1].data = KEYS.map(k => Math.round(sim[k] / 1000));
    simChart.update();
}

/* ══ MODO TOGGLE ══ */
function setMode(mode, btn) {
    /* CORRECCIÓN: antes usaba .agg-mode-toggle button (misma clase que la
       sub-navegación de canales) y las apagaba entre sí. Ahora se limita a
       los botones dentro del MISMO .agg-mode-toggle que el botón clicado. */
    const grupo = btn.closest('.agg-mode-toggle');
    if (grupo) grupo.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const simDiv = document.getElementById('mode-sim');
    const revDiv = document.getElementById('mode-rev');
    if (simDiv) simDiv.style.display = mode === 'sim' ? 'block' : 'none';
    if (revDiv) revDiv.style.display = mode === 'rev' ? 'block' : 'none';
}

/* ══ DESPLEGABLES POR CANAL — recalcula sin tocar los sliders ══ */
function onCanalKChange() {
    computeEffects();
}

function onChoqueOfertaInput() {
    const sl = document.getElementById('sl-choque-oferta');
    const sv = document.getElementById('sv-choque-oferta');
    if (sv) sv.textContent = parseFloat(sl.value).toFixed(1) + ' pp';
    computeEffects();
}
function aplicarChoque2013() {
    const sl = document.getElementById('sl-choque-oferta');
    if (!sl || sl.disabled) return;
    sl.value = 2.4;
    onChoqueOfertaInput();
}

/* ══ SLIDERS PROPIOS POR CANAL (v8) — Fiscal, Crédito, Restricción Externa ══ */
function onCanalSliderInput(cual) {
    onCanalSliderInputSilencioso(cual);
    computeEffects();
}
function onCanalSliderInputSilencioso(cual) {
    if (cual === 'inv-real') {
        const v = document.getElementById('sl-inv-real').value;
        document.getElementById('sv-inv-real').textContent = v + '%';
    } else if (cual === 'cin') {
        const v = parseFloat(document.getElementById('sl-cin').value);
        document.getElementById('sv-cin').textContent = (v >= 0 ? '+' : '') + fmt(v) + ' MM Bs';
    } else if (cual === 'rin') {
        const v = document.getElementById('sl-rin').value;
        document.getElementById('sv-rin').textContent = v + ' meses';
    }
}

/* ══ GRANULARIDAD DE SERIES (mes/trimestre/semestre/año) ══════════════
   Afecta los gráficos de agregados monetarios e inflación (Bloque 3/5),
   que son las series con dato mensual real disponible en DATOS_V14.MENSUAL.
   El resto del simulador (KPIs, canales) sigue operando sobre el año base. */
let granularidadActiva = 'anual';
function updateGranularidad() {
    const sel = document.getElementById('sel-granularidad');
    if (sel) granularidadActiva = sel.value;
    buildAggTimeSeriesChart();
}

function agregarSeriesPorGranularidad(campo) {
    const meses = Object.keys(DATOS_V14.MENSUAL).filter(k => k.startsWith(String(year)) || true);
    const todasClaves = Object.keys(DATOS_V14.MENSUAL).sort();
    if (granularidadActiva === 'mensual') {
        return todasClaves.map(k => ({ label: k, val: DATOS_V14.MENSUAL[k][campo] }));
    }
    if (granularidadActiva === 'trimestral') {
        const out = [];
        for (let i = 0; i < todasClaves.length; i += 3) {
            const grupo = todasClaves.slice(i, i + 3).map(k => DATOS_V14.MENSUAL[k][campo]).filter(v => v != null);
            if (!grupo.length) continue;
            const anio = todasClaves[i].slice(0, 4), tri = Math.floor(i / 3) % 4 + 1;
            out.push({ label: `${anio}T${tri}`, val: grupo.reduce((a, b) => a + b, 0) / grupo.length });
        }
        return out;
    }
    if (granularidadActiva === 'semestral') {
        const out = [];
        for (let i = 0; i < todasClaves.length; i += 6) {
            const grupo = todasClaves.slice(i, i + 6).map(k => DATOS_V14.MENSUAL[k][campo]).filter(v => v != null);
            if (!grupo.length) continue;
            const anio = todasClaves[i].slice(0, 4), sem = Math.floor(i / 6) % 2 + 1;
            out.push({ label: `${anio}S${sem}`, val: grupo.reduce((a, b) => a + b, 0) / grupo.length });
        }
        return out;
    }
    /* anual: diciembre de cada año (saldo a fin de período, coherente con BASE) */
    return [2010, 2011, 2012, 2013, 2014].map(y => ({ label: String(y), val: DATOS_V14.MENSUAL[`${y}-12`][campo] }));
}

let aggTimeChart = null;
function buildAggTimeSeriesChart() {
    const ctx = document.getElementById('c-agg-tiempo');
    if (!ctx) return;
    const serieM2p = agregarSeriesPorGranularidad('m2p');
    const serieInf = agregarSeriesPorGranularidad('inf_general_12m');
    if (aggTimeChart) aggTimeChart.destroy();
    aggTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: serieM2p.map(s => s.label),
            datasets: [
                { label: "M'2 (miles Bs)", data: serieM2p.map(s => s.val), borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)', yAxisID: 'y', tension: .25, fill: true },
                { label: 'Inflación 12m (%)', data: serieInf.map(s => s.val), borderColor: '#D85A30', yAxisID: 'y1', tension: .25, pointRadius: 2 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } } },
            scales: {
                x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 14 } },
                y: { position: 'left', grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: "M'2 (miles Bs)", color: txtC(), font: { size: 10 } } },
                y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: 'Inflación 12m (%)', color: txtC(), font: { size: 10 } } }
            }
        }
    });
}


/* ══ PANORAMA — PIB e Inflación con granularidad real (v9) ══════════════
   PIB: anual (suma 4T) / trimestral (dato directo, INE Cuadros 1.01.01/1.02.01).
   Inflación: anual (dic., ya verificado) / trimestral (fin de trimestre) /
   mensual (serie completa BCB/INE — 60 meses). PIB NO tiene dato mensual en
   la fuente: si el usuario pide "mensual", PIB cae a trimestral con aviso. */
let chPib = null, chPibn = null, chInf = null;
function pibAnualDesdeTrimestral(campo) {
    return [2010, 2011, 2012, 2013, 2014].map(y => {
        let s = 0;
        for (let t = 1; t <= 4; t++) s += DATOS_V14.TRIMESTRAL[`${y}T${t}`][campo];
        return s / 1000; // miles → millones
    });
}
function MOTOR_TRIMS() {
    const out = [];
    [2010, 2011, 2012, 2013, 2014].forEach(y => { for (let t = 1; t <= 4; t++) out.push(`${y}T${t}`); });
    return out;
}
function buildPanoramaCharts(gran) {
    const srcPib = document.getElementById('src-pib'), srcPibn = document.getElementById('src-pibn'), srcInf = document.getElementById('src-inf');
    let pibGran = gran, infGran = gran;
    let avisoPib = '';
    if (gran === 'mensual') { pibGran = 'trimestral'; avisoPib = ' — PIB no tiene dato mensual en la fuente, se muestra trimestral'; }

    let labelsPib, dataReal, dataNom;
    if (pibGran === 'anual') {
        labelsPib = ['2010', '2011', '2012', '2013', '2014'];
        dataReal = pibAnualDesdeTrimestral('pib_real');
        dataNom = pibAnualDesdeTrimestral('pib_nominal');
    } else {
        labelsPib = MOTOR_TRIMS();
        dataReal = labelsPib.map(t => DATOS_V14.TRIMESTRAL[t].pib_real / 1000);
        dataNom = labelsPib.map(t => DATOS_V14.TRIMESTRAL[t].pib_nominal / 1000);
    }
    if (srcPib) srcPib.textContent = `INE Cuadro 6.01.01 · precios constantes Bs 1990 · ${pibGran}${avisoPib}`;
    if (srcPibn) srcPibn.textContent = `INE Cuadro 6.01.02 · ${pibGran}${avisoPib}`;
    if (chPib) chPib.destroy();
    if (document.getElementById('c-pib')) {
        chPib = new Chart(document.getElementById('c-pib'), {
            type: 'bar',
            data: { labels: labelsPib, datasets: [{ data: dataReal, backgroundColor: '#1D9E75', borderRadius: 4 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => 'Bs ' + c.raw.toLocaleString() + ' MM (1990)' } } } }
        });
    }
    if (chPibn) chPibn.destroy();
    if (document.getElementById('c-pibn')) {
        chPibn = new Chart(document.getElementById('c-pibn'), {
            type: 'bar',
            data: { labels: labelsPib, datasets: [{ data: dataNom, backgroundColor: '#378ADD', borderRadius: 4 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => 'Bs ' + c.raw.toLocaleString() + ' MM' } } } }
        });
    }

    let labelsInf, dGen, dNuc, dSub;
    if (infGran === 'anual') {
        labelsInf = ['dic-2010', 'dic-2011', 'dic-2012', 'dic-2013', 'dic-2014'];
        dGen = [7.18, 6.90, 4.54, 6.48, 5.19]; dNuc = [6.13, 8.79, 4.84, 4.10, 4.34]; dSub = [5.66, 6.55, 3.52, 4.30, 3.92];
    } else if (infGran === 'trimestral') {
        labelsInf = MOTOR_TRIMS();
        const meses3 = labelsInf.map(t => { const y = t.slice(0, 4), tq = t.slice(4); const m = { T1: '03', T2: '06', T3: '09', T4: '12' }[tq]; return `${y}-${m}`; });
        dGen = meses3.map(k => DATOS_V14.MENSUAL[k].inf_general_12m);
        dNuc = meses3.map(k => DATOS_V14.MENSUAL[k].inf_nucleo_12m);
        dSub = meses3.map(k => DATOS_V14.MENSUAL[k].inf_subyacente_12m);
    } else {
        labelsInf = Object.keys(DATOS_V14.MENSUAL).sort();
        dGen = labelsInf.map(k => DATOS_V14.MENSUAL[k].inf_general_12m);
        dNuc = labelsInf.map(k => DATOS_V14.MENSUAL[k].inf_nucleo_12m);
        dSub = labelsInf.map(k => DATOS_V14.MENSUAL[k].inf_subyacente_12m);
    }
    if (srcInf) srcInf.textContent = `BCB Memoria 2013 · INE/UDAPE IPC · ${infGran}`;
    if (chInf) chInf.destroy();
    if (document.getElementById('c-inf')) {
        chInf = new Chart(document.getElementById('c-inf'), {
            type: 'line',
            data: { labels: labelsInf, datasets: [
                { label: 'General IPC (12m)', data: dGen, borderColor: '#D85A30', backgroundColor: 'rgba(216,90,48,0.08)', borderWidth: 2, pointRadius: infGran === 'anual' ? 5 : 0, fill: true, tension: .3 },
                { label: 'Núcleo ITI (12m)', data: dNuc, borderColor: '#BA7517', backgroundColor: 'transparent', borderWidth: 2, pointRadius: infGran === 'anual' ? 4 : 0, borderDash: [5, 3], tension: .3 },
                { label: 'Subyacente ITI (12m)', data: dSub, borderColor: '#534AB7', backgroundColor: 'transparent', borderWidth: 2, pointRadius: infGran === 'anual' ? 4 : 0, borderDash: [2, 3], tension: .3 },
            ] },
            options: { ...baseOpts(), plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 11 } } }, tooltip: { mode: 'index', intersect: false } },
                scales: { ...baseOpts().scales, x: { ...baseOpts().scales.x, ticks: { ...baseOpts().scales.x.ticks, maxTicksLimit: 14 } } } }
        });
    }
}
function updatePanoramaGranularidad() {
    const sel = document.getElementById('sel-gran-panorama');
    buildPanoramaCharts(sel ? sel.value : 'anual');
}

/* ══ BLOQUE REAL — PIB por el gasto, anual/trimestral ══ */
let chDatosReal = null;
function buildDatosReal(gran) {
    const el = document.getElementById('c-datos-real');
    if (!el) return;
    let labels, series;
    if (gran === 'trimestral') {
        labels = MOTOR_TRIMS();
        series = { c: labels.map(t => DATOS_V14.TRIMESTRAL[t].consumo_priv / 1000), g: labels.map(t => DATOS_V14.TRIMESTRAL[t].consumo_pub / 1000),
                   i: labels.map(t => DATOS_V14.TRIMESTRAL[t].fbkf / 1000), x: labels.map(t => DATOS_V14.TRIMESTRAL[t].exportaciones / 1000), m: labels.map(t => DATOS_V14.TRIMESTRAL[t].importaciones / 1000) };
    } else {
        labels = ['2010', '2011', '2012', '2013', '2014'];
        const anual = campo => pibAnualDesdeTrimestral(campo);
        series = { c: anual('consumo_priv'), g: anual('consumo_pub'), i: anual('fbkf'), x: anual('exportaciones'), m: anual('importaciones') };
    }
    if (chDatosReal) chDatosReal.destroy();
    chDatosReal = new Chart(el, {
        type: 'bar',
        data: { labels, datasets: [
            { label: 'Consumo privado (C)', data: series.c, backgroundColor: '#1D9E75', stack: 's' },
            { label: 'Consumo público (G)', data: series.g, backgroundColor: '#378ADD', stack: 's' },
            { label: 'FBKF (I)', data: series.i, backgroundColor: '#7A5FC7', stack: 's' },
            { label: 'Exportaciones (X)', data: series.x, backgroundColor: '#EF9F27', stack: 's' },
            { label: 'Importaciones (M, negativo)', data: series.m.map(v => -v), backgroundColor: '#D85A30', stack: 's' },
        ] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
            scales: { x: { stacked: true, grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 12 } }, y: { stacked: true, grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } } } }
    });
}
function updateDatosReal() {
    const sel = document.getElementById('sel-gran-real');
    buildDatosReal(sel ? sel.value : 'anual');
}

function buildDatosBloques() {
    const years5 = ['2010', '2011', '2012', '2013', '2014'];
    // Fiscal
    if (document.getElementById('c-datos-fiscal')) {
        new Chart(document.getElementById('c-datos-fiscal'), {
            type: 'bar',
            data: { labels: years5, datasets: [{ label: 'CIN fiscal (MM Bs)', data: years5.map(y => DATOS_V14.BASE[y].cin_fiscal_mmbs), backgroundColor: years5.map(y => DATOS_V14.BASE[y].cin_fiscal_mmbs > 0 ? '#D85A30' : '#5DCAA5'), borderRadius: 4 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false } } }
        });
    }
    // Externo
    if (document.getElementById('c-datos-externo')) {
        new Chart(document.getElementById('c-datos-externo'), {
            type: 'line',
            data: { labels: years5, datasets: [
                { label: 'RIN (meses)', data: years5.map(y => DATOS_V14.BASE[y].rin_meses), borderColor: '#1D9E75', yAxisID: 'y', tension: .25 },
                { label: 'Deuda externa (MM $us)', data: years5.map(y => DATOS_V14.BASE[y].deuda_externa_musd), borderColor: '#D85A30', yAxisID: 'y1', tension: .25 },
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }, y: { position: 'left', grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } }, y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Precios (inflación mensual + shock 2013)
    if (document.getElementById('c-datos-precios')) {
        const meses = Object.keys(DATOS_V14.MENSUAL).sort();
        new Chart(document.getElementById('c-datos-precios'), {
            type: 'line',
            data: { labels: meses, datasets: [
                { label: 'IPC Alimentos', data: meses.map(k => DATOS_V14.MENSUAL[k].ipc_alimentos), borderColor: '#D85A30', pointRadius: 0, tension: .2 },
                { label: 'Inflación general 12m (%)', data: meses.map(k => DATOS_V14.MENSUAL[k].inf_general_12m), borderColor: '#378ADD', pointRadius: 0, tension: .2, yAxisID: 'y1' },
            ] },
            options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 12 } }, y: { position: 'left', grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: 'IPC alimentos', color: txtC(), font: { size: 9 } } }, y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 10 } }, title: { display: true, text: 'Inflación 12m (%)', color: txtC(), font: { size: 9 } } } } }
        });
    }
    // Social
    if (document.getElementById('c-datos-social')) {
        new Chart(document.getElementById('c-datos-social'), {
            type: 'bar',
            data: { labels: ['2011', '2012', '2013', '2014'], datasets: [
                { label: 'Pobreza moderada %', data: [45.1, 43.3, 38.9, 39.1], backgroundColor: '#5DCAA5', borderRadius: 3 },
                { label: 'Pobreza extrema %', data: [21.0, 21.6, 18.7, 17.2], backgroundColor: '#1D9E75', borderRadius: 3 },
                { label: 'Desocupación %', data: [2.65, 2.31, 2.85, 2.34], backgroundColor: '#D85A30', borderRadius: 3, yAxisID: 'y1' },
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }, y: { position: 'left', grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } }, y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Contexto — ONI mensual (aplanado desde ONI_ANUAL por estación)
    if (document.getElementById('c-datos-oni')) {
        const meses = Object.keys(DATOS_V14.MENSUAL).sort();
        new Chart(document.getElementById('c-datos-oni'), {
            type: 'line',
            data: { labels: meses, datasets: [
                { label: 'ONI (anomalía °C)', data: meses.map(k => DATOS_V14.MENSUAL[k].oni), borderColor: '#378ADD', backgroundColor: 'rgba(55,138,221,0.08)', fill: true, pointRadius: 0, tension: .3 },
            ] },
            options: { responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => 'ONI: ' + c.raw.toFixed(2) } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 12 } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Fiscal — Ingresos vs Egresos
    if (document.getElementById('c-datos-fiscal-2')) {
        new Chart(document.getElementById('c-datos-fiscal-2'), {
            type: 'bar',
            data: { labels: years5, datasets: [
                { label: 'Ingresos totales', data: years5.map(y => DATOS_V14.BASE[y].ingresos_totales_mmbs / 1000), backgroundColor: '#1D9E75', borderRadius: 3 },
                { label: 'Egresos totales', data: years5.map(y => DATOS_V14.BASE[y].egresos_totales_mmbs / 1000), backgroundColor: '#D85A30', borderRadius: 3 },
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } }, tooltip: { callbacks: { label: c => c.dataset.label + ': Bs ' + c.raw.toFixed(1) + ' MM' } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Externo — Comercio exterior trimestral (X vs M)
    if (document.getElementById('c-datos-externo-2')) {
        const trims = MOTOR_TRIMS();
        new Chart(document.getElementById('c-datos-externo-2'), {
            type: 'line',
            data: { labels: trims, datasets: [
                { label: 'Exportaciones', data: trims.map(t => DATOS_V14.TRIMESTRAL[t].exportaciones / 1000), borderColor: '#1D9E75', tension: .25 },
                { label: 'Importaciones', data: trims.map(t => DATOS_V14.TRIMESTRAL[t].importaciones / 1000), borderColor: '#D85A30', tension: .25 },
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 10 } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Contexto — Índice de términos de intercambio
    if (document.getElementById('c-datos-tot')) {
        new Chart(document.getElementById('c-datos-tot'), {
            type: 'line',
            data: { labels: years5, datasets: [
                { label: 'Términos de intercambio (2010=100)', data: years5.map(y => DATOS_V14.BASE[y].tot_idx), borderColor: '#7A5FC7', backgroundColor: 'rgba(122,95,199,0.10)', fill: true, tension: .3, pointRadius: 5 },
                { label: 'Precio gas (2010=100, referencia)', data: (() => { const b0 = DATOS_V14.BASE[2010].precio_gas_usdton; return years5.map(y => DATOS_V14.BASE[y].precio_gas_usdton / b0 * 100); })(), borderColor: '#EF9F27', borderDash: [5, 3], pointRadius: 4, tension: .3 },
            ] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 10 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 11 } } }, y: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 10 } } } } }
        });
    }
    // Contexto — Remesas de trabajadores
    if (document.getElementById('c-datos-remesas')) {
        new Chart(document.getElementById('c-datos-remesas'), {
            type: 'bar',
            data: { labels: years5, datasets: [{ label: 'Remesas recibidas (MM $us)', data: years5.map(y => DATOS_V14.BASE[y].remesas_musd), backgroundColor: '#1D9E75', borderRadius: 4 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false } } }
        });
    }

    // Precios — gas natural anual
    if (document.getElementById('c-datos-gas')) {
        new Chart(document.getElementById('c-datos-gas'), {
            type: 'line',
            data: { labels: years5, datasets: [{ label: 'Precio gas (USD/ton)', data: years5.map(y => DATOS_V14.BASE[y].precio_gas_usdton), borderColor: '#EF9F27', backgroundColor: 'rgba(239,159,39,0.12)', fill: true, tension: .3, pointRadius: 5 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false } } }
        });
    }
    // Social — salario mínimo
    if (document.getElementById('c-datos-salario')) {
        new Chart(document.getElementById('c-datos-salario'), {
            type: 'bar',
            data: { labels: years5, datasets: [{ label: 'Salario Mínimo (Bs)', data: years5.map(y => DATOS_V14.BASE[y].salario_minimo), backgroundColor: '#378ADD', borderRadius: 4 }] },
            options: { ...baseOpts(), plugins: { legend: { display: false } } }
        });
    }
    // Contexto — commodities mensuales
    if (document.getElementById('c-datos-commod')) {
        const meses = Object.keys(DATOS_V14.MENSUAL).sort();
        new Chart(document.getElementById('c-datos-commod'), {
            type: 'line',
            data: { labels: meses, datasets: [
                { label: 'Zinc (USD/ton)', data: meses.map(k => DATOS_V14.MENSUAL[k].commod_zinc), borderColor: '#1D9E75', pointRadius: 0, tension: .2, yAxisID: 'y' },
                { label: 'Estaño (USD/ton)', data: meses.map(k => DATOS_V14.MENSUAL[k].commod_estano), borderColor: '#7A5FC7', pointRadius: 0, tension: .2, yAxisID: 'y1' },
                { label: 'Plata (USD/oz)', data: meses.map(k => DATOS_V14.MENSUAL[k].commod_plata), borderColor: '#378ADD', pointRadius: 0, tension: .2, yAxisID: 'y' },
                { label: 'Soya (USD/ton)', data: meses.map(k => DATOS_V14.MENSUAL[k].commod_soya), borderColor: '#EF9F27', pointRadius: 0, tension: .2, yAxisID: 'y' },
            ] },
            options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, labels: { color: txtC(), font: { size: 9 } } } },
                scales: { x: { grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 }, maxTicksLimit: 10 } },
                    y: { position: 'left', grid: { color: gridC() }, ticks: { color: txtC(), font: { size: 9 } } },
                    y1: { position: 'right', grid: { display: false }, ticks: { color: txtC(), font: { size: 9 } } } } }
        });
    }
    buildDatosReal('anual');
}


function startApp() {
    /* El selector manual de régimen fue eliminado (v8): ahora se deriva
       automáticamente del año base dentro de initSim() → regimenDeAnio(). */
    initStaticCharts();
    buildDatosBloques();
    buildSliders();
    initSim();
    buildAggTimeSeriesChart();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
