# SimuMac: diseño, construcción y validación de un simulador macroeconómico interactivo para el análisis del período boliviano 2010-2014

---

## Resumen

Se presenta SimuMac, una herramienta de simulación macroeconómica interactiva diseñada para el análisis histórico, contrafactual e hipotético de la economía boliviana entre 2010 y 2014. El instrumento incorpora un conjunto de correcciones metodológicas frente a especificaciones habituales en simuladores macroeconómicos didácticos de este tipo —inconsistencia dimensional en el cálculo de multiplicadores, validación circular de coeficientes, mecanismos de transmisión especificados como permanentemente activos sin condicionalidad empírica, y parámetros sin fuente documentada—, resueltas mediante la construcción de una base de datos verificada a partir de 54 fuentes primarias organizadas en 7 bloques temáticos, y el diseño de un motor de cálculo estructurado en cuatro canales de transmisión con palanca de simulación propia (Fiscal, Monetario, Crédito, Restricción Externa). Se documentan los hallazgos empíricos centrales del período estudiado —la activación condicional del canal de crédito interno neto solo en 2014, la inercia de la restricción externa durante todo el período, el carácter de oferta (no climático de gran escala) del choque inflacionario de 2013, y la divergencia entre el precio del gas natural y un índice más amplio de términos de intercambio— así como las limitaciones metodológicas declaradas explícitamente en la propia herramienta. Se concluye con una discusión sobre el valor pedagógico y de investigación del instrumento, y su agenda de extensión hacia un alcance temporal ampliado.

**Palabras clave:** simulación macroeconómica, Bolivia, Mundell-Fleming, multiplicador fiscal, monetización del déficit, herramienta pedagógica, código abierto.

---

## 1. Introducción

### 1.1 Motivación

Los simuladores macroeconómicos didácticos ocupan un lugar particular en la enseñanza de la economía: a diferencia de un modelo econométrico formal, no persiguen la estimación insesgada de un parámetro poblacional, sino la construcción de una intuición operativa sobre cómo interactúan los mecanismos de transmisión de política económica. Su valor pedagógico depende, sin embargo, de un requisito que con frecuencia se sacrifica en favor de la interactividad: que los números que el usuario manipula sean reales, verificables, y que los mecanismos que el software ejecuta no contradigan ni la teoría que dicen implementar ni los datos que dicen usar.

Este proyecto parte de una constatación frecuente en el desarrollo de simuladores macroeconómicos didácticos: la interactividad de la herramienta con frecuencia se logra a costa del rigor de sus mecanismos internos, un rigor que solo se hace visible cuando el instrumento se somete a una auditoría metodológica deliberada. Los errores que este tipo de auditoría típicamente revela no son fallas triviales de programación, sino errores de **consistencia económica**: un multiplicador fiscal que divide una magnitud real (por ejemplo, bolivianos a precios constantes) entre una magnitud nominal (dólares corrientes) sin conversión declarada; un mecanismo de crédito interno neto especificado como permanentemente activo, sin condicionar su transmisión a la existencia real de una necesidad de financiamiento; o una restricción externa que no puede leerse como empíricamente "validada" porque su especificación —a menudo un escalón discreto— nunca fue puesta a prueba por el nivel real de reservas internacionales del país en el período de referencia. SimuMac se construyó precisamente para evitar estos tres problemas, documentando de forma explícita, para cada mecanismo, si su especificación responde a un dato observado, a una calibración con los datos disponibles, o a un supuesto de modelización con alternativas comparables.

### 1.2 Objetivos

El proyecto se planteó tres objetivos, ejecutados en dos fases:

