# Chinchon - Anotador de Puntos

Anotador de puntos para el juego de cartas [Chinchon](https://es.wikipedia.org/wiki/Chinch%C3%B3n_(juego_de_naipes)), optimizado para usar desde el celular durante la partida.

## Funcionalidades

- **2 a 8 jugadores** con nombres personalizados
- **Limite de puntos configurable** (50, 70, 100 o 150)
- **Tabla de puntajes** con colores segun el estado de cada jugador
- **Barras de progreso** visuales hacia el limite de eliminacion
- **Repartidor rotativo** con indicador en cada ronda
- **Botones rapidos** para anotar puntajes frecuentes
- **Editar y eliminar** rondas anteriores
- **Deshacer** la ultima ronda
- **Deteccion automatica** de jugadores eliminados y ganador
- **Ranking final** al terminar la partida
- **Historial** de partidas anteriores
- **Funciona offline** (PWA instalable)
- **Datos guardados** en el navegador (localStorage)

## Tech Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) + [Bun](https://bun.sh)
- [Tailwind CSS](https://tailwindcss.com) v4
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (Workbox)

## Desarrollo

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Build de produccion
bun run build

# Preview del build
bun run preview
```

## Licencia

MIT
