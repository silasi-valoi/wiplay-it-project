import React from 'react';
import { BrowserRouter,Link } from "react-router-dom";
import { MatchMediaHOC } from 'react-match-media';
import { Editor } from "draft-js";
import {pageMediaBlockRenderer} from 'templates/draft-editor';

import { UpVoteReplyBtn,
         DownVoteReplytBtn,
         OpenEditorBtn,
         OpenOptionlBtn,
         ChangeImageBtn,
         OpenUsersModalBtn,} from 'templates/buttons';

import {ButtonsBox} from "templates/partials";
import Api from 'utils/api';
import  * as types  from 'actions/types';
import ReplyChildrenBox from "containers/main/replies/reply-children-page";
import ReplyGrandChildrenBox from "containers/main/replies/reply-grand-children-page";
import ReplyGreatGrandChildBox from "containers/main/replies/reply-great-grand-child-page";
import Helper from 'utils/helpers';
import { GetModalLinkProps } from "templates/component-props";
import { UserComponentSmall } from "templates/profile";

const api      = new Api();
const helper   = new Helper();

export const RepliesComponent = props => {
  // console.log(props.replyState)

   let replyStyles = {
         border     : 'px solid black',
         margin     : '15px 22px',
   }
   
   var replies   =   props.entities.replies;
   replies =  replies[props.repliesById];
   return(
      <div>
   
         { replies.replyList.map( (reply, index) => { 
            let replyProps = {
               reply,
               byId : props.repliesById,
               index,
               replyStyles,
               props
            }
                         
         return (
            <div key={index} >
                { props.comment.id === reply.comment?
                    <div  className="reply-container">
                        <div  className="reply-contents"> 
                            <Reply {...replyProps}/>
                            <ReplyChildrenBox {...replyProps}/>
                        </div>

                    </div>

               :""

               }
            </div>
         )

         }

         )}

      </div>


   )
}





export const ReplyChildernComponent = props => {
    //console.log(props)

    let replyStyles = {
             
               border     : 'px solid blue',
               margin     : '15px 22px 10px  38px',
    };
     
    var replies   =   props.entities.replies;
    replies =  replies[props.replyChildrenById];

    return(
        <div>

         { replies.replyList.map( (reply, index) => {
            let replyProps = {
               reply,
               byId : props.replyChildrenById,
               index,
               replyStyles,
               props
            }
            
            return (

               <div  key={index} >
                    { props.childParent.id === reply.parent?

                    <div className="reply-child-container">
                  
                     <div className="reply-child-contents"> 
                        <Reply {...replyProps}/>
                     </div>

                     { reply.has_children?
                           <ReplyGrandChildrenBox {...replyProps}/>
        
                           :
                           ''
                     }

                  </div>

                  : ""
                  } 
               </div> 
              ) 
            }

         )}

      </div>

   )
}




export const ReplyGrandChildernComponent = props => {
 
  let replyStyles = {
            border    : 'px solid red',
            margin    : '15px 22px 10px 60px',
         }

   var replies   =   props.entities.replies;
   replies =  replies[props.grandChildById];
   return(
         <div >

            { replies.replyList.map( (reply, index) => {
               let replyProps = {
                  reply,
                  byId : props.grandChildById, 
                  index,
                  replyStyles,
                  props
               }
               
            return(  
               <div  key={index}>
                  { props.grandChildParent.id === reply.parent?
                     <div className="reply-grand-child-container">
                        <div className="reply-grand-child-contents"> 
                           <Reply {...replyProps }/>
                        </div>
                        { reply.has_children?
                           <ReplyGreatGrandChildBox {...replyProps} />
                              :
                           ''
                        }

                     </div>
                     :

                     ""
                  }

               </div> 
            )
            }

           )}

         </div>

        
   )
}




export const ReplyGreatGrandChildComponent = props => {
    console.log(props)

    let replyStyles = {
             
              border     : 'px solid green',
              margin     : '15px 22px 10px 75px'
            }

    var replies   =  props.entities.replies;
    replies       =  replies[props.byId];
    var replyList =  replies.replyList;

    return(
         <div>
            {replyList.map( (reply, index) => {
               let replyProps = {reply,index,replyStyles,props}
                
                return(

                    <div  key={index}>
                        {props.greatGrandChildParent?.id === reply?.parent &&
                            <div className="reply-great-grand-child-container">
                                <div className="reply-great-grand-child-contents"> 
                                    <Reply {...replyProps}/>
                                </div>
                            </div>
                        }
                    </div>  
                )
            })}
        </div>
    )
}




