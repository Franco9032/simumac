# Manual de Uso — SimuMac
### Simulador Macroeconómico de Bolivia, 2010–2014
### Versión 14.50.2
### Creado por Franz Nicol Vargas Crespo, 2026

---

## 1. Presentación general

SimuMac es una herramienta interactiva para estudiar la economía boliviana entre 2010 y 2014 desde tres perspectivas complementarias:

- **Lectura histórica**: ver qué pasó realmente, con datos verificados contra fuentes oficiales.
- **Análisis contrafactual**: partir de un año que ya ocurrió y preguntar "¿qué habría cambiado si...?" — por ejemplo, ¿qué habría pasado con la inflación de 2012 si el precio del gas hubiera caído un 20%?
- **Análisis de escenarios hipotéticos**: construir una economía con condiciones fuera de lo que Bolivia vivió realmente en este período — por ejemplo, explorar qué ocurre si las reservas internacionales caen a niveles críticos, algo que no sucedió entre 2010 y 2014.

La herramienta está pensada para estudiantes y profesionales de economía. No asume que quien la usa sabe programar ni que conoce de antemano cómo está construida por dentro — pero sí asume conocimientos de macroeconomía básica e intermedia (IS-LM, Mundell-Fleming, curva de Phillips, multiplicador fiscal). Cuando se usa un término técnico específico de este proyecto, se explica la primera vez que aparece.

### 1.1 Cómo está organizada

Cuatro secciones, accesibles desde el menú superior:

| Sección | Para qué sirve |
|---|---|
| **Panorama** | Ver el conjunto de la economía boliviana 2010-2014 de un vistazo: los indicadores más importantes, los hitos del período, y un análisis narrativo año por año. |
| **Datos** | Explorar en detalle cada bloque de información (real, fiscal, monetario, externo, precios, social, contexto), con la teoría económica que corresponde a cada uno. |
| **Simulador** | El corazón de la herramienta: mover variables, aplicar políticas económicas, y ver el efecto estimado sobre el resto de la economía. |
| **Metodología** | Para quien quiera verificar de dónde sale cada número: las fuentes exactas y qué tan firme es cada coeficiente usado en los cálculos. |

Además, un botón fijo en la esquina inferior derecha (**📖 Manual**) abre este mismo documento en cualquier momento, sin perder lo que estés simulando.

### 1.2 Una regla que conviene tener presente

Todos los datos provienen de fuentes oficiales verificadas (Instituto Nacional de Estadística, Banco Central de Bolivia, Ministerio de Economía, entre otras). Cuando un dato no existe para un año determinado —el caso más importante es 2010, año en que no se realizó la Encuesta de Hogares, y que tampoco tiene un año previo dentro de la muestra para calcular la tasa de crecimiento del PIB— la herramienta lo indica como "sin dato" en vez de inventar un número. Esto significa que **2010 solo puede usarse como año base en modo Histórico** (lectura pura, sin mover palancas): al elegirlo, el Simulador cambia automáticamente a ese modo, porque Contrafactual e Hipotético necesitan una tasa de crecimiento de la cual partir que 2010 no tiene. 2010 sí aparece sin restricciones en los gráficos históricos de Panorama y Datos.

---

## 2. Pestaña Panorama

### 2.1 Tabla de indicadores

Una tabla con 20 variables clave, una fila por variable y una columna por año (2010 a 2014): crecimiento del PIB, inflación, desempleo, pobreza, inversión pública, balance fiscal, precio del gas, deuda externa, reservas internacionales, dolarización, salario mínimo, y otras. Es el punto de partida más rápido para tener una fotografía completa del período antes de entrar al detalle.

### 2.2 Gráficos

La mayoría de los gráficos muestran un dato por año. Dos de ellos —el PIB y la inflación— tienen un selector que permite verlos con mayor detalle temporal (por trimestre o por mes), útil cuando se quiere observar un movimiento específico dentro de un año, no solo el resultado de diciembre.

### 2.3 Hitos y análisis

Se documentan los sucesos más relevantes del período (el aumento y posterior reversión del precio de los combustibles en diciembre de 2010, y el choque de precios de alimentos de 2013), cada uno con un enlace a la fuente periodística o institucional donde se puede leer más. Debajo, un análisis en texto recorre año por año el comportamiento del PIB, la inflación, el mercado laboral, la pobreza, la inversión pública y las tasas de interés.

