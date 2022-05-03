import React from "react";
import {
    Modifier,
    SelectionState,
    EditorState,
    CompositeDecorator
} from "draft-js";


export const linkStrategy = (contentBlock, callback, contentState) => {

    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        return (
            entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK"
        );
    }, callback);
};

export const RenderLink = props => {
    const {contentState, entityKey } = props;
    const { url } = contentState.getEntity(entityKey).getData();
    return (
        <a
            className="draft-js-link"
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={url}>
            {props.children}
        </a>
    );
};




export const decorator = new CompositeDecorator([
        {
            strategy: linkStrategy,
            component: RenderLink,
        },
]);


export const insertLink = (editorState, data, text='link') => {
    
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithSpace = text.concat(' ');
    
    // create new content with text
    const newContent = Modifier.insertText(
      	contentState,
      	selection,
      	textWithSpace,
    );
    
    // create new link entity
    const newContentWithEntity = newContent.createEntity(
                                                'LINK',
                                                'MUTABLE',
                                                data,
                                        
                                            );
      
    const entityKey = newContentWithEntity.getLastCreatedEntityKey();
    // create new selection with the inserted text
    const anchorOffset = selection.getAnchorOffset();

    const newSelection = new SelectionState({
      	anchorKey: selection.getAnchorKey(),
      	anchorOffset,
      	focusKey: selection.getAnchorKey(),
      	focusOffset: anchorOffset + text.length,
    });

    // and aply link entity to the inserted text
    const newContentWithLink = Modifier.applyEntity(
      newContentWithEntity,
      newSelection,
      entityKey,
    );

    // create new state with link text
    const withLinkText = EditorState.push(
      	editorState,
      	newContentWithLink,
      	'insert-characters',
    );

    // now lets add cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(
      	withLinkText,
      	newContent.getSelectionAfter(),
    );

    return withProperCursor;
  };

