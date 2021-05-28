import React from 'react';
import { Link, Router } from "react-router-dom";
import * as Icon from 'react-feather';
import {history} from "App" 
import { MatchMediaHOC } from 'react-match-media';
import {ModalManager, Modal}   from  "containers/modal/modal-container";
import {closeModals}   from  'containers/modal/helpers';
import { store } from "store/index";
import {showModal, handleError} from 'actions/actionCreators';
import {IsBookMarked, pushToRouter} from 'utils/helpers';


 let unfollowedBtnStyles = {
        backgroundColor : '#E3EBF2', 
        color           : '#288FF0',
        border          : '1px solid #B7D5F0'
    };

    let  followedBtnStyles = {
        backgroundColor : '#EFEEEE', 
        color           : '#999999',
        border          : '1px solid #CFCFCF'
    };

export const LinkButton = (props)=>{
    let linkPath = props['linkPath'];

    return(
        <a href={linkPath} onClick={(event) => pushToRouter(props, event) }>
            {props['children']}
        </a>
    )
};

export const FollowUserBtn = props => {
       
    let {currentUser,
         editObjProps,
         editfollowersOrUpVoters } = props;

    let obj = editObjProps?.obj;
    
    let btnText        =  obj?.user_is_following && "Following" || "Follow";
    var followers_text =  obj?.profile.followers > 1 && 'Followers' || 'Follower';  
    let styles         =  obj?.user_is_following &&
                          followedBtnStyles || unfollowedBtnStyles;
        
    return(
        <div className="follow-btn-box">
            {obj?.email !== currentUser?.email &&
                <button 
                    style={styles} type="button" 
                    className="btn-sm follow-user-btn"
                    onClick={() => editfollowersOrUpVoters(editObjProps)}>  
                    
                    {btnText} {obj?.profile.followers }             
                </button>

                ||

                <button style={unfollowedBtnStyles} 
                        type="button" 
                        className="btn-sm num-followers-btn">
                    {obj?.profile.followers } {followers_text}
                </button>
            }
        </div>
    );
};

export const UnfollowUserBtn = props => {
    
    return(
        <button type="button"
                onClick={() => props.editfollowersOrUpVoters(props.editObjProps)}
                className="unfollow-user">
            Follow 
        </button>
    )
}                           


export const FollowQuestionBtn = props => {
    let obj = props?.editQuestionProps?.obj

    return(
        <button 
            type="button" 
            onClick={ () => props.editfollowersOrUpVoters(props.editObjProps)}
            className="btn-sm follow-question-btn" >

            <Icon.Rss 
                className="follow-btn icon-color" 
                size={20}/> Follow - {obj?.followers}       
        </button>
    )
}


export const UnfollowQuestionBtn = props => {
    let obj = props?.editQuestionProps?.obj

    return(
        <button type="button"
                onClick={() =>  props.editfollowersOrUpVoters(props.editObjProps)}
                className="btn-sm  follow-question-btn" >
            <Icon.Rss className="follow-btn" size={20}/> Following - {obj?.followers}
         </button>
    )
};


           
export const UpVotePostBtn = props => (     
   
        <button  type="button" 
            onClick={() => props.editfollowersOrUpVoters(props.editObjProps)}
            className="btn-sm  upvote-answer" >
            Upvote <span className="fa fa-arrow-up"></span>
        </button>
)


         
export const DownVotePostBtn = props => (  
      
    <button 
        type="button" 
        onClick={() =>  props.editfollowersOrUpVoters(props.editObjProps)}
        className="btn-sm icon-color upvote-answer" >
        Upvoted <span className="fa fa-arrow-up upvote-icon"></span>
    </button>
);


            
export const UpVoteAnswerBtn = props => (     
      
        <button
            type="button"
            onClick={() => props.editfollowersOrUpVoters(props.editObjProps)}
                                          className="btn-sm  upvote-answer" >
            Upvote <span className="fa fa-arrow-up"></span>
        </button>
   
);




         
export const DownVoteAnswerBtn = props => (  
    <div>       
        <button type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editObjProps)}
            className="btn-sm icon-color upvote-answer" >
            Upvoted <span className=" fa fa-arrow-up upvote-icon"></span>
        </button>
  </div>
 )


             
export const UpVoteCommentBtn = props => (     
    <div>    
        <button  type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editObjProps)}
            className="btn-sm upvote-comment-btn" >
            Upvote 
        </button>
    </div>

)


