# million-frontend
Bienvenido al README de Million Frontend! Este es un proyecto web construido con React.js, Next.js y React-Bootstrap, diseñado para ofrecer la visualización de propiedades inmobiliarias almacenados en MongoDB y expuestas por un API construida en .NET con c# (https://github.com/cristianmarind/million-backend). Construido sobre una arquitectura hexagonal y buenas prácticas de desarrollo. Documentación opcional generada con IA: https://deepwiki.com/cristianmarind/million-frontend

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Comandos de interés](#comandos-de-interes)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Pruebas](#pruebas)
- [Licencia](#licencia)

## Requisitos

- **[Node.js](https://nodejs.org)**: Versión 18.18.0 o superior (recomendado: última versión LTS, como 20.x o 22.x). Verifica con `node -v`.
- **[Git](https://git-scm.com/)**: Para clonar el repositorio del proyecto.
- **Gestor de paquetes**: npm (incluido con Node.js), Yarn, pnpm o bun. Recomendado: npm 10+.
- **Sistema operativo**: macOS, Windows (incluyendo WSL) o Linux.
- **Memoria**: Mínimo 4 GB de RAM recomendados para desarrollo.

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/cristianmarind/million-frontend
```

2. Navega al directorio del proyecto:
```bash
cd million-frontend
```

3. Instala las dependencias:
```bash
npm i
```

4. Las variables de entorno ya están disponibles en el archivo `.env` con la conexión a al API .NET, 
una mejora importante que se puede dar es añadir una capa de seguridad, en el API manejando token asimetrico, 
por esto se deja la variable APP_TOKEN para marcar la intension. Nota: no se debe publicar .env de hacer en entornos productivos.

## Ejecución del Proyecto

1. Inicia el proyecto
```bash
npm start
```

2. Inicia el proyecto para continuar el desarrollo
```bash
npm run dev
```

3. Buildeo del proyecto
```bash
npm run build
```

## Comandos de interés

1. Sincronizar los DTOs del backend .NET C#
```bash
npx openapi-typescript http://localhost:5119/swagger/v1/swagger.json --output app/src/core/infraestructure/dtos/internalApiTypes.ts
```
2. Remove Next.js Cache
```bash
Remove-Item -Recurse -Force .next
```

## Páginas y Servicios del Proyecto

### **Páginas Principales:**

1. **Página de Inicio (`/`)**
   - Página principal con componente UnderConstruction
   - Punto de entrada de la aplicación

2. **Página de Propiedades (`/properties`)**
   - **Diseño UI/UX**: Concebida como un lobby de búsqueda donde las consultas se aplican a todas las categorías simultáneamente
   - Listado principal de propiedades con filtros y categorías organizadas por tipo
   - **Categoría "Propiedades Cercanas"**: Sección especial que muestra propiedades cercanas a la ubicación del usuario
   - **Concurrencia con Bluebird**: Manejo de múltiples categorías con carga paralela para optimizar el rendimiento
   - Implementa revalidate de 3600 segundos (1 hora) para optimización de caché
   - Error boundaries y manejo robusto de errores

3. **Página de Detalle de Propiedad (`/property/[ownerId]/[propertyId]`)**
   - Vista detallada de propiedades individuales
   - Implementa revalidate de 86400 segundos (24 horas) para optimización de caché
   - Carga datos del propietario y propiedad en paralelo
   - Manejo de errores con redirección a 404 cuando no se encuentra la propiedad

4. **Página "Quiénes Somos" (`/who-we-are`)**
   - Información corporativa de la empresa

5. **Página de Contacto (`/contact-us`)**
   - Formulario y información de contacto

### **API Routes:**

1. **API de Propiedades Cercanas (`/api/properties/nearby`)**
   - Endpoint GET que obtiene propiedades cercanas basadas en coordenadas geográficas
   - Detección automática de ubicación por IP en desarrollo
   - Marca propiedades como `isNear: true` para diferenciación visual
   - Manejo de errores con respuestas HTTP apropiadas

### **Optimizaciones de Rendimiento:**

- **Revalidate**: Implementado en páginas críticas para cachear datos del servidor
  - Propiedades: 1 hora de caché
  - Detalles de propiedad: 24 horas de caché
- **Server Components**: Uso de componentes del servidor para mejor rendimiento
- **Lazy Loading**: Carga diferida de componentes pesados
- **React Window**: Implementación de virtualización para mejorar el rendimiento en listas grandes de propiedades
- **Error Boundaries**: Captura y manejo de errores de renderizado

## Arquitectura del Sistema

Se emplea arquitectura hexagonal con la intención de establecer una base sólida para el proyecto frontend, los componentes principales son:

### **Estructura de Capas:**

- **Domain Layer (`app/src/core/domain/`)**: Contiene las entidades de negocio (Property, Owner) y reglas de dominio
- **Application Layer (`app/src/core/application/`)**: Contiene los casos de uso y servicios de aplicación (GetProperties, GetOwners)
- **Infrastructure Layer (`app/src/core/infraestructure/`)**: Contiene la implementación de repositorios, clientes HTTP y controladores

### **Patrones Implementados:**

- **Repository Pattern**: Abstrae el acceso a datos, otorgando atributos de calidad como: Mantenibilidad, Portabilidad, Testabilidad y Flexibilidad
- **Error Boundaries**: Manejo robusto de errores en React con componentes ErrorBoundary para capturar errores de renderizado
- **Custom Error Classes**: Implementación de clases de error personalizadas (ApiError, NetworkError, ValidationError) para manejo granular de errores
- **Loading States**: Estados de carga consistentes con componentes LoadingSpinner reutilizables
- **Responsive Design**: Implementación de sliders responsivos con detección automática de ancho de ventana

### **Tecnologías y Herramientas:**

- **Next.js 15**: Framework React con App Router, Server Components y optimizaciones de rendimiento
- **React 19**: Biblioteca de UI con hooks modernos y concurrent features
- **TypeScript**: Tipado estático para mayor robustez y mantenibilidad
- **Bootstrap 5**: Framework CSS para diseño responsive
- **React Slick**: Slider responsivo con configuración dinámica
- **React Window**: Virtualización para optimización de listas grandes
- **Axios**: Cliente HTTP con interceptores para manejo de errores
- **Jest & React Testing Library**: Suite de pruebas unitarias con cobertura del 70%

### **Características de Calidad:**

- **Error Handling**: Manejo robusto de errores con clases personalizadas y Error Boundaries
- **Loading States**: Estados de carga consistentes en toda la aplicación
- **Responsive Design**: Adaptación automática a diferentes tamaños de pantalla
- **Type Safety**: Tipado completo con TypeScript
- **Testing**: Cobertura de pruebas unitarias para componentes críticos
- **Performance**: Lazy loading, optimización de imágenes y caching


## Pruebas

1. Instalar dependencias (maneja compatibilidad React 19)
```bash
npm run setup-tests
```
2. Ejecutar todas las pruebas
```bash
npm test
```


## Licencia

Este proyecto está licenciado bajo una variante de la MIT License.