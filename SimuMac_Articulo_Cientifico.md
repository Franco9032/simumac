# SimuMac: corrección de errores de especificación y hallazgos empíricos en un simulador macroeconómico para Bolivia, 2010-2014

*SimuMac: specification-error correction and empirical findings in a macroeconomic simulator for Bolivia, 2010-2014*

## Resumen

Este artículo estudia la transmisión de las políticas fiscal, monetaria y de crédito en Bolivia bajo el régimen cambiario fijo de 2010-2014, apoyado en un instrumento de simulación (SimuMac) construido sobre una base de datos verificada de 54 fuentes primarias y validado mediante pruebas funcionales automatizadas. El análisis arroja cuatro hallazgos empíricos centrales. Primero, el Crédito Interno Neto del Banco Central al Sector Público solo se activó como mecanismo de transmisión en 2014, coincidiendo con el primer déficit fiscal desde 2006, lo que respalda modelar la monetización del déficit como condicional y no permanente. Segundo, la restricción externa muestra lecturas divergentes según la métrica de reservas usada: la cobertura de importaciones permanece holgada todo el período, mientras el criterio de Wijnholds-Kapteyn se estrecha hacia 2014. Tercero, el choque inflacionario de agosto-septiembre de 2013 responde a un patrón de oferta alimentaria, no a un episodio climático según el Índice Oceánico El Niño. Cuarto, un índice ampliado de términos de intercambio ubica el pico del ciclo de recursos naturales en 2011, no en 2012 como sugiere el precio del gas natural aislado.

## Abstract

This article studies the transmission of fiscal, monetary, and credit policy in Bolivia under the fixed exchange-rate regime of 2010-2014, supported by a simulation instrument (SimuMac) built on a verified database of 54 primary sources and validated through automated functional tests. The analysis yields four central empirical findings. First, the Central Bank's Net Domestic Credit to the Public Sector activated as a transmission mechanism only in 2014, coinciding with the first fiscal deficit since 2006, supporting a conditional rather than permanent specification of deficit monetization. Second, the external constraint shows divergent readings depending on the reserve-adequacy metric used: import coverage remained ample throughout the period, while the Wijnholds-Kapteyn criterion narrowed toward 2014. Third, the August-September 2013 inflationary shock reflects a food-supply pattern rather than a large-scale climatic episode, according to the Oceanic Niño Index. Fourth, a broader terms-of-trade index places the peak of the natural-resource cycle in 2011, not in 2012 as suggested by the natural gas price alone.

**Palabras clave:** simulación macroeconómica, Bolivia, Mundell-Fleming, monetización del déficit, herramienta pedagógica.
**Keywords:** macroeconomic simulation, Bolivia, Mundell-Fleming, deficit monetization, pedagogical tool.
**Clasificación JEL:** E62, E52, F31.

---

## Introducción

Los simuladores macroeconómicos no buscan estimar parámetros como un modelo econométrico, sino construir intuición sobre los mecanismos de transmisión de política. Ese valor pedagógico depende de que los números sean reales y verificables, un requisito que en la práctica suele sacrificarse por la interactividad: los errores que una auditoría metodológica revela no son fallas de programación sino inconsistencias de fondo económico, como un multiplicador fiscal sin conversión de unidades declarada o un canal de crédito activo sin condicionarlo a una necesidad real de financiamiento.

Este trabajo parte de esa auditoría para estudiar la transmisión de la política fiscal, monetaria y de crédito en Bolivia bajo el régimen cambiario fijo de 2010-2014, apoyándose en SimuMac, un instrumento de simulación construido para evitar esos problemas. El proyecto tuvo tres objetivos: especificar un motor de cálculo sin las inconsistencias habituales en estos instrumentos, reconstruir la base de datos sobre 54 fuentes primarias verificables sin valores interpolados, y rediseñar la interfaz con una palanca de simulación propia para cada canal de transmisión. El análisis se acota a 2010-2014 para que cada coeficiente sea trazable a una fuente primaria concreta; la extensión a períodos posteriores, incluyendo el régimen cambiario flexible vigente desde junio de 2026, queda fuera de este trabajo.

El artículo se organiza como sigue: la sección 2 presenta el marco teórico; la sección 3, los errores de especificación identificados y la reconstrucción metodológica; la sección 4, los hallazgos empíricos centrales; la sección 5, la arquitectura del instrumento; la sección 6 discute alcance y límites, y la sección 7 concluye.

## 2. Marco teórico

### 2.1 El modelo Mundell-Fleming con tipo de cambio fijo como columna vertebral

