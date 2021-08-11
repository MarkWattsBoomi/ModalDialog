import React, { CSSProperties } from 'react';
import { eLoadingState, FlowComponent,  FlowField,  FlowOutcome } from 'flow-component-model';
import './modal.css';

declare const manywho: any;

export default class ModalDialog extends FlowComponent {

   version: string='1.0.0';
   context: any;
   lastContent: any = (<div></div>);
   dragEvent: DragEvent = new DragEvent();
   modal: any;
   dialog: HTMLDivElement;

   top: number = 0;
   left: number = 0;

   msgboxTitle: string = '';
   msgboxButtons: Array<any> = new Array();
   msgboxContent: any;
   //msgboxOnClose: any = this.hideMessageBox;


   constructor(props: any) {
      super(props);
      this.flowMoved = this.flowMoved.bind(this);
      this.setDialog = this.setDialog.bind(this);
      this.positionDialog = this.positionDialog.bind(this);
   }

   setDialog(dialog: HTMLDivElement) {
      this.dialog = dialog;
      if(this.dialog) {

         const parentXCenter = this.dialog.offsetParent.clientWidth / 2;
         const parentYCenter = this.dialog.offsetParent.clientHeight / 2;
         const dialogXOffset = this.dialog.clientWidth / 2;
         const dialogYOffset = this.dialog.clientHeight / 2;

         this.left = parentXCenter - dialogXOffset;
         this.top = parentYCenter - dialogYOffset;
         this.dialog.classList.add('shown');
         this.positionDialog();
      }
   }

   async flowMoved(xhr: any, request: any) {
      let me: any = this;
      if(xhr.invokeType==='FORWARD') {
         if(this.loadingState !== eLoadingState.ready){
            window.setImmediate(function() {me.flowMoved(xhr, request)});
         }
         else {
            let flag: boolean = (this.getStateValue() as string)?.toLowerCase() === "true"
            this.setState({ msgboxVisible: flag });
         }
      }
   }

