# K.A.T.E.
# *Kubernetes Administration Technology Environement* 
### [Backend / Frontend]

### Proyecto Final del grado DAW (*Desarrollo de Aplicaciones Web*) por **Alejandro Navarro García**

## Índice

- [Introducción](#introducción)
  - [Descripción del proyecto](#descripción-del-proyecto)
  - [Justificación](#justificación)
  - [Objetivos](#objetivos)
  - [Motivación](#motivación)
- [Funcionalidades del proyecto](#funcionalidades-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
    - [Tecnologías clave](#tecnologías-clave-fabrik8--threejs)
    - [Frontend](#frontend-react--tailwindcss)
    - [Backend](#backend-spring-boot)
    - [Herramientas Auxiliares](#herramientas-auxiliares)
- [Guía de instalación](#guía-de-instalación)
    - [FrontEnd](#frontend)
    - [BackEnd](#backend)
- [Guía de uso](#guía-de-uso)
  - [Acceso a la aplicación](#acceso-a-la-aplicación)
  - [Requisitos para su uso](#requisitos-para-su-uso)
  - [Flujo principal de uso](#flujo-principal-de-uso)
- [Enlace a la documentación](#enlace-a-la-documentación) 
- [Figma](#figma)
- [Conclusión](#conclusión)
  - [Backlog](#backlog)
- [Contribuciones, agradecimientos y referencias](#contribuciones-agradecimientos-y-referencias)
- [Licencias](#licencias)
- [Contacto](#contacto)



## Introducción
### Descripción del proyecto

Kubernetes Administration Technology Environement (a partir de ahora referenciado como KATE), es un proyecto ambicioso que parte del inconformismo con los modelos tecnológicos actuales. 
KATE es un principalmente visualizador de los pods de tu Kubernetes, y un entorno de control y gestión del mismo. Se trata de una aplicación que a primera vista te de los resultados y la información de las operaciones y gestiones que se están dando en tu KS. Además se implementa cierta funcionalidad para controlar elementos del mismo, como *apagar* deployments y gestionar las réplicas. 

### Justificación
Es un intento de pensar fuera de los esquemas tradicionales de aplicación web. Si bien no considero que la idea sea revolucionaria, en el momento de su concepción fue un intento de fusión de elementos antitéticos. 

Por un lado tenemos la gestión de deployments y kubernetes: un trabajo complejo y poco atractivo a la vista, pero con un potencial y una capacidad puntera. 
Por otro lado tenemos las nuevas formas de desarrollar páginas web. Ya no queremos páginas estáticas y formularios planos, cada día se busca más la sorpresa y la extra dimensionalidad dentro de las páginas. 

El punto de partida del proyecto es coger algo que, tecnológicamente es puntero, pero que visualmente nunca he visto atractivo, e incluso, se conocen casos de gente que de primeras no podrían trabajar así porque principalmente te peleas contra una pantalla negra. Y fusionarlo con la mayor forma estridente y visualmente atractiva que pudiera imaginar, algo casi *Videojugable*, una aplicación que de primeras podría parecer esas aplicaciones falsas que salen en las películas, pero que yo le dé una funcionalidad al nivel de la pantalla negra. 
### Objetivos
El objetivo principal de este proyecto es la investigación de tecnologías nuevas. Es suplir el ansia de conocimiento a través del descubrimiento. Durante los dos años del grado se presentó *Kubernetes* como una tecnología necesaria y atractiva de aprender, pero en ningún momento se dió la oportunidad de aprender a trabajar con ella. Este año que hemos trabajado más con los despliegues se ha vuelto más interesante ese mundo, y no podía dejar el grado sin acercarme a conocerlo. 

Después de investigar un poco llegué a la conclusión de que era una tecnología muy grande y de un trabajo mucho mayor de lo que tenía planteado hacer. Entonces descubrí que se podían controlar y gestionar ciertos elementos de un Clúster de Kubernetes con la API *Fabrik8* e implementarla en *SpringBoot* para crear un pequeño servicio de control. Aquí nace la idea de probar a visualizar y gestionar un poco PODS que haya en un Cluster.

Pero mi mayor preocupación es que los visualizadores y controladores de estos elementos nunca son accesibles a cualquier usuario ni son atractivos visualmente. Normalmente son o la anteriormente mencionada pantalla negra o una serie de tablas gráficos números y combinaciones de símbolos y letras que pueden marear al usuario no entrenado. 

Es por ello que decidí que mi OBJETIVO principal fuera crear una aplicación que sirviera tanto para visualizar y controlar elementos de un clúster como que fuera accesible y visualmente atractiva e interesante.

### Motivación

Mi mayor motivación parte del objetivo que me planteé: 

**¿Cómo hago que gestionar un Clúster de Kubernetes (que a primera vista parece lo más feo y aburrido del mundo) sea atractivo y divertido?**

Pues la respuesta y lo que me mantuvo motivado durante todo el proceso fue: investigar, investigar e investigar. Descubrir y probar. Fallar y reintentarlo. Buscar el mayor de los retos y juntar todos los elementos que siempre he querido probar. 

Además quería aprovechar la posibilidad de hacer un trabajo visualmente atractivo para investigar y desarrollar un estilo similar al *Frutiger Aero*. Una estética olvidada de principio de siglo que marcó mi infancia visualmente, y a la que me remonto siempre que busco inspiración en el diseño web. 




## Funcionalidades del proyecto
 - Visualizar los pods de un clúster de manera rápida y accesible. Se renderizan un número de esferas en círculo iguales al número de Pods del Clúster. Su color además indica si está o no funcionando ese pod. 
    - Esto se consigue introduciendo en el login la URL del despliegue de tu KS y un token que se ha de pedir desde la propia máquina al Kubernete que de acceso a la consulta y gestión de datos de tu perfil.
 - Consultar información sobre los Pods: 
    - Nombre del Pod
    - Namespace
    - DateTime a la que comenzó
    - El estado del pod, que puede ser *Running*, *Failure* o *Pending*. Esto también se puede ver por el color de la esfera de cada POD. 
    - Una lista de los Contenedores que tiene el pod y el estado de los mismos, si están *Redy* o no. 
 - Visualizar los Deployment del clúster en una lista con el número de réplicas y el namespace al que pertenecen.
    - Apagar (*reducir a 0 las réplicas del deployment*) cada uno de ellos y observar cómo los pods desaparecen.
    - Reiniciar y aplicar un número de réplicas deseado a cada deployment y observar como los pods de los mismos se generan en el círculo principal. 



## Tecnologías utilizadas

Este proyecto se apoya en un stack tecnológico moderno, visualmente potente y se ha intentado consolidar tecnológicamente lo aprendido durante el curso. 

### Tecnologías clave (Fabrik8 + Three.js)

- **[Fabric8 Kubernetes Client](https://github.com/fabric8io/kubernetes-client)**  
  Librería Java que permite interactuar de forma dinámica con un clúster de Kubernetes desde el backend.  
  Ha sido una de las tecnologías centrales del proyecto, ya que permite **visualizar, gestionar y controlar elementos del clúster (como Pods y Deployments)** directamente desde una API Java.  
  Es gracias a esta integración que se hace posible la propuesta principal de KATE: ofrecer un entorno visual y accesible para administrar Kubernetes sin usar terminales ni interfaces tradicionales.

- **[Three.js](https://threejs.org/manual/#en/creating-a-scene)**  
  **Motor gráfico 3D basado en WebGL**. Es la pieza central del enfoque visual del proyecto: gracias a Three.js y su integración con React, el frontend adquiere una dimensión gráfica dinámica, interactiva y fuera de lo convencional.

    - **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)**  
    Renderizador de React para Three.js. Permite construir escenas 3D de forma declarativa y reutilizable usando componentes.

    - **[@react-three/drei](https://docs.pmnd.rs/drei/)**  
    Conjunto de utilidades que extienden Three.js con componentes listos para usar (cámaras, luces, controles...).


### Frontend (React + TailwindCSS)

- **[React 19](https://react.dev/)**  
  Biblioteca principal para la construcción de interfaces.

- **[Vite 6](https://vitejs.dev/)**  
  Bundler ideal para proyectos modernos con tiempos de carga mínimos en desarrollo.

- **[Tailwind CSS 4](https://tailwindcss.com/docs/installation)**   
  Framework CSS utility-first utilizado durante el curso y que revoluciona (a mi parecer) la aplicación de CSS en el diseño. 

- **[GSAP](https://gsap.com/)**  
  Librería de animaciones que añade transiciones suaves en componentes y elementos gráficos, principalmente util para trabajar en un entorno 3D. Interesante para mayor investigación. 

- **[React Router DOM 7](https://reactrouter.com/en/main/start/tutorial)**    
  Enrutamiento para SPA, para navegación fluida entre vistas.

- **[Lucide React](https://lucide.dev/)**  
  Conjunto de iconos SVG elegantes y configurables.



### Backend (Spring Boot)

- **[Spring Boot 3.4](https://spring.io/projects/spring-boot)**  
  Framework base del backend, utilizado durante el curso y de mis tecnologías favoritas, implementando un desarrollo MVC. 

- **[Spring Web](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)**   
  Módulo para desarrollo de APIs REST con facilidad y control total.

- **[Maven](https://maven.apache.org/)**  
  Sistema de construcción y gestión de dependencias.

- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)**  
  Abstracción de acceso a datos relacionales usando JPA/Hibernate.

- **[Springdoc OpenAPI + Swagger UI](https://springdoc.org/)**  
  Generación automática de documentación para las APIs REST.

- **[Lombok](https://projectlombok.org/)**  
  Reducción de código repetitivo en Java (getters, setters, builders...).

- **[Jakarta Validation](https://jakarta.ee/specifications/bean-validation/)**  
  Validación declarativa de datos con anotaciones.




#### Herramientas auxiliares

- **[Figma](https://help.figma.com/hc/en-us)**   
  Utilizado para la creación de prototipos, interfaces 2D y elementos visuales utilizados posteriormente en el desarrollo.





## Guía de instalación

### [FRONTEND](https://github.com/AleNaGa/kate-visualizer-front)
#### Requisitos previos

- Node.js (versión 18 o superior)
- npm
- Git

#### Instalación y uso:

- Descargar del Repo e Instalar:

    ```bash
    git clone ttps://github.com/AleNaGa/kate-visualizer-front.git

    cd kate-visualizer-front

    npm install
    ```
- Desarrollo en local: 

    ```bash 
    npm run dev
    ```

- Accede a http://localhost:5173 en local

- Build para producción: 

    ```bash
    npm run build
    ```

- La versión optimizada la encontrarás en la carpeta *dist/*


### [BACKEND](https://github.com/AleNaGa/kate-controller-api)

#### Requisitos previos

- Java 21
- Maven
- Git

#### Instalación

- Descargar del Repo e Instalar:

    ```bash
    git clone https://github.com/AleNaGa/kate-controller-api.git
    cd kate-controller-api
    mvn clean install
    ```
- Ejecutar en local: 

    ```bash
    mvn spring-boot:run
    ```
- La aplicación estará disponible en http://localhost:8080 + los endpoints a los que quieras acceder. Recomendable uso de Postman o ThunderClient. 

- Build para producción: 
    ```bash
    mvn clean package
    ```



## Guía de uso

### Acceso a la aplicación

Una vez desplegada, accede al frontend desde [http://localhost:5173](http://localhost:5173) y asegúrate de que el backend está corriendo en [http://localhost:8080](http://localhost:8080).

### Requisitos para su uso: 
- Tener acceso a un Clúster de kubernetes desplegado en una IP Pública.
- Tener un perfil con acceso de administración a tu clúster. 
- Generar un token de acceso para ese perfil al clúster.

 **Si no se dispone de estos requisitos adjunto una guía para crear un perfil con estos accesos, pedir la url del clúster y pedir un token:**


- Certificar que está runneando el kubernetes, normalmente con: 

```Bash
kubectl get nodes
```
- Devuelve los nodos y sus estados

- Crear un ServiceAccount con permisos de administrador(lo hemos llamado my-api-user): 
```Bash
kubectl create serviceaccount my-api-user -n kube-system
```

- Asignarle rol de cluster-admin:
```Bash
kubectl create clusterrolebinding my-api-user-binding --clusterrole=cluster-admin --serviceaccount=kube-system:my-api-user
```
- Debe devolver algo así: 
    *clusterrolebinding.rbac.authorization.k8s.io/my-api-user-binding created*

- Generar un token para ServiceAccount (Solo en Kubernetes >1.24)
```Bash
kubectl create token my-api-user -n kube-system
```
- Guardar el Token para usar en el login

- Pedir la URL del Kubernetes:
```Bash
kubectl cluster-info
```

### Flujo principal de uso

1. **LoginPage**: Al abrir la aplicación nos encontramos con un formulario de LOGIN en el que debemos rellenar 2 campos: 

    - Kubernetes Server URL: donde introducimos la url donde se encuentra nuestro clúster
    - Token: donde pegaremos el token que nos genera nuestro ks

    A continuación presionamos en el botón de Login y si los datos son correctos nos llevarán a la siguiente vista. Si son incorrectos aparecerá un mensaje en la parte inferior derecha con información del error. 

2. **ClusterPage**: Una vista 3D interactuable donde aparecen en círculo representados a través de unas esferas brillantes los pods, con sus respectivos nombres sobre ellas. En el centro de este círculo hay una esfera de color grisáceo que se encarga de controlar y manejar los *Deployments*

3. **Gestión de pods**:
   - Las esferas de los pods aparecerán en color **Verde** si el pod está correctamente runeando. Si no aparece en verde puede ser porque esté *Pending* o porque haya tenido un fallo, que entonces aparecerá rojo. 
   - Si clicamos en cualquiera de las esferas la cámara se moverá hacia esta y nos aparecerá un modal con la información del pod. Concretamente el nombre, el namespace, los containers y el estado de estos.
   - Para volver a la vista general solo hemos de clicar fuera de la esfera.
4. **Gestión de los *Deployments*** .
    - Al clicar en la esfera central la camara se acerca y nos aparece una lista scrolleable con la información de los deployments de nuestro cluster. La información que vemos es el nombre del deployment, el namespace que lo contiene y el número de réplicas que tiene y que están disponibles. 
    - Además hay un input, en el que podemos poner el número de réplicas a las que queremos escalar el Deployment, y dos botones: 
        - Aplicar: para lanzar una petición de escalar al número de réplicas que hemos introducido en el input
        - Apagar: para reducir a 0 el número de réplicas y por lo tanto "*matar*" temporalmente esos Pods. 

5. **Interfaz interactiva**: La aplicación permite interactuar con los elementos 3D del entorno, facilitando una experiencia más intuitiva, permitiendo mover la cámara y visualizar el entorno en el que está la escena, un entorno cargado de diseño al estilo *Frutiger Aero* en una especie de Océano tecnológico.



## Enlace a la documentación

[Documentación creada en Notion](https://www.notion.so/K-A-T-E-20c238efeaa380e2be49f870a685aa0d?source=copy_link)



## Figma

[Diseño y Elementos creados en Figma](https://www.figma.com/design/lVCLtFsGIUxbQjQpefdIWA/TFG-KATE?node-id=1-2&t=9gzWY97i5A2jMVj5-1)

## Conclusión
KATE ha sido una apuesta por transformar la complejidad técnica en una experiencia accesible y visualmente atractiva. A lo largo del desarrollo, se ha logrado fusionar con éxito tecnologías punteras como Fabrik8 y Three.js, creando una interfaz interactiva que ofrece una nueva manera de visualizar y controlar un clúster de Kubernetes.

Más allá de los resultados técnicos, este proyecto representa un proceso de aprendizaje constante, en el que se han superado retos tanto en la integración tecnológica como en el diseño y la utilidad. La experiencia confirma que es posible salir del paradigma tradicional y ofrecer soluciones que no solo sean funcionales, sino también agradables y motivadoras para el usuario.

Además la investigación del estilo *Frutiger Aero* como marca personal a la hora de implementar diseños ha sido clave para mi desarrollo como diseñador. Es un elemento que quiero llevar a cada proyecto, pues tanto teóricamente como visualmente representa muy bien los caminos éticos y estéticos  que valoro. 

Aunque quedan aspectos por pulir y funcionalidades por implementar, la base está sentada para que KATE evolucione hacia un entorno cada vez más robusto, personalizado y eficiente. El futuro abre la puerta a un producto que democratice el acceso y gestión de Kubernetes, acercándolo a nuevos perfiles y necesidades.

En definitiva, KATE es una muestra de cómo la curiosidad y el deseo de innovar pueden dar lugar a proyectos que rompen esquemas, aportando valor real y abriendo caminos hacia un futuro tecnológico más accesible y creativo.



### BackLog

**BACKEND**
- Escalar el Backend para permitir más controles de los pods
- Acceso a distintos nodos desde la propia aplicación
- Implementar un sistema de Usuario y de Inicio de Sesión
- Implementar una Base de Datos para recoger la información de actividad de cada usuario
- Implementar un registro de estados de los pods, del clúster, de información que el usuario quiera registrar
- Desarrollar un sistema para generar estadísticas y visualizaciones del rendimiento y actividad del clúster

**FRONTEND**
- Arreglar los bugs visuales a la hora de ver Clústers de mayor tamaño
- Implementar animaciones de transición entre vistas
- Desarrollar en 3D los elementos gráficos bidimensionales del proyecto (El login, el footer, las tablas de información,...)
- Desarrollar un menú organizado para acceder a diferentes servicios
- Permitir la personalización temática, cambios de color, de intensidad de la luz, modo oscuro, ...
- Mejorar el rendimiento a la hora de generar los espacios tridimensionales llegando a reducir a 0 los tiempos de carga y la actualización del estado de los pods visualmente (glitches visuales de parpadeo y bajadas de FPS)


## Contribuciones, agradecimientos y referencias


### Agradecimientos personales:

Agradecer ante todo a mis compañeras de clase, Diana, Laura y Luna, sin ellas el día a día en este proyecto y durante el curso no habría sido lo mismo. Principalmente agradecer a Diana por los dos años de autoexigencias, inconformismo y trabajo en equipo que me han hecho evolucionar hasta lo que creo que soy hoy como persona, además de los buenos momentos. 

Agradecer también por la paciencia y la ayuda a mi pareja, Julia, por apoyarme en todo momento y soportar la ansiedad y el agobio que llevo encima, además de enseñarme trigonometría y matemáticas avanzadas para este proyecto. Sin su apoyo y conocimiento profundo del Sofware no habría comenzado este curso y menos este proyecto.

También a mis profesores, los que dan via a la creatividad y apoyan el debate y la reflexión sobre el mundo, los que enseñan y los que acompañan en el descubrimiento. Principalmente recuerdos a Ramón y agradecer a Joaquin y Rafa por este año. 


### Páginas consultadas y documentación:
- [StackOverFlow](https://stackoverflow.com/questions) 
- [Docu oficial de Three.js](https://threejs.org/docs/) 
- [Readme de Fabrik8](https://github.com/fabric8io/kubernetes-client/blob/main/README.md) 
- [Docu oficial de Kubernetes](https://kubernetes.io/docs/home/) 
- [Docu de Azure específica de Kubernetes](https://learn.microsoft.com/en-us/azure/aks/) 
- [Frutiger Aero](https://frutiger-aero.es/frutiger-aero)
- [NeoCities.org](https://frutiger-aero.neocities.org/tutorials)
- [Wiki Frutiger Aero](https://frutigeraero.fandom.com/wiki/Category:Template_documentation)
- [Getting Started with Three.js](https://medium.com/@alphadesign/getting-started-with-three-js-your-first-3d-scene-8aac4051e4a0)


### Recursos de Video consultados: 
- [Porfolio with Three.js](https://www.youtube.com/watch?v=Q7AOvWpIVHU&pp=ygUSdGhyZWUuanMgdHV0b3JpYWxz)
- [Tutoriales de Three.js](https://www.youtube.com/watch?v=xJAfLdUgdc4&list=PLjcjAqAnHd1EIxV4FSZIiJZvsdrBc1Xho)
- [Three.js Explained](https://www.youtube.com/watch?v=ZHZh6S9b6DY&pp=ygUSdGhyZWUuanMgdHV0b3JpYWxz)
- [Mega Tutorial de Three.js](https://www.youtube.com/watch?v=UMqNHi1GDAE&pp=ygUSdGhyZWUuanMgdHV0b3JpYWxz)
- [Mejor demostración de Three.js](https://www.youtube.com/watch?v=AB6sulUMRGE&pp=ygUSdGhyZWUuanMgdHV0b3JpYWxz)
- [Kubernetes Operator in Java](https://www.youtube.com/watch?v=uxR7Mfpn9HI&t=154s&pp=ygUSZmFicmlrOCBrdWJlcm5ldGVz)
- [Fabrik8 maven plugin](https://www.youtube.com/watch?v=EsvrcwXfFbU&t=182s&pp=ygUSZmFicmlrOCBrdWJlcm5ldGVz)


### Otros recursos importantes que inspiraron este TFG:
- Obras literarias: 
    - "Un Mundo Feliz" (Aldous Huxley)
    - "¿Sueñan los androides con ovejas eléctricas?" (Philip K. Dick)
    - “La mano izquierda de la oscuridad” (Ursula K. Le Guin)
    - “El Atlas de las Nubes” (David Mitchell)
    - "BLAME!" (Tsutomu Nihei)

- Películas: 
    - Brazil (1985, Terry Gilliam)
    - Ghost in the Shell (1995)
    - Her (2013)
    - Primer (2004)
    - Paprika (2006)

- Videojuegos: 
    - Portal (Valve)
    - FLOW (Thatgamecompany)
    - Mirror's Edge (EA games)
    - INSIDE (Playdead)
    - UI XBOX360 y PS3

- WEBS con estilo Frutiger
    - [stardock.com](#https://www.stardock.com/products/wb6/index.asp)
    - [neocities.org](#https://g7up.neocities.org/vista)



## Licencias
Este proyecto se distribuye bajo la licencia **MIT License**.

Esto significa que se puede usar, modificar y distribuir el código libremente, siempre que se incluya la mención a este mismo proyecto.

Para más detalles, se puede consultar el archivo LICENSE incluido en el repositorio.


## Contacto

### Alejandro Navarro García

- Correo: alejandronavarro.mgmt@gmail.com

Puedes encontrar el código completo y más proyectos míos en mi perfil de GitHub:

[Alejandro Navarro García en GitHub](https://github.com/AleNaGa)


Y encontrar nuevos proyectos y trabajos en los que me encuentro involucrado en mi Linkedin:

[Alejandro Navarro García en LinkedIn](https://www.linkedin.com/in/alejandro-navarro-97485030b/) 


---