1. **Especificar y validar** un motor de cálculo libre de las inconsistencias metodológicas frecuentes en esta clase de instrumentos, preservando la arquitectura pedagógica de exploración interactiva que este tipo de herramienta requiere para su uso didáctico.
2. **Reconstruir la base de datos** sobre 54 fuentes primarias verificables, organizadas en 7 bloques temáticos (Real, Fiscal, Monetario, Externo, Precios, Social, Contexto), con una regla operativa estricta: ningún valor se escribe a mano, y ninguna ausencia de dato se interpola.
3. **Rediseñar la interfaz** para que cada uno de los cuatro mecanismos de transmisión (fiscal, monetario, crédito, restricción externa) tenga su propia palanca de simulación, sus propias políticas precargadas, y su propio conjunto de datos de referencia — mientras una síntesis permanentemente visible integra el efecto combinado de los cuatro, sin importar cuál esté siendo explorado en un momento dado.

### 1.3 Alcance y limitaciones declaradas desde el inicio

El instrumento cubre exclusivamente el período 2010-2014, bajo un régimen cambiario fijo. Esta acotación temporal no es accidental: permite que cada coeficiente calibrado sea trazable a una fuente primaria concreta, en lugar de depender de generalizaciones no verificables sobre períodos más largos y heterogéneos. La extensión del instrumento a un rango temporal mayor —incluyendo los regímenes de ajuste posteriores, la pandemia de 2020, y el actual régimen cambiario flexible vigente desde junio de 2026— queda deliberadamente fuera de este trabajo y se documenta como la agenda de una plataforma futura de mayor escala.

---

## 2. Marco teórico

### 2.1 El modelo Mundell-Fleming con tipo de cambio fijo como columna vertebral

Bolivia mantuvo un régimen cambiario fijo durante todo el período de estudio (2010-2014), lo que hace del modelo Mundell-Fleming con movilidad de capitales imperfecta el marco natural de referencia. Bajo este marco, la política fiscal es el instrumento de estabilización dominante: con el tipo de cambio ancla y sin plena movilidad de capitales, el canal monetario doméstico opera, pero atenuado. SimuMac formaliza esta jerarquía asignando al Canal Fiscal el multiplicador de mayor magnitud, y al Canal Monetario un parámetro de eficacia (θ) que escala con el grado de sustitución de monedas observado en el sistema financiero —no con una medida de apertura de la cuenta de capital en sentido estricto, distinción que se declara explícitamente en la herramienta para no conflacionar dos mecanismos de la literatura que, aunque relacionados, no son intercambiables.

### 2.2 Monetización del déficit como mecanismo condicional, no permanente

La literatura sobre financiamiento monetario del déficit fiscal —desde los modelos de "fiscal dominance" hasta la formalización contable del señoreaje como impuesto inflacionario— describe un mecanismo que depende de una condición: la existencia de una necesidad de financiamiento que el fisco no puede cubrir con ingresos propios. SimuMac modela esto explícitamente: el Canal de Crédito solo transmite cuando el Crédito Interno Neto del Banco Central al Sector Público (CIN) es positivo, y el efecto se calibra como diferencia respecto al CIN histórico del año base, no como su valor absoluto —de modo que el estado inicial de cualquier simulación reproduce exactamente la trayectoria observada, y solo la desviación deliberada del usuario introduce un efecto.

### 2.3 Restricción de balanza de pagos y adecuación de reservas

La restricción externa se modela siguiendo la lógica de las crisis de balanza de pagos de segunda generación: un país con reservas internacionales adecuadas no enfrenta penalización sobre su multiplicador fiscal ni sobre su canal de crédito; por debajo de un umbral de adecuación, ambos se atenúan. SimuMac usa la cobertura de importaciones (meses de importación financiables con las RIN) como métrica primaria, con un umbral de 6 meses —una convención estándar, aunque no la única defendible: la herramienta documenta explícitamente el criterio complementario de Wijnholds-Kapteyn (RIN sobre agregado monetario amplio), que en el año de quiebre fiscal (2014) da una lectura de adecuación distinta a la que da la cobertura de importaciones para ese mismo año, ilustrando que ninguna métrica única agota la pregunta de "cuán cómoda" está la posición externa de un país.

