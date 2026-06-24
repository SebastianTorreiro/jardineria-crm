                                                  #### DIA 1 ####

# app/(dashboard)/dashboard/page.tsx

En el archivo page.tsx de dashboard. se declara una funcion entera que ya esta definida en dashboard services
en este mismo archivo, se hace esa llamada a la api, se calcula en base a esto algunas variables y ahi mismo se imprime todo.


# app/login/page.tsx

parecido a lo anterior, todo esta en el mismo archivo. voy a intentar describir que hace cada parte del codigo.

primero declara un type para ver que tipo como de pagina mostrar, si la de recuperacion de contrasenia, ingresar o magic-link. 

despues arranca el componente en si, inicializa userRouter y UserSearchParams. El primero se usa para redirigir y el segundo para acceder y cambiar la url. 

despues se declaran varios estados de forma independiente: loading, message, viewState y IsMagicLink.

despues viene un useEffect, que deberia repasar el funcionamiento, Pero recuerdo que es para hacer peticiones asincronas, por primer parametro se le pasa una funcion y en el segundo se le pasa una variable o un array de ellas. 
En este casousa search params para ver que valor tiene type en la url actual, doy por hecho que en algun otro lado se setea el type. 
hace un if para ver si es type recovery y si es asi, cambia el estado de viewState a update-password
despues hace como un destructuring de una llamada que es media rara, porque la funcion onAuthStateChange recibe una funcion flecha que recibe 2 argumentos event y session y si el event es passwrod recovery cambia el viewState igual que antes a update password. 

despues retorna authListener.Subscription.unsuscribe() que realmente no lo entiendo. 
el return en esta funcion entiendo que se ejecuta cuando el componente se desmonta. porque, ahora voy recordando, el useEffect era una especie de combinacion entre las viejas funciones que se usaban por separado que era cuando se montaba el componente, cuando cambiaba y cuando se desmontaba, no me acuerdo el naming exacto. 
en base a esto, entiendo que cuando el componente se desmonta esto se desuscribe del authListener. 
Suscribirse por lo que recuerdo es quedarte esperando cambios, cuando vos te suscribis a algo (digo algo porque no es que te podes suscribir a cualquier variable definida con let es a cosas particulares creo) te avisa de cada cambio del mismo. 

por ultimo, antes del return del componente, tiene el manejador del formulario. 
primero evita la recarga automatica.
activa el loading y el message en null que entiendo que es del error. 

despues hace un try grande si el viewState es update-password hace el update y hace destructuring buscando el error, si hay error lo pone en el estado message (que despues se renderiza en la parte html) y despues de 2 segundos por el settomeout te pushea a "/" que es una redireccion y recarga la pagina. ahora, el if ese de la linea 54 solo lanza el error, verdad? porque no abre llaves y engloba lo de abajo. osea que siempre se setea el message ? a no porque el hacer el throw error lo atrapa el catch. no? por lo tanto el codigo de abajo se ejecuta si no hay tal error. 

despues, si IsMagicLink es true, usea la funcion signInWithOtp, que supongo que es como una opcion especial para entrar con un magiclink. y despues lo mismo de antes, busca el error y sino setea el message y aca tambien el viewState a magic-link.

por ultimo el signInWithPassword, si no hay error te pusea a "/" y recarga la pagina. el catch simplemente lo consologea y setea el message con el texto del error y el finally, que se ejecuta si o si al final de todo setea el loading en false.

despues el return no tiene mucha complejidad, si te soy sincero nunca entendi ni puse mucha intencion en entender css, fue mi punto mas flojo, a grandes rasgos lo entiendo pero no al detalle. obviamente se que usa taldwind por eso los estilos estan ahi directamente, solo que quedan mas prolijo porque son cortitos. 
tiene varios ternario que son: condicione ? SeEjectuasiesTrue : SeEjecutaSiEsFalse

parece que hay 3 opciones posibles, que sea magic-link, update password o ninguno de estas. que seria ingresar normalmente por lo que entiendo. 

por ultimo abajo de todo tiene un componente 
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="animate-pulse">Cargando...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  )
}

que por lo que pude revisar no se ejecuta en ningun lado de la aplicacion, es solo decorativo. 


                                                    #### DIA 2 ####

