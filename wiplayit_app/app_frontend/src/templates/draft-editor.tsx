import React from 'react';
import * as Icon from 'react-feather';
import { ModalManager}   from  "containers/modal/modal-container";
import { ModalCloseBtn } from "templates/buttons"
import LinkInput from 'containers/draft-js-editor/input';
import { Editor, Entity,CompositeDecorator, EditorState } from 'draft-js';
import TextareaAutosize from 'react-autosize-textarea';




export const ToolBar = props => {
    const textStyles  = ['BOLD', 'ITALIC'];
    const mediaStyles = ['Video','Image', 'Link', 'MoreOptions']

    const buttons = textStyles.map(style => {
        let button;
        let buttonProps = {};
        buttonProps['name']   = style;
      
        //console.log(props)
      
          
        if (style === 'BOLD' || style === "ITALIC") {

            if (style === "BOLD" ) {
                buttonProps['onClick'] = props.addBold;
                buttonProps['boldOnClick']  = props.boldOnClick;
                buttonProps['className'] = props.boldOnClick?
                                      "btn-sm active toolbar-button":
                                      "btn-sm toolbar-button";
                button = <Button {...buttonProps} key={style}>
                            <Icon.Bold className="toolbar-btn-icon"  size={20}/>
                         </Button>   
            }

            else if (style === "ITALIC") {
                buttonProps['onClick'] = props.addItalic;
                buttonProps['className'] = props.italicOnClick?
                                      "btn-sm active toolbar-button":
                                      "btn-sm toolbar-button";
      
                button = <Button {...buttonProps} key={style}>
                        <Icon.Italic className="toolbar-btn-icon"  size={20}/>
                    </Button>   
            }
        }

        return button;
    });


    const MediaBtns = mediaStyles.map(style => {
        let button;
        let buttonProps = {};
        buttonProps['style']  = style
       
        if(style === "Image" || style === "Video") {
                      
            buttonProps['onChange']     = props.onURLChange;
            

            if (style === "Image" ) {
               buttonProps['name']         = 'image';
               buttonProps['accept']       = 'image/*'; 
             
                button = <ImageButton  key={style} {...buttonProps}>
                            <Icon.Camera className="toolbar-btn-icon" size={20}/>
                        </ImageButton> 
            }
            else if (style === "Video"){
                buttonProps['name']         = 'video'
                buttonProps['accept']       = 'video/*';
                button = <ImageButton  key={style} {...buttonProps}>
                            <Icon.Video className="toolbar-btn-icon" size={20}/>
                        </ImageButton>
            }

        }

        else if(style === "MoreOptions"){
            buttonProps['name']         = 'more-options'
            buttonProps['onClick']      = props.moreBtns;
            buttonProps['buttonFormat'] = 'more_horiz'; 
            buttonProps['className']    = "btn-sm toolbar-button";

            button = <Button  key={style} {...buttonProps}>
                        <Icon.MoreHorizontal  className="toolbar-btn-icon"  size={20}/>
                    </Button>

        }

        else if(style === "Link"){
            buttonProps['name']         = 'LINK'
            buttonProps['onClick']      = props.promptLinkIpunt;
            buttonProps['buttonFormat'] = 'insert_link'; 
            buttonProps['className']    = "btn-sm toolbar-button";
            button = <Button key={style} {...buttonProps}>
                        <Icon.Link2 className="toolbar-btn-icon"  size={20}/>
                     </Button>  

        }

        return button;

    });

    let LinkInputProps:object = {handleAddLink:props.handleAddLink}

    return (
         <div id='toolbar'>
            <div>
            { props.onLinkInput?
               <LinkInput {...LinkInputProps}/>
               :
               <ul className='navigation-toolbar'  onMouseDown={(e)=>e.preventDefault()}>
                  <li className="text-btns">
                     { buttons }
                  </li>

                 <li className="media-btns">
                     {MediaBtns}
                  </li>
               </ul>
            }
            </div>
         </div>
    )
}; 



const ImageButton = props => {
   
   return (
      <label  id="fileContainer" className="btn-sm toolbar-button">
         <input
            type="file"
            accept={props.accept} 
            name={props.name}
            onChange={props.onChange}
            className="image-input toolbar-button"
            value={ props.urlValue }
         />
         {props.children}
      </label>
     
   )
}


const Button = props => {
   //console.log(props)
   const style = props.boldOnClick? props.active:{}; 
   //console.log(style)
               
    return (

        <button
            style={style}
            onClick={props.onClick} 
            name={props.name} 
            className={props.className}>
            {props.children}
        </button>

   )
}

54


export const MobileModalNavBar = props  => {
    //console.log(props)
    let { isPut,
          isPost,
          modalTitle,
          objName,
          isDraftEditor } = props;

    let action = isPut && "Edit" || isPost && "Create";

    modalTitle = !modalTitle &&  `${action} ${objName}` ||  modalTitle;

    let SubmitBtn = ()=>(
            <button type="button" onClick={()=> props.submit()}
                            className="editor-submit-btn submit-btn">
                        Submit
            </button>
        )
    
    let DoneBtn = ()=>(
            <div className="submit-btn-box">
                <ModalCloseBtn> 
                    <span className="btn modal-custom-back-btn">
                        Done
                    </span>
                </ModalCloseBtn> 
            </div>
        )
       
    return (
        <div id="modal-navbar-container" className="fixed-top">
            <div className="modal-navbar-box"> 
                <ul className="partial-navbar-back-btn-box">
                    <ModalCloseBtn> 
                       <Icon.ArrowLeft id="feather-x" size={20} color={'white'}/>
                    </ModalCloseBtn>     
                </ul>

                <ul className="modal-title-box">
                    <li className="modal-title">{modalTitle || ''}</li>  
                </ul>
         
                <div className="modal-submit-btn-box">
                    { isDraftEditor?
                        <SubmitBtn/>
                        :
                        <DoneBtn/>
                    }
         
                </div>
            </div>

            { isDraftEditor && objName !== 'Question'?
                <div className="editor-btns-box">
                    <ToolBar {...props}/>
                </div>
                :
                null
            }
        </div>    
    ); 
}