Bolivia mantuvo un tipo de cambio nominal congelado desde fines de 2010 y, formalmente, un régimen de tipo de cambio fijo (Bs 6,96 por dólar) desde noviembre de 2011 hasta después de 2014 (Banco Central de Bolivia, n.d.). Por eso el modelo Mundell-Fleming con movilidad imperfecta de capitales es el marco natural para el análisis: bajo un ancla cambiaria y sin plena movilidad de capitales, la política fiscal es dominante y el canal monetario doméstico conserva cierto grado de efecto, en lugar de quedar completamente neutralizado. Este trabajo formaliza esa jerarquía asignando al canal fiscal el multiplicador de mayor magnitud del motor de cálculo.

La atenuación del canal monetario, sin embargo, no se calibra a partir de un indicador de movilidad de capitales, sino a partir de sustitución de monedas (dolarización financiera) observada en el sistema, un mecanismo distinto con su propia literatura sobre restricciones a la autonomía monetaria bajo dolarización. El parámetro θ escala con la dolarización financiera, que cayó de 44,1% en 2010 a 18,9% en 2014 (Banco Central de Bolivia, n.d.), lo que produce una eficacia estimada del canal doméstico que sube de θ = 0,15 en 2010 a θ = 0,36 en 2014. Esta distinción se declara explícitamente en la especificación del canal monetario: θ no mide movilidad de capitales en sentido estricto, ya que eso requeriría un índice de apertura de la cuenta financiera, sino específicamente sustitución de monedas.

### 2.2 Monetización del déficit como mecanismo condicional, no permanente

La literatura sobre financiamiento monetario del déficit (desde "fiscal dominance" hasta el señoreaje) describe un mecanismo condicional: el fisco solo recurre a él cuando no puede cubrir sus gastos con ingresos propios. Este mecanismo se modela aquí explícitamente: el canal de crédito solo transmite cuando el Crédito Interno Neto del Banco Central al Sector Público (CIN) es positivo, con una función de activación continua, no un interruptor binario discreto, dado que no hay evidencia de que los efectos de credibilidad y expectativas de un episodio de monetización sean verdaderamente discontinuos en el cruce exacto de cero. El efecto se calibra como diferencia respecto al CIN histórico del año base, no como su valor absoluto, de modo que el estado inicial de cualquier simulación reproduce exactamente la trayectoria observada, y solo la desviación deliberada del usuario introduce un efecto. Se complementa este canal con un indicador explícito de señoreaje (la expansión de base monetaria simulada, expresada como proporción del PIB nominal del año base), que permite cuantificar directamente cuánto del gasto público simulado se estaría financiando con emisión.

### 2.3 Restricción de balanza de pagos y adecuación de reservas