### 2.4 Curva de Phillips, Ley de Okun, y la identificación de choques de oferta

Un choque de oferta —una restricción súbita en la disponibilidad de bienes, no un exceso de demanda agregada— produce el patrón "u y π suben juntos" que la curva de Phillips no anticipa pero que la Ley de Okun, al no imponer supuesto alguno sobre la causa de la variación del producto, puede seguir describiendo. Este es precisamente el patrón que la evidencia recopilada documenta para el episodio de agosto-septiembre de 2013 en Bolivia, y es la razón por la que SimuMac usa Okun, no Phillips, como relación de referencia para ese episodio —con la salvedad, incorporada tras revisión metodológica, de que 2011 exhibe el patrón contrario (inflación núcleo por encima de la general), por lo que la conclusión se declara válida para el episodio específico de 2013, no como una regularidad general de la economía boliviana.

### 2.5 Términos de intercambio y dependencia de recursos naturales

El mecanismo clásico de la "enfermedad holandesa" —un régimen de precios internacionales favorable para los recursos naturales exportables que impulsa el ingreso fiscal, el gasto público, y en última instancia el propio ciclo macroeconómico doméstico— se documenta en SimuMac no solo a través del precio del gas natural (el mecanismo dominante en la literatura sobre Bolivia de este período), sino mediante un índice de términos de intercambio que incorpora los cuatro commodities adicionales para los que se dispone de series mensuales verificadas (zinc, estaño, plata, soya). Este índice revela que el ciclo de precios de recursos alcanzó su punto máximo en 2011, no en 2012 como sugeriría el precio del gas natural aisladamente —un hallazgo que matiza la periodización del "superciclo" cuando se considera la canasta completa de exportaciones, no un solo producto.

---

## 3. Metodología

### 3.1 Errores de especificación frecuentes en simuladores macroeconómicos didácticos, y su tratamiento en SimuMac

Antes de construir la base de datos y el motor de cálculo, se identificaron y documentaron formalmente los siguientes problemas de especificación, comunes en instrumentos de esta naturaleza cuando la interactividad se prioriza sobre la trazabilidad de cada coeficiente a su fuente:

| Error identificado | Naturaleza | Consecuencia si no se corrige |
|---|---|---|
| Multiplicador fiscal dimensionalmente inconsistente | Bs de 1990 (numerador) sobre USD corrientes (denominador), sin conversión declarada | El coeficiente resultante no tiene interpretación económica válida |
| Validación circular | El mismo par de años usado para calibrar el coeficiente y para "validarlo" | Ninguna prueba independiente del ajuste del modelo |
| Variable de capacidad productiva mal especificada | División de una tasa de crecimiento entre un nivel | Resultado sin sentido dimensional |
| Restricción externa como función escalonada | Discontinuidades artificiales en los puntos de corte | Comportamiento no derivable, penalización injustificadamente abrupta |
| Canal de crédito permanentemente activo | Factor de escala (0,06) sin fuente documentada, sin condicionalidad | Atribuye monetización del déficit a años de superávit fiscal observado |
| Ausencia de bloque de precios explícito | La inflación se usaba como criterio de validación sin ecuación propia | Imposibilidad de verificar de dónde proviene la inflación simulada |
| Signo incorrecto en un dato fiscal de 2012 | Error de transcripción | Balance fiscal reportado con signo opuesto al real |

### 3.2 Reconstrucción de la base de datos: los 7 bloques

Con la auditoría completa, se construyó una base de datos íntegramente nueva, organizada en 7 bloques temáticos, cada uno con su teoría económica aplicable declarada explícitamente (no cerrada a un único marco):

