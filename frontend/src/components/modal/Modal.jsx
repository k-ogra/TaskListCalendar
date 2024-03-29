import './Modal.css';
function Modal(props) {
    return (props.trigger) ? (
        <div className="modal">
            <div className="modal-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>&times;</button>
                <h3>{ props.onClick }</h3>
                { props.children }
            </div>
        </div>
    ) : "";
}

export default Modal;