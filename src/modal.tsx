import React, { CSSProperties } from 'react';
import './modal.css';
import DragEvent , { eDragEventType } from './DragEvent';
import './EventManager';
import FlowAJAX from './FlowAJAX';

declare const manywho: any;

export default class ModalDialog extends React.Component<any,any> {

   version: string='1.0.0';
   context: any;
   lastContent: any = (<div></div>);
   dragEvent: DragEvent = new DragEvent();
   modal: any;
   dialog: HTMLDivElement;

   top: number = 0;
   left: number = 0;

   //msgboxTitle: string = '';
   //msgboxButtons: Array<any> = new Array();
   //msgboxContent: any;
   //msgboxOnClose: any = this.hideMessageBox;


   constructor(props: any) {
      super(props);
      this.flowMoved = this.flowMoved.bind(this);
      this.setDialog = this.setDialog.bind(this);
      this.positionDialog = this.positionDialog.bind(this);
      this.state = {visible: false};
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
      if(xhr.invokeType==='FORWARD' || xhr.invokeType==='SYNC') {
         manywho.model.parseEngineResponse(xhr, this.props.flowKey);
         let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
         let visible: boolean = await this.getVisibility();
         if(this.state.visible !== visible) {
            this.setState({visible: visible}); 
         } 
      }
   }

   async componentDidMount() {
      let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
      let state = manywho.state.getComponent(this.props.id, this.props.flowKey);
      (manywho as any).eventManager.addDoneListener(this.flowMoved, this.props.id);
      
      let visible: boolean = await this.getVisibility();
      if(this.state.visible !== visible) {
         this.setState({visible: visible}); 
      } 
   }

   async getVisibility() : Promise<boolean> {
      let visible: boolean = false;
      let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
      if(model) {
         if(model.attributes.state) {
            //could be either a tag or an explicit Flow field
            let tag = model.tags?.find((element: any) => element.developerName === model.attributes.state);
            if(tag){
               visible=tag.contentValue.toLowerCase() === "true";
            }
            else {
               const value: any = await FlowAJAX.getValue(this.props.flowKey, model.attributes.state);
               visible = (value?.contentValue as string).toLowerCase() === "true"; 
            }
         }
         else {
            //must be the state value from the model
            visible = (model?.contentValue as string).toLowerCase() === "true"; 
            let newState = { "contentValue": model.visible };
            manywho.state.setComponent(this.props.id, newState, this.props.flowKey);
         }
      }
      //this.setState({visible: visible})
      return visible;
  }

   componentWillUnmount() {
      (manywho as any).eventManager.removeDoneListener(this.props.id);
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

   async hideMessageBox(outcome?: any) {

      //this.lastContent = (<div></div>);
      //let state = manywho.state.getComponent(this.props.id, this.props.flowKey)
      //state.contentValue=false;
      this.setState({ visible: false });
      //manywho.engine.sync(this.flowKey);
      if(outcome && outcome.attributes?.noTrigger?.toLowerCase() !== "true") {
         await manywho.component.onOutcome(outcome, null, this.props.flowKey);
      }
      else {
            //await manywho.engine.sync(this.props.flowKey);
      }
   }

   render() {
      let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
      if(model.loading === true) {
         return this.lastContent;
      }
      //handle classes attribute and hidden and size
      let classes: string = 'mb-redaction ' + model.attributes["classes"];
      let style: CSSProperties = {};
      style.width='-webkit-fill-available';
      style.height='-webkit-fill-available';

      if(model.isVisible === false || this.state.visible !== true) {
         this.lastContent = (
            <div/>
         );
      }
      else {
         let msgboxButtons = new Array();
         // build buttons from outcomes
         let outcomes: any = manywho.model.getOutcomes(this.props.id,this.props.flowKey);
         outcomes.forEach((outcome: any) => {
            let icon: any;
            if(outcome.attributes?.icon) {
               icon=(
                  <span 
                     className={"mb-dialog-button-bar-button-icon glyphicon glyphicon-" +  outcome.attributes?.icon}
                  />
               );
            }
            msgboxButtons.push(
               <button 
                  className="mb-dialog-button-bar-button" 
                  title={outcome.attributes?.tooltip || outcome.label || ""}
                  onMouseDown={(e) => {e.stopPropagation();this.hideMessageBox(outcome)}}
               >
                  {icon}
                  {outcome.label || outcome.developerName}
               </button>
         );
         });
         
         if(model.width) {
            style.width=model.width + 'px'
         }
         if(model.height) {
            style.height=model.height + 'px'
         }
         let icon: any;
         if(model.attributes["icon"]) {
            icon=(
               <span 
                  className={"mb-dialog-header-icon glyphicon glyphicon-" +  model.attributes["icon"]}
                  title={model.attributes?.tooltip || model.helpInfo}
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
                        <span className="mb-dialog-header-title">{model.attriubes?.title || model.label}</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', flexGrow: 0}}>
                        <span
                           className="glyphicon glyphicon-remove mb-dialog-header-button"
                           title="Close"
                           onMouseDown={(e) => {this.stopEventBubble(e); this.hideMessageBox() }}
                        />
                        </div>
                  </div>
                  <div className="mb-dialog-body" dangerouslySetInnerHTML={{__html:model.content}} />
                  <div className="mb-dialog-button-bar" >
                        {msgboxButtons}   
                  </div>
                  </div >
               </div>
         </div>
         );
      }
      return this.lastContent;
   }
}
 

manywho.component.register('ModalDialog', ModalDialog);