---

## 3. Pestaña Datos

### 3.1 Cómo navegar

Siete botones en la parte superior, uno por bloque temático: **Real, Fiscal, Monetario, Externo, Precios, Social, Contexto**. Cada bloque muestra sus propias tablas y gráficos, con tres elementos adicionales:

- **Un recuadro de "teoría aplicable"**: qué marco económico corresponde usar para interpretar esos datos, y por qué. La herramienta no se limita a una sola teoría: usa la ecuación de gasto agregado para el bloque Real, la restricción de balanza de pagos para el bloque Externo, la curva de Phillips y la Ley de Okun para el bloque Precios, y así sucesivamente según lo que cada conjunto de datos permite estudiar.
- **Un recuadro de "relación con el simulador"**, justo debajo del anterior: dice explícitamente si las variables de ese bloque son una palanca real del motor (por ejemplo, los 8 agregados del bloque Monetario son literalmente los sliders del Canal Monetario), si alimentan un resultado de la Síntesis sin ser palanca (como la inflación del bloque Precios), o si el bloque es puramente de contexto y no toca el motor de cálculo en absoluto (como Contexto, que solo informa qué tan grande fijar el choque de oferta a mano). La idea es que nunca quede ambiguo por qué se muestra cada dato específico.
- **Selector de granularidad**, donde la fuente original lo permite (por ejemplo, los agregados monetarios y las tasas de interés tienen dato mensual completo; la pobreza y el desempleo, en cambio, solo existen a nivel anual porque así se levanta la encuesta que los mide).

### 3.2 Qué se puede hacer aquí

Esta sección es de **consulta**, no de simulación — sirve para verificar un dato puntual, citar una fuente exacta, o entender la composición de una variable (por ejemplo, ver cuánto del Producto Interno Bruto corresponde a consumo privado frente a inversión). Para modificar variables y ver efectos, se usa la pestaña Simulador.

---

## 4. Pestaña Simulador

Esta es la sección más importante del manual. Se explica primero la lógica general y luego, canal por canal, cómo usarlo con ejemplos concretos.

### 4.1 Los controles que afectan a todo el simulador

**Año base.** Se elige entre 2010, 2011, 2012, 2013 o 2014. 2010 es un caso especial: al seleccionarlo, el modo cambia automáticamente a Histórico y queda bloqueado ahí (ver sección 1.2) — el resto de los años admite los tres modos sin restricción. Todo lo que se simule parte de los datos reales del año elegido.

**Modo de análisis.** Tres botones junto a "Reset total" determinan qué tan libre es la exploración. Cada uno, al seleccionarse, muestra un mensaje propio explicando qué se puede (y no se puede) hacer en ese modo:

- **Histórico** (🔒, rojo): todas las palancas quedan fijas en el valor observado — útil para revisar el año base sin alterarlo, como punto de referencia antes de empezar a modificar algo.
- **Contrafactual** (🔓, azul): las palancas están activas, pero ancladas al año base elegido. Es el modo por defecto y el más usado: "¿qué habría pasado en 2012 si...?".
- **Hipotético** (🧪, ámbar): las palancas se liberan con rangos más amplios (RIN hasta 0 meses, CIN hasta ±15.000 MM Bs), permitiendo explorar condiciones que Bolivia no vivió en este período (por ejemplo, reservas internacionales extremadamente bajas).

### 4.2 Los cuatro canales

Justo arriba de los cuatro botones de canal hay una barra de estado con el **contexto fiscal** del año base (superávit o déficit, según el signo del CIN observado) y el **régimen vigente**: una descripción breve del período (precio del gas, dolarización, si el CIN está o no monetizando el déficit) junto con los coeficientes ya ajustados por la Restricción Externa — φ, k_adj (el multiplicador que usa el Canal Fiscal) y β_adj (el que usa el Canal Crédito). Se muestra aquí, antes de entrar a cualquier canal, porque describe información que comparten tres de los cuatro canales a la vez.

Debajo de los controles generales hay cuatro botones — uno por canal de transmisión de política económica. Cada canal se puede explorar de forma independiente, y **todos alimentan al mismo tiempo un resultado combinado que se ve en la Síntesis**, al final de esta misma pantalla, sin importar cuál canal tengas abierto en ese momento.

