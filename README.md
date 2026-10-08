# Chileno AI Studio

Editor de vídeo asistido por IA, pensado para funcionar desde navegador en iPad/Android y desplegarse en GitHub Pages.

## V1 actual
- Interfaz móvil/desktop.
- Biblioteca local de assets.
- Agente de edición en modo demo.
- Generación de una timeline JSON.
- Descarga del plan de edición.
- Preparado para conectar un agente OpenRouter.
- Sin claves API incrustadas en el frontend.

## Arquitectura prevista
GitHub Pages (frontend) → backend/serverless seguro → OpenRouter → agente director → timeline JSON → motor de render.

El frontend estático no debe contener secretos. GitHub Actions Secrets pueden servir para procesos de build/deploy o para un backend/serverless asociado, pero una clave usada directamente por JavaScript del navegador queda expuesta al usuario. Para llamadas runtime a OpenRouter se recomienda un proxy/backend serverless.

## Próximas fases
1. OpenRouter Editor Agent.
2. Asset Finder para capturas de webs y fuentes reutilizables.
3. Generación de imágenes mediante proveedor/modelo configurable.
4. Selección automática de música/SFX desde una biblioteca del usuario.
5. Render con FFmpeg/WebCodecs.
6. Revisión visual automática.
7. Exportación 16:9 y 9:16.

## Secrets previstos
No crear ni copiar valores reales en el repositorio. Nombres previstos:
- OPENROUTER_API_KEY
- IMAGE_API_KEY
- ELEVENLABS_API_KEY (opcional)
- ASSET_SEARCH_API_KEY (opcional)

Si se usa GitHub Pages puro, estos secrets no están disponibles para JavaScript en tiempo de ejecución. Para eso habrá que añadir un backend/proxy seguro.

## Licencia
MIT.