1. **Real** — PIB por actividad económica y por componente de gasto (consumo privado, consumo público, formación bruta de capital fijo, exportaciones, importaciones), con periodicidad trimestral, permitiendo la descomposición Y = C + I + G + X − M.
2. **Fiscal** — ingresos, egresos, balance del Sector Público No Financiero, Crédito Interno Neto, inversión pública ejecutada (nominal y deflactada a precios de 1990 mediante el deflactor implícito de la Formación Bruta de Capital Fijo del Instituto Nacional de Estadística).
3. **Monetario** — los ocho agregados monetarios estándar (M1 a M4, en sus versiones en moneda nacional y en moneda nacional más extranjera), tasas activas y pasivas por plazo, con periodicidad mensual.
4. **Externo** — Reservas Internacionales Netas, deuda externa pública, dolarización de depósitos, remesas de trabajadores recibidas, comercio exterior.
5. **Precios** — Índice de Precios al Consumidor general y de alimentos, inflación núcleo y subyacente, precio de exportación del gas natural (verificado por dos fuentes independientes con una discrepancia inferior al 0,001%).
6. **Social** — desempleo, pobreza moderada y extrema, salario mínimo nacional, afiliación al sistema de pensiones.
7. **Contexto** — precios de commodities no gasíferos (zinc, estaño, plata, soya) y el Índice Oceánico El Niño, que permite distinguir choques de oferta de origen climático de gran escala de otros fenómenos de oferta más acotados.

En total, la base de datos consolida **54 fuentes primarias** —Instituto Nacional de Estadística, Banco Central de Bolivia, Unidad de Análisis de Políticas Sociales y Económicas / Ministerio de Economía y Finanzas Públicas, Autoridad de Fiscalización y Control de Pensiones y Seguros, Fondo Monetario Internacional, y la Administración Nacional Oceánica y Atmosférica de los Estados Unidos— con **60 observaciones mensuales**, **20 observaciones trimestrales** y **5 observaciones anuales** por variable, según la periodicidad de publicación de cada fuente. Ninguna ausencia de dato se interpola: cuando la fuente no publica una serie para un año determinado (el caso más relevante es 2010, año en que el Instituto Nacional de Estadística no levantó la Encuesta de Hogares), la herramienta lo declara explícitamente en lugar de estimar un valor.

### 3.3 Rediseño del motor de cálculo

El motor se reorganizó en torno a cuatro canales de transmisión, cada uno con:

- una **palanca de simulación propia**, independiente de las palancas de los demás canales — un requisito de diseño necesario para que cada mecanismo pueda explorarse de forma aislada (por ejemplo, simular un cambio en la inversión pública sin alterar artificialmente el canal de crédito, que en especificaciones donde los cuatro canales comparten un único agregado monetario como estímulo, quedaría necesariamente afectado);
- un **conjunto de políticas precargadas**, calibradas para mover esa palanca específica en magnitudes documentadas;
- una **etiqueta de procedencia metodológica** (observado, calibrado, o supuesto) para cada coeficiente que interviene en su cálculo.

La activación del Canal de Crédito se especifica mediante una función sigmoide continua, centrada en el punto donde el Crédito Interno Neto simulado cruza cero, con un ancho de transición declarado como supuesto de especificación (no como hallazgo calibrado) —una elección preferible a un interruptor binario discreto en ese mismo punto, dado que no existe evidencia de que los efectos de credibilidad y expectativas de monetización que preceden a un episodio de financiamiento monetario del déficit sean verdaderamente discontinuos en el cruce exacto de cero. La interfaz conserva, no obstante, una etiqueta binaria (activo/inactivo) como simplificación de lectura para el usuario, complementada con el porcentaje de activación de la función continua subyacente, de modo que la simplificación visual no oculte el comportamiento gradual que el motor efectivamente calcula.

Un componente de Síntesis, estructuralmente independiente de las cuatro palancas (no anidado dentro de ninguno de los cuatro paneles de canal), integra los efectos combinados y se recalcula ante cualquier modificación, sin importar cuál canal esté siendo visualizado en un momento dado — una decisión de arquitectura necesaria para evitar que la navegación entre canales pueda dejar visible un resultado de síntesis desactualizado respecto al estado real de las palancas.

