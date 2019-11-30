## `Présentation du Projet Pilotage vocale d'une application`
 Cette application a été conçu dans le cadre de la réalisation d’un projet en Développement de Logiciel Libre sous la licence CC BY-NC-SA.
L’objectif étant, de réaliser une application qui permettra aux utilisateurs de contrôler des documents (Exemple fichier PDF) de leur présentation uniquement grâce à leur voix.<br />

Notre projet est scindé en 2 parties:
<h4> Partie Frontend </h4>
<h4> Partie Backend </h4>

La partie <b> Backend </b> est structuré en composants ,et chacun est constiuté de la manière suivante: <br>

<h4> Route: <br>
La route définit le chemin par lequel on appelle l'action, afin que la requete soit traitée.

<h4> Action: <br>
C'est une fonction qui prend les parametres de la requete et l'envoie au process pour le traitement.

<h4> Process: <br>
C'est la partie du traitement de la requete, qui interagit avec l'environnement externe (exemple notre base de donnée Mongo, ou autre Api
externes)
<h4> Model: <br>
C'est le schéma de la base de donnée.

Pour pouvoir bien gérer la création de comptes des utilisateurs, nous avons integré le module Mailgun pour envoyer des mails contenant
le token d'activation du compte l'utilisateur. 

### `Démarrage de l'application`

Afin d'assurer le bon fonctionnement de l'application, plusieurs manipulations doivent être réalisées au préalable:

#### `Prérequis`

Installer NodeJS 

```
https://nodejs.org/

```

Récuperer la partie Backend sur Git:

```
https://github.com/M2OBY/MOBY-back.git

```

Récuperer la partie Frontend sur Git:

```
https://github.com/M2OBY/MOBY-Front.git

```
Puis ajouter les dépendances entre les differents paquets:

```
npm install dependencies

```
Installer le module Mailgun
```
npm install mailgun-js

```
POUR LANCER LE PROJET  : 
```
node app

```
Il sera lancé sur le port 5000.
