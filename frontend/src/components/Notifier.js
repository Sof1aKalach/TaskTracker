import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Notifier = ({ title, message, show, close }) => {
    return (
        <>
            <Modal show={show} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button autoFocus variant="primary" onClick={close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}