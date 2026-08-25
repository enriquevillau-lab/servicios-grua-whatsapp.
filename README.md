# Servicios Grúa - WhatsApp

Aplicación para Android móvil, tablet y navegador para registrar servicios de asistencia y enviarlos por WhatsApp de forma seria, ordenada, en mayúsculas y sin emojis.

## Qué incluye

- Datos generales: CIA, EXP., CLIENTE y TELÉFONO.
- Botón **+ AÑADIR VHC** para añadir tantos vehículos como haga falta.
- Para cada VHC: VHC, MMA, CARGADO SI/NO, MATRÍCULA, AVERÍA, ORIGEN, DESTINO y BASE.
- SOLICITA y AUTORIZADO aparecen una sola vez para todo el servicio.
- Vista previa antes del envío.
- Envío directo a WhatsApp.
- Historial guardado en el dispositivo.
- Diseño adaptable a móvil y tablet.
- PWA instalable desde el navegador.
- Preparada para convertirla en APK/AAB con Capacitor.
- GitHub Pages incluido mediante GitHub Actions.

## Subirla a GitHub

1. En GitHub crea un repositorio nuevo, por ejemplo `servicios-grua-whatsapp`.
2. Sube todos los archivos de esta carpeta al repositorio.
3. En GitHub entra en **Settings > Pages**.
4. En **Build and deployment > Source** selecciona **GitHub Actions**.
5. Al hacer `push` a `main`, GitHub construirá y publicará la app.

## Probar en el ordenador

```bash
npm install
npm run dev
```

## Generar versión de producción

```bash
npm install
npm run build
```

## Convertir a Android con Capacitor

Después de instalar dependencias:

```bash
npm run build
npm run cap:android
npm run cap:sync
npm run cap:open
```

Esto abre el proyecto Android en Android Studio, desde donde se puede generar APK o AAB.

## Formato enviado por WhatsApp

El mensaje usa negrita de WhatsApp en los títulos, texto en mayúsculas y bloques separados por vehículo. No usa emojis.

Ejemplo:

```text
CIA: ALLIANZ
EXP.: 2024/112233
CLIENTE: TRANSPORTES GARCÍA
TELÉFONO: 600 123 456

VHC 1: TRACTORA
MMA: 18.000 KG
CARGADO: SI
MATRÍCULA: 2387 HGF
AVERÍA: NO ARRANCA
ORIGEN: SEVILLA
DESTINO: TALLER RENAULT
BASE: SEVILLA

VHC 2: REMOLQUE
MMA: 24.000 KG
CARGADO: NO
MATRÍCULA: R7638 BLP
AVERÍA: BLOQUEADO
ORIGEN: SEVILLA
DESTINO: LUGAR SEGURO
BASE: SEVILLA

SOLICITA: PEDRO LÓPEZ
AUTORIZADO: ANA MARTÍNEZ
```
