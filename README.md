# La NutriHucha · app instalable

Este repositorio publica con GitHub Pages el **cargador** de La NutriHucha: la pantalla de clave, el service worker, el manifiesto y los iconos.

- La app va en `app.json`, **cifrada** con AES-256-GCM. La llave solo la entrega la API a quien tiene una clave personal válida.
- Aquí no hay datos ni claves.
- El código fuente está en un repositorio privado. Lo de este repositorio se genera con `tools/build.js` y no se edita a mano.
