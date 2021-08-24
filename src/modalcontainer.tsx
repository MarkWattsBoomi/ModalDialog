import React, { CSSProperties } from "react";
import DragEvent , { eDragEventType } from './DragEvent';
import FlowAJAX from "./FlowAJAX";
import './modal.css';
import './EventManager';

declare const manywho: any;

export default class ModalContainer extends React.Component<any,any> {

    container: any;
    redactionElement: HTMLElement;
    lastContent: any = (<div></div>);
    dragEvent: DragEvent = new DragEvent();
    dialog: HTMLDivElement;
    top: number = 0;
    left: number = 0;
    msgboxButtons: Array<any> = new Array();
    msgboxContent: any;

    constructor(props: any) {
        super(props);

        this.getVisibility = this.getVisibility.bind(this);
        this.flowMoved = this.flowMoved.bind(this);
        this.setDialog = this.setDialog.bind(this);
        this.positionDialog = this.positionDialog.bind(this);
        this.hideMessageBox = this.hideMessageBox.bind(this);
        this.state = {visible: false};

        // get and save top level repeating container
        this.container = manywho.model.getContainer(this.props.id, this.props.flowKey);
    }

    async componentDidMount() {
        
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.props.id);
        
        // get and save top level repeating container
        this.container = manywho.model.getContainer(this.props.id, this.props.flowKey);

        // get model, it should be defined in an attribute called ListField
        if (!this.container.attributes?.state) {
            console.log('No state attribute specified on modal to control visibility');
        } 

        let visible: boolean = await this.getVisibility();
        if(this.state.visible !== visible) {
            this.setState({visible: visible}); 
        } 
        //this.forceUpdate();
    }

    async componentWillUnmount() {
        //await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.props.id);
    }

    async componentDidUpdate() {
        //let visible: boolean = await this.getVisibility();
        //if(this.state.visible !== visible) {
        //    this.setState({visible: visible}); 
        //} 
    }

    async componentWillUpdate() {
        //let visible: boolean = await this.getVisibility();
        //if(this.state.visible !== visible) {
        //    this.setState({visible: visible}); 
        //} 
    }

    async componentWillReceiveProps() {
        //let visible: boolean = await this.getVisibility();
        //if(this.state.visible !== visible) {
        //    this.setState({visible: visible}); 
        //} 
    }

    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==='FORWARD' || xhr.invokeType==='SYNC') {
            manywho.model.parseEngineResponse(xhr, this.props.flowKey);     
            let visible: boolean = await this.getVisibility();
            if(this.state.visible !== visible) {
                this.setState({visible: visible}); 
            } 
        }
    }


    setDialog(dialog: HTMLDivElement) {
        this.dialog = dialog;
        if(this.dialog && this.dialog.offsetParent) {
  
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



    async getVisibility() : Promise<boolean> {
        let visible: boolean = false;
        this.container = manywho.model.getContainer(this.props.id, this.props.flowKey);
        if(this.container) {
            //could be either a tag or an explicit Flow field
            let tag = this.container.tags?.find((element: any) => element.developerName === this.container.attributes.state);
            if(tag){
                visible=tag.contentValue.toLowerCase() === "true";
            }
            else {
                const value: any = await FlowAJAX.getValue(this.props.flowKey, this.container.attributes.state);
                visible = (value?.contentValue as string).toLowerCase() === "true"; 
            }
        }
        //this.setState({visible: visible})
        return visible;
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
        //if(this.redactionElement) {
        //    this.setState({visible: false});
        //}
        
        if(outcome) {
            await manywho.component.onOutcome(outcome, null, this.props.flowKey);
        }
        else {
            //await manywho.engine.sync(this.props.flowKey);
        }
    }

    render() : any {
        let content: any = <div/>;
        if(this.container) {     
            let containerElement = document.getElementById(this.container.id);
            if(containerElement) {
                if(this.container.isVisible === false || this.state.visible === false) {
                    // hide the original container
                    containerElement.style.display = "none";
                }
                else {
                    containerElement.style.display = "";

                    const childData : Array<any> = manywho.model.getChildren(containerElement.id, this.props.flowKey);

                    let msgboxButtons: Array<any> = new Array();
                    let closeButton: any;
                    let displayChildData: Array<any> = [];
                    childData?.forEach((childElement: any) => {
                        if(childElement.componentType?.toLowerCase() === "outcomes") { //} && childElement.developerName.toLowerCase()==="modaloutcomes") {
                            let outcomes: any = manywho.model.getOutcomes(childElement.pageComponentId,this.props.flowKey);
                            
                            if(this.container.attributes?.closeOutcome) {
                                let closeOutcome: any = outcomes.find((outcome: any) => outcome.value === this.container.attributes["closeOutcome"].value);
                                if(closeOutcome) {
                                closeButton = (
                                    <span
                                        className="glyphicon glyphicon-remove mb-dialog-header-button"
                                        title="Close"
                                        onMouseDown={(e) => {this.stopEventBubble(e); this.hideMessageBox(closeOutcome) }}
                                    />
                                );
                                }
                            }
                            outcomes?.forEach((outcome: any) => {

                                let icon: any;
                                if(outcome.attributes?.icon) {
                                    icon=(
                                    <span 
                                        className={"mb-dialog-button-bar-button-icon glyphicon glyphicon-" +  outcome.attributes["icon"]}
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
                        }
                        else {
                            displayChildData.push(childElement)
                        }
                    });

                    let children: any = manywho.component.getChildComponents(displayChildData, containerElement.id, this.props.flowKey);

                    let icon: any;
                    if(this.container.attributes["icon"]) {
                        icon=(
                        <span 
                            className={"mb-dialog-header-icon glyphicon glyphicon-" +  this.container.attributes["icon"]}
                            title={this.container.attributes["tooltip"]}
                        />
                        );
                    }

                    let classes: string = 'mb-redaction ' + this.container.attributes?.classes;
                    let style: CSSProperties = {};
                    
                    content = (
                        <div
                            className={classes}
                            onMouseMove={(e) => {this.onMouseMove(e); }}
                            onMouseUp={(e) => {this.onMouseUp(e); }}
                            style={style}
                            ref={(element: HTMLDivElement) => {this.redactionElement = element}}
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
                                            <span className="mb-dialog-header-title">{this.container.attributes["title"]}</span>
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', flexGrow: 0}}>
                                            {closeButton}
                                        </div>
                                </div>
                                <div className="mb-dialog-body" >
                                    {children}
                                </div>
                                <div className="mb-dialog-button-bar" >
                                        {msgboxButtons}   
                                </div>
                                </div >
                            </div>
                        </div>
                    );                    
                }
            }
        }
        return content;
    }

}

export const getChartContainer = () => ModalContainer;
// : typeof G13PageSectionRepeater =>
// manywho.component.getByName("charts") || ChartContainer
manywho.component.registerContainer('charts', ModalContainer);
//manywho.component.registerContainer('mark', ModalContainer);