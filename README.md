# Confluencia

Sitio de **Confluencia Ambientalista Dominicana**, preparado para **confluencia.do**.

## Flujo de publicación

El código se mantiene en GitHub. Cloudflare Pages se conecta directamente al repositorio y publica los cambios enviados a la rama de producción `main`. Otras ramas pueden generar vistas previas antes de integrar sus cambios.

La página actual es HTML, CSS y JavaScript estático. La integración nativa de Pages realiza el despliegue automático. No hace falta un Worker intermedio ni un workflow de GitHub Actions para este flujo.

## Archivos

| Ruta | Función |
|---|---|
| `dist/index.html` | Página y contenido |
| `dist/styles.css` | Diseño y adaptación a móviles |
| `dist/app.js` | Navegación, búsqueda, filtros y fichas descargables |
| `dist/assets/` | Imagen, iconos, tipografías y licencias |
| `dist/recursos/guia-mineria.txt` | Guía descargable |
| `dist/_redirects` | Redirecciones de rutas de Pages |
| `dist/_headers` | Cabeceras para recursos estáticos |
| `dist/robots.txt` y `dist/sitemap.xml` | Metadatos del dominio público |
| `wrangler.jsonc` | Nombre del proyecto Pages y directorio público |

`dist/` contiene el sitio completo y se versiona en Git. No existe un paso de compilación que lo regenere. La configuración se preparó para un proyecto Pages nuevo llamado `confluencia`; si se elige otro nombre en Cloudflare, actualizar también `name` en `wrangler.jsonc`.

## Repositorio de GitHub

Repositorio: [jbrenes76/confluencia.do](https://github.com/jbrenes76/confluencia.do).

Rama de producción: `main`.

Para trabajar en una copia local:

```bash
git clone https://github.com/jbrenes76/confluencia.do.git
cd confluencia.do
```

El repositorio se llama `confluencia.do`; el proyecto de Cloudflare Pages puede llamarse `confluencia`, como declara `wrangler.jsonc`. Los dos nombres tienen funciones distintas.

## Conectar Cloudflare Pages

En el panel de Cloudflare:

1. Abrir **Workers & Pages**.
2. Elegir **Create application → Pages → Connect to Git** o **Import an existing Git repository**, según la presentación del panel.
3. Conectar GitHub y autorizar la app **Cloudflare Workers & Pages** para el repositorio `confluencia.do`.
4. Seleccionar el repositorio y configurar:

| Ajuste | Valor |
|---|---|
| Project name | `confluencia` |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | Dejar vacío, para usar la raíz del repositorio |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Environment variables | Ninguna para esta página |

5. Elegir **Save and Deploy**.
6. Verificar el primer despliegue en la URL `pages.dev` que entregue Cloudflare.

La app de GitHub se llama “Cloudflare Workers & Pages”; ese nombre no implica que deba crearse un Worker. `wrangler.jsonc` utiliza `pages_build_output_dir`, el campo de configuración de Pages. No incluye una entrada `main` de Worker ni lógica de servidor.

Este flujo utiliza la integración Git desde el comienzo. No crear el proyecto con Direct Upload para después intentar convertirlo: Cloudflare no permite convertir ese tipo de proyecto a integración Git.

## Conectar confluencia.do

1. En el proyecto Pages, abrir **Custom domains → Set up a domain**.
2. Añadir **confluencia.do**.
3. El dominio raíz debe ser una zona en la misma cuenta de Cloudflare que aloje el proyecto Pages y utilizar los nameservers que Cloudflare indique.
4. Antes de cambiar nameservers, conservar los registros existentes que se necesiten, especialmente los del correo.
5. Completar la asociación del dominio desde Pages y comprobar que dominio y certificado aparezcan activos.

No crear únicamente un CNAME sin asociar el dominio en Pages. Esta entrega no ha modificado DNS ni conectado el dominio.

## Trabajo habitual

Para un cambio que deba publicarse directamente:

```bash
git add .
git commit -m "Actualizar contenidos de Confluencia"
git push origin main
```

Cloudflare detectará el cambio, desplegará el contenido de `dist/` y actualizará la web cuando el despliegue finalice correctamente.

Para revisar un cambio antes de publicarlo, crear una rama, subir los cambios y abrir un pull request. Pages puede generar una vista previa para esa rama. La web de producción cambia al integrar la propuesta en `main`. Los pull requests de forks no tienen las mismas vistas previas automáticas. Las vistas previas de Pages son públicas por defecto; su acceso puede configurarse con Cloudflare Access si se necesita.

## Minería y crecimiento

La sección inicial es `https://confluencia.do/#mineria`. `dist/_redirects` dirige `/mineria` y `/mineria/` temporalmente a esa sección. Cuando exista una página minera propia, retirar esas reglas.

`mineria.confluencia.do` puede configurarse como un acceso alternativo mediante una regla de redirección por hostname en Cloudflare. No se ha creado ese subdominio. Las reglas por hostname no corresponden al archivo `_redirects` de Pages.

## Formularios y contenido

La ficha de aporte se genera y descarga en el navegador. La página no envía ni recibe aportes ni incluye un backend. Si se incorpora recepción de formularios, se puede evaluar Pages Functions o un servicio apropiado y actualizar la privacidad según su funcionamiento real.

La información de GoldQuest está identificada como empresarial. El expediente de Romero se presenta en preparación, sin afirmar su situación jurídica o ambiental actual.

## Créditos

Fotografía: Starus, río Yaque del Norte cerca de Jarabacoa, CC BY-SA 3.0. Tipografías DM Sans y DM Serif Display: SIL Open Font License. Los créditos y las licencias acompañan los recursos en `dist/assets/`.

## Documentación oficial consultada

- [Pages: integración Git](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Pages: HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Pages: integración con GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Pages: vistas previas](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Pages: configuración de Wrangler](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [Pages: dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Pages: Direct Upload y límites de conversión](https://developers.cloudflare.com/pages/get-started/direct-upload/)

Preparado el 22 de noviembre de 2026.
