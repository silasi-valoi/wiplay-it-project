import React, { Component } from 'react';
import  AjaxLoader from "templates/ajax-loader";
import  * as action  from 'actions/actionCreators';
import Helper from 'utils/helpers';
import {  CommentsComponent } from "templates/comment"
import {Editor, EditorState} from 'draft-js';
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {store} from "store/index";




const helper   = new Helper();


class CommentsBox extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isCommentBox    : true,
         commentsById    : '',
         newCommentsById : '',
         parent          : '',

      };
   
   };

   componentDidCatch(error, info) {
     // You can also log the error to an error reporting service
     //console.log(error, info);
   };

   

    componentDidMount() {
        let answer = this.props['answer'];
        let post = this.props['post'];
            
        var parent       = post   && post || answer && answer;
        let comments     = parent && parent.comments;
        var commentsById = answer && `commentsAnswer${parent.id}` ||
                           post && `commentsPost${parent.id}`;
                           
        let newCommentsById = answer && `newAnswerComments${parent.id}` 
                                || post && `newPostComments${parent.id}`;

        this.setState({commentsById, newCommentsById, parent});
                           
        if (comments && comments.length) {
            store.dispatch<any>(action.getCommentLindData(commentsById, comments));
        }
    };


    componentDidUpdate(nextProps, prevState) {
       
    } 
          
    getProps() {
        return {...this.props, ...this.state};
    }; 
   


   render() { 
        let props  = this.getProps();
        let commentsById = props['commentsById'];
        let newCommentsById = props['newCommentsById'];
            
        let comments  =  props['entities']['comments'];
        let newComments = comments && comments[newCommentsById]; 
        let oldComments = comments && comments[commentsById]
            
        
        return (
            <div>
                <div>
                    { newComments?
                        <NewComments {...props}/>
                        :
                        ""       
                    }
                </div>
               
                <div>
                    {oldComments?  
                        <OldComments {...props}/>
                        :
                        ""
                    }
                </div>  
            </div>
        );
   };
};


export default CommentsBox;


export const CommentsLink = props => {
   var byId = props.commentsById;
   var comments    = props.entities.comments;
   comments = comments[byId]
   let styles ={
      border         : "px solid red",
      fontSize       : "11px",
      margin         : 0,
      padding        : 0,
      display        : 'flex',
      listStyleType  : 'none', 
   }
  

   let commentCountStyles ={
      fontSize : "11px",
      margin   : '10px',
   }
  
   var linkData = comments.linkData;

    return (
     <div  onClick={ () => props.getCommentList(byId) } className="comments-link">
        <Links {...linkData}/>
         <ul style={styles}>
            <li  style={commentCountStyles}>Click to View More Comments</li>
            <li  style={commentCountStyles}>
               {linkData.numOfComments}  Comments
            </li>
         </ul>
     </div>
   )
}

const NewComments = props => {
   let {entities, newCommentsById} = props;
   let comments = entities.comments[newCommentsById]; 
   
   let commentsProps = Object.assign({isNewComments:true}, props)

   let commentList = comments.commentList 
                   && comments.commentList.length 
                   && comments.commentList;  

   return Comments(commentsProps, commentList);
};


const OldComments = props => {
   let {entities, commentsById, parent} = props;
   let comments = entities.comments[commentsById]; 

   let commentList = comments.commentList 
                   && comments.commentList.length 
                   && comments.commentList;

   return(
        <div>
            {comments.showLink?
                <CommentsLink {...props}/>
                :
                <div>
                    { comments.isLoading?
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>
                        :
                        <div>
                          { Comments(props, commentList)}
                        </div>
                    }
                </div>
            }

        </div>
    )

      
};

const Comments = (props, commentList) => {

   let {parent} = props;
                                 
    return (
        <div>
            { commentList && commentList.map( (comment, index) => {
                let commentProps = {comment, index};  
                Object.assign(commentProps, props);
                //console.log(commentProps)

                return(
                    <div  key={index} >
                        { parent.id === comment.answer || parent.id === comment.post?
                            <div className="comment-container">
                                <div className="comment-contents">
                                    <CommentsComponent {...commentProps}/>
                                </div>
                            </div>  
                            :
                            ""
                        } 
                    </div>
                )
            })}
        </div>
    );
}






export const Links = props => {
   let storedState = JSON.parse(props.comment.comment);
   const editorState = helper.convertFromRaw(storedState);
     
    return (
        <div  className="comment-box" id="comment-box">
            <div className="user-box">
            
            </div>
    
            <div className="comment">
                <Editor
                    blockRendererFn={pageMediaBlockRenderer}
                    editorState={editorState} 
                    readOnly={true} /> 
            </div>
        </div>
    )  
}