#### Canal Fiscal

**Qué representa:** el efecto de la inversión pública sobre el resto de la economía. Con Bolivia operando bajo tipo de cambio fijo durante este período, la política fiscal es, según la teoría de Mundell-Fleming, el instrumento de estabilización más potente disponible para el país — más que la política monetaria.

**Cómo usarlo:** mueve el control deslizante de "Inversión pública real" entre 40% y 160% del nivel que efectivamente se ejecutó ese año. Al 100% no hay cambio (se reproduce la historia exactamente). Subirlo simula un estímulo fiscal; bajarlo, un ajuste.

**Cómo leer el resultado:** el recuadro muestra el cambio porcentual en la inversión y, a la derecha, el efecto estimado sobre el PIB en puntos porcentuales. Hay además un menú para elegir qué tan sensible es esa relación (el "multiplicador"): puedes usar el valor típico del período completo, o el que corresponde específicamente a una de las cuatro transiciones anuales observadas.

**Dos formas de usar este canal**, mediante el interruptor "Fiscal → Macro" / "Macro → Fiscal":
- *Fiscal → Macro* (la vista habitual, descrita arriba): mueves la inversión y ves el efecto sobre el PIB.
- *Macro → Fiscal* (la pregunta inversa): fijas cuántos puntos porcentuales de PIB adicional quieres lograr solo vía este canal, y la herramienta busca qué % de inversión pública real se necesita y mueve el control por ti. A diferencia del canal inverso de Monetario, no usa pesos ilustrativos: resuelve numéricamente la misma fórmula exacta que usa Fiscal → Macro, incluida la penalidad por saturación de capacidad si el objetivo llega a activarla — si el ΔPIB pedido no es alcanzable dentro del rango del control (40%-160%), la herramienta te lo indica y muestra el resultado más cercano posible.

**Políticas ya preparadas**, si no quieres mover el control manualmente:
- *Recorte de inversión* → lleva la inversión al 80% del año base (un ajuste moderado).
- *Estímulo agresivo* → la lleva al 140%.
- *Ajuste gradual* → la lleva al 90%.

**Ejercicio guiado:** elige 2012 como año base, modo Contrafactual, y aplica "Estímulo agresivo". Observa cuánto sube el PIB estimado en el recuadro de Síntesis, y compáralo con lo que realmente ocurrió el año siguiente (2013, el de mayor crecimiento del período) — es una forma de preguntarte si un estímulo fiscal deliberado podría haber adelantado ese resultado.

#### Canal Monetario

**Qué representa:** el efecto de la política monetaria del Banco Central sobre la economía, a través de los agregados monetarios (M1 a M4, cada uno en su versión solo en bolivianos y en su versión que incluye también depósitos en moneda extranjera) y las tasas de interés.

**Cómo usarlo:** hay ocho controles deslizantes, uno por agregado monetario, e interconectados entre sí — mover uno reajusta proporcionalmente los demás, igual que ocurriría en la práctica si el Banco Central inyecta o retira liquidez del sistema. También puedes escribir un valor directamente en las casillas numéricas si prefieres precisión exacta.

**Un matiz importante:** la eficacia de este canal no es igual todos los años. Bolivia redujo de forma sostenida la proporción de depósitos en dólares durante este período (un proceso conocido como "bolivianización"), y eso hace que el mismo movimiento monetario tenga más efecto hacia 2014 que hacia 2010. Un menú permite comparar este comportamiento realista contra un supuesto más simple de eficacia constante, para ver cuánto cambia la conclusión según ese supuesto.

**Dos formas de usar este canal**, mediante el interruptor "Monetario → Macro" / "Macro → Monetario" que encontrarás arriba de los ocho controles, dentro de esta misma sección:
- *Monetario → Macro* (la vista habitual): mueves los agregados y ves el efecto sobre el PIB, la inflación, etc. Este es el motor principal de la herramienta, con cada coeficiente documentado en Metodología.
- *Macro → Monetario* (la pregunta inversa): fijas una meta macroeconómica (por ejemplo, "quiero 8% de crecimiento") y la herramienta estima qué tan grandes tendrían que ser los agregados monetarios para sostenerla. **Nota importante**: a diferencia del motor principal, esta dirección inversa usa una aproximación ilustrativa con pesos fijos por variable, no un canal simétrico ni calibrado con la misma evidencia que Monetario → Macro. Sirve para tener una intuición de orden de magnitud, no para leer sus resultados con el mismo nivel de confianza que el resto del Simulador.

