import { Modal, ModalBody } from "./ModalBody";
import { StyleExitFullScreen } from "../StyledButton";

function FullScreenModal({ open, handleClose, component }) {
  return (
    <Modal open={open} onClose={handleClose} sx={{ m: 0 }}>
      <ModalBody
        sx={{
          width: {
            xs: "90%",
            md: "85%",
            lg: "85%",
          },
          overflow: "hidden",
          p: 1,
          height: { md: "43vw", xs: "125vw", sm: "90vw" },
        }}
      >
        <StyleExitFullScreen
          extraStyles={{ float: "right" }}
          onClick={handleClose}
        />
        {component}
      </ModalBody>
    </Modal>
  );
}

export default FullScreenModal;
