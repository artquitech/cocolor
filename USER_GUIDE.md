# Teaching Construct - Guía de Usuario

## 📚 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Interfaz del Sistema](#interfaz-del-sistema)
3. [Terminal - Referencia Completa de Comandos](#terminal---referencia-completa-de-comandos)
4. [Navegación en el Entorno 3D](#navegación-en-el-entorno-3d)
5. [Sistema de Lecciones](#sistema-de-lecciones)
6. [Zonas de Contenido](#zonas-de-contenido)
7. [Sesiones de Clase](#sesiones-de-clase)
8. [Modo Multiplayer](#modo-multiplayer)
9. [Flujos de Trabajo Comunes](#flujos-de-trabajo-comunes)
10. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

---

## Introducción

**Teaching Construct** es una plataforma de aprendizaje 3D interactiva que combina un entorno virtual inmersivo con un sistema de gestión de lecciones y colaboración en tiempo real.

### Conceptos Clave

- **Terminal**: Interfaz de comandos para controlar el sistema
- **Construct**: El entorno 3D donde se realiza el aprendizaje
- **Zonas**: Pods de contenido interactivo en el espacio 3D
- **Lecciones**: Contenido educativo con múltiples slides
- **Sesiones de Clase**: Flujos guiados paso a paso
- **Multiplayer**: Colaboración en tiempo real con otros usuarios

---

## Interfaz del Sistema

### Modos de Operación

El sistema tiene 4 modos principales:

| Modo | Descripción | Cómo Acceder |
|------|-------------|--------------|
| **Idle** | Vista de terminal sin actividad | Estado inicial |
| **Booting** | Cargando el sistema | Automático al iniciar |
| **Construct** | Entorno 3D para exploración libre | `enter construct` |
| **Classroom** | Entorno 3D con sesión de clase activa | `start class "Título"` + `enter construct` |

### Componentes de la UI

#### En el Terminal
- **Área de logs**: Muestra historial de comandos y mensajes del sistema
- **Prompt de entrada**: Línea de comando con prefijo `>`
- **Hints**: Información contextual en la parte inferior

#### En el Construct
- **Botón Terminal** (esquina superior izquierda): Regresar al terminal
- **Botón Audio** (esquina superior derecha): Activar/desactivar audio
- **HUD de Clase** (parte superior central): Muestra progreso cuando hay clase activa
- **Panel de Lección** (centro): Slides de la lección actual
- **Indicadores de Zona** (parte inferior): Información de zonas cercanas

---

## Terminal - Referencia Completa de Comandos

### Comandos de Navegación

#### `help`
Muestra la lista completa de comandos disponibles.

```
> help
```

#### `clear`
Limpia el terminal y muestra mensaje de bienvenida.

```
> clear
```

#### `enter construct`
Entra al entorno 3D. Puedes volver al terminal con el botón en pantalla.

```
> enter construct
```

**Resultado**: Transición al modo 3D con cámara en primera persona.

---

### Comandos de Sesiones de Clase

#### `start class "<título>"`
Inicia una nueva sesión de clase con pasos predefinidos y zonas configuradas.

```
> start class "AI Foundations 101"
```

**Configuración automática**:
- 6 pasos guiados
- 3 zonas: AI Introduction, Demo Zone, Practice Exercise
- HUD de progreso visible
- Modo classroom activado

#### `end class`
Finaliza la sesión de clase actual.

```
> end class
```

**Efecto**: Limpia el HUD, vuelve a modo construct.

#### `next step`
Avanza al siguiente paso de la clase.

```
> next step
```

**Requisito**: Debe haber una clase activa.

#### `previous step`
Retrocede al paso anterior de la clase.

```
> previous step
```

---

### Comandos de Zonas

#### `list zones`
Lista todas las zonas disponibles en el construct con sus detalles.

```
> list zones
```

**Salida**:
```
Available Zones:

  zone_intro_ai
    AI Introduction
    Type: lesson
    Position: (-5.0, -3.0)

  zone_demo_1
    Demo Zone
    Type: video
    Position: (5.0, -3.0)
```

#### `open zone <id>`
Abre/activa una zona específica por su ID.

```
> open zone zone_intro_ai
```

**Tipos de zona**:
- **lesson**: Carga la lección asociada
- **video**: (Próximamente) Reproduce video
- **image**: (Próximamente) Muestra imagen
- **exercise**: (Próximamente) Carga ejercicio interactivo

**Atajo**: Presiona `E` cuando estés cerca de una zona en el construct.

---

### Comandos de Lecciones

#### `list lessons`
Muestra todas las lecciones disponibles en el sistema.

```
> list lessons
```

**Salida**:
```
Available Lessons:

  ai_intro_001
    Intro to Human–AI Collaboration
    Understanding the fundamentals of working with AI systems
```

#### `load lesson <id>`
Carga una lección específica.

```
> load lesson ai_intro_001
```

**Efecto**:
- Lección cargada en slide 1
- Panel visible en el construct
- Controles de navegación disponibles

#### `next slide`
Avanza al siguiente slide de la lección.

```
> next slide
```

**Atajos**:
- Botón "Next" en el panel 3D
- Si eres profesor en multiplayer, sincroniza con estudiantes

#### `previous slide`
Retrocede al slide anterior.

```
> previous slide
```

**Requisito**: No estar en el primer slide.

#### `exit lesson`
Cierra la lección actual.

```
> exit lesson
```

---

### Comandos de Display

#### `focus on`
Activa el modo de enfoque: oscurece el fondo para destacar la lección.

```
> focus on
```

**Efecto visual**: Overlay oscuro al 60% de opacidad.

#### `focus off`
Desactiva el modo de enfoque.

```
> focus off
```

---

### Comandos de Multiplayer

#### `join room <room-id> [nombre] [teacher]`
Conecta a una sala multiplayer.

**Ejemplos**:

```
> join room class101
```
*Se une como "Student" (nombre por defecto)*

```
> join room class101 Alice
```
*Se une como "Alice"*

```
> join room class101 "Dr. Smith" teacher
```
*Se une como profesor "Dr. Smith"*

**Parámetros**:
- `room-id`: Identificador único de la sala (ej: class101, demo, session2024)
- `nombre` (opcional): Tu nombre visible. Usa comillas para nombres con espacios
- `teacher` (opcional): Agrega esta palabra para unirte como profesor

**Efectos**:
- Conexión al servidor Socket.io
- Visualización de otros participantes en 3D
- Sincronización de posiciones y acciones
- Logs de entrada/salida de participantes

#### `leave room`
Desconecta de la sala multiplayer actual.

```
> leave room
```

**Efecto**: Desapareces del entorno 3D de otros usuarios.

#### `broadcast lesson <id>`
**(Solo Profesores)** Transmite una lección a todos los estudiantes.

```
> broadcast lesson ai_intro_001
```

**Resultado**:
- Lección se carga automáticamente en todos los estudiantes
- Los slides se sincronizan automáticamente cuando el profesor navega
- Estudiantes ven `[TEACHER]` en sus logs

---

## Navegación en el Entorno 3D

### Controles de Movimiento

| Tecla | Acción |
|-------|--------|
| **W** o **↑** | Mover adelante |
| **S** o **↓** | Mover atrás |
| **A** o **←** | Mover izquierda |
| **D** o **→** | Mover derecha |
| **E** | Activar zona cercana |

### Límites del Mundo

El entorno tiene límites en **±20 unidades** en los ejes X y Z para evitar que te alejes demasiado.

### Detección de Proximidad

- **Radio de detección**: 3 unidades
- **Indicador visual**: La zona pulsa cuando estás cerca
- **Mensaje en pantalla**: Aparece información de la zona y cómo activarla

### Cámara

- La cámara está en **primera persona**
- Altura fija a 1.7 unidades (altura de ojos humana)
- Se mueve automáticamente con el jugador

---

## Sistema de Lecciones

### Estructura de una Lección

Cada lección contiene:
- **ID único**: Identificador (ej: `ai_intro_001`)
- **Título**: Nombre descriptivo
- **Descripción**: Resumen del contenido
- **Slides**: Conjunto de diapositivas con contenido HTML

### Lecciones Disponibles

#### Intro to Human–AI Collaboration (`ai_intro_001`)

**6 slides**:
1. Welcome to Human-AI Collaboration
2. What is AI Collaboration?
3. Types of AI Collaboration
4. Best Practices
5. Common Challenges
6. Getting Started

**Contenido**: HTML con estilos Tailwind, listas, highlights, ejemplos prácticos.

### Navegación en Lecciones

**Desde el Terminal**:
```
> load lesson ai_intro_001
> next slide
> next slide
> previous slide
```

**Desde el Panel 3D**:
- Botones "Previous" y "Next" en la parte inferior
- Contador de slides: `Slide 2 of 6`
- Título del slide actual

### Modos de Visualización

#### Modo Normal
- Panel de 700px de ancho
- Fondo semi-transparente
- Visible con el entorno alrededor

#### Modo Focus
- Panel de 800px de ancho
- Entorno oscurecido al 60%
- Máxima atención en el contenido

```
> focus on
```

---

## Zonas de Contenido

### Tipos de Zonas

| Tipo | Color | Estado Actual |
|------|-------|---------------|
| **lesson** | Verde | ✅ Implementado |
| **video** | Cyan | 🚧 Próximamente |
| **image** | Magenta | 🚧 Próximamente |
| **exercise** | Magenta | 🚧 Próximamente |

### Anatomía de una Zona

**Componentes visuales**:
- **Caja 3D**: Cubo de 1x2x1 unidades
- **Emisión de luz**: Color según tipo
- **Texto flotante**: Título a 2 unidades de altura
- **Animación**: Flotación suave (bobbing)
- **Efecto de proximidad**: Pulsación cuando el jugador está cerca

### Interacción con Zonas

**Método 1: Proximidad + E**
1. Camina cerca de la zona (< 3 unidades)
2. Aparece indicador en pantalla
3. Presiona `E`

**Método 2: Comando**
```
> open zone zone_intro_ai
```

### Zonas Predefinidas

Cuando inicias una clase, se crean 3 zonas:

```
zone_intro_ai
  AI Introduction
  Posición: (-5, 0, -3)
  Contiene: ai_intro_001 lesson

zone_demo_1
  Demo Zone
  Posición: (5, 0, -3)
  Contiene: demo_video_001

zone_exercise_1
  Practice Exercise
  Posición: (0, 0, -8)
  Contiene: exercise_001
```

---

## Sesiones de Clase

### ¿Qué es una Sesión de Clase?

Una experiencia guiada paso a paso con:
- **Título personalizado**
- **Lista de pasos** (checklist)
- **Zonas pre-configuradas**
- **HUD de progreso visible**

### Iniciar una Clase

```
> start class "Introducción a IA Generativa"
```

**Se configura automáticamente**:
- 6 pasos predefinidos
- 3 zonas específicas
- Modo classroom
- HUD visible

### HUD de Clase

Ubicado en la parte superior central, muestra:

```
┌─────────────────────────────────────┐
│ Introducción a IA Generativa        │
│ STEP 2/6                            │
├─────────────────────────────────────┤
│ ● Walk to the AI Introduction zone │  ← Paso actual
├─────────────────────────────────────┤
│ ✓ Welcome students to the construct │
│ ● Walk to the AI Introduction zone │
│ ○ Open the lesson and review slides│
│ ○ Move to the Demo Zone...         │
│ ...                                 │
└─────────────────────────────────────┘
```

**Iconos**:
- ✓ Paso completado
- ● Paso actual (pulsa)
- ○ Paso pendiente

### Navegar en la Clase

```
> next step      # Avanza al siguiente paso
> previous step  # Retrocede un paso
> end class      # Finaliza la sesión
```

### Pasos Típicos de una Clase

1. **Welcome students to the construct**
2. **Walk to the AI Introduction zone**
3. **Open the lesson and review slides**
4. **Move to the Demo Zone for practical examples**
5. **Complete the practice exercise**
6. **Q&A and wrap-up**

---

## Modo Multiplayer

### Arquitectura

- **Servidor**: Socket.io en puerto 3001
- **Protocolo**: WebSocket con fallback a polling
- **Sincronización**: Tiempo real (<100ms)

### Roles

#### Estudiante
- **Permisos**:
  - Ver otros participantes
  - Navegar libremente
  - Cargar lecciones propias
- **Sincronización**:
  - Posición visible para otros
  - Lección actual compartida
  - Recibe broadcasts del profesor

#### Profesor
- **Permisos adicionales**:
  - Broadcast de lecciones
  - Control de slides grupal
- **Comando especial**: `broadcast lesson <id>`

### Conectarse a una Sala

**Como Estudiante**:
```
> join room session2024 "María García"
```

**Como Profesor**:
```
> join room session2024 "Prof. Rodríguez" teacher
```

**Logs esperados**:
```
[MULTIPLAYER] Connecting to room: session2024
[MULTIPLAYER] Name: María García
[MULTIPLAYER] Role: Student
[MULTIPLAYER] Joining room... Check logs for connection status
[MULTIPLAYER] Connected to server
[ROOM] 2 other player(s) in room
[ROOM] Prof. Rodríguez joined
```

### Experiencia Multiplayer

#### Visualización de Otros Jugadores

Cada jugador remoto se muestra como:
- **Avatar**: Cápsula con cabeza esférica
- **Nombre**: Etiqueta flotante sobre la cabeza
- **Color dinámico**:
  - **Cyan (#00ffff)**: Está en una lección
  - **Amarillo (#ffff00)**: Cerca de una zona
  - **Magenta (#ff00ff)**: Navegando libremente
- **Slide actual**: Pequeño texto debajo del nombre (si está en lección)
- **Indicador de zona**: Esfera amarilla pequeña (si está mirando una zona)

#### Sincronización Automática

**Posiciones**:
- Actualizaciones cada 50ms (throttled)
- Interpolación suave de movimientos

**Zonas**:
- Cuando te acercas a una zona, otros lo ven
- Tu zona actual se muestra en tu avatar

**Lecciones**:
- Si cargas una lección, otros ven que estás en ella
- El slide actual se muestra sobre tu avatar

**Profesor → Estudiantes**:
- Al hacer `broadcast lesson ai_intro_001`, todos los estudiantes cargan esa lección
- Al navegar slides (`next slide`), todos los estudiantes avanzan automáticamente
- Los estudiantes ven logs: `[TEACHER] Lesson broadcast received`

### Comandos en Multiplayer

```
# Ver quién está en la sala (automático al unirse)
> join room myclass
[ROOM] 3 other player(s) in room
[ROOM] Alice joined
[ROOM] Bob joined

# Transmitir como profesor
> broadcast lesson ai_intro_001
[TEACHER] Broadcasting lesson to all students: Intro to Human–AI Collaboration
[INFO] All students will now see this lesson

# Salir
> leave room
[MULTIPLAYER] Leaving room: myclass
[MULTIPLAYER] Left room
```

### Chat (Infraestructura Lista)

El sistema tiene eventos de chat configurados pero sin UI:
- `socket.on('chat-message')`
- `socketService.sendChatMessage()`

**Próximamente**: Panel de chat en pantalla.

---

## Flujos de Trabajo Comunes

### 📖 Flujo 1: Estudio Individual

**Objetivo**: Explorar una lección por tu cuenta.

```
1. > list lessons
   (Ver lecciones disponibles)

2. > load lesson ai_intro_001
   [LESSON] Loaded: Intro to Human–AI Collaboration

3. > enter construct
   (Entras al entorno 3D)

4. (En 3D) Usa botones del panel para navegar slides
   O vuelve al terminal y usa:
   > next slide
   > next slide

5. > focus on
   (Activa modo concentración)

6. Cuando termines:
   > exit lesson
```

---

### 👥 Flujo 2: Clase Multiplayer (Profesor)

**Objetivo**: Impartir una clase en vivo.

```
1. > start class "Workshop de IA - Sesión 1"
   [CLASS] Started: Workshop de IA - Sesión 1

2. > join room workshop01 "Dr. Smith" teacher
   [MULTIPLAYER] Connecting to room: workshop01
   [MULTIPLAYER] Role: Teacher
   [MULTIPLAYER] Connected to server

3. > enter construct
   (Entras al entorno 3D)
   (Espera a que los estudiantes se unan - verás sus avatares aparecer)

4. > broadcast lesson ai_intro_001
   [TEACHER] Broadcasting lesson to all students
   (Todos los estudiantes ven la lección automáticamente)

5. Navega slides:
   > next slide
   (Los estudiantes avanzan automáticamente)

6. Al finalizar:
   > end class
   > leave room
```

---

### 👨‍🎓 Flujo 3: Clase Multiplayer (Estudiante)

**Objetivo**: Participar en una clase en vivo.

```
1. > join room workshop01 "Alice"
   [MULTIPLAYER] Connecting to room: workshop01
   [ROOM] 1 other player(s) in room
   [ROOM] Dr. Smith joined

2. > enter construct
   (Ves al profesor y otros estudiantes)

3. (Automático) Cuando el profesor transmite:
   [TEACHER] Lesson broadcast received
   (La lección aparece en tu pantalla)

4. (Automático) Los slides se sincronizan con el profesor
   [TEACHER] Slide changed to 2

5. Opcional: Navega por tu cuenta
   > load lesson ai_intro_001
   (Tu color cambia a cyan - otros ven que estás en lección)

6. Al finalizar:
   > leave room
```

---

### 🎯 Flujo 4: Exploración de Zonas

**Objetivo**: Descubrir contenido explorando el mundo.

```
1. > start class "Exploración"
   (Crea zonas automáticamente)

2. > enter construct

3. Usa WASD para moverte

4. Acércate a una zona verde
   (Aparece mensaje: "AI Introduction - Press E to enter")

5. Presiona E
   (Se carga la lección de esa zona)

6. Navega la lección con los botones del panel

7. Opcional: Activa focus
   > focus on

8. Muévete a otra zona y presiona E
```

---

### 🔄 Flujo 5: Sesión Guiada Paso a Paso

**Objetivo**: Seguir una clase estructurada con checklist.

```
1. > start class "Fundamentos de ML"
   [CLASS] Started: Fundamentos de ML
   [CLASS] 6 steps in this session

2. > enter construct
   (HUD visible con paso 1)

3. Lee el paso actual en el HUD:
   "Welcome students to the construct"

4. > next step
   [STEP 2/6] Walk to the AI Introduction zone
   (HUD actualizado)

5. Camina a la zona indicada (coordenadas en pantalla)

6. > next step
   [STEP 3/6] Open the lesson and review slides

7. Presiona E en la zona para abrir lección

8. Continúa con:
   > next step
   (Hasta completar los 6 pasos)

9. > end class
```

---

## Tips y Mejores Prácticas

### 💡 Tips Generales

**1. Usa `help` cuando olvides un comando**
```
> help
```

**2. `clear` cuando el terminal esté saturado**
```
> clear
```

**3. Modo focus para lecciones largas**
```
> focus on
```
Elimina distracciones visuales.

**4. Usa el atajo `E` en lugar de comandos**
Es más rápido que escribir `open zone <id>`.

**5. Lista antes de cargar**
```
> list lessons
> load lesson <id>
```
Evita errores de tipeo.

---

### 👨‍🏫 Tips para Profesores

**1. Prueba la sala antes de la clase**
```
> join room test teacher
> broadcast lesson ai_intro_001
> leave room
```

**2. Usa nombres descriptivos de sala**
```
✅ > join room ai-workshop-2024-nov
❌ > join room room1
```

**3. Anuncia los cambios importantes**
El sistema no tiene chat UI aún, así que coordina por otro medio cuando vayas a cambiar de lección.

**4. Espera a que todos se conecten**
Observa los logs `[ROOM] <nombre> joined` antes de empezar.

**5. Navega slides lentamente**
Los estudiantes se sincronizan automáticamente, pero necesitan tiempo para leer.

---

### 👨‍🎓 Tips para Estudiantes

**1. Únete con tu nombre real**
```
> join room class101 "Juan Pérez"
```
Facilita la colaboración.

**2. No navegues slides si el profesor está transmitiendo**
Tus slides se sincronizarán automáticamente.

**3. Explora zonas cercanas**
Usa WASD para moverte y descubrir contenido.

**4. Observa los colores de avatares**
- Cyan = está en lección
- Amarillo = cerca de zona
- Magenta = navegando

**5. Usa `leave room` al terminar**
No solo cierres la ventana - desconéctate apropiadamente.

---

### 🚀 Tips de Rendimiento

**1. Cierra pestañas innecesarias**
Three.js requiere recursos gráficos.

**2. Usa navegadores modernos**
Chrome, Firefox, Edge (últimas versiones).

**3. Limita participantes en multiplayer**
Recomendado: <20 usuarios por sala.

**4. Reduce throttling si hay lag**
(Requiere modificar código - próxima versión tendrá configuración)

---

### ⌨️ Atajos de Teclado

| Contexto | Atajo | Acción |
|----------|-------|--------|
| 3D | **E** | Activar zona cercana |
| 3D | **WASD** | Movimiento |
| 3D | **Flechas** | Movimiento alternativo |
| Panel Lección | **Click Prev/Next** | Navegar slides |
| Terminal | **Enter** | Ejecutar comando |
| Cualquiera | **Botón Terminal** | Volver a terminal |

---

### 🐛 Solución de Problemas

#### "Command not recognized"
**Causa**: Typo o comando no disponible.

**Solución**:
```
> help
```
Verifica la sintaxis correcta.

#### "No lesson loaded"
**Causa**: Intentaste usar `next slide` sin lección activa.

**Solución**:
```
> load lesson ai_intro_001
```

#### "Zone not found"
**Causa**: El ID de zona no existe.

**Solución**:
```
> list zones
```
Copia el ID exacto.

#### No veo otros jugadores en multiplayer
**Causa posible 1**: No estás en la misma sala.

**Solución**: Verifica el room ID.

**Causa posible 2**: El servidor no está corriendo.

**Solución**: Ejecuta `npm run server` en otra terminal.

#### Los slides no se sincronizan
**Causa**: Conexión perdida.

**Solución**:
```
> leave room
> join room <id> <nombre> teacher
```
Reconecta.

#### El avatar no se mueve
**Causa**: Foco en otro elemento HTML.

**Solución**: Haz click en el canvas 3D.

---

## 📊 Resumen de Funcionalidades

| Feature | Estado | Comando Principal |
|---------|--------|-------------------|
| Terminal | ✅ | `help` |
| Entorno 3D | ✅ | `enter construct` |
| Lecciones | ✅ | `load lesson <id>` |
| Zonas | ✅ | `open zone <id>` o `E` |
| Clases | ✅ | `start class "<título>"` |
| Multiplayer | ✅ | `join room <id>` |
| Profesor Broadcast | ✅ | `broadcast lesson <id>` |
| Chat | 🚧 | (Próximamente) |
| Videos | 🚧 | (Próximamente) |
| Ejercicios | 🚧 | (Próximamente) |

---

## 🎓 Casos de Uso Reales

### Universidad Virtual

**Escenario**: Clase de IA con 15 estudiantes.

1. Profesor crea sala: `join room ia-clase-03 "Prof. López" teacher`
2. Estudiantes se unen: `join room ia-clase-03 "Estudiante X"`
3. Profesor inicia clase: `start class "Introducción a Redes Neuronales"`
4. Profesor transmite: `broadcast lesson ai_intro_001`
5. Profesor navega slides: `next slide` (x6)
6. Estudiantes exploran zonas: WASD + E
7. Profesor finaliza: `end class`, `leave room`

### Workshop Corporativo

**Escenario**: Training interno de empresa.

1. Facilitador: `join room onboarding-2024 "HR Team" teacher`
2. Nuevos empleados: `join room onboarding-2024 "Nombre"`
3. Tour guiado por zonas pre-configuradas
4. Cada empleado avanza a su ritmo
5. Sincronización opcional con `broadcast lesson`

### Estudio Autodirigido

**Escenario**: Aprendizaje individual.

1. `load lesson ai_intro_001`
2. `enter construct`
3. `focus on`
4. Navegación a tu propio ritmo
5. Exploración de zonas adicionales

---

## 📞 Soporte

Para reportar bugs o sugerir features:
- GitHub Issues: `https://github.com/artquitech/cocolor/issues`
- Documentación técnica: Ver `README.md`

---

**Versión del Documento**: 1.0
**Última Actualización**: 2025-11-19
**Sistema**: Teaching Construct v2.1.0 (Phase 6 Complete)