**Políticas monetarias ya preparadas**, con su tabla explicativa (qué instrumento del Banco Central representa cada una, y qué canal activa): Expansiva, Contractiva, Compra de valores en el mercado (OMA Compra), Venta de valores (OMA Venta), Aumento del encaje legal, y Profundización de la bolivianización.

**Ejercicio guiado:** elige 2010 como referencia visual en Panorama (recordando que como año base del Simulador solo admite modo Histórico, sin políticas activas), luego ve a 2014 en el Simulador y aplica la política "Bolivianización". Compara el efecto con la misma política aplicada sobre 2011. La diferencia que observes es precisamente el resultado de que el canal monetario se había vuelto más eficaz hacia el final del período.

#### Canal Crédito

**Qué representa:** el mecanismo por el cual el Banco Central financia directamente al Tesoro General de la Nación cuando el fisco no puede cubrir sus gastos con ingresos propios — lo que en la literatura económica se conoce como monetización del déficit.

**Un hallazgo central de este proyecto**: este canal **solo se activa cuando existe una necesidad real de financiamiento**. En los datos observados de Bolivia, eso ocurrió únicamente en 2014 — el resto del período tuvo superávit fiscal, por lo que el canal permanece inactivo aunque técnicamente exista. Notarás una etiqueta "ACTIVO" o "INACTIVO" que cambia según el valor que simules, acompañada de un porcentaje: la activación no es un interruptor binario exacto en Crédito Interno Neto = 0, sino una transición gradual (una rampa suave alrededor de ese punto), y el porcentaje indica qué tan avanzada está esa transición.

**Nota técnica**: el multiplicador que amplifica el efecto de este canal sobre el PIB es el mismo multiplicador ajustado (k) que usa el Canal Fiscal — ambos representan el mismo mecanismo de transmisión de un estímulo de demanda hacia el PIB, solo que activado por una palanca distinta (inversión pública real en un caso, financiamiento monetario del déficit en el otro). Por eso un cambio en el umbral de Restricción Externa (ver más abajo) afecta a la vez a ambos canales.

**Cómo usarlo:** el control deslizante mueve el "Crédito Interno Neto simulado", expresado en millones de bolivianos. Puede tomar valores negativos (indicando que el fisco no necesita financiamiento del Banco Central — el canal permanece inactivo) o positivos (indicando financiamiento monetario del déficit — el canal se activa). El efecto sobre el PIB y la inflación aparece más marcado cuanto más se aleje el valor simulado del valor que realmente ocurrió ese año.

**Un indicador adicional en este canal**: el **señoreaje**, expresado como porcentaje del PIB. Es el llamado "impuesto inflacionario" — cuánto del gasto público se está financiando con la creación de dinero en lugar de con ingresos genuinos. Cuando el Crédito Interno Neto simulado coincide con el valor histórico, el señoreaje muestra 0% (no hay cambio respecto a lo ya ocurrido); al aumentar el financiamiento monetario simulado, el señoreaje sube en proporción directa.

**Dos formas de usar este canal**, mediante el interruptor "Crédito → Macro" / "Macro → Crédito":
- *Crédito → Macro* (la vista habitual, descrita arriba): mueves el CIN simulado y ves el efecto sobre el PIB.
- *Macro → Crédito* (la pregunta inversa): fijas cuántos puntos porcentuales de PIB adicional quieres lograr solo vía este canal, y la herramienta busca el CIN simulado necesario. Como la activación del canal es una rampa suave (no lineal), este cálculo se resuelve numéricamente sobre la misma fórmula del motor, no con pesos aproximados — si el objetivo pedido no es alcanzable dentro del rango del control deslizante, la herramienta te lo indica y muestra el resultado más cercano posible.

**Políticas ya preparadas:**
- *Monetización total del déficit* → simula que el Banco Central cubre una necesidad grande de financiamiento.
- *Disciplina fiscal estricta* → simula lo opuesto, un superávit forzado.

**Ejercicio guiado:** elige 2012 (año de superávit real) y sube gradualmente el control de CIN simulado desde un valor muy negativo hasta uno muy positivo. Observa en qué punto la etiqueta cambia de INACTIVO a ACTIVO, y cómo el señoreaje solo se vuelve positivo después de ese cruce.