### 3.4 Validación funcional

El motor de cálculo se somete a una batería de pruebas automatizadas ejecutadas en un entorno de JavaScript sin navegador, que simula la interacción del usuario (selección de año base, movimiento de controles, aplicación de políticas, cambio de modo de simulación) y verifica que:

- el estado inicial de cualquier año base reproduce exactamente la trayectoria histórica observada, sin desviación alguna, cuando ninguna palanca ha sido modificada;
- cada canal responde de forma monótona y con la dirección de signo correcta ante su propia palanca;
- los umbrales de activación (Canal de Crédito, Restricción Externa, sistema de alertas) se cruzan en los puntos declarados y con la magnitud declarada;
- no existen identificadores duplicados, referencias rotas entre la interfaz y el código, ni inconsistencias en la estructura de navegación.

Esta metodología de verificación automatizada es particularmente relevante para instrumentos que combinan cálculo económico con manipulación directa del usuario: un umbral de alerta o una fórmula de penalización pueden ser correctos en su formulación algebraica y, sin embargo, comparar magnitudes en unidades incompatibles (por ejemplo, un nivel de índice de precios contra un umbral pensado para una tasa de variación porcentual) o reaccionar con el signo económico contrario al esperado ante una perturbación —errores que la inspección visual del código no necesariamente revela, pero que una prueba funcional que ejercita el instrumento con valores extremos y verifica la dirección del cambio sí detecta de forma sistemática.

---

## 4. Resultados

### 4.1 El Crédito Interno Neto como interruptor, no como canal permanente

El hallazgo más significativo del proyecto es empírico, no metodológico: el Crédito Interno Neto del Banco Central al Sector Público fue negativo (indicando superávit fiscal, sin necesidad de financiamiento monetario) en 2010, 2011, 2012 y 2013, y se volvió positivo únicamente en 2014 —el mismo año en que el balance del Sector Público No Financiero registró su primer déficit desde 2006. Este hallazgo, verificado de forma cruzada en tres presentaciones distintas de la misma variable (la serie fiscal, el balance monetario agregado, y el balance monetario desagregado por subsector institucional), es la base empírica que justifica especificar la monetización del déficit como un mecanismo condicional a la existencia de una necesidad de financiamiento, no como un canal continuamente activo durante todo el período.

### 4.2 Inercia de la restricción externa

Las Reservas Internacionales Netas se mantuvieron entre 17 y 21 meses de cobertura de importaciones durante la totalidad del período estudiado, muy por encima del umbral de 6 meses que activaría una penalización sobre los canales fiscal y de crédito. La restricción externa, aunque correctamente especificada en el motor de cálculo, nunca fue puesta a prueba por la historia observada de este período —una distinción metodológica que se declara explícitamente para no reclamar una validación empírica que los datos no permiten sostener.

### 4.3 El choque inflacionario de 2013 como fenómeno de oferta, no climático de gran escala

Tres piezas de evidencia convergen: la inflación general a doce meses se separa de la inflación núcleo por 2,38 puntos porcentuales hacia fines de 2013; a nivel de producto individual, los índices de precios de la papa y el tomate se incrementan 77% y 113% respectivamente entre mayo y octubre de ese año; y el Índice Oceánico El Niño se mantiene prácticamente neutro (entre -0,21 y -0,13) durante el trimestre exacto del pico del choque, descartando un episodio de El Niño o La Niña de gran escala como causa climática regional. La convergencia de estas tres fuentes de evidencia sustenta la caracterización del episodio como un choque de oferta de alimentos de origen probablemente estacional o logístico, no climático de gran escala.

### 4.4 Divergencia entre el precio del gas natural y el índice ampliado de términos de intercambio