export const Reply = (props, replyProps=undefined, isNewReply=false) => {
  
    let optionsBtnStyles = {
              fontSize   : '11px',
              background : ' #F5F5F5',
              fontWeight : 'bold',
              width      : '40px',
              color      : '#4A4A4A',
              margin     : '0 0 2px'
    }
    
    let { answer,
         post,
         currentUser,
         isAnswerBox,
         isAuthenticated,
         isPostBox } = props;

   let {
        byId,
        newRepliesById, 
        reply,
        replyStyles } = replyProps && replyProps  
    
   const editorState  = helper.convertFromRaw(reply.reply);
  
   let state = {
            reply,
            usersIsFor : answer? 'answerReplyUpVoters' : 'postReplyUpVoters', 
        }

   let pathToUpvoters;

   var createApiUrl = '';
   var updateUrl    = ''; 

    if (answer) {

        pathToUpvoters =  `/answer/reply/${reply.id}/upvoters/`;
        updateUrl    = api.updateAnswerReplyApi(reply.id);
        createApiUrl = api.createAnswerReplyChildApi(reply.id);
      
    }
    else{
      pathToUpvoters =  `/post/reply/${reply.id}/upvoters/`;
      updateUrl    = api.updatePostReplyApi(reply.id);
      createApiUrl = api.createPostReplyChildApi(reply.id);
      
    }

    let usersById = reply && isAnswerBox && `answerReplyUpVoters${reply.id}` ||
                    reply &&  `postReplyUpVoters${reply.id}`;

    let apiUrl    = reply && isAnswerBox && api.getAnswerReplyUpVotersListApi(reply.id) ||
                    reply && api.getPostReplyUpVotersListApi(reply.id);

    let linkName = reply.upvotes > 1 && `${reply.upvotes} Upvoters` || `${reply.upvotes} Upvoter`;

    byId = isNewReply && newRepliesById || byId;


    let replyUpvotersProps = {
            apiUrl,
            byId      : usersById,
            obj       : reply,
            currentUser,
            isAuthenticated,
            linkName,
        };
   
     
    let editObjProps = {
        objName     : 'Reply',
        isPut       : true,
        obj         : reply, 
        byId,
        apiUrl      : updateUrl,
        currentUser,
        isAuthenticated,
    };



    let createObjProps = {
        objName           : 'Reply',
        obj               : reply,
        isPost            : true,
        byId              :  `newReplies${reply.id}`,
        currentUser,
        isAuthenticated,
        apiUrl            : createApiUrl,
        className         : 'btn-sm edit-reply-btn',
    };

    editObjProps = GetModalLinkProps.props(editObjProps);
    createObjProps = GetModalLinkProps.props(createObjProps);
   
    let EditorModalBtn   = <OpenEditorBtn {...createObjProps}/>; 
    
    
    let ReplyUpVotersBtn = reply.upvotes !== 0 &&
                           <OpenUsersModalBtn {...replyUpvotersProps}/> 

    

    let btnsProps = {
        ...props,
        editObjProps,
        createObjProps,
        btnStyles:optionsBtnStyles,
        btnText : 'More', 
    }; 

    
    let upvoteBtn =  reply.upvoted && <DownVoteReplytBtn {...btnsProps}/> ||
                                     <UpVoteReplyBtn {...btnsProps}/>

    const btnsList  = {
        itemsCounter :  ReplyUpVotersBtn,
        btn1         :  upvoteBtn,
        btn2         :  EditorModalBtn,
        btn3         :  <OpenOptionlBtn {...btnsProps}/>,
    } 

    const userProps  = {
            obj   : reply,
            currentUser,
    };

    return (
         <div style={ replyStyles}  className="reply-box" id="reply-box">
            <div className="autor-details-box">
                <UserComponentSmall {...userProps}/>
            </div>

         
            <div className="reply">
               <Editor
                 blockRendererFn={pageMediaBlockRenderer}
                 editorState={editorState} 
                 readOnly={true} />
            </div>
            
            
          <ButtonsBox {...btnsList}/>


         </div>
    
   )
}