La restricción externa sigue la lógica de las crisis de balanza de pagos de segunda generación. Con reservas adecuadas, no hay penalización sobre el multiplicador fiscal ni el canal de crédito; por debajo del umbral, ambos se atenúan, y también el canal monetario, porque la restricción externa afecta a la demanda agregada sin importar el canal de transmisión. Se usa la cobertura de importaciones (meses de importación financiables con las RIN) como métrica primaria, con un umbral seleccionable de 6 o 12 meses, convenciones estándar dentro de la literatura sobre adecuación de reservas en economías emergentes (Wijnholds & Kapteyn, 2001; Bussière & Mulder, 1999), aunque no las únicas defendibles: se documenta explícitamente el criterio complementario de Wijnholds-Kapteyn (RIN sobre el agregado monetario amplio M'2), que muestra un comportamiento distinto al de la cobertura de importaciones (ver Tabla 2, Sección 4.2). Esta divergencia entre métricas ilustra que ninguna métrica única agota la pregunta de cuán cómoda está la posición externa de un país, razón por la que ambas se documentan en paralelo.

### 2.4 Curva de Phillips, Ley de Okun, y la identificación de choques de oferta

Un choque de oferta, una restricción súbita en la disponibilidad de bienes, hace que el desempleo y la inflación suban juntos. La curva de Phillips no anticipa ese patrón; la Ley de Okun, en cambio, no impone supuestos sobre la causa de la variación del producto, por lo que sí puede describirlo. Este es precisamente el patrón que la evidencia recopilada documenta para el episodio de agosto-septiembre de 2013 en Bolivia, por lo que se usa Okun, no Phillips, como relación de referencia para ese episodio específico, con la salvedad, incorporada tras una revisión metodológica más amplia del período completo, de que 2011 exhibe el patrón contrario (inflación núcleo de 8,79% frente a una inflación general de 6,90%, una brecha de 1,89 puntos porcentuales en sentido inverso al de 2013, compatible con un episodio de demanda generalizada) (Banco Central de Bolivia, n.d.). La conclusión se declara válida para el episodio de 2013 en particular, no como una regularidad general de la economía boliviana en todo el período.

### 2.5 Términos de intercambio y dependencia de recursos naturales

La "enfermedad holandesa" —precios altos de recursos naturales que impulsan el ingreso fiscal, el gasto y el ciclo macro— se analiza aquí no solo a través del precio del gas, sino con un índice ampliado que incluye zinc, estaño, plata y soya. Este índice revela que el ciclo de precios de recursos alcanzó su punto máximo en 2011 (131,5, base 2010=100), no en 2012 como sugeriría el precio del gas natural aisladamente (que alcanza su máximo en 488 USD/tonelada ese año) (Banco Central de Bolivia, n.d.), impulsado principalmente por el precio de la plata, que subió 74% entre 2010 y 2011 y luego cayó de forma sostenida (Fondo Monetario Internacional, n.d.). Este hallazgo matiza la periodización del "superciclo" cuando se considera la canasta completa de exportaciones, no un solo producto.

## 3. Metodología

### 3.1 Errores de especificación frecuentes en simuladores macroeconómicos didácticos, y su tratamiento

Antes de construir la base de datos y el motor de cálculo, se identificaron y documentaron formalmente los siguientes problemas de especificación, comunes en instrumentos de esta naturaleza cuando la interactividad se prioriza sobre la trazabilidad de cada coeficiente a su fuente (Tabla 1).

**Tabla 1.** *Errores de especificación frecuentes en simuladores macroeconómicos didácticos*

| Error de especificación | Naturaleza | Consecuencia si no se corrige |
|---|---|---|
| Multiplicador fiscal dimensionalmente inconsistente | Bs de precios constantes (numerador) sobre USD corrientes (denominador), sin conversión declarada | El coeficiente resultante no tiene interpretación económica válida |
| Validación circular | El mismo par de años usado para calibrar el coeficiente y para "validarlo" | Ninguna prueba independiente del ajuste del modelo |
| Variable de capacidad productiva mal especificada | División de una tasa de crecimiento entre un nivel | Resultado sin sentido dimensional |
| Restricción externa como función escalonada | Discontinuidades artificiales en los puntos de corte | Comportamiento no derivable, penalización injustificadamente abrupta |
| Canal de crédito permanentemente activo | Sin condicionalidad a la existencia real de necesidad de financiamiento | Atribuye monetización del déficit a años de superávit fiscal observado |
| Ausencia de bloque de precios explícito | La inflación se usaba como criterio de validación sin ecuación propia | Imposibilidad de verificar de dónde proviene la inflación simulada |
| Inconsistencia entre componentes de un mismo cálculo | Un término usa una magnitud ya corregida por un mecanismo de ajuste; otro término, del mismo cálculo, usa la magnitud sin corregir | El desglose no suma el total mostrado; el resultado puede ser implausible en escenarios extremos |

*Fuente: elaboración propia.*

Este tipo de error (inconsistencia entre componentes, no una fórmula aislada) es difícil de detectar con solo mirar el código: cada término puede ser correcto por separado, y la inconsistencia solo se revela al ejercitar el instrumento con valores extremos y verificar que los componentes sumen el total. Por eso la validación funcional automatizada (Sección 3.4) es fundamental, no solo la revisión manual del código.

### 3.2 Reconstrucción de la base de datos: los siete bloques

Con la auditoría completa, se construyó una base de datos íntegramente nueva, organizada en siete bloques temáticos, cada uno con su teoría económica aplicable declarada explícitamente (no cerrada a un único marco): (1) Real: PIB por actividad económica y por componente de gasto, con periodicidad trimestral, permitiendo la descomposición Y = C + I + G + X − M; (2) Fiscal: ingresos, egresos, balance del Sector Público No Financiero, Crédito Interno Neto, inversión pública ejecutada; (3) Monetario: los ocho agregados monetarios estándar (M1 a M4, en moneda nacional y moneda nacional más extranjera), tasas activas y pasivas por plazo; (4) Externo: Reservas Internacionales Netas, deuda externa pública, dolarización de depósitos, remesas de trabajadores recibidas, comercio exterior; (5) Precios: Índice de Precios al Consumidor general y de alimentos, inflación núcleo y subyacente, precio de exportación del gas natural, verificado por dos fuentes independientes con una discrepancia inferior al 0,001%; (6) Social: desempleo, pobreza moderada y extrema, salario mínimo nacional, afiliación al sistema de pensiones; y (7) Contexto: precios de commodities no gasíferos (zinc, estaño, plata, soya) y el Índice Oceánico El Niño, que permite distinguir choques de oferta de origen climático de gran escala de otros fenómenos de oferta más acotados.

En total, la base de datos consolida 54 fuentes primarias del Instituto Nacional de Estadística, el Banco Central de Bolivia, la Unidad de Análisis de Políticas Sociales y Económicas / Ministerio de Economía y Finanzas Públicas, la Autoridad de Fiscalización y Control de Pensiones y Seguros, el Fondo Monetario Internacional y la Administración Nacional Oceánica y Atmosférica de los Estados Unidos (ver Anexo C). Ninguna ausencia de dato se interpola: si una fuente no publica una serie para un año determinado, se declara explícitamente en lugar de estimar un valor. El caso más notorio es 2010, año en que el INE no levantó la Encuesta de Hogares.

El tipo de cambio de los años 2010 y 2011, previos a la fijación oficial en Bs 6,96 desde noviembre de ese año, se calculó como el promedio simple de los doce promedios mensuales de venta oficial (Banco Central de Bolivia, n.d.); esta es una aproximación razonable pero no ponderada por el flujo mensual real de ejecución de inversión pública, granularidad que no existe públicamente, y se documenta aquí como un supuesto de conversión, no como un dato observado.

La reconstrucción de la base de datos permitió además identificar series recopiladas pero no conectadas a ningún canal de transmisión ni a ninguna visualización, que se incorporaron en tres frentes: el indicador de señoreaje descrito en la Sección 2.2, conectado como salida directa del canal de crédito; la serie de remesas de trabajadores recibidas, sumada a la base de datos y a las visualizaciones del bloque externo; y la variación del salario mínimo real, contrastada descriptivamente contra el crecimiento del consumo privado (con una brecha sostenida de entre 13 y 18 puntos porcentuales por año). Esta última se documenta únicamente como correlación visualizada en el bloque social, no como relación causal modelada ni como palanca de simulación, para no introducir un mecanismo de transmisión salarial sin una calibración propia que lo sustente.

### 3.3 Rediseño del motor de cálculo

El motor se organiza en torno a cuatro canales de transmisión, cada uno con una palanca de simulación propia e independiente de los demás canales —de modo que, por ejemplo, se puede simular un cambio en la inversión pública sin alterar el canal de crédito—, un conjunto de políticas precargadas calibradas para mover esa palanca en magnitudes documentadas, y una etiqueta de procedencia metodológica (observado, calibrado o supuesto) para cada coeficiente que interviene en su cálculo.

La activación del canal de crédito se especifica mediante una función sigmoide continua, centrada en el punto donde el Crédito Interno Neto simulado cruza cero, con un ancho de transición declarado como supuesto de especificación, no como hallazgo calibrado. La interfaz conserva una etiqueta binaria (activo/inactivo) como simplificación de lectura, complementada con el porcentaje de activación de la función continua subyacente, de modo que la simplificación visual no oculte el comportamiento gradual que el motor efectivamente calcula.

Un componente de síntesis, estructuralmente independiente de las cuatro palancas, integra los efectos combinados y se recalcula ante cualquier modificación, sin importar cuál canal esté siendo visualizado en un momento dado — una decisión de arquitectura necesaria para evitar que la navegación entre canales deje visible un resultado de síntesis desactualizado respecto al estado real de las palancas.

### 3.4 Validación funcional

Para verificar el motor de cálculo se diseñó una batería de pruebas automatizadas, ejecutada en un entorno de JavaScript sin navegador que simula la interacción del usuario. Con ellas se comprobó que el estado inicial de cualquier año base reproduce exactamente la trayectoria histórica observada cuando ninguna palanca ha sido modificada; que cada canal responde de forma monótona y con el signo correcto ante su propia palanca; que los umbrales de activación se cruzan en los puntos y con la magnitud declarados; que los componentes de un resultado compuesto suman efectivamente el total reportado; y que no hay identificadores duplicados, referencias rotas ni inconsistencias en la navegación.

Se diseñó esta batería de pruebas porque un umbral de alerta o una fórmula de penalización pueden estar bien formulados algebraicamente y aun así comparar magnitudes en unidades incompatibles, reaccionar con el signo económico contrario al esperado, o —el error más difícil de detectar— usar en un componente del cálculo una magnitud ya corregida por un mecanismo de ajuste mientras otro componente del mismo cálculo usa la magnitud sin corregir. Este último tipo de error solo se manifiesta al ejercitar el instrumento con estímulos lo bastante grandes como para activar ese mecanismo. Por eso se incluyeron pruebas que ejercitan el motor en sus rangos extremos y verifican explícitamente la consistencia interna de cada desglose.

## 4. Resultados

### 4.1 El Crédito Interno Neto como interruptor, no como canal permanente

El hallazgo más importante es empírico: el Crédito Interno Neto del BCB al Sector Público fue negativo en 2010-2013 (superávit fiscal) y se volvió positivo en 2014, el mismo año del primer déficit desde 2006 (Banco Central de Bolivia, n.d.; Unidad de Análisis de Políticas Sociales y Económicas / Ministerio de Economía y Finanzas Públicas de Bolivia, n.d.). Este hallazgo, verificado de forma cruzada en tres presentaciones distintas de la misma variable, es la base empírica que justifica especificar la monetización del déficit como un mecanismo condicional a la existencia de una necesidad de financiamiento, no como un canal continuamente activo durante todo el período. El indicador de señoreaje derivado de este canal permanece en cero mientras el CIN simulado coincide con el observado, y solo se activa, de forma proporcional, cuando se simula un financiamiento monetario del déficit que se aparta del que efectivamente ocurrió.

Este hallazgo es consistente con la evolución de la deuda externa pública, que casi se duplicó en el período —de 2.891 a 5.736 millones de dólares entre 2010 y 2014 (Banco Central de Bolivia, n.d.)—, coincidiendo con el mismo año de quiebre fiscal: evidencia independiente, por la vía externa, de que 2014 marcó el inicio de una necesidad de financiamiento real y no solo un artefacto del canal monetario.

### 4.2 Inercia de la restricción externa, según la métrica considerada

Las Reservas Internacionales Netas se mantuvieron entre 17 y 21 meses de cobertura de importaciones durante la totalidad del período estudiado, muy por encima del umbral de 6 (o incluso 12) meses que activaría una penalización sobre los canales fiscal, de crédito y monetario (Banco Central de Bolivia, n.d.). Bajo esta métrica, la restricción externa, aunque correctamente especificada en el motor de cálculo, nunca fue puesta a prueba por la historia observada de este período. Sin embargo, el criterio complementario de Wijnholds-Kapteyn (RIN sobre M'2) muestra una lectura distinta (Tabla 2): cae de 119,2% en 2011 a 95,7% en 2014, cruzando el umbral de 100% precisamente en el año del quiebre fiscal.

**Tabla 2.** *RIN: cobertura de importaciones frente al criterio de Wijnholds-Kapteyn*

| Año | RIN (millones USD) | Importaciones anuales (millones USD) | RIN / importaciones (meses) | M'2 (millones Bs) | RIN / M'2 (%) |
|---|---|---|---|---|---|
| 2010 | 9.729,7 | 5.603,9 | 20,8 | 59.795.511 | 115,0 |
| 2011 | 12.018,5 | 7.935,7 | 18,2 | 70.469.612 | 119,2 |
| 2012 | 13.926,7 | 8.590,1 | 19,5 | 82.646.060 | 117,3 |
| 2013 | 14.430,1 | 9.699,0 | 17,9 | 95.835.929 | 104,8 |
| 2014 | 15.122,8 | 10.674,1 | 17,0 | 109.988.092 | 95,7 |

*Fuente: BCB, Cuadro 1.4.5.2 (RIN) y Cuadro de Comercio Exterior (importaciones).*

Esta divergencia entre métricas, ambas igualmente estándar en la literatura sobre adecuación de reservas, se declara explícitamente para no reclamar, bajo ninguna de las dos, una validación empírica más sólida de la que los datos permiten sostener.

### 4.3 El choque inflacionario de 2013 como fenómeno de oferta, no climático de gran escala

Tres piezas de evidencia convergen: la inflación general a doce meses se separa de la inflación núcleo por 2,38 puntos porcentuales hacia fines de 2013; a nivel de producto individual, los índices de precios de la papa y el tomate se incrementan 77% y 93% respectivamente entre mayo y octubre de ese año, mientras el pollo sube 17% (Instituto Nacional de Estadística de Bolivia, n.d.); y el Índice Oceánico El Niño se mantiene prácticamente neutro (entre -0,21 y -0,13) durante el trimestre exacto del pico del choque (National Oceanic and Atmospheric Administration, n.d.), descartando un episodio de El Niño o La Niña de gran escala como causa climática regional. Un análisis del período completo muestra, no obstante, que 2011 exhibe el patrón inverso, compatible con un episodio de demanda, de modo que la caracterización de 2013 no debe generalizarse como una regularidad del período completo.

### 4.4 Divergencia entre el precio del gas natural y el índice ampliado de términos de intercambio

Mientras el precio de exportación del gas natural alcanza su máximo en 2012 (Banco Central de Bolivia, n.d.), un índice de términos de intercambio que incorpora zinc, estaño, plata y soya, además del gas, alcanza su máximo en 2011 (Fondo Monetario Internacional, n.d.), impulsado principalmente por el precio de la plata, que ya se encontraba en descenso hacia 2012. Este hallazgo matiza la periodización del ciclo de recursos naturales cuando se considera la canasta completa de exportaciones bolivianas, y constituye evidencia empírica directa del mecanismo de enfermedad holandesa descrito en la Sección 2.5.

### 4.5 El multiplicador fiscal frente a la literatura internacional

El multiplicador fiscal calibrado sobre las cuatro transiciones anuales disponibles (2,14 a 4,02, según el año) se ubica por encima incluso del extremo de largo plazo (1,4) que reportan Ilzetzki, Mendoza y Végh (2013) para economías bajo tipo de cambio predeterminado en su muestra internacional de 44 países. Con apenas cuatro observaciones anuales, no es posible distinguir si la magnitud calibrada refleja particularidades genuinas de la economía boliviana en este período o la fragilidad estadística inherente a un tamaño de muestra tan reducido. Esta fragilidad se manifiesta con claridad: al simular un estímulo fiscal grande —un incremento del 40% en la inversión pública, por ejemplo—, el efecto bruto sobre el PIB antes de ajustes puede superar los 10 puntos porcentuales, un resultado implausible que el mecanismo de capacidad productiva reduce a una magnitud razonable, actuando como salvaguarda y no como un ajuste fino.

## 5. Arquitectura del instrumento

La interfaz de SimuMac se organiza en cuatro secciones de navegación diseñadas para que la exploración de escenarios no se desligue de sus fuentes: Panorama, con veinte indicadores macroeconómicos clave a lo largo de los cinco años e hitos documentados con enlace a su fuente primaria; Datos, con los siete bloques temáticos y su nota de teoría económica aplicable; Simulador, con los cuatro canales de transmisión como subsecciones de una misma pantalla y una síntesis permanentemente visible que integra sus efectos combinados; y Metodología, con la tabla completa de coeficientes y su etiqueta de procedencia, el inventario de las 54 fuentes primarias, y las limitaciones metodológicas declaradas.

El simulador opera en tres modos: histórico, con todas las palancas bloqueadas para la lectura exacta del año observado; contrafactual, con las palancas activas y ancladas al año base; e hipotético, con rangos ampliados. Un sistema de cinco alertas de umbral, etiquetadas según el canal al que corresponden, señala cuándo se activa cada mecanismo de restricción.

La documentación completa de la interfaz, el manual de uso, el código fuente y la base de datos consolidada están disponibles en el repositorio de acceso abierto en Zenodo (Vargas Crespo, 2026a, 2026b).

## 6. Discusión

### 6.1 Sobre el valor y los límites de la calibración con series cortas

La tensión entre interactividad y rigor estadístico es recurrente en este trabajo. Una serie de cuatro o cinco observaciones anuales no puede sostener estimaciones robustas. La postura adoptada es declarar la procedencia de cada coeficiente, mostrar rangos, contrastar con la literatura, y dejar que el propio ejercicio exponga sus límites. Esto no resuelve la limitación de fondo, pero la hace visible: no la oculta tras una interfaz que sugiere más precisión de la que los datos permiten.

### 6.2 Sobre la ausencia de una métrica única de adecuación de reservas

La cobertura de importaciones y el criterio de Wijnholds-Kapteyn divergen para el mismo período. Una sugiere holgura, la otra un estrechamiento. Esto recuerda que la "adecuación" de una posición externa no se captura con un solo indicador. Documentar ambas métricas en paralelo, y permitir que el usuario elija el umbral, es mejor que imponer una sola lectura como si fuera la única válida.

### 6.3 Sobre la vigencia del marco Mundell-Fleming

El marco teórico central del instrumento, tipo de cambio fijo con movilidad de capitales imperfecta, dejó de describir el régimen cambiario vigente en Bolivia a partir del 29 de junio de 2026, cuando el país adoptó un régimen de tipo de cambio flexible mediante la Resolución Ministerial N.º 245/2026 y la Resolución de Directorio N.º 88/2026 del Banco Central de Bolivia. Esta circunstancia no invalida el análisis del período 2010-2014, que en efecto operó bajo el régimen fijo, pero exige una calificación explícita de alcance en cualquier lectura del instrumento con fines de política económica presente: los mecanismos aquí descritos no son extrapolables sin modificación sustancial al régimen cambiario actual.

### 6.4 Agenda futura

Tres líneas de extensión se dejaron fuera deliberadamente, para no comprometer la trazabilidad de los coeficientes: primero, las expectativas de agentes, dado que el análisis opera hoy con expectativas estáticas; segundo, el ahorro privado compensatorio ante el gasto público (equivalencia ricardiana) y el crowding-out de la inversión privada por tasas de interés, más allá del mecanismo indirecto ya incluido; y tercero, la extensión temporal hacia 2015-2019, la pandemia de 2020 y el régimen cambiario flexible desde 2026.

## 7. Conclusiones

Este artículo estudió la transmisión de la política fiscal, monetaria y de crédito en Bolivia bajo el régimen cambiario fijo de 2010-2014, apoyado en la reconstrucción de un instrumento de simulación validado mediante pruebas funcionales exhaustivas. Los hallazgos empíricos centran la contribución del trabajo: la activación condicional, no permanente, de la monetización del déficit; la lectura divergente que ofrecen dos métricas igualmente estándar de adecuación de reservas; el carácter de oferta del choque inflacionario de 2013; y la periodización distinta que revela un índice ampliado de términos de intercambio frente al precio del gas natural aisladamente. En conjunto, estos resultados constituyen un aporte sustantivo al análisis del período, más allá del valor metodológico del propio ejercicio de construcción y validación del instrumento que los hizo posibles.

El trabajo demuestra, además, que la calidad pedagógica de un simulador interactivo no está reñida con el rigor de sus fuentes de datos ni con la honestidad declarativa sobre las limitaciones de su calibración: es posible construir una herramienta que a la vez invite a la exploración libre de escenarios contrafácticos e hipotéticos, y declare explícitamente qué de lo que muestra es un dato observado, qué es una calibración con la evidencia disponible, y qué es una decisión de especificación sujeta a alternativas igualmente defendibles.

## Referencias

Autoridad de Fiscalización y Control de Pensiones y Seguros de Bolivia. (n.d.). *Asegurados registrados en el Sistema Integral de Pensiones — Histórico* [Conjunto de datos]. APS.

Banco Central de Bolivia. (n.d.). *Series estadísticas: agregados monetarios, tasas de interés, reservas internacionales netas, tipo de cambio, deuda externa pública y precio de exportación del gas natural, 2010-2014* [Conjuntos de datos]. BCB.

Bussière, M., & Mulder, C. (1999). *External vulnerability in emerging market economies: How high liquidity can offset weak fundamentals* (IMF Working Paper No. 99/88). International Monetary Fund.

Fondo Monetario Internacional. (n.d.). *Primary Commodity Price System* [Conjunto de datos]. FMI.

Ilzetzki, E., Mendoza, E. G., & Végh, C. A. (2013). How big (small?) are fiscal multipliers? *Journal of Monetary Economics, 60*(2), 239-254.

Instituto Nacional de Estadística de Bolivia. (n.d.). *Cuadros de Cuentas Nacionales, Índice de Precios al Consumidor, y Encuesta de Hogares* [Conjunto de datos]. INE.

National Oceanic and Atmospheric Administration, Climate Prediction Center. (n.d.). *Oceanic Niño Index* [Conjunto de datos]. NOAA.

Unidad de Análisis de Políticas Sociales y Económicas / Ministerio de Economía y Finanzas Públicas de Bolivia. (n.d.). *Dossier de Estadísticas Sociales y Económicas* [Conjunto de datos]. UDAPE/MEFP.

Vargas Crespo, F. N. (2026a). *SimuMac: Simulador Macroeconómico de Bolivia (2010-2014)* (Versión 14.12.3) [Software]. Zenodo. https://doi.org/10.5281/zenodo.21637545

Vargas Crespo, F. N. (2026b). *SimuMon_Bloques_1-7_Consolidado_FINAL.xlsx* [Conjunto de datos]. Zenodo. https://doi.org/10.5281/zenodo.21637545

Wijnholds, J. O. de B., & Kapteyn, A. (2001). *Reserve adequacy in emerging market economies* (IMF Working Paper No. 01/143). International Monetary Fund.

## Anexos

### Anexo A. Ecuaciones centrales del motor económico

Este anexo presenta las ecuaciones centrales del motor de cálculo de SimuMac, en notación de texto. El conjunto completo de ecuaciones (canal monetario, inflación, Ley de Okun, capacidad productiva y el parámetro θ) está disponible con el mismo nivel de detalle en el repositorio de acceso abierto en Zenodo (Vargas Crespo, 2026a).

> ⚠️ **Nota para la versión Word:** en el archivo `.docx` que acompaña a este `.md`, estas ecuaciones deben insertarse con el editor de ecuaciones de Word/OnlyOffice antes del envío final, conforme a la norma de la revista. Aquí se dejan en notación de texto solo como referencia de contenido para el repositorio.

- **Canal fiscal:** ΔY_fiscal = k · (ΔI_pública real / Y_base) · 100, donde ΔI_pública real = I_pública real, base · (factor − 1); factor ∈ [0,40, 1,60]; k = multiplicador fiscal calibrado (2,14–4,02; por defecto k = 2,66, mediana del período).
- **Canal de crédito (activación suave):** ψ(CIN) = 1 / (1 + e^(−4·CIN/2000)), donde 2000 es el ancho de transición en millones de bolivianos (supuesto de especificación). Efecto sobre el PIB: ΔY_crédito = k · β · ΔG · 100, donde ΔG = [ψ(CIN_sim)·CIN_sim − ψ(CIN_hist)·CIN_hist] / M3_base.
- **Restricción externa:** φ = max(0, min(0,5, 0,5 · (U − RIN_meses)/U)), donde U es el umbral (6 o 12 meses). Multiplicadores ajustados: k_adj = k·(1 − φ); β_adj = β·(1 − φ).

### Anexo B. Coeficientes del motor — detalle de procedencia

| Coeficiente | Canal | Valor | Tipo | Fuente / justificación |
|---|---|---|---|---|
| θ | B | 0,15 – 0,36 | SUPUESTO | θ = 0,25 · (Dolarización 2012 / Dolarización año base). Alternativa fija (θ=0,25) disponible para comparación. |
| h | B | 6,39 | CALIBRADO | ΔM2 / Δr = 17,75% / 2,78 pp. Fuente: BCB, tasas activas de corto plazo 2012-2013. |
| b | B | 1,80 | CALIBRADO | Elasticidad inversión-tasa para Bolivia, con base en datos de crédito privado y tasas de interés (BCB/INE). |
| β | C | 0,688 | OBSERVADO + SUPUESTO | ΔM3 / ΔInv = 20,99% / 30,50% (BCB/VIPFE, 2012-2013). La activación condicional al signo del CIN es un supuesto de especificación. |
| ε(okun) | — | -0,30 | CALIBRADO | Δu / ΔY sobre la transición 2012-2013. |
| ε(pob) | — | -0,647 | CALIBRADO | Δpob / ΔY = -4,4 pp / 6,80%. Fuente: INE, Cuadro 3.06.01.01, transición 2012-2013. |
| φ | Externo | Rampa continua (0–0,5) | SUPUESTO | φ = clamp((U − RIN_meses)/U · 0,5, 0, 0,5). Umbral U = 6 o 12 meses. Nunca se activó en el período observado. |
| Capacidad productiva | A, C | Techo = 108% Y(base) | SUPUESTO | Penaliza los canales A y C cuando el PIB simulado supera el 95% del 108% del PIB base. |

*Fuente: elaboración propia a partir de datos del INE, BCB, UDAPE/MEFP y VIPFE, consolidados en el archivo maestro (Vargas Crespo, 2026b).*

### Anexo C. Fuentes primarias por institución

La base de datos consolida 54 fuentes primarias. El inventario completo, archivo por archivo, está disponible en el repositorio de acceso abierto en Zenodo (Vargas Crespo, 2026b, hoja `01_Inventario_Fuentes`).

| Institución | N.º de fuentes |
|---|---|
| Banco Central de Bolivia (todas las áreas) | 30 |
| Instituto Nacional de Estadística / INE-UDAPE | 10 |
| UDAPE / MEFP / VIPFE / SIN | 8 |
| Autoridad de Fiscalización y Control de Pensiones y Seguros (APS) | 1 |
| Fondo Monetario Internacional (FMI) | 1 |
| National Oceanic and Atmospheric Administration (NOAA) | 1 |
| **Total** | **54** |

*Fuente: elaboración propia a partir del archivo maestro SimuMon_Bloques_1-7_Consolidado_FINAL.xlsx (Vargas Crespo, 2026b).*

### Anexo D. Tablas complementarias

**Tabla D.1.** *Precios de commodities y términos de intercambio (2010-2014)*

| Año | Gas (USD/ton) | Zinc (USD/ton) | Estaño (USD/ton) | Plata (USD/oz) | Soya (USD/ton) | ToT ampliado (2010=100) |
|---|---|---|---|---|---|---|
| 2010 | 315,9 | 2.160,4 | 20.367,3 | 20,2 | 385,0 | 100,0 |
| 2011 | 404,4 | 2.195,5 | 26.051,5 | 35,1 | 484,3 | 131,5 |
| 2012 | 488,0 | 1.950,0 | 21.109,4 | 31,2 | 537,8 | 128,5 |
| 2013 | 471,0 | 1.910,2 | 22.281,6 | 23,8 | 517,2 | 119,9 |
| 2014 | 446,4 | 2.161,0 | 21.898,9 | 19,1 | 457,8 | 112,5 |

*Fuente: BCB (precio del gas) y FMI (commodities). El ToT ampliado es el promedio simple de los cinco precios normalizados a 2010 = 100.*

**Tabla D.2.** *Dolarización de depósitos y eficacia del canal monetario (θ)*

| Año | Depósitos MN (millones Bs) | Depósitos ME (millones Bs) | Dolarización (%) | θ estimado |
|---|---|---|---|---|
| 2010 | 33.289.933 | 26.286.538 | 44,1 | 0,154 |
| 2011 | 46.211.158 | 25.451.274 | 35,5 | 0,191 |
| 2012 | 64.237.335 | 23.901.479 | 27,1 | 0,250 |
| 2013 | 80.044.558 | 23.020.653 | 22,3 | 0,304 |
| 2014 | 97.540.421 | 22.713.698 | 18,9 | 0,359 |

*Fuente: BCB, Sistema Financiero. θ = 0,25 × (Dolarización 2012 / Dolarización año).*