#### Restricción Externa

**Qué representa:** la idea de que un país con reservas internacionales bajas ve debilitada su capacidad de sostener el gasto público y el crédito interno — porque enfrenta el riesgo de no poder cubrir sus compromisos externos.

**Un segundo hallazgo central de este proyecto**: durante todo 2010-2014, las reservas internacionales de Bolivia se mantuvieron muy por encima del nivel que activaría esta restricción (entre 17 y 21 meses de importaciones, frente a un umbral de referencia de 6 meses). En la práctica, este canal nunca operó en la historia real de este período — está disponible principalmente para explorar escenarios hipotéticos.

**Cómo usarlo:** el control deslizante mueve las reservas internacionales simuladas, expresadas en meses de importaciones que podrían financiarse con ellas. En el modo Hipotético, el rango se extiende hasta valores extremos (incluso cero) que Bolivia no experimentó en este período.

**Umbral de referencia ajustable**: un selector permite elegir entre 6 y 12 meses de importaciones como umbral que activa la restricción. Seis meses es la convención estándar de cobertura de importaciones; doce meses es un criterio más conservador, citado en parte de la literatura para economías dependientes de la exportación de materias primas (como el gas en el caso boliviano). Cambiar el umbral solo tiene efecto visible cuando las reservas simuladas se acercan a él — en modo Histórico este selector queda bloqueado, porque las RIN observadas están muy por encima de cualquiera de los dos umbrales.

**Por qué este canal no tiene un interruptor "→ Macro" / "Macro →"**, a diferencia de Fiscal, Monetario y Crédito: la Restricción Externa no genera un efecto propio sobre el PIB — es un atenuador que reduce la potencia de los otros dos canales de demanda (Fiscal y Crédito) cuando las reservas caen por debajo del umbral. No existe entonces una "meta de PIB vía Restricción Externa" de la cual partir para invertir el cálculo. El equivalente más honesto a esa pregunta inversa ya está disponible de forma directa: el **RIN mínimo antes de que la restricción empiece a penalizar es, exactamente, el umbral que elijas arriba** (6 o 12 meses).

**Ejercicio guiado:** activa el modo Hipotético, elige cualquier año, y reduce las reservas simuladas por debajo de 6 meses. Observa cómo esto penaliza automáticamente el efecto de los canales Fiscal y de Crédito — la lógica es que un país con reservas escasas no puede sostener el mismo nivel de estímulo sin generar presión sobre el tipo de cambio.

### 4.3 La Síntesis: el resultado combinado

Debajo de los cuatro canales, siempre visible sin importar cuál esté abierto, la Síntesis muestra:

- El **efecto total estimado sobre el PIB**, sumando lo que aporta cada canal.
- La **descomposición de la inflación** en dos componentes: uno que depende de cuánto dinero circula en la economía, y otro que representa un **choque de oferta simulable**. Un control deslizante permite fijar la magnitud de ese choque libremente, y el botón **"Aplicar choque 2013"** lo lleva de un clic al valor observado en el choque de alimentos de ese año (2,4 puntos porcentuales), sin importar qué año base tengas seleccionado — útil para preguntar qué habría pasado si un choque de esa magnitud hubiera ocurrido en un momento distinto.
- Un conjunto de **resultados estimados**: PIB, inflación general y núcleo, tasa de interés, desempleo, pobreza, inversión privada, y un índice de presión sobre el tipo de cambio.
- Un **gráfico comparativo** de los agregados monetarios, contrastando el valor histórico con el simulado.
- El **sistema de alertas** (ver siguiente sección).

### 4.4 Cómo leer las alertas

Cinco indicadores tipo semáforo, cada uno señalando a qué canal corresponde:

| Alerta | Corresponde a | Qué significa el color rojo |
|---|---|---|
| Reservas internacionales | Restricción Externa | Las reservas simuladas son tan bajas que comprometen la capacidad de sostener el gasto |
| Brecha cambiaria | Restricción Externa | Presión significativa sobre el tipo de cambio oficial |
| Inflación de alimentos | Resultado combinado | El componente de choque de oferta está generando una presión inflacionaria alta |
| Déficit fiscal | Fiscal / Crédito | El financiamiento monetario simulado del déficit alcanza un nivel considerado insostenible |
| Dolarización | Monetario | La proporción de depósitos en moneda extranjera es tan alta que debilita fuertemente la política monetaria |