export const DownVoteCommentBtn = props => (     
    <div>    
        <button  type="button" 
            onClick={ () => props.editfollowersOrUpVoters(props.editObjProps)} 
                      className="btn-sm upvote-comment-btn" >
         Upvoted 
        </button>
    </div>
)


export const UpVoteReplyBtn = props => (     
    <div>    
        <button 
            type="button"
            onClick={ () => props.editfollowersOrUpVoters(props.editObjProps)}
            className="btn-sm upvote-reply-btn" >
            Upvote 
        </button>
    </div>

)


export const DownVoteReplytBtn = props => (     
    <div>    
        <button  
            type="button"
            onClick={() => props.editfollowersOrUpVoters(props.editObjProps)} 
            className="btn-sm  icon-color upvote-comment" >
            Upvoted 
        </button>
    </div>
)


export const ProfileOptsModalBtns = props => {
   
    return (
        <button type="button" id="logout" 
                onClick={props.logout}
                className="btn-sm logout" >
            Logout
        </button>
    )
}


export const QuestionOptsModalBtns = props => {
    let editObjProps = props?.editObjProps;

    return (
        <button type="button"
                onClick={() => {
                    closeModals(true)
                    props.editfollowersOrUpVoters(editObjProps)
                }}
                className="btn-sm">
            <Icon.Rss className="options-menu-icon" size={20}/> 
            Follow Question
        </button>
    )
};

export const OptionsMenuBtns = props => {
    
    return(
        <div className="options-menu">
            <ExtraBtns {...props}/>
            <Author {...props}/>
        </div>
    )
};

export const Author = props =>{
    let {currentUser} = props;
    let obj = props.editObjProps?.obj;
    
    if(obj?.author?.id != currentUser?.id) return null

    return(
        <div className="options-menu">
            <OpenEditorBtn {...props.editObjProps}>
                <Icon.Edit className="options-menu-icon" size={20}/> 
            </OpenEditorBtn>
            <button type="button" className="btn-sm  option-delete-btn" >
                <Icon.Trash2 
                    className="options-menu-icon"
                    id="options-menu-icon" size={20}
                />
                Delete 
            </button>
        </div>
    )

}; 

export const ExtraBtns = (props) =>{
    let objName = props?.editObjProps?.objName
    if (objName == 'Question') return <QuestionOptsModalBtns {...props}/>
    if (objName === 'UserProfile') return <ProfileOptsModalBtns {...props}/>   
    if (objName !== 'Post' && objName !== 'Answer') return null;

    let obj = props.answer || props.post;
    let inBookMarks = IsBookMarked('answers', obj);
    
    return(
        <div>
            <button  
                type="button"
                onClick={()=> {
                    closeModals(true)
                    props.addBookmark(props.createBookmarkProps)
                }}
                className="btn-sm bookmark-btn">
                <Icon.Bookmark className="options-menu-icon" size={20}/>
                Add to Bookmark 
                {inBookMarks &&
                    <Icon.Check 
                        className="check-bookmark-icon text-highlight"
                        size={20}/>
                }
            </button>
            <button 
                type="button" 
                onClick={()=> closeModals(true)}
                className="btn-sm  bookmark">
                <Icon.Share2 className="options-menu-icon" size={20}/>
                Share 
            </button>
        </div>
    )
}


export const ModalOptionsMenu = (props:object) => {
    return (
        <div className="modal-menu">
            <OptionsMenuBtns {...props}/>

            <ul className="modal-menu-dismiss-box">
                <ModalCloseBtn> 
                    Cancel
                </ModalCloseBtn>
            </ul>
        </div>
    )
}


export const ModalCloseBtn = (props:object) => {
    let styles = props['styles'];

    return(
        <button type="button" 
              style={styles}
              onClick={()=> closeModals(true)}
              className="nav-bar-back-bt btn-sm" >
           {props['children']}
        </button>  
    )
}


export const SubmitBtn = props => {
 
    return (
        <div className="submit-btn-box">
            <button type="button" 
                    onClick={props.handleSubmit} 
                    className="submit-btn ">
                Submit 
            </button>
        </div>
    )
};


export const OpenEditorBtn = props => {
        
    let { objName,
          isPut, 
          className,
          linkName } = props;
    let context = objName && objName.toLowerCase();
    
    let getButtonName =()=> {
        let Edit = isPut && "Edit " || "";
        return `${Edit}${objName}`;
    };
    linkName   = linkName || getButtonName();
    
    return(
        <button className={`modal-editor-btn ${className}`}
                onClick={()=> OpenModalEditor(props)}>
            {props.children} <span className="">{linkName}</span> 
        </button>
    );
};

