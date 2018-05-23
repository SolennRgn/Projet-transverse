## Synopsis
Trouve ton Excuse
Synopsis Projet Développé par :
Beary 

Timothée Marguier, Valentin Bauer, Océane Fradon, Sonia Ould Amrouche, Solenn Regné
Efrei Paris Promotion 2020
L3

Contexte et enjeu :
Afin de cerner au mieux le contexte du projet à développer, nous allons ici tenter d’en décrire les enjeux mais aussi les attentes de celui-ci.

1.	Synthèse du sujet posé et analyse :

Dans le cadre du projet transverse de notre première année en cycle ingénieur de Efrei Paris, nous avons donc constitué un groupe de 5 personnes alliant technique, recherche et créativité. C’est dans ce cadre que nous avons décidé de nous tourner vers un projet qui peut se rendre utile aux étudiants de France et du monde entier, un projet possédant une intelligence artificielle afin de travailler main dans la main avec la technologie pour l’homme en lui simplifiant les problèmes du quotidien.

Notre sujet est le suivant : trouver un moyen d’aider les étudiants dans leur vie de tous les jours, face aux problématiques qu’ils peuvent rencontrer chaque jour.

On s’est donc posé la question de comment aider les élèves aujourd’hui. Mais la réelle analyse que nous avons eu a été : qu’est-ce qui était problématique pour nous quand nous étions au lycée.

Pour répondre à cette question, nous avons analysé chacun nos difficultés et nous nous sommes rendu compte que l'on avait tous le même problème : nous n'arrivons pas à trouver une excuse valable pour justifier nos retards.

C’est de ce constat qu’est parti notre projet, il nous faudrait un ami créatif qui nous souffle une bonne excuse à chaque fois que nous sommes en retard, tout simplement. Mais ce n’est pas simplement une excuse aléatoire, cela serait une excuse qui prendrait en compte tous les paramètres de la situation actuelle !


2.	Synthèse de notre travail de conception 


L’idée de Trouve Ton Excuse est assez simple. Aujourd’hui, de nombreux étudiants, collégiens, lycéens et stagiaires sont en retard, tous les matins. Ayant nous-même expérimenté cette problématique alors plus jeune, il fallait donc à tout prix se justifier auprès de son professeur, de sa directrice, de son maître de stage. 
Cependant, peu d’élèves arrivent à imaginer en quelques minutes une réponse adaptée à la situation qu’ils rencontrent. Chez Beary, nous voulons que Trouve ton Excuse réponde à cette solution. En fonction de votre mode de transport, de votre classe, de votre cours et de votre heure d’arrivée, nous vous fournissons une réponse adaptée et efficace afin de maximiser vos chances de réussite d’entrée dans la classe en vous fournissant une explication correct devant votre supérieur. 

L’utilisateur va donc faire appel à notre chatbot Facebook, en effet, le développement de ce nouveau support est en pleine explosion, on pourrait parler de chatbot connu en France comme citron ou encore Jam. L’avantage d’un chatbot c’est que vous avez une expérience utilisateur identique à une conversation avec un ami. Nous souhaitons ici que cela soit le même principe. Demander à un ami une excuse en fonction d’une situation précise. 
L’utilisateur va donc dans un premier temps indiquer au chatbot qu’il est en retard et va demander de lui trouver une excuse. Le chat bot va lui poser ensuite une série de question à définir afin de cibler quel est la meilleure excuse pour l’utilisateur. Si l’utilisateur est content de l’excuse proposée, l’expérience peut s'arrêter là mais il peut aussi la partager avec ses amis ! Si cette excuse n’est pas cohérente pour la situation, l’utilisateur peut toujours demander au chatbot de lui proposer une nouvelle excuse !


3.	Feuille de route