Verde significa que el valor está en un rango manejable; naranja, que merece atención; rojo, que se ha cruzado un umbral considerado crítico. Estas alertas están pensadas para reaccionar principalmente cuando se está simulando (moviendo palancas), no como un diagnóstico del año histórico en reposo.

---

## 5. Pestaña Metodología

### 5.1 Cómo leer la tabla de coeficientes

Cada relación económica usada en los cálculos lleva una de tres etiquetas:

- **Observado**: el dato viene directamente de una fuente oficial, sin ningún cálculo adicional.
- **Calibrado**: el número se obtuvo aplicando una fórmula económica estándar sobre los datos observados de este período — no es una estimación estadística con las propiedades de una regresión econométrica formal, sino un cálculo directo sobre un número reducido de años.
- **Supuesto**: es una decisión de diseño metodológico, declarada como tal, con una alternativa disponible en la propia herramienta para que el usuario pueda comparar qué tanto cambia el resultado según esa decisión.

Esta distinción es importante para interpretar con criterio los resultados: un efecto que depende de un coeficiente "calibrado" con pocos años de datos debe leerse como una aproximación razonable, no como una certeza estadística.

### 5.2 El inventario de fuentes

Una tabla con las 54 fuentes primarias usadas en todo el proyecto, cada una con el documento exacto, la institución, el período que cubre, y en qué parte de la herramienta se utiliza — pensada para que cualquier dato mostrado en la herramienta pueda rastrearse hasta su origen oficial.

### 5.3 Limitaciones que conviene tener presentes

- El multiplicador fiscal se calcula sobre solo cuatro transiciones anuales — es una aproximación, no una estimación econométrica con las garantías estadísticas de una muestra grande.
- La restricción externa nunca fue puesta a prueba por la historia real de este período — su comportamiento ante escenarios extremos es una extrapolación razonable de la teoría, no una validación empírica.
- El marco de tipo de cambio fijo (Mundell-Fleming) que sustenta buena parte de la herramienta corresponde al régimen cambiario vigente en Bolivia entre 2010 y 2014; no debe extrapolarse sin ajustes al régimen cambiario flexible vigente desde 2026.
- La dirección "Macro → Monetario" del Canal Monetario (sección 4.2) usa pesos fijos declarados como aproximación ilustrativa, no calibrados con la misma evidencia que el resto de la herramienta — trátese como una intuición de orden de magnitud, no como un resultado con el mismo respaldo que el motor principal (Monetario → Macro).

---

## 6. Glosario

**Canal de transmisión**: un mecanismo por el cual una decisión de política económica (fiscal, monetaria, de crédito, o relacionada con las reservas internacionales) afecta al resto de la economía.

**Contrafactual**: un ejercicio de "qué habría pasado si", partiendo de una situación real y modificando una condición específica.

**Crédito Interno Neto**: la cantidad de financiamiento que el Banco Central otorga directamente al sector público.

**Dolarización**: la proporción de los depósitos del sistema financiero que están denominados en moneda extranjera en lugar de en bolivianos.

**Monetización del déficit**: financiar el gasto público mediante la creación de dinero por parte del Banco Central, en lugar de mediante impuestos o deuda con terceros.

**Multiplicador fiscal**: cuánto cambia el Producto Interno Bruto ante un cambio en el gasto o la inversión pública.

**Reservas Internacionales Netas (RIN)**: los activos externos que mantiene el Banco Central, usualmente medidos en meses de importaciones que podrían financiarse con ellos.

**Señoreaje**: el ingreso que obtiene un gobierno al financiar gasto mediante la creación de dinero, también llamado impuesto inflacionario.

**Términos de intercambio**: la relación entre los precios de lo que un país exporta y los precios de lo que importa.

**Tipo de cambio fijo**: un régimen en el que el banco central se compromete a mantener el valor de la moneda nacional constante frente a una divisa de referencia.

---

*Ante cualquier duda sobre un resultado específico, la combinación más confiable es: revisar el dato de origen en la pestaña Datos, contrastar el coeficiente usado en Metodología, y solo después interpretar el resultado que muestra el Simulador.*
