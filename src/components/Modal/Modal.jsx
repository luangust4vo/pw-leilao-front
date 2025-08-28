import { Dialog } from "primereact/dialog"

const Modal = ({ header, visible, onHide, footer, children }) => {
    return (
        <Dialog
            visible={visible}
            header={header}
            modal
            onHide={onHide}
            footer={footer}
            className="p-fluid"
            style={{ width: '32rem' }}
        >
            {children}
        </Dialog>
    )
}

export default Modal