Dans un premier temps, nous allons devoir créer le schéma de l’utilisateur. Nous allons donc être sur la conception plus précise avec l’élaboration d’un cahier des charges. En effet, pour le moment nous n’avons surtout qu’une idée très générale et qui n’est donc pas précise concernant l’élaboration d’un algorithme. Ensuite, une fois le schéma de l’expérience utilisateur mise en place, nous allons devoir commencer à comprendre le fonctionnement ainsi que la mise en production d’un chat bot. Pour cela nous allons nous documenter par la doc que Facebook met à disposition des développeurs pour en savoir plus sur le fonctionnement des chatbot. 
Une fois cela réalisé nous allons mettre en place une première version du chatbot reliée à la page.

Ensuite nous ferons une phase d’intégration de l’algorithme.

Enfin nous, nous travaillerons sur les interactions avec l’utilisateur afin de répondre au mieux aux différentes questions/ remarques que l’utilisateur va pouvoir poser. En effet, au début notre bot ne sera pas toujours autonome, il faudra donc répértorier au fur et à mesure les différents cas de question/réponse avec des utilisateurs lambda.

Enfin, nous pourrons le publier sur facebook et avoir nos premiers retours externes, ce sera pour nous l’occasion de perfectionner un peu plus notre chatbot et de lancer une communication sur les réseaux sociaux.


4.	Objectif du prototype initial 

Dans un premier temps, nous devons nous familiariser avec l’environnement du chatbot, son fonctionnement et son implémentation dans facebook. 

Notre prototype initial devra répondre à plusieurs critères :

Il devra être implémenté à une page facebook
Il permettra d’afficher une excuse à l’utilisateur avec un schéma de conversation simple, c’est à dire sans se concentrer sur l’échange avec l’utilisateur directement.

5. Pour aller plus loin

Une fois ce prototype initial réalisé et fonctionnel, nous pourrions faire évoluer son intelligence avec des algorithmes plus poussés. Par exemple nous pourrions accéder directement aux informations de l’utilisateur afin de récolter des données exploitables, comme ses likes, les pages qu’ils suit, afin d’affiner la réponse. Aussi, nous pourrions ajouter une fonction de prévention d’absences,  dans le cas où un élève sait à l’avance qu’il ne sera pas présent, le bot pourra par exemple prévoir des mots d’excuse, des alibis permettant de prévoir la futur absence. 

## Motivation

Trouve Ton Excuse est une idée originale de Timothée Marguier et de Nicolas Sebag alors qu'ils étaient encore au Lycée. Au fil de ses études, Timothée Marguier a continué à maintenir le projet Trouve Ton Excuse ( anciennement Excusez-moi Madame).

L'objectif est donc de développer ce concept sur un maximum de plateformes.

## Installation

Vous pouvez télécharger ce projet à l'adresse git : https://github.com/TimRD/Trouve-Ton-Excuse-Messenger

## API Reference

Ce projet fait appel à l'API de facebook messenger ainsi qu'à une API développée par les concepteurs à l'adresse : https://pacific-springs-69478.herokuapp.com/excuses Aucun autorisation n'est nécessaire, ces excuses sont libres de droit.

Le NLP de facebook messenger est aussi utilisé pour faciliter la reconnaisssance du langage naturel.

## Tests

Ce projet utilise Heroku couplé à Git Hub, pour toute la partie test il est nécessaire de mettre en production à chaque Test. Pensez à vous créer un compte développeur Facebook.

--> https://developers.facebook.com/

Il vous sera demandé de créer une application, n'hésitez pas à regarder le quick start : https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start

## Contributors

Timothée Marguier 
	https://github.com/TimRD
	https://twitter.com/TMarguier?lang=fr
	https://www.linkedin.com/in/timothee-marguier/

Valentin Bauer
Sonia Ould-Amrouche
Solenn Regné
Océane Fradon

## Contact

Vous pouvez-contacter l'équipe à l'adresse trouvetonexcuse@gmail.com


## Site internet

L'application est disponible sous forme web à l'adresse : http://vps488780.ovh.net/trouvetonexcuse/Trouve-Ton-Excuse-Website/

## Application Android

Une version Android de l'application existe, vous pouvez dès à présent la télécharger à l'adresse : https://play.google.com/store/apps/details?id=com.ionicframework.excusezmoimadame397203&hl=fr


## License

This project got an ISC License