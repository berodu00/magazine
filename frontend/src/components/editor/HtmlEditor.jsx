import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const HtmlEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={(newValue) => onChange(newValue)}
            init={{
                license_key: 'gpl',
                promotion: false,
                height: 500,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image code | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};

export default HtmlEditor;
