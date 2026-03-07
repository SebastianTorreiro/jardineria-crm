# UI Guidelines - CRM Jardinería

Este documento establece las reglas fundamentales de diseño de la interfaz, definiendo una estética limpia, moderna y profesional (estilo "SaaS" como Shadcn UI o Vercel). 

## 1. Paleta de Colores Semántica

El proyecto utiliza **Tailwind CSS v4** con una configuración *CSS-first* dentro de `src/app/globals.css`. Queda **estrictamente prohibido** utilizar colores arbitrarios (como `bg-blue-500` o `text-gray-400`); en su lugar, siempre se deben usar las utilidades semánticas:

| Token | Propósito | Valor de Referencia | Utils Comunes |
|---|---|---|---|
| **Background** | Fondo principal de la aplicación (crea contraste de profundidad). | `slate-50` (#f8fafc) | `bg-background` |
| **Foreground** | Color de texto principal en fondos claros. | `emerald-950` (#022c22) | `text-foreground` |
| **Card** | Fondo para tarjetas y superficies elevadas (limpio, contrasta con el background). | `white` (#ffffff) | `bg-card` |
| **Card Foreground** | Texto dentro de tarjetas. | `emerald-950` (#022c22) | `text-card-foreground` |
| **Primary** | Color principal de la marca, acciones importantes y botones primarios. | `emerald-600` (#059669) | `bg-primary text-primary-foreground` |
| **Secondary** | Color de fondo sutil para acciones secundarias o estados *hover* suaves. | `emerald-50` (#ecfdf5) | `bg-secondary text-secondary-foreground`|
| **Accent** | Detalles, estados activos, badges neutrales o fondos en focus. | `slate-100` (#f1f5f9) | `bg-accent text-accent-foreground` |
| **Border** | Líneas de división sutiles, bordes de inputs y cards. | `slate-200` (#e2e8f0) | `border-border` |
| **Ring** | Color del anillo de *focus* por accesibilidad. | `emerald-600` (#059669) | `ring-ring` |

## 2. Consistencia de Layout y "Cards"

Todas las superficies tipo "Card" (tarjetas de clientes, visitas, finanzas, formularios en recuadros) deben adherirse a la siguiente estructura visual para estandarizar el diseño:

- **Background:** `bg-card`
- **Border:** `border border-border`
- **Shadow:** `shadow-sm` (mantener las sombras sutiles, sin exagerar).
- **Radius:** `rounded-xl` (o la variable CSS `--radius-xl`).
- **Estados Interactivos (opcional):** Si la tarjeta es clickeable, agregar `transition-all hover:shadow-md`.

*Regla: No generar "islas" desconectadas de estilos. Todas las tarjetas lucirán iguales.*

## 3. Jerarquía Visual y Profundidad

- El `<body>` de la aplicación tendrá `bg-background` (slate-50), lo que es apenas grisáceo/frio.
- Las `Cards` o contenedores principales tendrán `bg-card` (blanco puro).
- Esto permite al usuario diferenciar visualmente el contenido flotante frente a la superficie estructural sin necesidad de bordes pesados o sombras oscuras.

## 4. Formularios e Inputs (Modernización)

- Los inputs (componente `FormField`) abandonan los contornos que los hacen lucir anticuados o desconectados.
- **Estado por defecto:** `bg-background` (o blanco), `border border-border`, `shadow-sm`, `rounded-md`.
- **Estado *Focus* (Ring Design):** Al hacer uso o click, utilizar: `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background`.
- **Mensajes de error:** Usarán un borde de estado destructivo y texto acorde (rojo/rose sutil).

## 5. Floating Action Button (FAB)

- Se remueven atributos como `bgColor` de manera expuesta en props.
- El FAB existirá como un componente monolítico y su color debe ser estrictamente `bg-primary text-primary-foreground`.
- Tareas: Cualquier referencia en las páginas que pase `bgColor="blue-600"` será limpiada.

---

> El motor CSS leerá esto dinámicamente desde el `@theme` en Tailwind v4. Al implementar características futuras, básate exclusivamente en las utilidades de colores definidas aquí (`primary`, `border`, `card`, `muted` etc.) y abandona las clases estáticas directas de Tailwind.