   async componentDidMount() {
      await super.componentDidMount();
      (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
      this.msgboxButtons = new Array();
      // build buttons from outcomes
      Object.keys(this.outcomes).forEach((name: string) => {
         let oc: FlowOutcome = this.outcomes[name];
         let icon: any;
         if(oc.attributes["icon"]) {
            icon=(
               <span 
                  className={"mb-dialog-button-bar-button-icon glyphicon glyphicon-" +  oc.attributes["icon"]?.value}
               />
            );
         }
         this.msgboxButtons.push(
            <button 
               className="mb-dialog-button-bar-button" 
               title={oc.attributes["tooltip"]?.value || oc.label || ""}
               onMouseDown={(e) => {e.stopPropagation();this.hideMessageBox(oc)}}
            >
               {icon}
               {oc.label || oc.developerName}
            </button>
        );
      });
      this.msgboxContent=this.model.content;
      this.msgboxTitle=this.model.label;
      let flag: boolean = (this.getStateValue() as string)?.toLowerCase() === "true";
      this.setState({ msgboxVisible: flag });
   }

   async componentWillUnmount() {
      await super.componentWillUnmount();
      (manywho as any).eventManager.removeDoneListener(this.componentId);
   }

   positionDialog() {
      if(this.dialog) {
         this.dialog.style.left = this.left + "px";
         this.dialog.style.top = this.top + "px";
      }
   }

   moveMe(left: number, top: number) {
      this.left = left;
      this.top = top; // - this.box.getBoundingClientRect().top;
      this.positionDialog();
   }

   onMouseDown(e: any) {
      // this.stopEventBubble(e);
      // include component bounding rect to allow for mouse offset into component
      const clientRect = e.target.getBoundingClientRect();
      const mouseOffsetY: number = e.clientY - clientRect.top;
      this.dragEvent = DragEvent.start(eDragEventType.dialog, this, e.clientX - clientRect.left, mouseOffsetY);
   }

   onMouseMove(e: any) {
      // this.stopEventBubble(e);
      if (this.dragEvent.type === eDragEventType.dialog) {
         this.moveMe(e.clientX - this.dragEvent.mouseOffsetX, e.clientY - this.dragEvent.mouseOffsetY);
      }
   }

   onMouseUp(e: any) {
      // this.stopEventBubble(e);
      if (this.dragEvent.type === eDragEventType.dialog) {
         this.dragEvent.end(null, e.clientX, e.clientY);
      }
   }

   stopEventBubble(e: any) {
      if (e.stopPropagation) { e.stopPropagation(); }
      if (e.preventDefault) { e.preventDefault(); }
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
   }

   async hideMessageBox(outcome?: FlowOutcome) {
      //let flag: FlowField = await this.loadValue(this.getAttribute("visibleValueName","ShowModal"));
      //flag.value = false;
      //await this.updateValues(flag);
      //this.setState({ msgboxVisible: false });
      this.lastContent = (<div></div>);
      this.setStateValue(false);
      let flag: boolean = (this.getStateValue() as string)?.toLowerCase() === "true";
      this.setState({ msgboxVisible: flag });
      //manywho.engine.sync(this.flowKey);
      if(outcome && outcome.attributes["noTrigger"]?.value.toLowerCase() !== "true") {
         this.triggerOutcome(outcome.developerName);
      }
   }

   render() {
      if(this.loadingState !== eLoadingState.ready) {
         return this.lastContent;
      }
      //handle classes attribute and hidden and size
      let classes: string = 'mb-redaction ' + this.getAttribute('classes','');
      let style: CSSProperties = {};
      style.width='-webkit-fill-available';
      style.height='-webkit-fill-available';

      if(this.model.visible === false || this.state.msgboxVisible !== true) {
         this.lastContent = (
            <div/>
         );
      }
      else {
         if(this.model.width) {
            style.width=this.model.width + 'px'
         }
         if(this.model.height) {
            style.height=this.model.height + 'px'
         }
         let icon: any;
         if(this.getAttribute("icon")) {
            icon=(
               <span 
                  className={"mb-dialog-header-icon glyphicon glyphicon-" +  this.getAttribute("icon")}
                  title={this.model.helpInfo}
               />
            );
         }
         this.lastContent = (
            <div
               className={classes}
               onMouseMove={(e) => {this.onMouseMove(e); }}
               onMouseUp={(e) => {this.onMouseUp(e); }}
               style={style}
            >
               <div
                  //style={style}
                  className="mb-content"
                  ref={(element: HTMLDivElement) => (this.setDialog(element))}
               >
                  <div className="mb-dialog">
                  <div
                        className="mb-dialog-header"
                        onMouseDown={(e) => {this.onMouseDown(e); }}
                  >
                        <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
                           {icon}
                        <span className="mb-dialog-header-title">{this.msgboxTitle}</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', flexGrow: 0}}>
                        <span
                           className="glyphicon glyphicon-remove mb-dialog-header-button"
                           title="Close"
                           onMouseDown={(e) => {this.stopEventBubble(e); this.hideMessageBox() }}
                        />
                        </div>
                  </div>
                  <div className="mb-dialog-body" dangerouslySetInnerHTML={{__html:this.msgboxContent}} />
                  <div className="modal-dialog-button-bar" >
                        {this.msgboxButtons}   
                  </div>
                  </div >
               </div>
         </div>
         );
      }
      return this.lastContent;
   }
}

export class modalDialogButton {
   label: string;
   handler: any;
 
   constructor(label: string, handler: any) {
     this.label = label;
     this.handler = handler;
   }
 }
 
 export enum eDragEventType
 {
     unknown,
     canvas,
     table,
     link,
     dialog
 }
 
 export class DragEvent
 {
     type: eDragEventType;
     sourceElement: any;
     targetElement: any;
     mouseX: number;
     mouseY: number;
     mouseOffsetX: number;
     mouseOffsetY: number;
 
     constructor()
     {
         this.type = eDragEventType.unknown;
         this.sourceElement = null;
         this.targetElement = null;
         this.mouseX = 0;
         this.mouseY = 0;
         this.mouseOffsetX = 0;
         this.mouseOffsetY = 0;
     }
 
     public static start(type: eDragEventType, sourceElement: any, mouseX: number, mouseY: number): DragEvent
     {
         const evt: DragEvent = new DragEvent();
         evt.type = type;
         evt.sourceElement = sourceElement;
         evt.targetElement = null;
         evt.mouseX = mouseX;
         evt.mouseY = mouseY;
         evt.mouseOffsetX = mouseX;
         evt.mouseOffsetY = mouseY;
         return evt;
     }
 
     drag(mouseX: number, mouseY: number)
     {
         this.mouseX = mouseX;
         this.mouseY = mouseY;
     }
 
     end(target: any, mouseX: number, mouseY: number) : any
     {
 
         this.targetElement = target;
         this.mouseX = mouseX;
         this.mouseY = mouseY;
 
         this.type=eDragEventType.unknown;      
     }
 }

manywho.component.register('ModalDialog', ModalDialog);
