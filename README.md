# SimuMac — Simulador Macroeconómico de Bolivia (2010–2014)

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-brightgreen)](https://github.com/tu-usuario/simumac/releases)
[![Estado](https://img.shields.io/badge/Estado-estable-success)]()

SimuMac es una herramienta interactiva de simulación macroeconómica diseñada para el análisis histórico, contrafactual e hipotético de la economía boliviana durante el período 2010–2014. Fue desarrollada como proyecto de tesis de grado para la carrera de Economía de la Universidad Mayor de San Simón (UMSS), Cochabamba, Bolivia.

El instrumento integra una base de datos verificada a partir de **54 fuentes primarias oficiales** (INE, BCB, UDAPE/MEFP, APS, FMI, NOAA) y un motor de cálculo estructurado en **cuatro canales de transmisión** de política económica (Fiscal, Monetario, Crédito, Restricción Externa), todos ellos con palancas de simulación independientes y coeficientes etiquetados según su procedencia metodológica.

---

## 📋 Características principales

- **📊 Base de datos consolidada** – 7 bloques temáticos (Real, Fiscal, Monetario, Externo, Precios, Social, Contexto) con periodicidad anual, trimestral y mensual.
- **⚙️ Motor económico de 4 canales** – Fiscal (multiplicador keynesiano), Monetario (IS-LM con TC fijo), Crédito (CIN BCB→TGN) y Restricción Externa (φ_t por RIN). Cada canal opera con su propia palanca de simulación.
- **🎛️ Modos de simulación** – Histórico (lectura), Contrafactual (alterar el año base) e Hipotético (rangos ampliados para RIN y CIN).
- **🚨 Sistema de alertas** – 5 umbrales críticos (RIN, brecha cambiaria, inflación de alimentos, déficit fiscal, dolarización) con semáforo verde/naranja/rojo.
- **📈 Gráficos interactivos** – Visualización dinámica con Chart.js (PIB, inflación, agregados monetarios, tasas de interés, etc.).
- **📚 Manual integrado** – Documentación completa accesible desde el botón flotante sin perder el estado de la simulación.
- **🌙 Modo oscuro** – Adaptación automática según la preferencia del sistema.
- **📱 Responsive** – Funcional en dispositivos móviles y de escritorio.

---

## 🔍 Hallazgos empíricos documentados

- El **Crédito Interno Neto (CIN) del BCB al Sector Público** fue negativo en 2010–2013 y se volvió positivo únicamente en 2014, activando el canal de monetización del déficit.
- Las **Reservas Internacionales Netas (RIN)** se mantuvieron entre 17 y 21 meses de importación durante todo el período, por lo que la restricción externa (φ_t) nunca se activó en la historia observada.
- El **choque inflacionario de 2013** (papa +77%, tomate +113%) fue un fenómeno de oferta interno, no climático de gran escala (ONI neutral en el pico del choque).
- El **índice ampliado de términos de intercambio** (gas + zinc + estaño + plata + soya) alcanzó su máximo en 2011, mientras que el precio del gas aislado lo hizo en 2012.

---

## 🚀 ¿Cómo usar SimuMac?

### Opción 1: Demo en línea (recomendada)
Visita la versión publicada en: simumac.netlify.app

### Opción 2: Ejecutar localmente
1. Clona el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/simumac.git](https://github.com/Franco9032/simumac
   cd simumac
