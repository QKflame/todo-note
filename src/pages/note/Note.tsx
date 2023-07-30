import './note.less';

import GroupMenu from 'src/components/groupMenu/GroupMenu';

import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';

const Note = () => {
  return (
    <div className="note-page">
      <GroupMenu></GroupMenu>
      <NoteList></NoteList>
      <NoteEditor></NoteEditor>
    </div>
  );
};

export default Note;
