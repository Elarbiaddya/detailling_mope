# TFG

# Temática

Aplicación web para un centro de detailing y cuidado estético del automóvil.

La plataforma permite consultar los servicios ofrecidos, solicitar citas online y gestionar usuarios, servicios y citas mediante un panel de administración.

# Objetivos

Desarrollar una aplicación web que permita:

* Mostrar los servicios disponibles.
* Permitir a los usuarios registrarse e iniciar sesión.
* Solicitar citas para los diferentes servicios.
* Consultar el historial de citas realizadas.
* Gestionar usuarios, servicios y citas desde un panel de administración.
* Aplicar control de acceso mediante roles.
* Disponer de una interfaz responsive y fácil de utilizar.

# Funcionalidades

## Roles

### Admin

* Gestionar usuarios.
* Gestionar servicios.
* Gestionar citas.
* Acceder al panel de administración.

### Cliente

* Registrarse e iniciar sesión.
* Solicitar citas.
* Consultar su historial de citas.
* Consultar su próxima cita pendiente.
* Cancelar citas permitidas.

### Anónimo

* Consultar la página principal.
* Consultar los servicios disponibles.
* Ver el detalle de los servicios.

## Vistas

### Públicas

* Home
* Servicios
* Detalle de servicio
* Login
* Registro

### Cliente

* Perfil
* Citas
* Historial de citas

### Administrador

* Dashboard Admin
* Gestión de usuarios
* Gestión de servicios
* Gestión de citas

# Arquitectura/Tecnología

## Frontend

* Figma para prototipado
* React
* React Router
* CSS Modules
* Fetch API

## Backend

* Laravel
* Laravel Sanctum
* ORM: Eloquent
* API REST

## Base de datos

* MySQL

## Despliegue

* AWS (Amazon Web Services)

# Esquema entidad-relación

## Entidades principales

* Roles
* Usuarios
* Servicios
* Citas
* Vehículos
* Cartas de trabajo

# Autor

* Elarbi Addya Daoui