Mientras el precio de exportación del gas natural alcanza su máximo en 2012, un índice de términos de intercambio que incorpora zinc, estaño, plata y soya —además del gas— alcanza su máximo en 2011, impulsado principalmente por el precio de la plata, que ya se encontraba en descenso hacia 2012. Este hallazgo matiza la periodización del ciclo de recursos naturales cuando se considera la canasta completa de exportaciones bolivianas, no un único producto.

### 4.5 El multiplicador fiscal frente a la literatura internacional

El multiplicador fiscal calibrado sobre las cuatro transiciones anuales disponibles (2,14 a 4,02, según el año) se ubica por encima incluso del extremo de largo plazo (1,4) que reportan Ilzetzki, Mendoza y Végh (2013) para economías bajo tipo de cambio predeterminado en su muestra internacional de 44 países. Esta comparación se declara explícitamente en la herramienta como una nota de cautela: con apenas cuatro observaciones anuales, no es posible distinguir si la magnitud calibrada refleja particularidades genuinas de la economía boliviana en este período (una economía relativamente cerrada, con capacidad productiva ociosa) o si refleja la fragilidad estadística inherente a un tamaño de muestra tan reducido.

### 4.6 Indicadores adicionales incorporados a la base de datos y a las visualizaciones

Un examen de la correspondencia entre las variables recopiladas en la base de datos y los mecanismos efectivamente incorporados al motor de cálculo permitió identificar series disponibles pero no conectadas a ningún canal de transmisión ni a ninguna visualización. Se incorporaron en consecuencia: un indicador de señoreaje, que sí se conecta como salida directa del Canal de Crédito (impuesto inflacionario, expresado como proporción del Producto Interno Bruto nominal, derivado de la expansión de base monetaria simulada por ese canal); la serie de remesas de trabajadores recibidas, incorporada a la base de datos y a las visualizaciones del bloque externo; y la variación del salario mínimo real, contrastada descriptivamente contra el crecimiento del consumo privado (con una brecha sostenida de entre 13 y 18 puntos porcentuales por año). Esta última se documenta únicamente como correlación visualizada en el bloque social —no como relación causal modelada ni como palanca de simulación— para no introducir en el motor de cálculo un mecanismo de transmisión salarial sin una calibración propia que lo sustente.

---

## 5. Arquitectura del instrumento

SimuMac se organiza en cuatro secciones de navegación:

- **Panorama**: veinte indicadores macroeconómicos clave a lo largo de los cinco años, con selección de granularidad temporal (anual, trimestral o mensual, según lo permita cada fuente), hitos documentados con enlace a su fuente primaria, y análisis narrativo año por año.
- **Datos**: navegación por los siete bloques temáticos, cada uno con su nota de teoría económica aplicable, sus tablas de referencia, y sus visualizaciones gráficas.
- **Simulador**: la vista unificada de los cuatro canales de transmisión como subsecciones internas de una misma pantalla, con una síntesis permanentemente visible que integra sus efectos combinados, tres modos de operación —histórico, con todas las palancas bloqueadas para garantizar la lectura exacta del año observado; contrafactual, con las palancas activas y ancladas al año base; e hipotético, con rangos ampliados— y un sistema de cinco alertas de umbral, cada una etiquetada según el canal al que corresponde.
- **Metodología**: la tabla completa de coeficientes con su etiqueta de procedencia (observado, calibrado, supuesto), el inventario íntegro de las 54 fuentes primarias, y las limitaciones metodológicas declaradas.

Un panel de manual de uso, accesible mediante un control flotante visible desde cualquiera de las cuatro secciones, permite la consulta de la documentación completa sin interrumpir el estado de una simulación en curso.

---

## 6. Discusión

### 6.1 Sobre el valor y los límites de la calibración con series cortas

