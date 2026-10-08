# Arquitectura de Chileno AI Studio

## Principio
El modelo de IA no edita directamente un MP4. El agente actúa como director y devuelve una timeline estructurada.

Entrada:
- briefing
- narración
- inventario de assets
- preferencias de estilo

Salida:
- clips
- imágenes
- música
- volumen
- cortes
- transiciones
- duración
- captions
- notas de render

Ejemplo conceptual:

    {
      "segments": [
        {"type":"VIDEO","asset":"ai-01.mp4","start":0,"duration":4},
        {"type":"IMAGE","asset":"jev-ui.png","start":4,"duration":3},
        {"type":"MUSIC","asset":"tech.mp3","start":0,"duration":120,"volume":0.12}
      ]
    }

## Seguridad
Nunca enviar una API key secreta desde el navegador. La web de GitHub Pages debe hablar con un endpoint propio que mantenga las credenciales en el servidor.

## Mobile-first
La interfaz debe seguir funcionando con Safari en iPad y Chrome en Android. El render pesado se incorporará después y podrá ejecutarse localmente cuando sea viable o delegarse a infraestructura serverless.