export const RepliesLink = props => {
   //console.log(props)



   let styles:object = {
      border        : "px solid #D5D7D5",
      display       : 'flex',
      flexDirection : 'row',
      margin        : '10px 60px',
      padding       : '2px 2px 2px 7px',
      borderRadius  : '20px',
      background    : '#EEEEEE'
   }
  
   let userStyles:object = {
      display       : 'flex',
      border        : 'px solid blue',
      padding       : '2px',
      listStyleType : 'none',
      margin        : '0',
   }


  let itemStyles:object = {
   display       : 'flex',
   border        : 'px solid blue',
   listStyleType : 'none',
   margin        : '0',
   padding       : '0',
        
  }

   let imgStiles:object = {
      borderRadius  : '50%',
      width         : '17px',
      height        : '19px',
      
       
   }

   let userNameStyles:object = {
       border      : 'px solid blue',
       fontSize    : '11px',
       color       : '#2C2D2D',
       fontFamily  : 'Mukta',
       lineHeight  : '1.8',
       margin      : '0 0 0 3px',
   } 

   let totalRepliesStyles:object = {
      border      : 'px solid red',
      fontSize    : '9px',
      margin      : '2px 0 0 10px',
      lineHeight  : '1.8',
   }

   let textStyles:object = {
      color       : 'black',
      fontSize    : '9px',
      border      : 'px solid black',
      lineHeight  : '1.8',
      margin      : '2px 0 0 4px',
   }
   
   return (
      <div style={styles} className="comments-link">

         <ul style={ userStyles}>
            <li style={ imgStiles }>
               { props.reply.author.profile.profile_picture === null?
                  <img alt="" src={require("media/user-image-placeholder.png")} className="profile-photo"/>
               :  
                  <img alt="" src={props.reply?.author?.profile.profile_picture}
                         className="profile-photo"/> 
               }

            </li>
            <li style={ userNameStyles } >
               { props.reply?.author?.first_name }   { props.reply?.author?.last_name } ...
            </li>
         </ul>

         <ul style={ itemStyles} >
            <li style={ textStyles } > Replied </li>
            <li style={totalRepliesStyles}> { props.totalReplies } Reply</li>
         </ul>
      </div>
   )
}


export const CommentsReplyLink = props => {
   var byId = props.repliesById;
   var replies   =  props.entities.replies;
   var linkData  =  replies[byId].linkData;
   var reply     =  linkData.reply;
  
   var apiUrl = '';
   if (props.isAnswerBox) { 
     apiUrl = api.getAnswerReplyListApi(reply.comment);
   }else{
      apiUrl = api.getPostReplyListApi(reply.comment);
   }

   var replyProps = {
      actionType: types.GET_REPLY_LIST,
      apiUrl    : apiUrl,
      byId,

   }; 
   return(
      <div  className="reply-link-box"
                  onClick={ () => props.getReplyList(replyProps) }> 
         <RepliesLink {...linkData}/>
      </div> 
   );
};



export const ChildRepliesLink = props => {
   var byId     = props.replyChildById;
   var replies  = props.entities.replies[byId]
   
   var linkData = replies.linkData;
   var reply    = props.childParent;
    
   var apiUrl = '';
   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType : types.GET_REPLY_CHILD_LIST,
      apiUrl     : apiUrl,
      byId,
      children   : reply.children,
   };

   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps, reply.children) }> 
         <ul>
            <li>Click to view More</li>
            <li>{ linkData.totalReplies }</li>
         </ul>
      </div> 
   );
};


export const GrandChildRepliesLink = props => {
   var reply     = props.childParent;
   var byId      = props.replyChildById ;
   var replies   = props.entities.replies[byId]
   var linkData  = replies.linkData;
  
   var apiUrl    = '';

   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType : types.GET_REPLY_CHILD_LIST,
      apiUrl     : apiUrl,
      byId,
      children  : reply.children,
   }; 

   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps) }> 
           <ul>
            <li>Click to view More</li>
            <li>{ linkData.totalReplies }</li>
         </ul>
      </div> 
   );
};



export const GreatGrandChildRepliesLink = props => {
   var byId = props.replyChildById;
   var replyState = props.entities.replies[byId];

   var linkData  = replyState.linkData;
   var reply     = props.greatGrandChildParent;
   var apiUrl = '';
   
   if (props.isAnswerBox) { 
      apiUrl = api.getAnswerReplyChildrenListApi(reply.id);
   }else{
      apiUrl = api.getPostReplyChildrenListApi(reply.id);
   }

   var replyProps = {
      actionType: types.GET_REPLY_CHILD_LIST,
      apiUrl    : apiUrl,
      byId,
      
   }; 
   return(
      <div onClick={ () => props.getReplyChildrenList(replyProps) }> 
         <ul>
            <li>Click to view More</li>
            <li>{linkData.totalReplies}</li>
         </ul>
      </div> 
   );
};