# SRP
El problema está en "cosas". Una función puede hacer muchas operaciones y tener una sola razón para cambiar. El criterio no es cuántas líneas tiene ni cuántas operaciones ejecuta — es quién o qué la obliga a cambiar.
La pregunta precisa es: ¿a quién le pertenece esta responsabilidad? O dicho de otro modo: si mañana cambia una regla de negocio, ¿también tengo que tocar esta función? ¿Y si cambia cómo se muestra la pantalla? ¿Y si cambia la base de datos? Si la respuesta a más de una de esas preguntas es "sí" — ahí está la violación.




handleLogin en login/page.tsx viola SRP porque tiene tres razones para cambiar: cambia la regla de magic-link, cambia la lógica de password recovery, o cambia el flujo de sign-in normal. Cada uno de esos flujos debería tener su propia función con una sola responsabilidad.

                                                    #### DIA 3 ####
# Acoplamiento

La idea en una frase: dos piezas de código están acopladas cuando cambiar una obliga a cambiar la otra.
El nivel de acoplamiento se mide con una pregunta concreta: si cambio X, ¿cuántos archivos tengo que tocar? Muchos archivos — acoplamiento alto. Pocos o ninguno — acoplamiento bajo.
El objetivo no es acoplamiento cero, eso es imposible. El objetivo es que las dependencias sean explícitas, controladas, y en la dirección correcta.


Si algo cambia, tiene que cambiar en muchos lados? eso esta mal.
Una funcion no tiene que saber la entranias de otra, solo la interfaz. Si la funcion esta bien hecha, por mas que cambie sigue enviando masomenos lo mismo, entonces la otra que lo recibe no tiene que cambiar. (encapsulamiento).
el acoplamiento alto aparece exactamente cuando se rompe el encapsulamiento
Por ejemplo en el CRM organization_id aparece 268 resultados en  20 archivos es decir que si por lo que sea el campo cambia de nombre, tengo que cambiarlo en 268 oportunidades en 20 archivos distintos, lejos de ser escalable y prolijo es un descontrol.

                                                    #### DIA 4 ####

# Separacion de capas

HomePage en home/page.tsx mezcla tres capas en un mismo componente: obtiene datos de Supabase, define una regla de negocio (timezone de Argentina), y renderiza el resultado en JSX. Si el negocio expande a otro país, o cambia de base de datos, o cambia el diseño — las tres razones obligan a tocar el mismo archivo.

Las tres capas que venimos viendo son las fundamentales, pero no son las únicas. Primero las afinamos, después las expandimos.

Las tres base
Capa de presentación

Su única pregunta: ¿cómo se ve esto? No toma decisiones, no habla con la base de datos. Recibe datos ya procesados y los muestra. Si esta capa está bien hecha, podés cambiar todo el diseño sin tocar ninguna regla de negocio.
Capa de negocio (también llamada dominio o lógica de aplicación)

Su única pregunta: ¿qué reglas aplican aquí? Es la capa más valiosa y la más frágil si está mezclada con las otras. Acá vive lo que hace único a este software — la regla de timezone de Argentina, qué significa "stock bajo", cómo se calcula el ingreso mensual. No sabe nada de cómo se muestra ni de dónde vienen los datos.
Capa de datos (también llamada infraestructura o persistencia)

Su única pregunta: ¿cómo obtengo o guardo información? Habla con Supabase, con una API externa, con un archivo. Si mañana migrás de Supabase a PostgreSQL directo, solo esta capa debería cambiar.

Capas adicionales que existen en sistemas más grandes
Capa de servicios de aplicación

Coordina entre la capa de negocio y la de datos sin pertenecer a ninguna. En NestJS la reconocés — es el Service que el Controller llama. No tiene reglas de negocio propias, orquesta las que existen.
Capa de transporte (o interfaz)

En NestJS es el Controller — recibe el request HTTP y delega. En Next.js App Router son las Server Actions o los Route Handlers. No decide nada, solo recibe y pasa.
Capa de infraestructura transversal

Logging, autenticación, manejo de errores global. Cosas que aplican a todas las capas pero no pertenecen a ninguna en particular.

