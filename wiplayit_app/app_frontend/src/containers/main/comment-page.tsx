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

        let isAnswerBox:boolean = this.props['isAnswerBox'];
        let isPostBox:boolean = this.props['isPostBox'];

        const parent:object = post && post || answer && answer;
                
        if(parent){
            let commentsById:string;
            let newCommentsById:string;
            let parentId:number = parent['id']

            if (isAnswerBox) { 
               commentsById =  `commentsAnswer${parentId}`;
               newCommentsById = `newAnswerComments${parentId}`; 

            } else if(isPostBox) {
                commentsById =  `commentsPost${parentId}`;
                newCommentsById = `newPostComments${parentId}`;
            }

            this.setState({
                commentsById, 
                newCommentsById,
                parent,
                parentId
            });
         
            let comments:object[] = parent['comments'];
            if (comments.length) {
                
                store.dispatch<any>(
                    action.getCommentLindData(commentsById, comments)
                );
            }
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
            <div className="comment-page">
                {newComments || oldComments &&
                    <p className="comments-title">Comments</p>
                }
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
    let linkData = comments.linkData;


    let commentList = comments.commentList 
                   && comments.commentList.length 
                   && comments.commentList;
    const commentProps:object = {
        ...props, 
        comment:linkData.comment,
    }

    return(
        <div>
            {comments.showLink &&
                <div>
                    <CommentsComponent {...commentProps}/>
                    <ul className="comments-loader"
                        onClick={()=> props.getCommentList(commentsById)}>
                        <li>Click to view {commentList.length - 1} more comments</li>
                    </ul>
                </div>
                ||

                <div>
                    { comments.isLoading &&
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>

                        ||
                        <div>
                            {Comments(props, commentList)}
                        </div>
                       
                    }
                </div>
            }
        </div>
    )

      
};

const Comments = (props, commentList) => {
    let parent:object = props['parent'];
                                           
    return (
        <div>
            {commentList && commentList.map( (comment, index) => {
                if(parent){
                    let isParentComment = parent['id'] === comment.answer ||
                                          parent['id'] === comment.post
                    if(!isParentComment){
                        return null;
                    }
                    
                }

                let commentProps = {
                    ...props,
                    comment,
                    index
                };  
                              
                return(
                    <div  key={index} >
                        <CommentsComponent {...commentProps}/>
                         
                    </div>
                )
            })}
        </div>
    );
}