const OpenModalEditor=(props)=>{
    let {isAuthenticated, currentUser} = props;

    if(!isAuthenticated) return history.push('/user/registration/');
    
    let storeUpdate = store.getState();
    let {entities}  = storeUpdate;
    let modal:object     = entities['modal'];
    let optionsModal = modal && modal['optionsMenu'];

    if (currentUser && !currentUser.is_confirmed) {
        let error = 'Sorry, you must confirm your account first before you start posting ';
        return store.dispatch<any>(handleError(error));
    }

    let modalProps = {
        ...props,
        modalName : 'editor',
        isModal   : true, 
    };

    if (optionsModal && optionsModal.modalIsOpen) {
        window.history.back();

        return setTimeout(()=> {
            Modal(modalProps) ; 
        }, 500);
    }

    Modal(modalProps)
};

export const OptionsDropDownBtn = props => {

    return(
        <div className="droplef dropdown-box">
            <button className="btn-sm options-btn" id="dropdown-menu-toggle"
                  data-toggle="dropdown" aria-haspopup="false"
                  aria-expanded="true" type="button" >
                <Icon.MoreHorizontal id="feather-more-horizontal" size={30}/>  

            </button>
            <div className="dropdown-menu dropdown-menu-box"
                 aria-labelledby="dropdown-menu-toggle">
                <OptionsMenuBtns {...props}/>
            </div>
        </div>
    )
}

export const  OptionModal = props => {
    let  modalProps = {
            ...props,
            modalName : 'optionsMenu', 
        };

    return(
        <button className="btn-sm options-btn" onClick={()=> {  Modal(modalProps) }}>
            <Icon.MoreHorizontal id="feather-more-horizontal" size={30}/>  
        </button>
    )
}


export const OpenOptionlBtn  = props => {
            
    return(
        <div>
            <OptBtnSmallScreen {...props}/>
            <OptBtnBigScreen {...props}/>
        </div>
    );
  
};

const OptBtnSmallScreen = MatchMediaHOC(OptionModal, '(max-width: 980px)');
const OptBtnBigScreen = MatchMediaHOC(OptionsDropDownBtn, '(min-width: 980px)');

export const ChangeImageBtn = props => {
    let {currentUser} = props && props;
    
    let modalProps = {
            ...props,
            modalName : 'dropImage', 
            isModal   : true, 
        }; 
    
    let linkName = props.linkName || `Edit`;

    return(
       
        <button 
            className="edit-img-btn btn" 
            onClick={()=> {
                if (!currentUser.is_confirmed) {
                    let error = 'Please confirm your account first before you can ' + 
                    'change your profile picture.';
                    store.dispatch<any>(handleError(error));
                        return;   
                    }
                    Modal(modalProps)
                  }}>
            {linkName}  
        </button>
    );
};





export const OpenUsersModalBtn = props => {
    let {linkName, isAuthenticated} = props;
        
    let modalProps = {
            ...props,
            modalName : 'userList', 
        }; 
           
    return(
        <button className="btn-sm " onClick={()=> {Modal(modalProps)}}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};




export const SmsCodeModalBtn = props => {
    let {obj, linkName} = props
    
    let modalProps = {
            ...props,
            modalName : 'smsCodeForm', 
        }; 
          
    return(
        <button className="btn-sm text-highlight"
                onClick={()=> Modal(modalProps)}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};


export const AuthenticationBtn = props => {
    let {linkName, children} = props
             
    return(
        <button className="btn-sm"
                onClick={()=> props.loginUser()}>
            {linkName} 
            {children} 
        </button>
        
    );
};



export const OpenAuthModalBtn = props => {
    let {linkName, children} = props;
    let modalProps = {...props}
                      
    return(
        <button className="btn-sm"
                onClick={()=> Modal(modalProps) }>
            {linkName} 
            {children} 
        </button>
        
    );
};


export const PasswordConfirmModalBtn = props => {
    let {obj, linkName} = props
    
    let modalProps = {
            ...props,
            modalName : 'passwordConfirmForm', 
        }; 
          
    return(
        <button className="btn-sm text-highlight"
                onClick={()=> Modal(modalProps)}>
            {linkName} 
            {props.children} 
        </button>
        
    );
};


