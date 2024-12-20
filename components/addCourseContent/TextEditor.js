// import { useState } from 'react';
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   ContentBlock,
//   genKey,
//   ContentState,
//   DefaultDraftBlockRenderMap,
// } from 'draft-js';
// import 'draft-js/dist/Draft.css';

// const TextEditor = () => {
//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );

//   const handleBoldClick = () => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
//   };

//   const handleItalicClick = () => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
//   };

//   const handleUnderlineClick = () => {
//     setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
//   };

//   const handleHeadingClick = (level) => {
//     const blockType = `header${level}`;
//     setEditorState(RichUtils.toggleBlockType(editorState, blockType));
//   };

//   const handleChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const blockRenderMap = DefaultDraftBlockRenderMap.merge(
//     new Map({
//       'header1': {
//         element: 'h1',
//       },
//       'header2': {
//         element: 'h2',
//       },
//       'header3': {
//         element: 'h3',
//       },
//       'header4': {
//         element: 'h4',
//       },
//       'header5': {
//         element: 'h5',
//       },
//       'header6': {
//         element: 'h6',
//       },
//     })
//   );

//   const extendedBlockRenderMap = ContentState.createFromBlockArray(
//     editorState
//       .getCurrentContent()
//       .getBlockMap()
//       .map((block) => {
//         if (block.getType() === 'unstyled') {
//           return block.merge({
//             type: 'unstyled',
//             data: new Map(),
//           });
//         }
//         return block;
//       })
//       .toList()
//       .toArray()
//   );

//   const customBlockRenderMap = blockRenderMap.merge(extendedBlockRenderMap);

//   return (
//     <div>
//       <div>
//         <button onClick={handleBoldClick}>Bold</button>
//         <button onClick={handleItalicClick}>Italic</button>
//         <button onClick={handleUnderlineClick}>Underline</button>
//         <button onClick={() => handleHeadingClick(1)}>H1</button>
//         <button onClick={() => handleHeadingClick(2)}>H2</button>
//         <button onClick={() => handleHeadingClick(3)}>H3</button>
//       </div>
//       <Editor
//         editorState={editorState}
//         onChange={handleChange}
//         blockRenderMap={customBlockRenderMap}
//       />
//     </div>
//   );
// };

// export default TextEditor;