export const DesktopModalNavBar = (props) => {
    
    let {isPut, isPost, modalTitle, objName } = props;
    let action = isPut && "Update" || isPost && "Add";

    modalTitle = !modalTitle &&  `${action} ${objName}` ||  modalTitle;

    return(
        <div className="modal-navbar-top">
            <ul className="modal-title-box">
                <li className="modal-title">{modalTitle || ""}</li>
            </ul>

            <div className="desktop-modal-close-btn">
                <ModalCloseBtn> 
                    <Icon.X id="feather-x" size={20} color="white"/>
                </ModalCloseBtn> 
            </div>
        </div>
    )  
};

export const DesktopToolBar = (props) => {
    let {objName, submit} = props;
    return(
        <div className="editor-navbar-bottom">
            <div className="toolbar-box">
                { objName === "Question"?
                    null
                    :
                    <ToolBar {...props}/>
                }
            </div>

            <div className="editor-submit-btn-box">
                <button type="button" onClick={()=> submit()}
                        className="editor-submit-btn">
                        Submit
                </button>
            </div>
        </div>
    );
};

export const TextAreaEditor = props => {
    //console.log(props)
    return (
        <form className="textarea-form">
            <TextareaAutosize {...props.textAreaProps} rows={1}/>
        </form>
    );

}


export const PostEditor = (props) => {
    let {onScroolStyles, handleFocus} = props;
    
    return(
        <div className="post-editor-box">
            <div style={onScroolStyles} 
                 id="editors-box"
                 className="editors-box post-textarea-editor-box">
                <TextAreaEditor   {...props} rows={2}/>
                
                <div className="post-draft-editor-box" onClick={()=> handleFocus()}>
                    <DraftEditor {...props}/>
                </div>
            </div>
        </div>
    );
};


export const QuestionEditor = (props) => {
    let {onScroolStyles} = props;

    return(
        <div className="editors-page" id="editors-page">
        <div className="question-editor-box">
            <div style={onScroolStyles} id="editors-box" className="editors-box">
                <div className="question-form-box">
                    <TextAreaEditor {...props} rows={2}/>
                </div> 
            </div>
        </div>
        </div>
    );

};

export const DraftEditor = props => {
       
	return (
        <div className="draft-editor">
            <Editor 
                editorState={props.editorState} 
                blockRendererFn={mediaBlockRenderer}
                handleKeyCommand={props.handleKeyCommand}
                keyBindingFn={props.keyBindingFn}
                onChange={props.onChange}
                decorators={CompositeDecorator}
                blockStyleFn={props.blockStyleFn}
                placeholder={props.editorPlaceHolder}
                ref={input => props.self.editor = input}
                onBlur={props.handleBlur}
            />
        </div>
    )        
}

export  function mediaBlockRenderer(block) {
        
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        }
    }
    return null;
}

export  function pageMediaBlockRenderer(block) {
        
    if (block.getType() === 'atomic') {
        return {
            component: MediaPage,
            editable: false,
        };
    }
    return null;
};   


const Image = (props) => {
   return <img alt="" src={props.src} style={styles['media']}/>
};

const Video = (props) => {
   return <video controls src={props.src} style={styles['media']} />;
};


const Media = (props) => {
    let {contentState, block} = props;
    let entityKey = props.block.getEntityAt(0);

    if (!entityKey) return null;

    const entity = contentState.getEntity(entityKey);
    const {src} = entity.getData();
    const type = entity.getType();
    
    let media;
    if (type === 'image') {
      media = <Image src={src} />;
    }
    else if (type === 'video') {
      media = <Video src={src} />;
    }
   return media;
};

const MediaPage = (props) => {
   let {contentState, block} = props;
   let blockEntity = props.block.getEntityAt(0);

    if (!blockEntity) return null;

    const entity = props.contentState.getEntity(blockEntity);
    const {src}  = entity.getData();
    const type   = entity.getType();
    let media;
       
    if (type === 'image') {
        media = <div style={styles['imageBox']}>
                 <img alt="" src={src} style={styles['mediaPage']}/>
             </div>;
    }
    else if (type === 'video') {
        media = <div style={styles['imageBox']}>
                  <video controls src={src} style={styles['mediaPage']} />;
                </div>;
    }
    return media;
};
    

const styles:object = {
    root: {
       fontFamily: '\'Georgia\', serif',
       padding: 20,
       width: 600,
    },
    buttons: {
       marginBottom: 10,
    },
    urlInputContainer: {
       marginBottom: 10,
    },
    urlInput: {
      fontFamily: '\'Georgia\', serif',
      marginRight: 10,
      padding: 3,
   },
   editor: {
      border: '1px solid #ccc',
      cursor: 'text',
      minHeight: 80,
      padding: 10,
   },

   button: {
      marginTop: 10,
      textAlign: 'center',
   },

   media: {
      width     : '50%',
      height    : 'auto',
      objectFit : 'cover',
   },

   mediaPage: {
      width     : '100%',
      maxWidth  : '100%',
      height    : 'auto',
      objectFit : 'cover',
   },

   imageBox: {
      border    : 'px solid red',
      margin    : '0 10px',
   }
};