Un tema recurrente en este trabajo es la tensión entre la interactividad que un instrumento pedagógico demanda y el rigor estadístico que una serie de cuatro a cinco observaciones anuales puede sostener. La postura adoptada —declarar explícitamente la etiqueta de procedencia de cada coeficiente, mostrar rangos en lugar de puntos únicos donde la evidencia lo permite, y contrastar los valores propios contra la literatura internacional cuando existe una referencia comparable— no resuelve la limitación de fondo, pero la hace visible al usuario en lugar de ocultarla detrás de una interfaz que sugiere más precisión de la que los datos permiten sostener.

### 6.2 Sobre la vigencia del marco Mundell-Fleming

El marco teórico central del instrumento —tipo de cambio fijo con movilidad de capitales imperfecta— dejó de describir el régimen cambiario vigente en Bolivia a partir de junio de 2026, cuando el país adoptó un régimen de tipo de cambio flexible. Esta circunstancia no invalida el análisis del período 2010-2014, que en efecto operó bajo el régimen fijo, pero exige una calificación explícita de alcance en cualquier lectura del instrumento con fines de política económica presente: los mecanismos aquí descritos no son extrapolables sin modificación sustancial al régimen cambiario actual.

### 6.3 Agenda futura

Se identifican tres líneas de extensión no incorporadas deliberadamente en esta versión, para no comprometer la trazabilidad de cada coeficiente a su fuente primaria: la incorporación de expectativas de agentes económicos (actualmente el instrumento opera bajo el supuesto implícito de expectativas estáticas); la modelización del comportamiento de ahorro privado compensatorio ante el gasto público (equivalencia ricardiana, actualmente no incorporada); y la extensión del rango temporal cubierto —hacia el período de ajuste posterior a 2014, el choque de la pandemia de 2020, y el régimen cambiario flexible vigente desde 2026— como una plataforma de mayor alcance, distinta y complementaria a la aquí presentada.

---

## 7. Conclusiones

Se ha presentado el proceso completo de auditoría, corrección y validación de un instrumento de simulación macroeconómica para el período boliviano 2010-2014. El trabajo demuestra que la calidad pedagógica de un simulador interactivo no está reñida con el rigor de sus fuentes de datos ni con la honestidad declarativa sobre las limitaciones de su calibración: es posible construir una herramienta que a la vez invite a la exploración libre de escenarios contrafactuales e hipotéticos, y declare explícitamente qué de lo que muestra es un dato observado, qué es una calibración con la evidencia disponible, y qué es una decisión de especificación sujeta a alternativas igualmente defendibles. Los hallazgos empíricos centrales —la activación condicional, no permanente, de la monetización del déficit; la inercia de la restricción externa a lo largo de todo el período; el carácter de oferta del choque inflacionario de 2013; y la periodización distinta que revela un índice ampliado de términos de intercambio frente al precio del gas natural aisladamente— constituyen, en conjunto, una contribución sustantiva al análisis del período, más allá del valor metodológico del propio ejercicio de construcción del instrumento.

---

## Referencias

Ilzetzki, E., Mendoza, E. G., & Végh, C. A. (2013). How big (small?) are fiscal multipliers? *Journal of Monetary Economics*, 60(2), 239-254.

Banco Central de Bolivia. (2013). *Memoria 2013*. La Paz: BCB.

Instituto Nacional de Estadística de Bolivia. Cuadros de Cuentas Nacionales, Índice de Precios al Consumidor, y Encuesta de Hogares (varios años).

Unidad de Análisis de Políticas Sociales y Económicas / Ministerio de Economía y Finanzas Públicas de Bolivia. Dossier de Estadísticas Sociales y Económicas (varios años).

Autoridad de Fiscalización y Control de Pensiones y Seguros de Bolivia. Asegurados Registrados en el Sistema Integral de Pensiones — Histórico.

Fondo Monetario Internacional. Primary Commodity Price System.

National Oceanic and Atmospheric Administration, Climate Prediction Center. Oceanic Niño Index.

---

*El código fuente completo, la base de datos consolidada, y el manual de uso de SimuMac se encuentran disponibles en el repositorio público del proyecto.*
