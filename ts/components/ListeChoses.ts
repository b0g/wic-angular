import {Component, Input, OnInit}               from "@angular/core";
import {Chose, ListeChoses as ListeChosesNF} 	from "@NoyauFonctionnel/nf";
import {ListeChosesService}                     from "@NoyauFonctionnel/service";

const htmlTemplate = `
	<section class="todoapp" *ngIf="nf"> <!-- On initialise la condition que le noyau fonctionnel doit-être chargé, sans quoi des erreurs subvienne -->
		<header class="header">
			<h1>{{titre}}</h1>
			<form (ngSubmit)="createChose(newTodo.value);newTodo.value=''" >  <!-- Lorsqu'on soumet le formulaire, on appele la création d'une chose par rapport à la référence du input -->
				<input class="new-todo" placeholder="Que faire?" 			    
				    #newTodo 
				    autofocus>  <!-- Référence -->
			</form>
		</header>
		<section class="main">
			<input  class           = "toggle-all" 
			        type            = "checkbox"
                    (ngModelChange) = "ToutCocherDecocher()"    
			        [ngModel]       = "ToutEstFait()"            
			        />  <!-- Si la valeur change alors on appel toutCocherDecoche --><!-- Nous lions l'input check à un boolean correspondant a un model -->
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
                <li *ngFor              = "let chose of getChoses()"
                    [class.completed]   = "chose.fait"
                    [class.editing]     = "compo.editing">
                    <item-chose [nf]    = "chose" #compo ></item-chose>    
                </li>
            </ul>
		</section>
        <footer class="footer">
            <span class="todo-count"><strong></strong> restantes</span>
            <ul class="filters">
                <li>
                    <a class                = "filterAll"       
                       (click)              = "currentFilter = filterAll"        
                       [class.selected]     = "currentFilter === filterAll"    
                       >Tous</a>  <!-- Sur le click on defini le current filter de la class a filterAll -->  <!-- Pour la vue la class selected surligne le lien (css) ducoup on test si le currentFilter est filterAll -->
                </li>
                <li>
                    <a class                = "filterActives"
                       (click)              = "currentFilter = filterUnDone"         
                       [class.selected]     = "currentFilter === filterUnDone"
                       >Actifs</a>
                </li>
                <li>
                    <a class                = "filterCompleted"
                       (click)              = "currentFilter = filterDone"         
                       [class.selected]     = "currentFilter === filterDone"
                       >Complétés</a>
                </li>
            </ul>
            <button class="clear-completed">Supprimer cochées</button>
        </footer>
	</section>
	<hr/>
	<section>
	    <section *ngFor="let chose of getChoses()">
	        {{chose.fait}} : {{chose.texte}}
        </section>
	</section>
`;

type filterChose = (c : Chose) => boolean; // Définition de notre type de filtre : PROPRE (une chose en parametre,
@Component({
  selector		: "liste-choses",
  template		: htmlTemplate
})
export class ListeChoses implements OnInit {
    @Input() titre	: string;
    public nf       : ListeChosesNF;
    private choses  : Chose[] = [];
	constructor		(private serviceListe: ListeChosesService) {
	};
    ngOnInit(): void {
        ListeChosesService.getData().then( (nf) => {
            this.nf     = nf;
            this.choses = nf.choses;
        });
    }
    // Définition des différents types de filtres
    filterAll: filterChose = () => true; // on assigne une fonction a un nom : pas besoin de () à l'appel (voir après currentFilter)
    filterDone: filterChose = () => true;
    filterUnDone: filterChose = () => true;
    currentFilter=this.filterAll; //Définition de notre paramètre de class currentFilter

    getChoses() : Chose[] {
        // return this.choses; C'est sans le filtre
        return this.choses.filter(this.currentFilter); // choses est un tableau, on le filtre en lui passant la fonction défini par currentFilter
    }
    createChose(texte: string){
        //this.choses.push(new Chose(texte, this.nf)); Mauvaise Idée
        this.nf.Ajouter(texte);
    }

    ToutEstFait(): boolean { // Verifie par accumulation si tout est fait dans la liste de chose du noyau
        return this.nf.choses.reduce((acc,c)=> acc && c.fait , true);
    }
    ToutCocherDecocher(){
        let cocher = !this.ToutEstFait();
        this.nf.choses.forEach( c => c.Fait(cocher));
    }


    DeleteCompleted(){
        this.choses.filter(this.filterDone).forEach(c => c.dispose())
    }

}