El patrón que une todo
En NestJS ya lo viviste sin nombrarlo así:
Request → Controller (transporte)
        → Service (aplicación + negocio)
        → Repository (datos)
        → Base de datos
En Next.js App Router con tu stack sería:
Request → page.tsx (presentación)
        → service.ts (negocio + aplicación)
        → queries.ts (datos)
        → Supabase
El problema de tu CRM es que page.tsx está haciendo el trabajo de las tres capas del medio además de la presentación.


                                                    #### DIA 5 ####


# Naming


formData — es genérico — describe el tipo (un FormData) no el contenido. Algo como loginFormData o directamente extraer los valores sin nombrar el intermediario diría más. Los email y password que salen de ahí están bien nombrados — son exactamente lo que son.

handleLogin — Esta función no maneja "login" — maneja tres flujos de autenticación distintos. El nombre miente por omisión. Algo como handleAuthSubmit o handleAuthForm refleja mejor que es el handler del formulario de autenticación completo, no solo del login.

type —  Viviendo dentro de un useEffect que maneja recuperación de contraseña, type es completamente opaco. authFlowType o recoveryType diría exactamente de dónde viene y para qué se usa.


typescriptconst [loading, setLoading] = useState(false)
¿Loading de qué? En un componente con tres flujos distintos, isSubmitting es más preciso — describe que hay una operación en curso, no solo un estado de carga genérico.

typescriptconst { data: authListener } = supabase.auth.onAuthStateChange(...)
El destructuring renombra data a authListener — eso está bien hecho. Pero la variable session en el callback nunca se usa. Una variable declarada que no se usa es 
naming debt — debería ser _session para señalar explícitamente que es intencional ignorarla.

typescriptfunction LoginFormContent()
El componente se llama LoginFormContent pero maneja recuperación de contraseña y magic link — no solo login. El nombre promete menos de lo que hace. AuthFormContent sería más honesto.

handleLogin → handleAuthSubmit porque maneja tres flujos distintos de autenticación, no solo login. 
type → authFlowType porque describe exactamente de dónde viene y qué decide.


                                            #### dia 6 y 7 descanso y repaso ####



                                                    #### DIA 8 ####

# DRY Una frase: no repitas lógica que debería vivir en un solo lugar.

La pregunta precisa no es "¿este código se parece a otro?" — es "si cambio la regla en un lugar, debería cambiar en todos los demás también?" Si la respuesta es sí y son lugares separados, eso es DRY violado.
La distinción que más confunde: repetición accidental vs repetición intencional. Dos formularios que validan email por separado pero con reglas distintas — eso no es DRY violado, son reglas independientes que casualmente se parecen. Dos formularios que validan email con la misma regla de negocio escrita dos veces — ahí sí, porque si la regla cambia tenés que acordarte de cambiarla en ambos lados.                                       

En visits/layouts.tsx existe dry al repetirse el estilo de 5 links diferentes pero es dry de estructura de presentacion no dry de logica de negocio.

En dashboard/page.tsx y en lib/services/dashboard-service.ts Si hay dry de logica de negocio porque se hace una llamada a la base de datos que es identica en casi toda su extension. Solo difiere en como llama a un dato que es una fecha y que trae algunos datos extra que la otra no, tengo que ajustarla al caso de uso real y usar 1 sola. la otra eliminarla.


                                                    #### DIA 9 ####

# Testabilidad como síntoma de diseño: si algo es difícil de testear, casi siempre es porque está mal acoplado.                                              

En home/page.tsx la funcion componente HomePage no se puede testear en aislamiento porque tiene como dependencia externa la creacion de cliente de supabase, un llamada a supabase para obtener el organizationId y Otra llamada a una tabla de la base de datos.

HomePage en home/page.tsx no se puede testear en aislamiento porque tiene infraestructura hardcodeada: crea el cliente de Supabase internamente, resuelve el organizationId internamente, y ejecuta las queries internamente. Un test no puede reemplazar ninguna de esas dependencias sin levantar Supabase real. Esto indica acoplamiento directo a la infraestructura — el mismo problema que el Día 3, ahora visto desde el ángulo de la testabilidad.