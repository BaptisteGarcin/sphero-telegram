# spheroservice
Service Rest utilisé pour le dialogue avec **Wit.ai** et le **contrôle du Sphero**. Il est destiné à tourner sur l'ordinateur connecté au Sphero par bluetooth.
## installation
L'installation nécessite nodeJS et yarn
```bash
$ yarn
$ # ou
$ yarn install
```

Sous linux il est conseillé d'installer apt://blueman (gestionnaire bluetooth avancé)
```bash
$ sudo apt get install blueman
```
Puis d'appairer le bluetooth à l'aide de ce gestionnaire avec la sphero et de se connecter sur le port série (clic droit->serial port)
Une fois cela fait un message va vous indiquer sur quel port le sphero est connecté (/dev/rfcomm0 par défaut) 
si celui-ci est différent alors il faudra l'indiquer après yarn start

## démarrage du service
```bash
$ yarn start
$ # ou
$ yarn start <port bluetooth du sphero>
```
Si la console renvoie l'erreur Unhandled rejection Error: Command sync response was lost. cela signifie que la 
connexion bluetooth avec le sphero n'est pas stable, arrêtez le service avec ctrl+C et relancez le

Le service devrait démarrer sur le port 8010. Une interface textuelle est accessible à l'adresse 'http://localhost:8010'.

Si on est sous OS X
Au chargement, le service cherchera à se connecter au Sphero via '/dev/tty.Sphero-RGG-AMP-SPP' 

Si pour une raison ou une autre la connection échouait, le service restera en attente et on pourra utiliser la commande connexion via cette interface textuelle pour retenter une connexion.
Ou relancer yarn start avec le bon port bluetooth que ce soit sous Linux ou OS X

Commandes spéciales qui ne sont pas traitées par le chatbot :
* **connexion** : permet de tenter de se connecter au Sphero
* **déconnexion** : permet de se déconnecter du Sphero
* **dodo** : met le Sphero en sommeil léger (on peut le taper pour le réveiller)
* **reset session** : permet de partir d'une nouvelle conversation au prochain message (ne devrait pas être utile, mais permet de tuer une boucle d'intéraction si cela se produisait)
* **calibration distance** : permet de faire avancer la boule tout droit à une vitesse de 80
* **démarrer calibration** : permet de mettre le Sphero en mode calibration (pour définir l'heading manuellement)
* **fin calibration** : permet d'arrêter le mode calibration du Sphero (démarrer avec 'démarrer calibration')

## Fonctionnement du service
Il dispose d'un unique chemin 'processmessage' utilisé pour traiter l'entrée d'un utilisateur envoyée en POST.
```
{'message': 'change de couleur'}
```
Le traitement peut engendrer soit une action du Sphero ou du service soit une réponse pour l'utilisateur. Quel que soit le cas, un JSON est retourné contenant le message pour l'utilisateur ou rien.
```
{'botResponseToUser': 'Quelle couleur ?'}
```
## Ce que permet de faire le service
Que ce soit pour tourner ou bouger, la direction actuelle est considérée comme base pour la direction de l'action qui va s'effectuer. Ainsi, si on dit quatre fois de suite à Sphero d'aller à droite, il va décrire un carré.
* Faire tourner Sphero dans une direction avec ou non un nombre de degrés donnés. Si des informations manquent, elles seront demandées à l'utilisateur.
  * "Tourne à droite"
  * "Fais demi-tour"
  * "Tourne à gauche de 43 degrés"
* Faire change la couleur de Sphero. Si la couleur est manquante, elle sera demandée.
  * "Change de couleur en rouge"
  * Couleur prise en charge actuellement (potentiellement, toutes les couleurs supportées par javascript pourraient être ajoutées) :
    * Or
    * Blanc
    * Rose
    * Magenta
    * Violet
    * Rouge
    * Jaune
    * Argent
    * Bleu
    * Noir
    * Cyan
    * Marron
    * Gris
    * Vert
    * Orange
* Bouger devant ou derrière avec une direction ou non. Il est possible de spécifier une distance en mètres, mais le résultat est assez approximatif (on note aussi un recul plus faible que l'avancée).
  * "Avance"
  * "Avance à droite"
  * "Recule"
  * "Recule à gauche"

## License
* Librairies nodeJS
  * body-parser (https://www.npmjs.com/package/body-parser) : MIT
  * express (https://www.npmjs.com/package/express) : MIT
  * node-wit (https://www.npmjs.com/package/node-wit) : License de la librairie à inclure avec l'application. "Wit does not acquire ownership of your Devices, Applications, or Customer Data by your use of the APIs or other Wit Content." (*Extrait des termes d'utilisation depuis le site wit.ai*)
  * serialport (https://www.npmjs.com/package/serialport) : MIT
  * sphero (https://www.npmjs.com/package/sphero) : MIT
