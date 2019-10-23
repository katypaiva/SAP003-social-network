function Textarea(props) {
    return `<textarea class="${props.class}" placeholder="${props.placeholder}"></textarea>`;
 }
 
window.Textarea = {
    component:Textarea,
}

 export default Textarea;