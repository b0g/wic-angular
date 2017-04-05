import { Component, Input, ViewChild, ElementRef} from "@angular/core";
import {Chose} from "@NoyauFonctionnel/nf";

const htmlTemplate = `
	<div class="view">
		<input 	class			= "toggle" 
				type			= "checkbox" 
				name			= "fait"
				[ngModel]       = "nf.fait"
				(ngModelChange) = "fait(inputFait.checked)"
				#inputFait
				/>
				
		<label 	class       = "texte"
		    (dblclick)      = "edition()">{{nf.texte}}</label>
		<button class       = "destroy"
		    (click)         = "dispose()"></button>
	</div>
	<form *ngIf="editing" >
		<input 	class		= "edit"
		    value           = "{{nf.texte}}"
		    (blur)          = "setText(inputTexte.value)"
			#inputTexte
			/>
	</form>
`;

@Component({
  selector		: "item-chose",
  template		: htmlTemplate
})
export class ItemChose {
    @Input ("nf" ) nf   : Chose;
	@ViewChild("newText") newTextInput : ElementRef;
	editing			    : boolean = false;

	//constructor() {}
    dispose(){
        this.nf.dispose();
    }
    edition(){
        this.editing = true;
    }
    setText(str:string){
        this.editing = false;
        this.nf.Texte(str);
    }
    fait(f:boolean){
        this.nf.Fait(f);
    }
    edit(){ //je ne sais pas ce que c'est
        requestAnimationFrame(()=>{
            this.newTextInput.nativeElement.focus()
        });
    }
}
